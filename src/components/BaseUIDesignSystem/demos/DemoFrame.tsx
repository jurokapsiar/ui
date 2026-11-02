import React from 'react';
import styles from './BaseUIDemos.module.css';

interface DemoFrameProps {
  category: string;
  packageName: string;
  title: string;
  tagline: string;
  contractLabel: string;
  contract: string[];
  contractNote: string;
  children: React.ReactNode;
}

/** Page header plus card grid shared by every demo added after the original Base UI set, in both the Base UI and Fluent UI views. */
export const DemoFrame: React.FC<DemoFrameProps> = ({
  category,
  packageName,
  title,
  tagline,
  contractLabel,
  contract,
  contractNote,
  children,
}) => (
  <div className={styles.demoPageContainer}>
    <header className={styles.demoHeader}>
      <div className={styles.metaRow}>
        <span>{category}</span>
        <span aria-hidden="true">·</span>
        <span>{packageName}</span>
      </div>
      <h1 className={styles.componentTitle}>{title}</h1>
      <p className={styles.componentTagline}>{tagline}</p>
      <div className={styles.contractStrip}>
        <span className="font-semibold text-xs">{contractLabel}</span>
        {contract.map((item) => (
          <code key={item} className={styles.contractBadge}>
            {item}
          </code>
        ))}
        <span className="ms-auto font-mono text-xs text-[var(--color-neutral-text-muted,#71717a)]">{contractNote}</span>
      </div>
    </header>
    <div className={styles.variantGrid}>{children}</div>
  </div>
);

interface DemoCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  column?: boolean;
}

export const DemoCard: React.FC<DemoCardProps> = ({ title, subtitle, children, column }) => (
  <section className={styles.variantCard}>
    <div className={styles.variantCardHeader}>
      <div>
        <h2 className={styles.variantTitle}>{title}</h2>
        <p className={styles.variantSubtitle}>{subtitle}</p>
      </div>
    </div>
    <div className={column ? `${styles.previewArea} ${styles.previewColumn}` : styles.previewArea}>{children}</div>
  </section>
);
