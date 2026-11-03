import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '../../src/design-system/core';
import * as Base from '../../src/design-system/base';
import { Button as FluentButton, FluentProvider } from '../../src/design-system/fluent';

// Deliberately imports no showcase modules, global app CSS, or Tailwind.
function Consumer() {
  return (
    <ThemeProvider>
        <main>
          <h1>Pinned source consumer</h1>
          <Base.Button>Base button</Base.Button>
          <Base.Slider.Root defaultValue={50} aria-label="Volume">
            <Base.Slider.Control>
              <Base.Slider.Track>
                <Base.Slider.Indicator />
                <Base.Slider.Thumb aria-label="Volume" />
              </Base.Slider.Track>
            </Base.Slider.Control>
          </Base.Slider.Root>
          <FluentProvider>
          <FluentButton appearance="primary">Fluent button</FluentButton>
        </FluentProvider>
      </main>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(<Consumer />);
