export interface TaskDraft {
  title: string;
  description: string;
  date: string;
  time: string;
  endTime: string;
  deadline: string;
  list: string;
}

export interface WorkspaceTask extends TaskDraft {
  id: string;
  completed: boolean;
  pinned: boolean;
  priority: 'low' | 'normal' | 'high';
}

export const TASK_LISTS = ['Product launch', "jurokapsiar's list", 'Personal'];
export const INITIAL_TASKS: WorkspaceTask[] = [
  { id: 'mv', title: 'mv', description: '', date: '2026-11-03', time: '10:30', endTime: '', deadline: '', list: "jurokapsiar's list", completed: false, pinned: true, priority: 'normal' },
  { id: 'brief', title: 'Review the launch brief', description: 'Align on scope and the final release checklist.', date: '2026-11-03', time: '11:00', endTime: '11:30', deadline: '2026-11-05', list: 'Product launch', completed: false, pinned: false, priority: 'high' },
  { id: 'handoff', title: 'Prepare design handoff', description: 'Include component states and keyboard behavior.', date: '2026-11-03', time: '14:00', endTime: '', deadline: '', list: 'Product launch', completed: false, pinned: false, priority: 'normal' },
  { id: 'accessibility', title: 'Run the accessibility review', description: 'Check focus, labels, contrast, and narrow screens.', date: '2026-11-04', time: '09:30', endTime: '', deadline: '2026-11-06', list: 'Product launch', completed: false, pinned: false, priority: 'high' },
  { id: 'assets', title: 'Organize release assets', description: '', date: '2026-11-02', time: '10:00', endTime: '', deadline: '', list: 'Product launch', completed: true, pinned: false, priority: 'low' },
  { id: 'sync', title: 'Schedule the team sync', description: '', date: '2026-11-02', time: '13:00', endTime: '', deadline: '', list: 'Personal', completed: true, pinned: false, priority: 'normal' },
];

export function createTaskDraft(task: WorkspaceTask): TaskDraft {
  const { title, description, date, time, endTime, deadline, list } = task;
  return { title, description, date, time, endTime, deadline, list };
}

export function validateTaskDraft(draft: TaskDraft): string {
  if (!draft.title.trim()) return 'Add a task title.';
  if (draft.endTime && draft.time && draft.endTime <= draft.time) return 'End time must be after the start time.';
  return '';
}

export function saveTaskDraft(tasks: WorkspaceTask[], id: string, draft: TaskDraft): WorkspaceTask[] {
  const error = validateTaskDraft(draft);
  if (error) throw new Error(error);
  return tasks.map((task) => task.id === id ? { ...task, ...draft, title: draft.title.trim() } : task);
}

export function formatTaskDate(date: string): string {
  if (!date) return 'No date';
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

export function formatTaskTime(time: string): string {
  if (!time) return 'No time';
  const [hours, minutes] = time.split(':').map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')}${hours >= 12 ? 'pm' : 'am'}`;
}
