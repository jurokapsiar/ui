import React, { useState } from 'react';
import { Button } from '@base-ui-components/react/button';
import { Toggle } from '@base-ui-components/react/toggle';
import { BookmarkSimple, Gear, Heart, ShareNetwork, Star } from '../../Icons/phosphor';
import { DemoCard, DemoFrame } from './DemoFrame';
import styles from './BaseUIDemos.module.css';

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
        <Button className={styles.iconBtn} aria-label="Open settings">
          <Gear size={20} aria-hidden="true" />
        </Button>
        <Button className={styles.iconBtn} aria-label="Share link">
          <ShareNetwork size={20} aria-hidden="true" />
        </Button>
      </DemoCard>

      <DemoCard title="Filled" subtitle="Brand fill for the primary icon action">
        <Button className={styles.iconBtn} data-variant="filled" aria-label="Add to favourites">
          <Star size={20} aria-hidden="true" />
        </Button>
        <Button className={styles.iconBtn} data-variant="filled" aria-label="Open settings" disabled>
          <Gear size={20} aria-hidden="true" />
        </Button>
      </DemoCard>

      <DemoCard title="Tonal and outlined" subtitle="Medium emphasis: a soft container or a strong outline">
        <Button className={styles.iconBtn} data-variant="tonal" aria-label="Share link">
          <ShareNetwork size={20} aria-hidden="true" />
        </Button>
        <Button className={styles.iconBtn} data-variant="outlined" aria-label="Open settings">
          <Gear size={20} aria-hidden="true" />
        </Button>
      </DemoCard>

      <DemoCard title="Toggle" subtitle="Pressed state uses a tint, a ring and aria-pressed">
        <Toggle
          className={styles.iconBtn}
          data-variant="toggle"
          pressed={liked}
          onPressedChange={setLiked}
          aria-label="Like"
        >
          <Heart size={20} weight={liked ? 'fill' : 'regular'} aria-hidden="true" />
        </Toggle>
        <Toggle
          className={styles.iconBtn}
          data-variant="toggle"
          pressed={saved}
          onPressedChange={setSaved}
          aria-label="Save for later"
        >
          <BookmarkSimple size={20} weight={saved ? 'fill' : 'regular'} aria-hidden="true" />
        </Toggle>
      </DemoCard>
    </DemoFrame>
  );
};
