import { useParams } from 'react-router-dom';
import { useProject, useAddMember } from '../hooks/useProjects';
import {
    useCreateTask,
    useDeleteTask,
    useTasks,
    type TaskStatus,
    useUpdateTask,
    useUpdateTaskStatus,
} from '../hooks/useTasks';
import { TaskCard, type Task } from '@/components/TaskCard';
import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Plus, UserPlus } from 'lucide-react';

type ProjectMember = {
    role: 'ADMIN' | 'MEMBER';
    user: { id: string; name: string; email: string };
};

type TaskColumn = {
    status: TaskStatus;
    title: string;
    dot: string;
};

const taskColumns: TaskColumn[] = [
    { status: 'PENDING', title: 'To do', dot: '#4b5563' },
    { status: 'IN_PROGRESS', title: 'In progress', dot: '#f59e0b' },
    { status: 'COMPLETED', title: 'Done', dot: '#10b981' },
];

const fieldLabel: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    color: '#4b5563',
    marginBottom: '6px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
};

const fieldInput: React.CSSProperties = {
    width: '100%',
    background: '#111',
    border: '1px solid #2a2a2a',
    borderRadius: '7px',
    padding: '8px 12px',
    fontSize: '13px',
    color: '#f0f0f0',
    outline: 'none',
    boxSizing: 'border-box',
};

const fieldTextarea: React.CSSProperties = {
    ...fieldInput,
    minHeight: '72px',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
};

const fieldSelect: React.CSSProperties = {
    ...fieldInput,
    cursor: 'pointer',
};

const submitBtn = (disabled: boolean): React.CSSProperties => ({
    width: '100%',
    background: disabled ? '#1a2e27' : '#10b981',
    color: disabled ? '#4a7a63' : '#fff',
    border: 'none',
    borderRadius: '7px',
    padding: '9px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    marginTop: '6px',
    transition: 'background 0.15s',
});

export const ProjectPage = () => {
    const { id } = useParams();
    const { data: project, isLoading: projectLoading } = useProject(id!);
    const pendingTasks = useTasks(id!, 'PENDING');
    const inProgressTasks = useTasks(id!, 'IN_PROGRESS');
    const completedTasks = useTasks(id!, 'COMPLETED');

    const createTask = useCreateTask(id!);
    const updateTask = useUpdateTask(id!);
    const deleteTask = useDeleteTask(id!);
    const updateStatus = useUpdateTaskStatus();
    const addMember = useAddMember(id!);

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
        dueDate: '',
        assigneeId: '',
    });

    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editTaskForm, setEditTaskForm] = useState({ title: '', description: '', dueDate: '' });

    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [memberEmail, setMemberEmail] = useState('');

    const tasksLoading = pendingTasks.isLoading || inProgressTasks.isLoading || completedTasks.isLoading;

    if (projectLoading || tasksLoading) {
        return (
            <div style={{ color: '#4b5563', fontSize: '13px', paddingTop: '60px', textAlign: 'center' }}>
                Loading...
            </div>
        );
    }

    const isAdmin = project.currentUserRole === 'ADMIN';
    const projectMembers: ProjectMember[] = project.members ?? [];

    const taskData: Record<TaskStatus, Task[]> = {
        PENDING: pendingTasks.data ?? [],
        IN_PROGRESS: inProgressTasks.data ?? [],
        COMPLETED: completedTasks.data ?? [],
    };

    const handleCreateTask = () => {
        if (!taskForm.title) return;
        createTask.mutate(
            {
                title: taskForm.title,
                description: taskForm.description || undefined,
                priority: taskForm.priority,
                dueDate: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : undefined,
                assigneeId: taskForm.assigneeId || undefined,
            },
            {
                onSuccess: () => {
                    setIsTaskModalOpen(false);
                    setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
                },
            }
        );
    };

    const openEditTask = (task: Task) => {
        setEditingTaskId(task.id);
        setEditTaskForm({
            title: task.title,
            description: task.description ?? '',
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '',
        });
    };

    const handleUpdateTask = () => {
        if (!editingTaskId || !editTaskForm.title.trim()) return;
        updateTask.mutate(
            {
                taskId: editingTaskId,
                title: editTaskForm.title.trim(),
                description: editTaskForm.description.trim() || null,
                dueDate: editTaskForm.dueDate ? new Date(editTaskForm.dueDate).toISOString() : null,
            },
            { onSuccess: () => setEditingTaskId(null) }
        );
    };

    const handleDeleteTask = (taskId: string) => {
        if (!window.confirm('Delete this task?')) return;
        deleteTask.mutate(taskId);
    };

    const handleAddMember = () => {
        if (!memberEmail) return;
        addMember.mutate(
            { email: memberEmail },
            {
                onSuccess: () => {
                    setIsMemberModalOpen(false);
                    setMemberEmail('');
                },
            }
        );
    };

    return (
        <div className="fade-up">
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    marginBottom: '24px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                    <div>
                        <h1
                            style={{
                                fontSize: '20px',
                                fontWeight: 600,
                                color: '#f0f0f0',
                                letterSpacing: '-0.2px',
                            }}
                        >
                            {project.name}
                        </h1>
                        {project.description && (
                            <p style={{ fontSize: '13px', color: '#4b5563', marginTop: '4px' }}>
                                {project.description}
                            </p>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        {/* Member avatars */}
                        <div style={{ display: 'flex' }}>
                            {projectMembers.slice(0, 5).map((m, i) => (
                                <div
                                    key={m.user.id}
                                    title={`${m.user.name} (${m.role})`}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        background: '#1a2e27',
                                        border: '2px solid #0f0f0f',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        color: '#10b981',
                                        marginLeft: i > 0 ? '-8px' : '0',
                                        zIndex: projectMembers.length - i,
                                        position: 'relative',
                                    }}
                                >
                                    {m.user.name.charAt(0).toUpperCase()}
                                </div>
                            ))}
                        </div>

                        {isAdmin && (
                            <>
                                <button
                                    onClick={() => setIsMemberModalOpen(true)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        color: '#6b7280',
                                        background: 'transparent',
                                        border: '1px solid #2a2a2a',
                                        borderRadius: '7px',
                                        padding: '6px 12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#d1d5db';
                                        e.currentTarget.style.borderColor = '#3a3a3a';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#6b7280';
                                        e.currentTarget.style.borderColor = '#2a2a2a';
                                    }}
                                >
                                    <UserPlus size={13} /> Invite
                                </button>
                                <button
                                    onClick={() => setIsTaskModalOpen(true)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        color: '#fff',
                                        background: '#10b981',
                                        border: 'none',
                                        borderRadius: '7px',
                                        padding: '6px 12px',
                                        cursor: 'pointer',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#0d9f72')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = '#10b981')}
                                >
                                    <Plus size={13} /> New task
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Kanban columns */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '14px',
                }}
            >
                {taskColumns.map((column) => {
                    const tasks = taskData[column.status];
                    return (
                        <div
                            key={column.status}
                            style={{
                                background: '#111',
                                border: '1px solid #1a1a1a',
                                borderRadius: '10px',
                                padding: '14px',
                                display: 'flex',
                                flexDirection: 'column',
                                height: 'calc(100vh - 260px)',
                                minHeight: '360px',
                                maxHeight: '700px',
                            }}
                        >
                            {/* Column header */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '12px',
                                    flexShrink: 0,
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                    <span
                                        style={{
                                            width: '7px',
                                            height: '7px',
                                            borderRadius: '50%',
                                            background: column.dot,
                                            display: 'inline-block',
                                            flexShrink: 0,
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: '#9ca3af',
                                            letterSpacing: '0.02em',
                                        }}
                                    >
                                        {column.title}
                                    </span>
                                </div>
                                <span
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: '#374151',
                                        background: '#1a1a1a',
                                        padding: '1px 7px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {tasks.length}
                                </span>
                            </div>

                            {/* Tasks */}
                            <div
                                className="task-scroll"
                                style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '2px' }}
                            >
                                {tasks.length === 0 ? (
                                    <div
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#2a2a2a',
                                            fontSize: '12px',
                                        }}
                                    >
                                        Empty
                                    </div>
                                ) : (
                                    tasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            currentUserId={project.currentUserId}
                                            isAdmin={isAdmin}
                                            onEdit={openEditTask}
                                            onDelete={handleDeleteTask}
                                            onStatusChange={(taskId, status) =>
                                                updateStatus.mutate({ taskId, status })
                                            }
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create Task Modal */}
            <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="New task">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                        <label style={fieldLabel}>Title</label>
                        <input
                            style={fieldInput}
                            placeholder="What needs to be done?"
                            value={taskForm.title}
                            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                            onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                            onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
                        />
                    </div>
                    <div>
                        <label style={fieldLabel}>Description (optional)</label>
                        <textarea
                            style={fieldTextarea}
                            placeholder="Add details..."
                            value={taskForm.description}
                            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                            onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                            onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <label style={fieldLabel}>Assignee</label>
                            <select
                                style={fieldSelect}
                                value={taskForm.assigneeId}
                                onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })}
                            >
                                <option value="">Unassigned</option>
                                {projectMembers.map((m) => (
                                    <option key={m.user.id} value={m.user.id}>
                                        {m.user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={fieldLabel}>Priority</label>
                            <select
                                style={fieldSelect}
                                value={taskForm.priority}
                                onChange={(e) =>
                                    setTaskForm({ ...taskForm, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' })
                                }
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style={fieldLabel}>Due date (optional)</label>
                        <input
                            type="date"
                            style={fieldInput}
                            value={taskForm.dueDate}
                            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                            onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                            onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
                        />
                    </div>
                    <button
                        onClick={handleCreateTask}
                        disabled={createTask.isPending || !taskForm.title}
                        style={submitBtn(createTask.isPending || !taskForm.title)}
                    >
                        {createTask.isPending ? 'Creating...' : 'Create task'}
                    </button>
                </div>
            </Modal>

            {/* Edit Task Modal */}
            <Modal isOpen={!!editingTaskId} onClose={() => setEditingTaskId(null)} title="Edit task">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                        <label style={fieldLabel}>Title</label>
                        <input
                            style={fieldInput}
                            value={editTaskForm.title}
                            onChange={(e) => setEditTaskForm({ ...editTaskForm, title: e.target.value })}
                            onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                            onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
                        />
                    </div>
                    <div>
                        <label style={fieldLabel}>Description</label>
                        <textarea
                            style={fieldTextarea}
                            value={editTaskForm.description}
                            onChange={(e) => setEditTaskForm({ ...editTaskForm, description: e.target.value })}
                            onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                            onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
                        />
                    </div>
                    <div>
                        <label style={fieldLabel}>Due date</label>
                        <input
                            type="date"
                            style={fieldInput}
                            value={editTaskForm.dueDate}
                            onChange={(e) => setEditTaskForm({ ...editTaskForm, dueDate: e.target.value })}
                            onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                            onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
                        />
                    </div>
                    <button
                        onClick={handleUpdateTask}
                        disabled={updateTask.isPending || !editTaskForm.title.trim()}
                        style={submitBtn(updateTask.isPending || !editTaskForm.title.trim())}
                    >
                        {updateTask.isPending ? 'Saving...' : 'Save changes'}
                    </button>
                </div>
            </Modal>

            {/* Invite Member Modal */}
            <Modal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} title="Invite member">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <p style={{ fontSize: '12px', color: '#4b5563' }}>
                        The user must already have an account to be added to{' '}
                        <strong style={{ color: '#9ca3af' }}>{project.name}</strong>.
                    </p>
                    <div>
                        <label style={fieldLabel}>Email address</label>
                        <input
                            type="email"
                            style={fieldInput}
                            placeholder="colleague@example.com"
                            value={memberEmail}
                            onChange={(e) => setMemberEmail(e.target.value)}
                            onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                            onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
                        />
                    </div>
                    <button
                        onClick={handleAddMember}
                        disabled={addMember.isPending || !memberEmail}
                        style={submitBtn(addMember.isPending || !memberEmail)}
                    >
                        {addMember.isPending ? 'Inviting...' : 'Send invite'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};
