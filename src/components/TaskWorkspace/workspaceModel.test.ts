import { describe, expect, it } from 'vitest';
import { INITIAL_TASKS, createTaskDraft, saveTaskDraft, validateTaskDraft } from './workspaceModel';

describe('task editor draft contract', () => {
  it('keeps edits isolated until Save and preserves completion and pin state', () => {
    const tasks = INITIAL_TASKS.map((task) => ({ ...task }));
    const task = tasks[0];
    const draft = { ...createTaskDraft(task), title: '  Updated task  ', list: 'Personal' };
    expect(tasks[0].title).toBe(task.title);
    const saved = saveTaskDraft(tasks, task.id, draft);
    expect(saved[0].title).toBe('Updated task');
    expect(saved[0].list).toBe('Personal');
    expect(saved[0].completed).toBe(task.completed);
    expect(saved[0].pinned).toBe(task.pinned);
    expect(saved[1]).toBe(tasks[1]);
    expect(tasks[0].title).toBe(task.title);
  });

  it('rejects an empty title and an end time before the start time', () => {
    const draft = createTaskDraft(INITIAL_TASKS[0]);
    expect(validateTaskDraft({ ...draft, title: '  ' })).toBe('Add a task title.');
    expect(validateTaskDraft({ ...draft, time: '10:30', endTime: '09:00' })).toBe('End time must be after the start time.');
    expect(validateTaskDraft({ ...draft, time: '10:30', endTime: '11:00' })).toBe('');
  });
});
