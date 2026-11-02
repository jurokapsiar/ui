import React, { useState } from 'react';
import {
  Bookmark20Filled,
  Bookmark20Regular,
  Heart20Filled,
  Heart20Regular,
  Settings20Regular,
  Share20Regular,
  Star20Regular,
} from '@fluentui/react-icons';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { Button, ToggleButton } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';

export const IconButtonsDemo: React.FC = () => {
  const [liked, setLiked] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <FluentDemoFrame
      id="icon-buttons"
      tagline="Icon-only controls in standard, filled and toggle styles. Each has an aria-label because no visible text names it."
    >
      <DemoCard title="Standard" subtitle="Transparent until hovered; for toolbars and dense rows">
        <Button appearance="subtle" icon={<Settings20Regular />} aria-label="Open settings" />
        <Button appearance="subtle" icon={<Share20Regular />} aria-label="Share link" />
      </DemoCard>

      <DemoCard title="Filled" subtitle="Brand fill for the primary icon action">
        <Button appearance="primary" icon={<Star20Regular />} aria-label="Add to favourites" />
        <Button appearance="primary" icon={<Settings20Regular />} aria-label="Open settings" disabled />
      </DemoCard>

      <DemoCard title="Tonal and outlined" subtitle="Medium emphasis: a soft container or a strong outline">
        <Button appearance="tonal" icon={<Share20Regular />} aria-label="Share link" />
        <Button appearance="outline" icon={<Settings20Regular />} aria-label="Open settings" />
      </DemoCard>

      <DemoCard title="Toggle" subtitle="Pressed state uses a tint, a ring and aria-pressed">
        <ToggleButton
          checked={liked}
          onClick={() => setLiked((v) => !v)}
          icon={liked ? <Heart20Filled /> : <Heart20Regular />}
          aria-label="Like"
        />
        <ToggleButton
          checked={saved}
          onClick={() => setSaved((v) => !v)}
          icon={saved ? <Bookmark20Filled /> : <Bookmark20Regular />}
          aria-label="Save for later"
        />
      </DemoCard>
    </FluentDemoFrame>
  );
};
