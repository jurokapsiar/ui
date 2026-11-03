import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Button,
  Checkbox,
  Collapsible,
  Dialog,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
  Dropdown,
  Field,
  Input,
  InteractionTag,
  InteractionTagPrimary,
  List,
  ListItem,
  ListRow,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Option,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  ProgressBar,
  Radio,
  RadioGroup,
  Slider,
  Switch,
  Tab,
  TabList,
  Tag,
  TagGroup,
  Tooltip,
  ToggleButton,
} from '../../design-system/fluent';
import { formatTaskDate, formatTaskTime, INITIAL_TASKS, saveTaskDraft, TASK_LISTS, type TaskDraft, type WorkspaceTask, createTaskDraft, validateTaskDraft } from './workspaceModel';
import { WorkspaceIcon } from './WorkspaceIcon';
import styles from './TaskWorkspace.module.css';

type TaskFilter = 'all' | 'active' | 'completed';
type WorkspaceTab = 'tasks' | 'activity';

const INITIAL_DRAFT: TaskDraft = { title: '', description: '', date: '', time: '', endTime: '', deadline: '', list: TASK_LISTS[0] };

export const FluentTaskWorkspace: React.FC = () => {
  const [tasks, setTasks] = useState<WorkspaceTask[]>(() => INITIAL_TASKS.map((task) => ({ ...task })));
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<WorkspaceTab>('tasks');
  const [projectName, setProjectName] = useState('Product launch');
  const [savedProjectName, setSavedProjectName] = useState('Product launch');
  const [owner, setOwner] = useState('Juro Kapsiar');
  const [notifications, setNotifications] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [defaultPriority, setDefaultPriority] = useState('normal');
  const [focusBudget, setFocusBudget] = useState(8);
  const [editorId, setEditorId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TaskDraft>(INITIAL_DRAFT);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [showDeadline, setShowDeadline] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [editorError, setEditorError] = useState('');
  const [notice, setNotice] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [newTaskDraft, setNewTaskDraft] = useState<WorkspaceTask | null>(null);
  const editorReturnFocus = useRef<HTMLElement | null>(null);
  const tabsId = useId();
  const editorErrorId = useId();
  const editorTitleId = useId();
  const titleError = editorError && !draft.title.trim() ? editorError : '';
  const endTimeError = editorError && !titleError ? editorError : '';

  useEffect(() => {
    // showPopover runs in the library's layout effect. Focus after the native
    // surface is visible rather than during React's hidden-surface mount.
    if (editorId) document.getElementById(editorTitleId)?.focus();
  }, [editorId, editorTitleId]);

  const updateDraft = (field: keyof TaskDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setEditorError('');
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === 'all' || (filter === 'active' ? !task.completed : task.completed);
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${task.title} ${task.description} ${task.list}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch && (showCompleted || !task.completed);
  });
  const completedCount = tasks.filter((task) => task.completed).length;
  const completion = tasks.length ? Math.round(completedCount / tasks.length * 100) : 0;
  const allVisibleChecked = filteredTasks.length > 0 && filteredTasks.every((task) => task.completed);
  const someVisibleChecked = filteredTasks.some((task) => task.completed);
  const filteredOwnerOptions = ['Juro Kapsiar', 'Mina Patel', 'Launch team'];
  const newEditorId = editorId && newTaskDraft?.id === editorId ? editorId : null;

  const resetEditor = (restoreFocus = true) => {
    if (restoreFocus && editorReturnFocus.current?.isConnected) editorReturnFocus.current.focus();
    setEditorId(null);
    setNewTaskDraft(null);
    setDraft(INITIAL_DRAFT);
    setEditorError('');
    setShowSchedule(false);
    setShowEndTime(false);
    setShowDeadline(false);
    setShowDescription(false);
  };

  const dismissEditor = (id: string, restoreFocus = true) => {
    if (editorId !== id) return;
    resetEditor(restoreFocus);
  };

  const startEditor = (task: WorkspaceTask) => {
    setEditorId(task.id);
    setDraft(createTaskDraft(task));
    setEditorError('');
    setShowSchedule(false);
    setShowEndTime(Boolean(task.endTime));
    setShowDeadline(Boolean(task.deadline));
    setShowDescription(Boolean(task.description));
  };

  const startNewTask = () => {
    const id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const task: WorkspaceTask = {
      id,
      ...INITIAL_DRAFT,
      title: '',
      date: '2026-11-03',
      time: '10:30',
      list: TASK_LISTS.includes(projectName) ? projectName : TASK_LISTS[0],
      completed: false,
      pinned: false,
      priority: defaultPriority as WorkspaceTask['priority'],
    };
    setNewTaskDraft(task);
    startEditor(task);
  };

  const handlePopoverChange = (id: string, open: boolean, task?: WorkspaceTask, restoreFocus = true) => {
    if (open) {
      if (id === 'new') startNewTask();
      else if (task) startEditor(task);
      return;
    }
    dismissEditor(id === 'new' ? newEditorId ?? id : id, restoreFocus);
  };

  const saveEditor = (event: React.FormEvent) => {
    event.preventDefault();
    const error = validateTaskDraft(draft);
    if (error) {
      setEditorError(error);
      return;
    }
    if (!editorId) return;
    if (newTaskDraft?.id === editorId) {
      setTasks((current) => [...current, { ...newTaskDraft, ...draft, title: draft.title.trim() }]);
      setFilter('all');
      setSearch('');
      setTab('tasks');
      setNotice('Task created');
    } else {
      setTasks((current) => saveTaskDraft(current, editorId, draft));
      setNotice('Task saved');
    }
    resetEditor();
  };

  const updateTask = (id: string, patch: Partial<WorkspaceTask>) => {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, ...patch } : task));
  };

  const handleSync = () => {
    setSyncing(true);
    setNotice('Syncing workspace…');
    window.setTimeout(() => {
      setSyncing(false);
      setNotice('Workspace synced');
    }, 900);
  };

  const editorSurface = (taskId: string) => editorId === taskId ? (
    <form className={styles.editorForm} onSubmit={saveEditor}>
      <Button
        appearance="subtle"
        className={styles.editorClose}
        icon={<WorkspaceIcon name="close" />}
        aria-label="Close editor"
        type="button"
        onClick={() => dismissEditor(taskId)}
      />
      <Field label={{ children: 'Task title', className: styles.visuallyHidden }} className={styles.editorTitle} validationState={titleError ? 'error' : undefined}>
        <Input
          id={editorTitleId}
          className={styles.editorTitleControl}
          autoFocus
          aria-label="Task title"
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? editorErrorId : undefined}
          value={draft.title}
          onChange={(_event, data) => updateDraft('title', data.value)}
        />
      </Field>

      <div className={styles.editorRow}>
        <WorkspaceIcon name="clock" />
        <div>
          <div className={styles.editorSchedule}>
            <Button appearance="subtle" className={styles.editorLink} type="button" aria-label="Change task date" onClick={() => setShowSchedule((value) => !value)}>
              {draft.date ? formatTaskDate(draft.date) : 'Add date'}
            </Button>
            <Button appearance="subtle" className={styles.editorLink} type="button" aria-label="Change task start time" onClick={() => setShowSchedule((value) => !value)}>
              {draft.time ? formatTaskTime(draft.time) : 'Add time'}
            </Button>
            {!showEndTime && (
              <Button appearance="outline" className={styles.editorPill} type="button" onClick={() => setShowEndTime(true)}>
                Add end time
              </Button>
            )}
          </div>
          <p className={styles.editorHint}>Does not repeat</p>
          {(showSchedule || showEndTime) && (
            <div className={styles.editorInputs}>
              {showSchedule && <Field label="Date"><Input className={styles.editorNativeInput} aria-label="Task date" type="date" value={draft.date} onChange={(_event, data) => updateDraft('date', data.value)} /></Field>}
              {showSchedule && <Field label="Start time"><Input className={styles.editorNativeInput} aria-label="Task time" type="time" value={draft.time} onChange={(_event, data) => updateDraft('time', data.value)} /></Field>}
              {showEndTime && (
                <Field label="End time" validationState={endTimeError ? 'error' : undefined}>
                  <Input className={styles.editorNativeInput} aria-label="Task end time" type="time" value={draft.endTime} aria-invalid={Boolean(endTimeError)} aria-describedby={endTimeError ? editorErrorId : undefined} onChange={(_event, data) => updateDraft('endTime', data.value)} />
                  <Button appearance="subtle" type="button" aria-label="Remove end time" onClick={() => { setShowEndTime(false); updateDraft('endTime', ''); }}>Remove</Button>
                </Field>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.editorRow}>
        <WorkspaceIcon name="deadline" />
        <div>
          {!showDeadline ? (
            <Button appearance="subtle" className={styles.editorLink} type="button" onClick={() => setShowDeadline(true)}>Add deadline</Button>
          ) : (
            <Field label="Deadline" className={styles.editorInputs}>
              <Input className={styles.editorNativeInput} aria-label="Task deadline" type="date" value={draft.deadline} onChange={(_event, data) => updateDraft('deadline', data.value)} />
              <Button appearance="subtle" type="button" onClick={() => { setShowDeadline(false); updateDraft('deadline', ''); }}>Remove deadline</Button>
            </Field>
          )}
        </div>
      </div>

      <div className={styles.editorRow}>
        <WorkspaceIcon name="description" />
        <div>
          {!showDescription ? (
            <div className={styles.inline}>
              <Button appearance="subtle" className={styles.editorLink} type="button" onClick={() => setShowDescription(true)}>Add description</Button>
              <span className={styles.muted}>or a Google Drive attachment</span>
            </div>
          ) : (
            <Field label="Task description">
              <textarea className={styles.editorDescription} aria-label="Task description" value={draft.description} onChange={(event) => updateDraft('description', event.currentTarget.value)} />
              <Button appearance="subtle" className={styles.editorLink} type="button" onClick={() => { setShowDescription(false); updateDraft('description', ''); }}>Remove description</Button>
            </Field>
          )}
        </div>
      </div>

      <div className={styles.editorRow}>
        <WorkspaceIcon name="list" />
        <Field label={{ children: 'Task list', className: styles.visuallyHidden }}>
          <Dropdown
            className={styles.editorSelectRoot}
            button={{ className: styles.editorSelect }}
            value={draft.list}
            selectedOptions={[draft.list]}
            onOptionSelect={(_event, data) => updateDraft('list', data.optionValue ?? draft.list)}
            aria-label="Task list"
          >
            {TASK_LISTS.map((list) => <Option key={list} value={list}>{list}</Option>)}
          </Dropdown>
        </Field>
      </div>

      {editorError && <p id={editorErrorId} className={styles.editorError} role="alert">{editorError}</p>}
      <div className={styles.editorFooter}>
        <Button appearance="subtle" type="button" onClick={() => dismissEditor(taskId)}>Cancel</Button>
        <Button appearance="primary" type="submit" className={styles.editorSave}>Save</Button>
      </div>
    </form>
  ) : null;

  const portaledEditor = (taskId: string, isNew = false) => createPortal(
    <PopoverSurface
      className={styles.editorPopup}
      data-fluent-root
      role="dialog"
      aria-label={isNew ? 'Create task' : 'Edit task'}
      onKeyDown={(event) => {
        // Portal events still bubble through React's row tree. Keep grid navigation
        // out of the editor, while letting a nested dropdown handle Escape first.
        event.stopPropagation();
        if (event.key === 'Escape' && !event.defaultPrevented) {
          dismissEditor(taskId);
        }
      }}
    >{editorSurface(taskId)}</PopoverSurface>,
    document.body,
  );

  const taskRow = (task: WorkspaceTask) => (
    <ListItem key={task.id} value={task.id} className={styles.taskRow} data-completed={task.completed}>
      <div role="gridcell">
        <Checkbox
          checked={task.completed}
          aria-label={`Complete task: ${task.title || 'Untitled task'}`}
          onChange={(_event, data) => updateTask(task.id, { completed: data.checked === true })}
        />
      </div>
      <div role="gridcell" className={styles.taskContent}>
        <div className={styles.taskTitle}>{task.title || 'Untitled task'}</div>
        <div className={styles.taskMeta}>
          <span>{formatTaskDate(task.date)} · {formatTaskTime(task.time)}</span>
          <span className={styles.taskBadge}>{task.list}</span>
          {task.deadline && <span>Due {formatTaskDate(task.deadline)}</span>}
          {task.priority === 'high' && <span className={styles.taskBadge}>High priority</span>}
          {task.description && <span>{task.description}</span>}
        </div>
      </div>
      <div role="gridcell" className={styles.rowActions} data-component="icon-buttons">
        <Button appearance="subtle" disabled icon={<WorkspaceIcon name="calendar" />} aria-label={`Schedule ${task.title} in calendar (unavailable)`} />
        <span data-component="tooltip">
          <Tooltip content={task.pinned ? 'Unpin task' : 'Pin task'} relationship="description">
            <ToggleButton
              appearance="subtle"
              icon={<WorkspaceIcon name="star" />}
              checked={task.pinned}
              aria-label={task.pinned ? `Unpin ${task.title}` : `Pin ${task.title}`}
              onClick={() => updateTask(task.id, { pinned: !task.pinned })}
            />
          </Tooltip>
        </span>
        <Popover
          open={editorId === task.id}
          trapFocus={false}
          onOpenChange={(event, data) => handlePopoverChange(task.id, data.open, task, event.type !== 'toggle')}
        >
          <PopoverTrigger>
            <Button
              appearance="subtle"
              icon={<WorkspaceIcon name="edit" />}
              aria-label={`Edit task: ${task.title}`}
              onClick={(event) => { editorReturnFocus.current = event.currentTarget; }}
              data-component="popover"
            >Edit</Button>
          </PopoverTrigger>
          {portaledEditor(task.id)}
        </Popover>
        <span data-component="menu">
          <Menu>
            <Tooltip content="More task actions" relationship="description">
              <MenuTrigger disableButtonEnhancement>
                <Button appearance="subtle" icon={<WorkspaceIcon name="more" />} aria-label={`More actions: ${task.title}`} />
              </MenuTrigger>
            </Tooltip>
            <MenuPopover>
              <MenuList>
                <MenuItem onClick={() => updateTask(task.id, { pinned: !task.pinned })}>{task.pinned ? 'Remove pin' : 'Pin task'}</MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => setDeleteTaskId(task.id)}>Delete task</MenuItem>
                <MenuItem disabled>Move to another workspace</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </span>
      </div>
    </ListItem>
  );

  return (
    <section className={styles.workspace} data-workspace="fluent" aria-label="Task workspace">
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <span>Workspace</span><WorkspaceIcon name="chevron" size={12} /><span>{savedProjectName}</span>
      </nav>

      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>{savedProjectName}</h1>
          <p className={styles.subtitle}>Tuesday, November 3 · {tasks.length} tasks · {completedCount} completed</p>
        </div>
        <div className={styles.actions} data-component="buttons">
          <Popover open={Boolean(newEditorId)} trapFocus={false} onOpenChange={(event, data) => handlePopoverChange('new', data.open, undefined, event.type !== 'toggle')}>
            <PopoverTrigger>
              <Button appearance="primary" icon={<WorkspaceIcon name="plus" />} onClick={(event) => { editorReturnFocus.current = event.currentTarget; }}>New task</Button>
            </PopoverTrigger>
            {portaledEditor(newEditorId ?? 'new', true)}
          </Popover>
          <Button appearance="secondary" onClick={handleSync} disabled={syncing}>{syncing ? 'Syncing…' : 'Sync now'}</Button>
          <Button appearance="subtle" disabled aria-label="Share project (unavailable)">Share</Button>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.mainColumn} aria-label="Project tasks">
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div><h2 className={styles.cardTitle}>Your work</h2><p className={styles.cardDescription}>Plan the next steps for the launch.</p></div>
              <span className={styles.muted}>{completedCount} of {tasks.length} complete</span>
            </div>
            <div data-component="tabs">
              <TabList
                className={styles.tabs}
                selectedValue={tab}
                onTabSelect={(_event, data) => setTab(String(data.value) as WorkspaceTab)}
                aria-label="Workspace content"
              >
                <Tab id={`${tabsId}-tasks-tab`} value="tasks" aria-controls={`${tabsId}-tasks-panel`}>Tasks</Tab>
                <Tab id={`${tabsId}-activity-tab`} value="activity" aria-controls={`${tabsId}-activity-panel`}>Activity</Tab>
              </TabList>
            </div>
            <div role="tabpanel" id={`${tabsId}-tasks-panel`} aria-labelledby={`${tabsId}-tasks-tab`} hidden={tab !== 'tasks'} tabIndex={0}>
              <div className={styles.toolbar}>
                <div className={styles.chips} role="group" aria-label="Filter tasks" data-component="chips">
                  {(['all', 'active', 'completed'] as const).map((value) => (
                    <InteractionTag key={value} selected={filter === value}>
                      <InteractionTagPrimary
                        aria-pressed={filter === value}
                        onClick={() => setFilter(value)}
                      >
                        {value[0].toUpperCase() + value.slice(1)}
                      </InteractionTagPrimary>
                    </InteractionTag>
                  ))}
                </div>
                <Field className={styles.search} data-component="text-field">
                  <Input aria-label="Search tasks" placeholder="Search tasks" value={search} onChange={(_event, data) => setSearch(data.value)} />
                </Field>
              </div>

              {filter !== 'all' && (
                <TagGroup aria-label="Active filters" onDismiss={() => setFilter('all')}>
                  <Tag value={filter} dismissible dismissIcon={{ 'aria-label': `Remove ${filter} filter` }}>{filter[0].toUpperCase() + filter.slice(1)}</Tag>
                </TagGroup>
              )}

              <div className={styles.inline} data-component="checkbox">
                <Checkbox
                  checked={allVisibleChecked ? true : someVisibleChecked ? 'mixed' : false}
                  label="Select all visible"
                  onChange={(_event, data) => {
                    const visibleIds = new Set(filteredTasks.map((task) => task.id));
                    setTasks((current) => current.map((task) => visibleIds.has(task.id) ? { ...task, completed: data.checked === true } : task));
                  }}
                />
              </div>

              <div data-component="lists">
                {filteredTasks.length ? (
                    <List className={styles.taskList} aria-label="Tasks" navigationMode="composite">
                    {filteredTasks.map(taskRow)}
                  </List>
                ) : <p className={styles.empty}>No tasks match these filters.</p>}
              </div>
            </div>
            <div role="tabpanel" id={`${tabsId}-activity-panel`} aria-labelledby={`${tabsId}-activity-tab`} hidden={tab !== 'activity'} tabIndex={0}>
              <List className={styles.taskList} aria-label="Recent activity" data-component="lists">
                <ListItem value="approved"><ListRow icon={<WorkspaceIcon name="check" />} headline="Launch assets approved" support="Mina Patel completed the review" meta="9:42 am" /></ListItem>
                <ListItem value="checklist"><ListRow icon={<WorkspaceIcon name="edit" />} headline="Release checklist updated" support="Juro Kapsiar changed the project plan" meta="Yesterday" /></ListItem>
                <ListItem value="created"><ListRow icon={<WorkspaceIcon name="plus" />} headline="Project created" support="Product launch workspace is ready" meta="Oct 28" /></ListItem>
              </List>
            </div>
            <p className={styles.notice} role="status">{notice}</p>
          </div>
        </section>

        <aside className={styles.sideColumn} aria-label="Project settings and progress">
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div><h2 className={styles.cardTitle}>Project progress</h2><p className={styles.cardDescription}>A clear view of the launch checklist.</p></div>
              <span className={styles.statNumber}>{completion}%</span>
            </div>
            <ProgressBar className={styles.progress} value={completion} max={100} aria-label="Project completion" data-component="progress" />
            <p className={styles.statLabel}>{completedCount} / {tasks.length} complete</p>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Project settings</h2>
            <Button appearance="subtle" type="button" onClick={() => {
              if (!projectName.trim()) { setNotice('Add a project name before saving settings.'); return; }
              setSavedProjectName(projectName.trim());
              setNotice('Project settings saved');
            }}>Save settings</Button>
            <div className={styles.fieldStack}>
              <Field
                label="Project name"
                data-component="text-field"
                validationState={projectName.trim() ? 'success' : 'error'}
                validationMessage={projectName.trim() ? 'Workspace name is ready.' : 'Add a project name.'}
              >
                <Input appearance="filled" aria-label="Project name" value={projectName} onChange={(_event, data) => setProjectName(data.value)} />
              </Field>
              <Field label="Project owner" data-component="select">
                <Dropdown
                  value={owner}
                  selectedOptions={[owner]}
                  onOptionSelect={(_event, data) => setOwner(data.optionValue ?? owner)}
                  aria-label="Project owner"
                >
                  {filteredOwnerOptions.map((name) => <Option key={name} value={name}>{name}</Option>)}
                </Dropdown>
              </Field>
            </div>
            <div className={styles.fieldStack} data-component="switch">
              <label className={styles.settingRow}>
                <span><span className={styles.settingLabel}>Task notifications</span><span className={styles.settingHint}>Updates for assignments and due dates</span></span>
                <Switch checked={notifications} onChange={(_event, data) => setNotifications(data.checked)} aria-label="Task notifications" />
              </label>
              <label className={styles.settingRow}>
                <span><span className={styles.settingLabel}>Show completed tasks</span><span className={styles.settingHint}>Include completed tasks in this view</span></span>
                <Switch checked={showCompleted} onChange={(_event, data) => setShowCompleted(data.checked)} aria-label="Show completed tasks" />
              </label>
              <label className={styles.settingRow}>
                <span><span className={styles.settingLabel}>Organization-wide retention</span><span className={styles.settingHint}>Managed by your administrator</span></span>
                <Switch disabled aria-label="Organization-wide retention" />
              </label>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Planning defaults</h2>
            <Field label="Default task priority" data-component="radio">
              <RadioGroup className={styles.radioGroup} value={defaultPriority} onChange={(_event, data) => setDefaultPriority(data.value)} aria-label="Default task priority">
                <Radio value="normal" label="Normal" />
                <Radio value="high" label="High" />
                <Radio value="low" label="Low" />
              </RadioGroup>
            </Field>
            <div className={styles.fieldStack} data-component="slider">
              <label className={styles.settingLabel} htmlFor={`${tabsId}-focus-budget`}>Weekly focus budget · {focusBudget} hours</label>
              <Slider
                id={`${tabsId}-focus-budget`}
                className={styles.slider}
                min={2}
                max={20}
                step={1}
                value={focusBudget}
                onChange={(_event, data) => setFocusBudget(data.value)}
                aria-label="Weekly focus budget"
              />
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div><h2 className={styles.cardTitle}>Project guide</h2><p className={styles.cardDescription}>Useful context for the whole team.</p></div>
            </div>
            <div data-component="accordion">
              <Accordion defaultOpenItems="about" collapsible className={styles.disclosure}>
                <AccordionItem value="about">
                  <AccordionHeader>About this project</AccordionHeader>
                  <AccordionPanel><p className={styles.cardDescription}>Coordinate the launch checklist, design handoff and final accessibility review in one shared workspace.</p></AccordionPanel>
                </AccordionItem>
                <AccordionItem value="workflow">
                  <AccordionHeader>Workflow guidance</AccordionHeader>
                  <AccordionPanel><p className={styles.cardDescription}>Keep each task small, assign an owner and set a deadline before the release review.</p></AccordionPanel>
                </AccordionItem>
              </Accordion>
            </div>
          </section>
          <section className={styles.card}>
            <div data-component="collapsible">
              <Collapsible title="Advanced settings">
                <div className={styles.fieldStack}>
                  <p className={styles.cardDescription}>Fine-tune workspace behavior for this launch.</p>
                  <Switch label="Send a weekly digest" defaultChecked />
                  <Switch label="External guest access" disabled />
                </div>
              </Collapsible>
            </div>
          </section>
        </aside>
      </div>

      <div data-component="dialog">
        <Dialog open={Boolean(deleteTaskId)} modalType="alert" onOpenChange={(_event, data) => { if (!data.open) setDeleteTaskId(null); }}>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Delete this task?</DialogTitle>
              <div className={styles.dialogContent}>
                <p>This task will be removed from the {savedProjectName} workspace.</p>
                <DialogActions>
                  <Button appearance="secondary" onClick={() => setDeleteTaskId(null)}>Cancel</Button>
                  <Button appearance="danger" onClick={() => {
                    if (deleteTaskId) setTasks((current) => current.filter((task) => task.id !== deleteTaskId));
                    setDeleteTaskId(null);
                    setNotice('Task deleted');
                  }}>Delete task</Button>
                </DialogActions>
              </div>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </div>
    </section>
  );
};
