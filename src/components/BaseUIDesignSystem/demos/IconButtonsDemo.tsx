import React, { useState } from 'react';
import { IconButton, IconToggle } from '../../../design-system/base';
import { BookmarkSimple, Gear, Heart, ShareNetwork, Star } from '../../Icons/phosphor';
import { DemoCard, DemoFrame } from './DemoFrame';

export const IconButtonsDemo: React.FC = () => {
  const [liked, setLiked] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <DemoFrame
      category="Forms & Inputs"
      packageName="@base-ui-components/react/toggle"
      title="Icon Buttons"
      tagline="Icon-only controls in standard, filled and toggle styles. Each has an aria-label because no visible text names it."
      contractLabel="DOM state attributes:"
      contract={['[data-pressed]', '[data-variant]', '[data-disabled]']}
      contractNote="aria-pressed on toggles"
    >
      <DemoCard title="Standard" subtitle="Transparent until hovered; for toolbars and dense rows">
        <IconButton aria-label="Open settings">
          <Gear size={20} aria-hidden="true" />
        </IconButton>
        <IconButton aria-label="Share link">
          <ShareNetwork size={20} aria-hidden="true" />
        </IconButton>
      </DemoCard>

      <DemoCard title="Filled" subtitle="Brand fill for the primary icon action">
        <IconButton data-variant="filled" aria-label="Add to favourites">
          <Star size={20} aria-hidden="true" />
        </IconButton>
        <IconButton data-variant="filled" aria-label="Open settings" disabled>
          <Gear size={20} aria-hidden="true" />
        </IconButton>
      </DemoCard>

      <DemoCard title="Tonal and outlined" subtitle="Medium emphasis: a soft container or a strong outline">
        <IconButton data-variant="tonal" aria-label="Share link">
          <ShareNetwork size={20} aria-hidden="true" />
        </IconButton>
        <IconButton data-variant="outlined" aria-label="Open settings">
          <Gear size={20} aria-hidden="true" />
        </IconButton>
      </DemoCard>

      <DemoCard title="Toggle" subtitle="Pressed state uses a tint, a ring and aria-pressed">
        <IconToggle
          data-variant="toggle"
          pressed={liked}
          onPressedChange={setLiked}
          aria-label="Like"
        >
          <Heart size={20} weight={liked ? 'fill' : 'regular'} aria-hidden="true" />
        </IconToggle>
        <IconToggle
          data-variant="toggle"
          pressed={saved}
          onPressedChange={setSaved}
          aria-label="Save for later"
        >
          <BookmarkSimple size={20} weight={saved ? 'fill' : 'regular'} aria-hidden="true" />
        </IconToggle>
      </DemoCard>
    </DemoFrame>
  );
};
