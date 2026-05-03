import { AlertCircle, Calendar, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { isBefore, startOfToday } from 'date-fns';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string;
    updatedAt: string;
    assigneeId?: string;
    assignee?: { id: string; name: string };
}

interface TaskCardProps {
    task: Task;
    currentUserId: string;
    isAdmin?: boolean;
    onEdit?: (task: Task) => void;
    onDelete?: (taskId: string) => void;
    onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const nextStatus: Record<Exclude<TaskStatus, 'COMPLETED'>, TaskStatus> = {
    PENDING: 'IN_PROGRESS',
    IN_PROGRESS: 'COMPLETED',
};

const nextStatusLabel: Record<Exclude<TaskStatus, 'COMPLETED'>, string> = {
    PENDING: 'Start',
    IN_PROGRESS: 'Done',
};

const priorityConfig = {
    HIGH: { color: '#ef4444', bg: '#1f1111', label: 'High' },
    MEDIUM: { color: '#f59e0b', bg: '#1f1a0d', label: 'Med' },
    LOW: { color: '#6b7280', bg: '#161616', label: 'Low' },
};

export const TaskCard = ({
    task,
    currentUserId,
    isAdmin = false,
    onEdit,
    onDelete,
    onStatusChange,
}: TaskCardProps) => {
    const isOverdue =
        task.status !== 'COMPLETED' &&
        !!task.dueDate &&
        isBefore(new Date(task.dueDate), startOfToday());

    const canChangeStatus = task.assigneeId === currentUserId && task.status !== 'COMPLETED';
    const next = canChangeStatus ? (task.status !== 'COMPLETED' ? nextStatus[task.status] : null) : null;
    const pConfig = priorityConfig[task.priority];

    return (
        <div
            className="group"
            style={{
                background: '#161616',
                border: '1px solid #1e1e1e',
                borderRadius: '8px',
                padding: '12px 14px',
                transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#272727')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1e1e1e')}
        >
            {/* Title row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <p
                    style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: task.status === 'COMPLETED' ? '#374151' : '#e5e7eb',
                        textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                        lineHeight: '1.4',
                        flex: 1,
                    }}
                >
                    {task.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    {/* Priority pill */}
                    <span
                        style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: pConfig.bg,
                            color: pConfig.color,
                            letterSpacing: '0.04em',
                        }}
                    >
                        {pConfig.label}
                    </span>
                    {/* Admin actions (visible on hover) */}
                    {isAdmin && task.status !== 'COMPLETED' && (
                        <div
                            style={{
                                display: 'flex',
                                gap: '2px',
                                opacity: 0,
                                transition: 'opacity 0.15s',
                            }}
                            className="group-hover:opacity-100"
                        >
                            <button
                                type="button"
                                onClick={() => onEdit?.(task)}
                                title="Edit"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#4b5563',
                                    cursor: 'pointer',
                                    padding: '3px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#d1d5db')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#4b5563')}
                            >
                                <Pencil size={12} />
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete?.(task.id)}
                                title="Delete"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#4b5563',
                                    cursor: 'pointer',
                                    padding: '3px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#4b5563')}
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            {task.description && (
                <p
                    style={{
                        fontSize: '12px',
                        color: '#374151',
                        marginTop: '6px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {task.description}
                </p>
            )}

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {task.status === 'COMPLETED' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981' }}>
                            <CheckCircle2 size={11} />
                            Done · {new Date(task.updatedAt).toLocaleDateString()}
                        </div>
                    ) : (
                        task.dueDate && (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '11px',
                                    color: isOverdue ? '#ef4444' : '#4b5563',
                                }}
                            >
                                <Calendar size={10} />
                                {new Date(task.dueDate).toLocaleDateString()}
                                {isOverdue && <AlertCircle size={10} />}
                            </div>
                        )
                    )}
                    {task.assignee && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#374151' }}>
                            <div
                                style={{
                                    width: '14px',
                                    height: '14px',
                                    borderRadius: '50%',
                                    background: '#1a2e27',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '8px',
                                    fontWeight: 700,
                                    color: '#10b981',
                                }}
                            >
                                {task.assignee.name.charAt(0).toUpperCase()}
                            </div>
                            {task.assignee.name}
                        </div>
                    )}
                </div>

                {/* Status action */}
                {task.status === 'COMPLETED' ? (
                    <span
                        style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: '#10b981',
                            background: '#1a2e27',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        <CheckCircle2 size={10} /> Done
                    </span>
                ) : next ? (
                    <button
                        type="button"
                        onClick={() => onStatusChange(task.id, next)}
                        style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: '#10b981',
                            background: '#1a2e27',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#1f3d30')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#1a2e27')}
                    >
                        {nextStatusLabel[task.status as Exclude<TaskStatus, 'COMPLETED'>]}
                    </button>
                ) : (
                    <span style={{ fontSize: '10px', color: '#374151', background: '#161616', padding: '3px 8px', borderRadius: '4px' }}>
                        {task.status.replace('_', ' ').toLowerCase()}
                    </span>
                )}
            </div>
        </div>
    );
};
