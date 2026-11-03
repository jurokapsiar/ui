import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const appURL = process.env.APP_URL ?? process.env.WORKSPACE_THEME_APP_URL ?? 'http://127.0.0.1:3000';
const chromiumBin = process.env.CHROMIUM_BIN ?? '/snap/bin/chromium';
const artifactDir = mkdtempSync(join(tmpdir(), 'workspace-theme-browser-'));
const profileDir = join(artifactDir, 'profile');
mkdirSync(profileDir);
const snapshots = [];
let chromium;
let socket;

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const equal = (actual, expected, description) => {
  assert(actual === expected, `${description}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
};

try {
  const portServer = createServer();
  const port = await new Promise((resolve, reject) => {
    portServer.once('error', reject);
    portServer.listen(0, '127.0.0.1', () => {
      const address = portServer.address();
      portServer.close((error) => error ? reject(error) : resolve(address.port));
    });
  });
  chromium = spawn(chromiumBin, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
    `--remote-debugging-port=${port}`, `--user-data-dir=${profileDir}`, 'about:blank',
  ], { stdio: 'ignore' });

  let target;
  for (let attempt = 0; attempt < 100 && !target; attempt += 1) {
    if (chromium.exitCode !== null) throw new Error(`Chromium exited with code ${chromium.exitCode}`);
    target = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())
      .then((targets) => targets.find((entry) => entry.type === 'page'))
      .catch(() => null);
    if (!target) await pause(100);
  }
  assert(target, `Chromium did not expose a page target on port ${port} using ${chromiumBin}`);

  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let nextCommandId = 0;
  const pending = new Map();
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  });

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextCommandId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const response = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
    return response.result.value;
  };
  const click = async (selector) => {
    const point = await evaluate(`(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (!element) return null;
      element.scrollIntoView({ block: 'nearest' });
      const rect = element.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    })()`);
    assert(point, `Missing clickable element: ${selector}`);
    for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) {
      await send('Input.dispatchMouseEvent', {
        type, ...point, button: type === 'mouseMoved' ? 'none' : 'left', clickCount: 1,
      });
    }
    await pause(180);
  };
  const hover = async (selector) => {
    const point = await evaluate(`(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (!element) return null;
      element.scrollIntoView({ block: 'nearest' });
      const rect = element.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    })()`);
    assert(point, `Missing hover target: ${selector}`);
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point, button: 'none' });
    await pause(120);
  };
  const clickEditorAction = async (text) => {
    const point = await evaluate(`(() => {
      const popup = document.querySelector('[class*="editorPopup"]');
      const element = [...popup.querySelectorAll('button')].find((button) => button.textContent.trim() === ${JSON.stringify(text)});
      if (!element) return null;
      element.scrollIntoView({ block: 'nearest' });
      const rect = element.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    })()`);
    assert(point, `Missing editor action: ${text}`);
    for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) {
      await send('Input.dispatchMouseEvent', {
        type, ...point, button: type === 'mouseMoved' ? 'none' : 'left', clickCount: 1,
      });
    }
    await pause(180);
  };
  const pressEnter = async () => {
    for (const type of ['keyDown', 'keyUp']) {
      await send('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    }
    await pause(180);
  };
  const waitFor = async (expression, description) => {
    for (let attempt = 0; attempt < 50; attempt += 1) {
      if (await evaluate(expression)) return;
      await pause(100);
    }
    throw new Error(`Timed out waiting for ${description}`);
  };
  const choosePreset = async (presetId) => {
    await click('[aria-label="Theme preset"]');
    const found = await evaluate(`(async () => {
      const { THEME_PRESETS } = await import('/src/design-system/core/themeTokens.ts');
      const name = THEME_PRESETS.find((preset) => preset.id === ${JSON.stringify(presetId)})?.name;
      const option = [...document.querySelectorAll('[role="option"]')].find((item) => item.textContent.includes(name));
      option?.focus();
      return Boolean(option);
    })()`);
    assert(found, `Theme preset option not found: ${presetId}`);
    await pressEnter();
    await waitFor(`document.documentElement.dataset.dsPreset === ${JSON.stringify(presetId)}`, `preset ${presetId}`);
  };
  const inspect = () => evaluate(`(() => {
    const popup = document.querySelector('[class*="editorPopup"]');
    const save = popup.querySelector('button[type="submit"]');
    const endTime = [...popup.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Add end time');
    const close = popup.querySelector('[aria-label="Close editor"]');
    const title = popup.querySelector('[aria-label="Task title"]');
    const root = getComputedStyle(document.documentElement);
    const popupStyle = getComputedStyle(popup);
    const saveStyle = getComputedStyle(save);
    const pillStyle = endTime ? getComputedStyle(endTime) : null;
    const titleStyle = getComputedStyle(title);
    const rootValue = (name, fallback = '') => root.getPropertyValue(name).trim() || fallback;
    const expected = document.createElement('span');
    expected.style.position = 'fixed';
    expected.style.visibility = 'hidden';
    expected.style.boxShadow = 'var(--shadow-elevation-high)';
    expected.style.borderColor = 'var(--color-neutral-border)';
    const expectedStrongBorder = document.createElement('span');
    expectedStrongBorder.style.borderColor = 'var(--color-neutral-border-strong)';
    const expectedHover = document.createElement('span');
    expectedHover.style.backgroundColor = 'var(--color-neutral-surface-hover)';
    const expectedBrandTint = document.createElement('span');
    expectedBrandTint.style.backgroundColor = 'var(--color-brand-tint)';
    const expectedMuted = document.createElement('span');
    expectedMuted.style.color = 'var(--color-neutral-text-muted)';
    document.body.append(expectedStrongBorder);
    document.body.append(expectedHover, expectedBrandTint, expectedMuted);
    expected.style.color = 'var(--color-danger)';
    expected.style.outlineColor = 'var(--color-focus-ring)';
    expected.style.backgroundColor = 'color-mix(in oklch, var(--color-brand-tint) 35%, var(--color-neutral-surface))';
    expected.style.paddingTop = 'calc(var(--spacing-lg, 24px) * 2 + var(--spacing-base, 4px))';
    expected.style.paddingRight = 'var(--spacing-md, 16px)';
    expected.style.paddingBottom = 'var(--spacing-md, 16px)';
    expected.style.paddingLeft = 'calc(var(--spacing-lg, 24px) + var(--spacing-base, 4px))';
    document.body.append(expected);
    const expectedStyle = getComputedStyle(expected);
    const attachment = [...popup.querySelectorAll('[class*="muted"]')].find((element) => element.textContent.includes('Google Drive attachment'));
    const attachmentInline = attachment?.closest('[class*="inline"]');
    const paintedDateInputs = ['Task date', 'Task start time', 'Task time', 'Task end time', 'Task deadline'].map((name) => {
      const input = popup.querySelector('[aria-label="' + name + '"]');
      if (!input) return null;
      const painted = input.closest('[class*="editorNativeInput"]') ?? input;
      const style = getComputedStyle(painted);
      const inputStyle = getComputedStyle(input);
      return {
        name,
        type: input.type,
        radius: style.borderRadius,
        borderWidth: style.borderTopWidth,
        borderColor: style.borderTopColor,
        backgroundColor: style.backgroundColor,
        fontFamily: inputStyle.fontFamily,
        height: painted.getBoundingClientRect().height,
      };
    }).filter(Boolean);
    const controls = [...popup.querySelectorAll('button:not(:disabled), input:not([type="hidden"]), textarea, select')]
      .filter((element) => element.getAttribute('aria-hidden') !== 'true' && !element.closest('[aria-hidden="true"]'))
      .map((element) => ({ label: element.getAttribute('aria-label') ?? element.textContent.trim(), tag: element.tagName, type: element.getAttribute('type'), className: String(element.className), height: element.getBoundingClientRect().height }));
    const row = popup.querySelector('[class*="editorRow"]');
    const schedule = popup.querySelector('[class*="editorSchedule"]');
    const titleRoot = popup.querySelector('[class*="editorTitleControl"]') ?? title;
    const titleRootStyle = getComputedStyle(titleRoot);
    const result = {
      preset: document.documentElement.dataset.dsPreset,
      popupRadius: popupStyle.borderRadius,
      saveRadius: saveStyle.borderRadius,
      pillRadius: pillStyle?.borderRadius ?? null,
      fieldRadius: paintedDateInputs[0]?.radius ?? null,
      popupBorderWidth: popupStyle.borderTopWidth,
      popupBorderColor: popupStyle.borderTopColor,
      popupBackground: popupStyle.backgroundColor,
      popupShadow: popupStyle.boxShadow,
      popupPadding: [popupStyle.paddingTop, popupStyle.paddingRight, popupStyle.paddingBottom, popupStyle.paddingLeft],
      formGap: getComputedStyle(popup.querySelector('form')).rowGap,
      rowGaps: [getComputedStyle(row).rowGap, getComputedStyle(row).columnGap],
      scheduleGap: getComputedStyle(schedule).columnGap,
      saveHeight: save.getBoundingClientRect().height,
      closeSize: [close.getBoundingClientRect().width, close.getBoundingClientRect().height],
      closeHovered: close.matches(':hover'),
      closeHoverBackground: getComputedStyle(close).backgroundColor,
      attachmentMutedColor: attachment ? getComputedStyle(attachment).color : null,
      attachmentInlineGap: attachmentInline ? getComputedStyle(attachmentInline).columnGap : null,
      titleHeight: title.getBoundingClientRect().height,
      controls,
      saveWeight: saveStyle.fontWeight,
      saveTracking: saveStyle.letterSpacing,
      bodyFont: popupStyle.fontFamily,
      titleFont: titleStyle.fontFamily,
      dateInputs: paintedDateInputs,
      motion: popupStyle.transitionDuration,
      easing: popupStyle.transitionTimingFunction,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      focusOutlineColor: titleRootStyle.outlineColor,
      errorColor: getComputedStyle(popup.querySelector('[role="alert"]') ?? expected).color,
      expected: {
        controlRadius: rootValue('--radius-control', rootValue('--radius-base', '4px')),
        fieldRadius: rootValue('--radius-field', rootValue('--radius-base', '4px')),
        popupRadius: rootValue('--radius-lg'),
        borderWidth: rootValue('--border-width'),
        borderColor: expectedStyle.borderTopColor,
        strongBorderColor: getComputedStyle(expectedStrongBorder).borderTopColor,
        neutralSurfaceHover: getComputedStyle(expectedHover).backgroundColor,
        brandTint: getComputedStyle(expectedBrandTint).backgroundColor,
        mutedText: getComputedStyle(expectedMuted).color,
        background: expectedStyle.backgroundColor,
        shadow: expectedStyle.boxShadow,
        danger: expectedStyle.color,
        focus: expectedStyle.outlineColor,
        paddingTop: expectedStyle.paddingTop,
        paddingRight: expectedStyle.paddingRight,
        paddingBottom: expectedStyle.paddingBottom,
        paddingLeft: expectedStyle.paddingLeft,
        formGap: rootValue('--spacing-md', '16px'),
        rowGap: rootValue('--spacing-sm', '8px'),
        rowColumnGap: rootValue('--spacing-md', '16px'),
        scheduleGap: rootValue('--spacing-xs', '4px'),
        touchTarget: Number.parseFloat(rootValue('--touch-target-min', '44px')),
        labelWeight: rootValue('--font-weight-label', '600'),
        labelTracking: rootValue('--letter-spacing-label', 'normal'),
        bodyFont: rootValue('--font-family-body', 'system-ui, sans-serif'),
        titleFont: rootValue('--font-family-display', 'system-ui, sans-serif'),
        dateFont: rootValue('--font-family-mono', 'ui-monospace, monospace'),
        motion: rootValue('--motion-duration', '200ms'),
        easing: rootValue('--motion-easing', 'ease'),
      },
    };
    expectedStrongBorder.remove();
    expectedHover.remove();
    expectedBrandTint.remove();
    expectedMuted.remove();
    expected.remove();
    return result;
  })()`);
  const verifyTheme = (snapshot, label) => {
    const { expected: token } = snapshot;
    if (!snapshot.custom) {
      const presetControlRadii = { enterprise: '4px', substance: '9999px', brutalist: '0px', obsidian: '8px' };
      equal(token.controlRadius, presetControlRadii[snapshot.preset], `${label} selected preset control radius`);
    }
    const expectedInputTypes = {
      'Task date': 'date',
      [snapshot.mode === 'base' ? 'Task start time' : 'Task time']: 'time',
      'Task end time': 'time',
      'Task deadline': 'date',
    };
    equal(snapshot.dateInputs.map(({ name }) => name).join('|'), Object.keys(expectedInputTypes).join('|'), `${label} styled schedule input names`);
    equal(snapshot.saveRadius, token.controlRadius, `${label} Save control radius`);
    equal(snapshot.pillRadius, token.controlRadius, `${label} Add end time control radius`);
    equal(snapshot.popupRadius, token.popupRadius, `${label} popup radius`);
    equal(snapshot.popupBorderWidth, token.borderWidth, `${label} popup border width`);
    equal(snapshot.popupBorderColor, token.borderColor, `${label} neutral border color`);
    equal(snapshot.popupBackground, token.background, `${label} neutral surface/background`);
    equal(snapshot.popupShadow, token.shadow, `${label} elevation shadow`);
    assert(snapshot.closeHovered, `${label} Close hover state was not reached`);
    equal(snapshot.closeHoverBackground, snapshot.mode === 'base' ? token.neutralSurfaceHover : token.brandTint, `${label} Close hover surface`);
    equal(snapshot.attachmentMutedColor, token.mutedText, `${label} portal attachment muted color`);
    equal(snapshot.attachmentInlineGap, token.rowGap, `${label} portal attachment inline gap`);
    equal(snapshot.popupPadding.join('|'), [token.paddingTop, token.paddingRight, token.paddingBottom, token.paddingLeft].join('|'), `${label} tokenized popup padding`);
    equal(snapshot.formGap, token.formGap, `${label} form gap`);
    equal(snapshot.rowGaps.join('|'), `${token.rowGap}|${token.rowColumnGap}`, `${label} row spacing`);
    equal(snapshot.scheduleGap, token.scheduleGap, `${label} schedule spacing`);
    assert(snapshot.saveHeight >= token.touchTarget, `${label} Save height ${snapshot.saveHeight}px is below touch target ${token.touchTarget}px`);
    assert(snapshot.closeSize.every((size) => size >= token.touchTarget), `${label} Close size ${snapshot.closeSize.join('×')} is below touch target ${token.touchTarget}px`);
    assert(snapshot.titleHeight >= token.touchTarget, `${label} title height ${snapshot.titleHeight}px is below touch target ${token.touchTarget}px`);
    const undersizedControls = snapshot.controls.filter(({ height }) => height < token.touchTarget);
    assert(snapshot.controls.length > 0 && undersizedControls.length === 0, `${label} has controls below the ${token.touchTarget}px touch target: ${JSON.stringify(undersizedControls)}`);
    equal(snapshot.saveWeight, token.labelWeight, `${label} label weight`);
    equal(snapshot.saveTracking, token.labelTracking, `${label} label tracking`);
    assert(snapshot.bodyFont.includes(token.bodyFont.split(',')[0].replaceAll('"', '').trim()), `${label} body font ${snapshot.bodyFont} does not use ${token.bodyFont}`);
    assert(snapshot.titleFont.includes(token.titleFont.split(',')[0].replaceAll('"', '').trim()), `${label} title font ${snapshot.titleFont} does not use ${token.titleFont}`);
    for (const input of snapshot.dateInputs) {
      equal(input.type, expectedInputTypes[input.name], `${label} ${input.name} native input type`);
      equal(input.radius, token.fieldRadius, `${label} ${input.name} field radius`);
      equal(input.borderWidth, token.borderWidth, `${label} ${input.name} border width`);
      equal(input.borderColor, token.strongBorderColor, `${label} ${input.name} border color`);
      assert(input.height >= token.touchTarget, `${label} ${input.name} height ${input.height}px is below touch target ${token.touchTarget}px`);
      const maxSingleLineHeight = token.touchTarget + (2 * Number.parseFloat(token.borderWidth));
      assert(input.height <= maxSingleLineHeight, `${label} ${input.name} painted root height ${input.height}px exceeds the single-line bound ${maxSingleLineHeight}px`);
      assert(input.fontFamily.includes(token.dateFont.split(',')[0].replaceAll('"', '').trim()), `${label} ${input.name} font ${input.fontFamily} does not use ${token.dateFont}`);
    }
    const expectedDuration = token.motion.endsWith('ms') ? `${Number.parseFloat(token.motion) / 1000}s` : token.motion;
    assert(snapshot.motion.split(',').every((duration) => duration.trim() === expectedDuration), `${label} motion duration ${snapshot.motion} does not use ${token.motion}`);
    assert(snapshot.easing.includes(token.easing), `${label} motion easing ${snapshot.easing} does not use ${token.easing}`);
    equal(snapshot.errorColor, token.danger, `${label} error color`);
    equal(snapshot.focusOutlineColor, token.focus, `${label} focus ring color`);
  };

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1050, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: appURL });
  await waitFor('Boolean(document.querySelector(\'[aria-label="Task workspace demo"]\'))', 'Task workspace showcase entry');
  await click('[aria-label="Task workspace demo"]');
  await waitFor('Boolean(document.querySelector(\'[data-workspace="base"]\'))', 'Base Task workspace');

  for (const mode of ['base', 'fluent']) {
    if (mode === 'fluent') {
      await evaluate(`([...document.querySelectorAll('[role="tab"]')].find((tab) => tab.textContent.trim() === 'Fluent UI'))?.click()`);
      await waitFor('Boolean(document.querySelector(\'[data-workspace="fluent"]\'))', 'Fluent Task workspace');
    }
    for (const preset of ['enterprise', 'substance', 'brutalist', 'obsidian']) {
      await choosePreset(preset);
      await click(`[data-workspace="${mode}"] [aria-label^="Edit"]`);
      await waitFor('Boolean(document.querySelector(\'[class*="editorPopup"] [aria-label="Task title"]\'))', `${mode}/${preset} editor`);
      await click('[aria-label="Change task date"]');
      await waitFor('Boolean(document.querySelector(\'[aria-label="Task date"]\'))', `${mode}/${preset} date input`);
      const pillRadius = await evaluate(`getComputedStyle([...document.querySelector('[class*="editorPopup"]').querySelectorAll('button')].find((button) => button.textContent.trim() === 'Add end time')).borderRadius`);
      await clickEditorAction('Add end time');
      await waitFor('Boolean(document.querySelector(\'[aria-label="Task end time"]\'))', `${mode}/${preset} end-time input`);
      await clickEditorAction('Add deadline');
      await waitFor('Boolean(document.querySelector(\'[aria-label="Task deadline"]\'))', `${mode}/${preset} deadline input`);
      const attachmentMetrics = await evaluate(`(() => {
        const popup = document.querySelector('[class*="editorPopup"]');
        const attachment = [...popup.querySelectorAll('[class*="muted"]')].find((element) => element.textContent.includes('Google Drive attachment'));
        const inline = attachment?.closest('[class*="inline"]');
        return { attachmentMutedColor: attachment ? getComputedStyle(attachment).color : null, attachmentInlineGap: inline ? getComputedStyle(inline).columnGap : null };
      })()`);
      await clickEditorAction('Add description');
      await waitFor('Boolean(document.querySelector(\'[aria-label="Task description"]\'))', `${mode}/${preset} description field`);

      await evaluate(`(() => { const title = document.querySelector('[class*="editorPopup"] [aria-label="Task title"]'); const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(title, ''); title.dispatchEvent(new Event('input', { bubbles: true })); title.focus(); })()`);
      await click('[class*="editorPopup"] button[type="submit"]');
      await waitFor('Boolean(document.querySelector(\'[class*="editorPopup"] [role="alert"]\'))', `${mode}/${preset} validation error`);
      await evaluate(`document.querySelector('[class*="editorPopup"] [aria-label="Task title"]').focus()`);
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1, button: 'none' });
      await hover('[class*="editorPopup"] [aria-label="Close editor"]');
      await pause(120);
      const snapshot = { mode, ...await inspect(), ...attachmentMetrics, pillRadius };
      snapshots.push(snapshot);
      verifyTheme(snapshot, `${mode}/${preset}`);
      console.log(`${mode}/${preset}: theme tokens verified`);

      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      const reduced = await evaluate(`getComputedStyle(document.querySelector('[class*="editorPopup"]')).transitionDuration`);
      assert(reduced.split(',').every((duration) => duration.trim() === '0s'), `${mode}/${preset} reduced motion duration is ${reduced}, expected 0s`);
      await send('Emulation.setEmulatedMedia', { features: [] });
      await click('[aria-label="Close editor"]');
    }

    await choosePreset('enterprise');
    await click(`[data-workspace="${mode}"] [aria-label^="Edit"]`);
    await waitFor('Boolean(document.querySelector(\'[class*="editorPopup"] [aria-label="Task title"]\'))', `${mode} touch-target overlap editor`);
    const touchTargetGeometry = await evaluate(`(() => {
      const root = document.documentElement;
      root.style.setProperty('--touch-target-min', '56px');
      const popup = document.querySelector('[class*="editorPopup"]');
      const close = popup.querySelector('[aria-label="Close editor"]');
      const title = popup.querySelector('[aria-label="Task title"]');
      const geometry = { closeBottom: close.getBoundingClientRect().bottom, titleTop: title.getBoundingClientRect().top };
      root.style.removeProperty('--touch-target-min');
      return geometry;
    })()`);
    assert(touchTargetGeometry.closeBottom <= touchTargetGeometry.titleTop, `${mode} at 56px touch target Close bottom ${touchTargetGeometry.closeBottom}px overlaps title top ${touchTargetGeometry.titleTop}px`);
    await evaluate(`(() => {
      const root = document.documentElement;
      const tokens = {
        '--radius-control': '9px', '--radius-field': '13px', '--radius-lg': '19px', '--border-width': '3px',
        '--spacing-base': '8px', '--spacing-xs': '6px', '--spacing-sm': '12px', '--spacing-md': '20px', '--spacing-lg': '32px',
        '--touch-target-min': '60px', '--shadow-elevation-high': '0px 7px 11px rgb(1, 2, 3)',
        '--font-weight-label': '650', '--letter-spacing-label': '1px',
        '--font-family-body': 'Georgia, serif', '--font-family-display': 'Courier New, monospace', '--font-family-mono': 'Consolas, monospace',
        '--motion-duration': '420ms', '--motion-duration-fast': '180ms', '--motion-easing': 'linear',
        '--color-neutral-bg': 'rgb(245, 245, 240)', '--color-neutral-surface': 'rgb(235, 230, 220)',
        '--color-neutral-surface-hover': 'rgb(205, 210, 215)',
        '--color-neutral-border': 'rgb(110, 120, 130)', '--color-neutral-border-strong': 'rgb(70, 80, 90)',
        '--color-neutral-text': 'rgb(23, 27, 31)', '--color-neutral-text-muted': 'rgb(80, 85, 90)',
        '--color-brand-tint': 'rgb(230, 215, 245)', '--color-brand-primary': 'rgb(100, 60, 180)',
        '--color-danger': 'rgb(220, 0, 68)', '--color-focus-ring': 'rgb(0, 170, 204)',
      };
      for (const [name, value] of Object.entries(tokens)) root.style.setProperty(name, value);
    })()`);
    await pause(180);
    await click('[aria-label="Change task date"]');
    await waitFor('Boolean(document.querySelector(\'[aria-label="Task date"]\'))', `${mode} custom override date input`);
    const customPillRadius = await evaluate(`getComputedStyle([...document.querySelector('[class*="editorPopup"]').querySelectorAll('button')].find((button) => button.textContent.trim() === 'Add end time')).borderRadius`);
    await clickEditorAction('Add end time');
    await waitFor('Boolean(document.querySelector(\'[aria-label="Task end time"]\'))', `${mode} custom end-time input`);
    await clickEditorAction('Add deadline');
    await waitFor('Boolean(document.querySelector(\'[aria-label="Task deadline"]\'))', `${mode} custom deadline input`);
    const attachmentMetrics = await evaluate(`(() => {
      const popup = document.querySelector('[class*="editorPopup"]');
      const attachment = [...popup.querySelectorAll('[class*="muted"]')].find((element) => element.textContent.includes('Google Drive attachment'));
      const inline = attachment?.closest('[class*="inline"]');
      return { attachmentMutedColor: attachment ? getComputedStyle(attachment).color : null, attachmentInlineGap: inline ? getComputedStyle(inline).columnGap : null };
    })()`);
    await clickEditorAction('Add description');
    await waitFor('Boolean(document.querySelector(\'[aria-label="Task description"]\'))', `${mode} custom description field`);
    await evaluate(`(() => { const title = document.querySelector('[class*="editorPopup"] [aria-label="Task title"]'); const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(title, ''); title.dispatchEvent(new Event('input', { bubbles: true })); title.focus(); })()`);
    await click('[class*="editorPopup"] button[type="submit"]');
    await waitFor('Boolean(document.querySelector(\'[class*="editorPopup"] [role="alert"]\'))', `${mode} custom validation error`);
    await evaluate(`document.querySelector('[class*="editorPopup"] [aria-label="Task title"]').focus()`);
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1, button: 'none' });
    await hover('[class*="editorPopup"] [aria-label="Close editor"]');
    await pause(120);
    const custom = { mode, custom: true, ...await inspect(), ...attachmentMetrics, pillRadius: customPillRadius };
    snapshots.push(custom);
    verifyTheme(custom, `${mode}/custom overrides`);
    assert(custom.saveRadius === '9px' && custom.pillRadius === '9px' && custom.popupRadius === '19px', `${mode} custom radii were not applied`);
    assert(custom.popupBorderWidth === '3px' && custom.popupShadow.includes('7px 11px'), `${mode} custom stroke/shadow were not applied`);
    assert(custom.saveHeight >= 60 && custom.closeSize.every((size) => size >= 60), `${mode} custom touch target was not applied`);
    assert(custom.saveWeight === '650' && custom.saveTracking === '1px', `${mode} custom label tokens were not applied`);
    assert(custom.bodyFont.includes('Georgia') && custom.titleFont.includes('Courier'), `${mode} custom font tokens were not applied`);
    assert(custom.motion.split(',').every((duration) => duration.trim() === '0.42s') && custom.easing.includes('linear'), `${mode} custom motion tokens were not applied`);
    console.log(`${mode}/custom overrides: live tokens verified`);
    await click('[aria-label="Close editor"]');
  }

  const reportPath = process.env.WORKSPACE_THEME_REPORT ?? join(tmpdir(), 'workspace-theme-browser-report.json');
  writeFileSync(reportPath, `${JSON.stringify(snapshots, null, 2)}\n`);
  console.log(`Theme regression passed for ${snapshots.length} workspace/preset combinations. Report: ${reportPath}`);
} finally {
  socket?.close();
  if (chromium && chromium.exitCode === null) chromium.kill('SIGTERM');
  rmSync(artifactDir, { recursive: true, force: true });
}
