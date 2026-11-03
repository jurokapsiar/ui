import React, { useId, useMemo, useState } from 'react';
import {
  Accordion,
  AccordionChevron,
  Button,
  Checkbox,
  ChipCheck,
  ChipInput,
  ChipRemove,
  Collapsible,
  Dialog,
  DialogActions,
  Field,
  IconButton,
  IconToggle,
  Input,
  List,
  ListHeadline,
  ListItem,
  ListLead,
  ListMeta,
  ListOption,
  ListSupport,
  ListText,
  Menu,
  Popover,
  Progress,
  Radio,
  RadioGroup,
  RadioLabel,
  Select,
  Slider,
  Switch,
  SwitchLabel,
  SwitchText,
  Tabs,
  Toggle,
  Tooltip,
} from '../../design-system/base';
import {
  createTaskDraft,
  formatTaskDate,
  formatTaskTime,
  INITIAL_TASKS,
  saveTaskDraft,
  TASK_LISTS,
  validateTaskDraft,
  type TaskDraft,
  type WorkspaceTask,
} from './workspaceModel';
import { WorkspaceIcon } from './WorkspaceIcon';
import styles from './TaskWorkspace.module.css';

type TaskFilter = 'All' | 'Active' | 'Completed';
type TaskTab = 'tasks' | 'activity';
type CheckValue = boolean | 'indeterminate';

const TEAM_MEMBERS = ['Juro Kapsiar', 'Mina Park', 'Alex Rivera'];
const EMPTY_DRAFT: TaskDraft = {
  title: '',
  description: '',
  date: '2026-11-03',
  time: '',
  endTime: '',
  deadline: '',
  list: 'Product launch',
};

function SelectField({
  label,
  value,
  options,
  onChange,
  editor = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  editor?: boolean;
}) {
  return (
    <Field.Root>
      <Field.Label className={editor ? styles.visuallyHidden : undefined}>{label}</Field.Label>
      <Select.Root items={options.map((option) => ({ value: option, label: option }))} value={value} onValueChange={(next) => next && onChange(next)}>
        <Select.Trigger aria-label={label} className={editor ? styles.editorSelect : undefined}>
          <Select.Value>{(selected: string | null) => selected ?? `Choose ${label.toLowerCase()}`}</Select.Value>
          <Select.Icon aria-hidden="true"><WorkspaceIcon name="chevron" size={14} /></Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={6} alignItemWithTrigger={false}>
            <Select.Popup>
              {options.map((option) => (
                <Select.Item key={option} value={option}>
                  <Select.ItemIndicator><WorkspaceIcon name="check" size={14} /></Select.ItemIndicator>
                  <Select.ItemText>{option}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
  );
}

function TaskEditor({
  draft,
  setDraft,
  onSave,
  onCancel,
  error,
  isNew = false,
}: {
  draft: TaskDraft;
  setDraft: React.Dispatch<React.SetStateAction<TaskDraft>>;
  onSave: () => void;
  onCancel: () => void;
  error: string;
  isNew?: boolean;
}) {
  const [showDeadline, setShowDeadline] = useState(Boolean(draft.deadline));
  const [showDescription, setShowDescription] = useState(Boolean(draft.description));
  const [showEndTime, setShowEndTime] = useState(Boolean(draft.endTime));
  const [showSchedule, setShowSchedule] = useState(false);
  const errorId = useId();
  const titleError = error && !draft.title.trim() ? error : '';
  const endTimeError = error && !titleError ? error : '';
  const update = (field: keyof TaskDraft, value: string) => setDraft((current) => ({ ...current, [field]: value }));

  return (
    <Popover.Popup className={styles.editorPopup} role="dialog" aria-label={isNew ? 'Create task' : 'Edit task'}>
      <Popover.Close render={<IconButton type="button" className={styles.editorClose} aria-label="Close editor"><WorkspaceIcon name="close" /></IconButton>} />
      <form
        className={styles.editorForm}
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <Field.Root className={styles.editorTitle}>
          <Field.Label className={styles.visuallyHidden}>Task title</Field.Label>
          <Input
            autoFocus
            aria-label="Task title"
            placeholder="Task name"
            value={draft.title}
            onChange={(event) => update('title', event.target.value)}
            aria-invalid={Boolean(titleError)}
            aria-describedby={titleError ? errorId : undefined}
          />
        </Field.Root>

        <div className={styles.editorRow}>
          <WorkspaceIcon name="clock" />
          <div>
            <div className={styles.editorSchedule}>
              <Button type="button" data-variant="text" className={styles.editorLink} aria-label="Change task date" onClick={() => setShowSchedule((show) => !show)}>{formatTaskDate(draft.date)}</Button>
              <Button type="button" data-variant="text" className={styles.editorLink} aria-label="Change task start time" onClick={() => setShowSchedule((show) => !show)}>{formatTaskTime(draft.time)}</Button>
              {!showEndTime && <Button type="button" data-variant="outlined" className={styles.editorPill} onClick={() => setShowEndTime(true)}>Add end time</Button>}
            </div>
            <p className={styles.editorHint}>Does not repeat</p>
            {(showSchedule || showEndTime) && <div className={styles.editorInputs}>
              {showSchedule && <>
                <Field.Root>
                  <Field.Label>Date</Field.Label>
                  <Input type="date" aria-label="Task date" value={draft.date} onChange={(event) => update('date', event.target.value)} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Start time</Field.Label>
                  <Input type="time" aria-label="Task start time" value={draft.time} onChange={(event) => update('time', event.target.value)} />
                </Field.Root>
              </>}
              {showEndTime ? (
                <Field.Root>
                  <Field.Label>End time</Field.Label>
                  <div className={styles.inline}>
                    <Input type="time" aria-label="Task end time" value={draft.endTime} onChange={(event) => update('endTime', event.target.value)} aria-invalid={Boolean(endTimeError)} aria-describedby={endTimeError ? errorId : undefined} />
                    <IconButton type="button" aria-label="Remove end time" onClick={() => { setShowEndTime(false); update('endTime', ''); }}><WorkspaceIcon name="close" size={14} /></IconButton>
                  </div>
                </Field.Root>
              ) : null}
            </div>}
          </div>
        </div>

        <div className={styles.editorRow}>
          <WorkspaceIcon name="deadline" />
          <div>
            {showDeadline ? (
              <Field.Root>
                <Field.Label>Deadline</Field.Label>
                <div className={styles.inline}>
                  <Input type="date" aria-label="Task deadline" value={draft.deadline} onChange={(event) => update('deadline', event.target.value)} />
                  <IconButton type="button" aria-label="Remove deadline" onClick={() => { setShowDeadline(false); update('deadline', ''); }}><WorkspaceIcon name="close" size={14} /></IconButton>
                </div>
              </Field.Root>
            ) : (
              <Button type="button" data-variant="text" className={styles.editorLink} onClick={() => setShowDeadline(true)}>Add deadline</Button>
            )}
          </div>
        </div>

        <div className={styles.editorRow}>
          <WorkspaceIcon name="description" />
          <div>
            {showDescription ? (
              <Field.Root>
                <Field.Label>Description</Field.Label>
                <textarea
                  className={styles.editorDescription}
                  aria-label="Task description"
                  placeholder="Add a description"
                  value={draft.description}
                  onChange={(event) => update('description', event.target.value)}
                />
                <Button type="button" data-variant="text" className={styles.editorLink} onClick={() => { setShowDescription(false); update('description', ''); }}>Remove description</Button>
              </Field.Root>
            ) : (
              <div className={styles.inline}>
                <Button type="button" data-variant="text" className={styles.editorLink} onClick={() => setShowDescription(true)}>Add description</Button>
                <span className={styles.muted}>or a Google Drive attachment</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.editorRow}>
          <WorkspaceIcon name="list" />
          <SelectField editor label="Task list" value={draft.list} options={TASK_LISTS} onChange={(value) => update('list', value)} />
        </div>

        {error && <p id={errorId} className={styles.editorError} role="alert">{error}</p>}
        <div className={styles.editorFooter}>
          <Button type="button" data-variant="text" onClick={onCancel}>Cancel</Button>
          <Button type="submit" data-variant="filled" className={styles.editorSave}>{isNew ? 'Create task' : 'Save'}</Button>
        </div>
      </form>
    </Popover.Popup>
  );
}

export function BaseTaskWorkspace() {
  const [tasks, setTasks] = useState<WorkspaceTask[]>(() => INITIAL_TASKS.map((task) => ({ ...task })));
  const [filter, setFilter] = useState<TaskFilter>('All');
  const [tab, setTab] = useState<TaskTab>('tasks');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<TaskDraft>(EMPTY_DRAFT);
  const [editorTaskId, setEditorTaskId] = useState<string | null>(null);
  const [newEditorOpen, setNewEditorOpen] = useState(false);
  const [isNewDraft, setIsNewDraft] = useState(false);
  const [editorError, setEditorError] = useState('');
  const [status, setStatus] = useState('');
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('Product launch');
  const [savedProjectName, setSavedProjectName] = useState('Product launch');
  const [projectNameTouched, setProjectNameTouched] = useState(false);
  const [owner, setOwner] = useState(TEAM_MEMBERS[0]);
  const [notifications, setNotifications] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [effort, setEffort] = useState<WorkspaceTask['priority']>('normal');
  const [focusBudget, setFocusBudget] = useState(8);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [accordionValue, setAccordionValue] = useState<unknown[]>(['about']);
  const [isSyncing, setIsSyncing] = useState(false);

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesFilter = filter === 'All' || (filter === 'Active' ? !task.completed : task.completed);
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${task.title} ${task.description} ${task.list}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch && (showCompleted || !task.completed);
  }), [filter, search, tasks, showCompleted]);
  const completedCount = tasks.filter((task) => task.completed).length;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const selection: CheckValue = visibleTasks.length > 0 && visibleTasks.every((task) => task.completed)
    ? true
    : visibleTasks.some((task) => task.completed) ? 'indeterminate' : false;
  const beginEdit = (task: WorkspaceTask) => {
    setIsNewDraft(false);
    setEditorError('');
    setDraft(createTaskDraft(task));
    setEditorTaskId(task.id);
  };

  const closeEditor = () => {
    setEditorTaskId(null);
    setDraft(EMPTY_DRAFT);
    setEditorError('');
    setIsNewDraft(false);
    setNewEditorOpen(false);
  };

  const saveEditor = () => {
    const error = validateTaskDraft(draft);
    if (error) {
      setEditorError(error);
      return;
    }
    if (isNewDraft) {
      const newTask: WorkspaceTask = {
        ...draft,
        title: draft.title.trim(),
        id: `task-${Date.now()}`,
        completed: false,
        pinned: false,
        priority: effort,
      };
      setTasks((current) => [...current, newTask]);
      setFilter('All');
      setSearch('');
      setStatus('Task created');
    } else if (editorTaskId) {
      setTasks((current) => saveTaskDraft(current, editorTaskId, draft));
      setStatus('Task saved');
    }
    closeEditor();
  };

  const startNewTask = () => {
    setIsNewDraft(true);
    setDraft({ ...EMPTY_DRAFT });
    setEditorError('');
    setEditorTaskId('new');
    setNewEditorOpen(true);
  };

  const toggleTaskCompletion = (id: string, checked: boolean) => {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: checked } : task));
  };

  const setAllVisibleCompleted = (checked: CheckValue) => {
    const completed = checked === true || checked === 'indeterminate';
    const visibleIds = new Set(visibleTasks.map((task) => task.id));
    setTasks((current) => current.map((task) => visibleIds.has(task.id) ? { ...task, completed } : task));
  };

  const deleteTask = () => {
    if (!deletingTaskId) return;
    setTasks((current) => current.filter((task) => task.id !== deletingTaskId));
    setDeletingTaskId(null);
    setStatus('Task deleted');
  };

  const sync = () => {
    setIsSyncing(true);
    setStatus('Syncing project');
    window.setTimeout(() => {
      setIsSyncing(false);
      setStatus('Project synced');
    }, 900);
  };

  const renderTaskEditor = (isNew = false) => (
    <TaskEditor
      draft={draft}
      setDraft={(next) => { setDraft(next); setEditorError(''); }}
      error={editorError}
      isNew={isNew}
      onSave={saveEditor}
      onCancel={closeEditor}
    />
  );

  return (
    <div className={styles.workspace} data-workspace="base">
      <div className={styles.breadcrumb}>
        <span>Workspace</span><WorkspaceIcon name="chevron" size={12} /><span>{savedProjectName}</span>
      </div>

      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>{savedProjectName}</h1>
          <p className={styles.subtitle}>Tuesday, November 3 · {tasks.length} tasks · {completedCount} completed</p>
        </div>
        <div className={styles.actions} data-component="buttons">
          <Popover.Root open={newEditorOpen} onOpenChange={(open) => { if (!open) closeEditor(); }}>
            <Popover.Trigger render={<Button type="button" data-variant="filled" onClick={startNewTask}><WorkspaceIcon name="plus" />New task</Button>} />
            <Popover.Portal>
              <Popover.Positioner side="bottom" sideOffset={8} collisionPadding={16}>
                {renderTaskEditor(true)}
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
          <Button type="button" data-variant="outlined" onClick={sync} disabled={isSyncing}>Share / Sync</Button>
          <Button type="button" data-variant="outlined" disabled title="This action is available after review">Publish update</Button>
        </div>
      </header>

      <Tooltip.Provider delay={140}>
        <div className={styles.grid}>
          <section className={styles.mainColumn} aria-label="Project tasks">
            <section className={styles.card} aria-label="Task workspace">
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Your work</h2>
                  <p className={styles.cardDescription}>Plan the next steps for the launch.</p>
                </div>
                <span className={styles.muted}>{completedCount} of {tasks.length} complete</span>
              </div>

              <Tabs.Root className={styles.tabs} value={tab} onValueChange={(value) => setTab(value as TaskTab)}>
                <Tabs.List aria-label="Workspace sections" data-component="tabs">
                  <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
                  <Tabs.Tab value="activity">Activity</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="tasks">
                  <div className={styles.toolbar}>
                    <div role="group" aria-label="Filter tasks" className={styles.chips} data-component="chips">
                      {(['All', 'Active', 'Completed'] as const).map((option) => (
                        <Toggle key={option} value={option} pressed={filter === option} onPressedChange={(pressed) => { if (pressed) setFilter(option); }} data-filter={option}>
                          <ChipCheck><WorkspaceIcon name="check" size={13} /></ChipCheck>{option}
                        </Toggle>
                      ))}
                    </div>
                    <Field.Root className={styles.search} data-component="text-field">
                      <Field.Label className="sr-only">Search tasks</Field.Label>
                      <Input type="search" aria-label="Search tasks" placeholder="Search tasks" value={search} onChange={(event) => setSearch(event.target.value)} />
                    </Field.Root>
                  </div>

                  {filter !== 'All' && (
                    <ChipInput role="listitem" aria-label={`Active filter ${filter}`}>
                      {filter} tasks
                      <ChipRemove type="button" aria-label="Clear active filter" onClick={() => setFilter('All')}><WorkspaceIcon name="close" size={13} /></ChipRemove>
                    </ChipInput>
                  )}

                  <div className={styles.cardHeader}>
                    <label className={styles.inline} data-component="checkbox">
                      <Checkbox.Root
                        checked={selection === true}
                        indeterminate={selection === 'indeterminate'}
                        onCheckedChange={setAllVisibleCompleted}
                        aria-label="Select all visible tasks"
                        data-testid="select-all"
                      >
                        <Checkbox.Indicator><WorkspaceIcon name="check" size={14} /></Checkbox.Indicator>
                      </Checkbox.Root>
                      <span className={styles.muted}>Select visible</span>
                    </label>
                    <span className={styles.muted}>{visibleTasks.length} shown</span>
                  </div>

                  {visibleTasks.length ? (
                    <List className={styles.taskList} aria-label="Tasks" data-component="lists">
                      {visibleTasks.map((task) => (
                        <ListItem key={task.id} className={styles.taskRow} data-task-id={task.id} data-completed={String(task.completed)}>
                          <Checkbox.Root
                            checked={task.completed}
                            onCheckedChange={(checked) => toggleTaskCompletion(task.id, checked === true)}
                            aria-label={`${task.completed ? 'Mark' : 'Mark'} ${task.title} ${task.completed ? 'incomplete' : 'complete'}`}
                            data-testid={`complete-${task.id}`}
                          >
                            <Checkbox.Indicator><WorkspaceIcon name="check" size={14} /></Checkbox.Indicator>
                          </Checkbox.Root>
                          <ListText className={styles.taskContent}>
                            <ListHeadline className={styles.taskTitle}>{task.title}</ListHeadline>
                            <ListSupport className={styles.taskMeta}>
                              <span>{formatTaskDate(task.date)} · {formatTaskTime(task.time)}</span>
                              <span aria-hidden="true">·</span>
                              <span className={styles.taskBadge}>{task.list}</span>
                              {task.deadline && <span className={styles.taskBadge}>Due {formatTaskDate(task.deadline)}</span>}
                              {task.priority === 'high' && <span className={styles.taskBadge}>High priority</span>}
                              {task.description && <span>{task.description}</span>}
                            </ListSupport>
                          </ListText>
                          <div className={styles.rowActions} data-component="icon-buttons">
                            <IconButton type="button" disabled aria-label={`Schedule ${task.title} in calendar (unavailable)`}><WorkspaceIcon name="calendar" size={16} /></IconButton>
                            <Tooltip.Root>
                              <Tooltip.Trigger render={
                                <IconToggle
                                  type="button"
                                  aria-label={`${task.pinned ? 'Unpin' : 'Pin'} ${task.title}`}
                                  aria-pressed={task.pinned}
                                  data-variant="toggle"
                                  pressed={task.pinned}
                                  onPressedChange={(pressed) => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, pinned: pressed } : item))}
                                ><WorkspaceIcon name="star" size={16} /></IconToggle>
                              } />
                              <Tooltip.Portal><Tooltip.Positioner side="top" sideOffset={6}><Tooltip.Popup role="tooltip">{task.pinned ? 'Unpin task' : 'Pin task'}</Tooltip.Popup></Tooltip.Positioner></Tooltip.Portal>
                            </Tooltip.Root>
                            <Popover.Root
                              open={editorTaskId === task.id}
                              onOpenChange={(open) => {
                                if (open) beginEdit(task);
                                else if (editorTaskId === task.id) closeEditor();
                              }}
                            >
                              <Popover.Trigger
                                data-component="popover"
                                aria-label={`Edit ${task.title}`}
                                render={<Button type="button" data-variant="text"><WorkspaceIcon name="edit" size={15} />Edit</Button>}
                              />
                              <Popover.Portal>
                                <Popover.Positioner side="bottom" sideOffset={8} collisionPadding={16}>
                                  {renderTaskEditor()}
                                </Popover.Positioner>
                              </Popover.Portal>
                            </Popover.Root>
                            <span data-component="tooltip">
                              <Menu.Root open={openMenuTaskId === task.id} onOpenChange={(open) => setOpenMenuTaskId(open ? task.id : null)}>
                              <Tooltip.Root>
                                <Menu.Trigger data-component="menu" render={<Tooltip.Trigger render={<IconButton type="button" aria-label={`More actions for ${task.title}`}><WorkspaceIcon name="more" /></IconButton>} />} />
                                <Tooltip.Portal><Tooltip.Positioner side="top" sideOffset={6}><Tooltip.Popup role="tooltip">More task actions</Tooltip.Popup></Tooltip.Positioner></Tooltip.Portal>
                              </Tooltip.Root>
                                <Menu.Portal>
                                  <Menu.Positioner sideOffset={4}>
                                    <Menu.Popup>
                                      <Menu.Item onClick={() => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, pinned: !item.pinned } : item))}>{task.pinned ? 'Unpin task' : 'Pin task'}</Menu.Item>
                                      <Menu.Item data-component="dialog" onClick={() => setDeletingTaskId(task.id)}>Delete task</Menu.Item>
                                    </Menu.Popup>
                                  </Menu.Positioner>
                                </Menu.Portal>
                              </Menu.Root>
                            </span>
                          </div>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <p className={styles.empty}>No tasks match this view. Try another filter or search term.</p>
                  )}
                </Tabs.Panel>
                <Tabs.Panel value="activity">
                  <List className={styles.taskList} aria-label="Recent activity" data-component="lists">
                    <ListItem>
                      <ListLead><WorkspaceIcon name="check" /></ListLead>
                      <ListText><ListHeadline>Release assets organized</ListHeadline><ListSupport>Juro completed this task · Today at 10:12 am</ListSupport></ListText>
                      <ListMeta>2h ago</ListMeta>
                    </ListItem>
                    <ListItem>
                      <ListLead><WorkspaceIcon name="edit" /></ListLead>
                      <ListText><ListHeadline>Launch brief updated</ListHeadline><ListSupport>Mina added the final review checklist.</ListSupport></ListText>
                      <ListMeta>Yesterday</ListMeta>
                    </ListItem>
                    <ListItem>
                      <ListLead><WorkspaceIcon name="plus" /></ListLead>
                      <ListText><ListHeadline>Project started</ListHeadline><ListSupport>Product launch workspace created.</ListSupport></ListText>
                      <ListMeta>Oct 28</ListMeta>
                    </ListItem>
                  </List>
                </Tabs.Panel>
              </Tabs.Root>
            </section>

          </section>

          <aside className={styles.sideColumn} aria-label="Project settings and progress">
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div><h2 className={styles.cardTitle}>Project progress</h2><p className={styles.cardDescription}>A clear view of the launch checklist.</p></div>
                <span className={styles.statNumber}>{progress}%</span>
              </div>
              <div data-component="progress">
                <Progress.Root value={isSyncing ? null : progress} max={100} aria-label="Task completion">
                  <Progress.Track><Progress.Indicator style={{ width: `${progress}%` }} /></Progress.Track>
                </Progress.Root>
              </div>
              <p className={styles.statLabel}>{completedCount} / {tasks.length} complete</p>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div><h2 className={styles.cardTitle}>Project settings</h2><p className={styles.cardDescription}>Keep ownership and notifications up to date.</p></div>
                <Button type="button" data-variant="text" onClick={() => {
                  setProjectNameTouched(true);
                  if (!projectName.trim()) { setStatus('Add a project name before saving settings.'); return; }
                  setSavedProjectName(projectName.trim());
                  setStatus('Project settings saved');
                }}>Save settings</Button>
              </div>
              <div className={styles.settingsGrid}>
                <Field.Root invalid={projectNameTouched && !projectName.trim()} data-component="text-field">
                  <Field.Label>Project name</Field.Label>
                  <Input
                    data-variant="filled"
                    aria-label="Project name"
                    value={projectName}
                    onChange={(event) => { setProjectName(event.target.value); setProjectNameTouched(true); }}
                    aria-invalid={projectNameTouched && !projectName.trim()}
                  />
                  {projectNameTouched && !projectName.trim()
                    ? <Field.Error match={true} role="alert">Project name cannot be empty.</Field.Error>
                    : <Field.Description>Shown in your workspace and shared links.</Field.Description>}
                </Field.Root>
                <div data-component="select">
                  <SelectField label="Project owner" value={owner} options={TEAM_MEMBERS} onChange={setOwner} />
                </div>
              </div>

              <div className={styles.settingsGrid}>
                <div className={styles.fieldStack} data-component="switch">
                  <SwitchLabel className={styles.settingRow}>
                    <span><SwitchText className={styles.settingLabel}>Task notifications</SwitchText><span className={styles.settingHint}>Email when a task changes.</span></span>
                    <Switch.Root checked={notifications} onCheckedChange={setNotifications} aria-label="Task notifications"><Switch.Thumb /></Switch.Root>
                  </SwitchLabel>
                  <SwitchLabel className={styles.settingRow}>
                    <span><SwitchText className={styles.settingLabel}>Show completed tasks</SwitchText><span className={styles.settingHint}>Include completed tasks in this view.</span></span>
                    <Switch.Root checked={showCompleted} onCheckedChange={setShowCompleted} aria-label="Show completed tasks"><Switch.Thumb /></Switch.Root>
                  </SwitchLabel>
                  <SwitchLabel className={styles.settingRow}>
                    <span><SwitchText className={styles.settingLabel}>Organization-wide digest</SwitchText><span className={styles.settingHint}>Managed by your workspace admin.</span></span>
                    <Switch.Root checked={false} aria-label="Organization-wide digest" disabled><Switch.Thumb /></Switch.Root>
                  </SwitchLabel>
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Planning defaults</h2>
                <div className={styles.fieldStack}>
                  <div data-component="radio">
                    <p className={styles.settingLabel}>Default effort</p>
                    <RadioGroup className={styles.radioGroup} value={effort} onValueChange={(value) => setEffort(value as WorkspaceTask['priority'])} aria-label="Default effort">
                      {(['low', 'normal', 'high'] as const).map((level) => (
                        <RadioLabel key={level}>
                          <Radio.Root value={level} aria-label={`${level[0].toUpperCase()}${level.slice(1)} effort`}><Radio.Indicator /></Radio.Root>
                          <span>{level[0].toUpperCase()}{level.slice(1)}</span>
                        </RadioLabel>
                      ))}
                    </RadioGroup>
                  </div>
                  <div data-component="slider">
                    <div className={styles.settingRow}>
                      <span className={styles.settingLabel}>Weekly focus budget</span>
                      <span className={styles.statLabel}>{focusBudget} hours</span>
                    </div>
                    <Slider.Root value={focusBudget} min={1} max={20} step={1} onValueChange={(value) => setFocusBudget(Array.isArray(value) ? value[0] : Number(value))}>
                      <Slider.Control className={styles.slider}>
                        <Slider.Track><Slider.Indicator /><Slider.Thumb aria-label="Weekly focus budget" /></Slider.Track>
                      </Slider.Control>
                    </Slider.Root>
                  </div>
                </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div><h2 className={styles.cardTitle}>Project guide</h2><p className={styles.cardDescription}>Useful context for the whole team.</p></div>
              </div>
              <div data-component="accordion">
                <Accordion.Root value={accordionValue} onValueChange={(value) => setAccordionValue(value as unknown[])} multiple aria-label="Project guidance">
                  <Accordion.Item value="about">
                    <Accordion.Header><Accordion.Trigger>About this project<AccordionChevron><WorkspaceIcon name="chevron" size={14} /></AccordionChevron></Accordion.Trigger></Accordion.Header>
                    <Accordion.Panel>Coordinate the launch checklist, content handoff, and final quality review in one shared workspace.</Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item value="workflow">
                    <Accordion.Header><Accordion.Trigger>Workflow guidance<AccordionChevron><WorkspaceIcon name="chevron" size={14} /></AccordionChevron></Accordion.Trigger></Accordion.Header>
                    <Accordion.Panel>Keep tasks specific, add a due date for reviews, and mark an item complete only after the deliverable is ready.</Accordion.Panel>
                  </Accordion.Item>
                </Accordion.Root>
              </div>
            </section>

            <section className={styles.card}>
              <Collapsible.Root open={advancedOpen} onOpenChange={setAdvancedOpen} data-component="collapsible">
                <Collapsible.Trigger>Advanced settings<WorkspaceIcon name="chevron" size={14} /></Collapsible.Trigger>
                <Collapsible.Panel>
                  <SwitchLabel className={styles.settingRow}>
                    <span><SwitchText className={styles.settingLabel}>Weekly summary</SwitchText><span className={styles.settingHint}>A Monday recap of project changes.</span></span>
                    <Switch.Root checked={weeklyDigest} onCheckedChange={setWeeklyDigest} aria-label="Weekly summary"><Switch.Thumb /></Switch.Root>
                  </SwitchLabel>
                  <p className={styles.settingHint}>Your project owner is {owner}.</p>
                </Collapsible.Panel>
              </Collapsible.Root>
            </section>
          </aside>
        </div>
      </Tooltip.Provider>

      <Dialog.Root open={Boolean(deletingTaskId)} onOpenChange={(open) => { if (!open) setDeletingTaskId(null); }}>
        <div data-component="dialog">
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup>
              <div className={styles.dialogContent}>
                <Dialog.Title>Delete this task?</Dialog.Title>
                <Dialog.Description>This removes the task from the project. This action cannot be undone.</Dialog.Description>
                <DialogActions>
                  <Dialog.Close render={<Button type="button" data-variant="outlined">Cancel</Button>} />
                  <Button type="button" data-variant="danger" onClick={deleteTask}>Delete task</Button>
                </DialogActions>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </div>
      </Dialog.Root>

      <p className={styles.notice} role="status" aria-live="polite">{status}</p>
    </div>
  );
}
