import React from 'react';

export type WorkspaceIconName = 'edit' | 'clock' | 'deadline' | 'description' | 'list' | 'close' | 'plus' | 'more' | 'check' | 'star' | 'chevron' | 'calendar';
const paths: Record<WorkspaceIconName, React.ReactNode> = {
  edit: <><path d="m13 5 6 6M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15z" /></>,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></>,
  deadline: <><circle cx="11" cy="13" r="7" /><path d="M18 4 10 13l-3-2m8-5a7 7 0 0 0-4-1" /></>,
  description: <path d="M4 6h16M4 10h16M4 14h11M4 18h7" />,
  list: <><path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" /></>,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z" />,
  chevron: <path d="m8 5 7 7-7 7" />,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></>,
};
export function WorkspaceIcon({ name, size = 18 }: { name: WorkspaceIconName; size?: number }) {
  return <svg aria-hidden="true" focusable="false" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}
