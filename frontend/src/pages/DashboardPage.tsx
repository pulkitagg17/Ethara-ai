import { useState, useMemo } from 'react';
import { useProjects, useCreateProject } from '../hooks/useProjects';
import { useMyTasks } from '../hooks/useTasks';
import { Link } from 'react-router-dom';
import { isToday, isBefore, startOfToday } from 'date-fns';
import { ChevronRight, Plus } from 'lucide-react';

type DashboardTask = {
    id: string;
    title: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    dueDate?: string;
    project?: { name: string };
};

type ProjectSummary = {
    id: string;
    name: string;
    role?: string;
};

const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#4b5563',
    marginBottom: '12px',
    display: 'block',
};

export const DashboardPage = () => {
    const { data: projects, isLoading: projectsLoading } = useProjects();
    const { data: myTasksResponse, isLoading: tasksLoading } = useMyTasks(['PENDING', 'IN_PROGRESS']);
    const createProject = useCreateProject();

    const [name, setName] = useState('');
    const myTasks = useMemo<DashboardTask[]>(() => myTasksResponse ?? [], [myTasksResponse]);

    const handleCreate = () => {
        if (!name.trim()) return;
        createProject.mutate({ name: name.trim() });
        setName('');
    };

    const stats = useMemo(() => ({
        total: myTasks.length,
        dueToday: myTasks.filter((t) => t.dueDate && isToday(new Date(t.dueDate))).length,
        overdue: myTasks.filter((t) => t.dueDate && isBefore(new Date(t.dueDate), startOfToday())).length,
    }), [myTasks]);

    const activeTasks = useMemo(() => {
        return [...myTasks].sort((a, b) => {
            const aOverdue = a.dueDate && isBefore(new Date(a.dueDate), startOfToday());
            const bOverdue = b.dueDate && isBefore(new Date(b.dueDate), startOfToday());
            const aToday = a.dueDate && isToday(new Date(a.dueDate));
            const bToday = b.dueDate && isToday(new Date(b.dueDate));
            if (aOverdue && !bOverdue) return -1;
            if (!aOverdue && bOverdue) return 1;
            if (aToday && !bToday) return -1;
            if (!aToday && bToday) return 1;
            if (a.dueDate && !b.dueDate) return -1;
            if (!a.dueDate && b.dueDate) return 1;
            if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            return 0;
        });
    }, [myTasks]);

    if (projectsLoading || tasksLoading) {
        return (
            <div style={{ color: '#4b5563', fontSize: '13px', paddingTop: '60px', textAlign: 'center' }}>
                Loading...
            </div>
        );
    }

    return (
        <div className="fade-up">
            {/* Page heading */}
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#f0f0f0', letterSpacing: '-0.2px' }}>
                    Overview
                </h1>
                <p style={{ fontSize: '13px', color: '#4b5563', marginTop: '4px' }}>
                    Your workspace at a glance.
                </p>
            </div>

            {/* Stat row */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    marginBottom: '32px',
                }}
            >
                {[
                    { label: 'Active', value: stats.total },
                    { label: 'Due today', value: stats.dueToday },
                    { label: 'Overdue', value: stats.overdue, warn: stats.overdue > 0 },
                ].map((s) => (
                    <div
                        key={s.label}
                        style={{
                            background: '#141414',
                            border: `1px solid ${s.warn ? '#3d1f1f' : '#1e1e1e'}`,
                            borderRadius: '8px',
                            padding: '16px 18px',
                        }}
                    >
                        <p
                            style={{
                                fontSize: '22px',
                                fontWeight: 700,
                                color: s.warn ? '#f87171' : '#f0f0f0',
                                lineHeight: 1,
                            }}
                        >
                            {s.value}
                        </p>
                        <p style={{ fontSize: '11px', color: '#4b5563', marginTop: '5px', fontWeight: 500 }}>
                            {s.label}
                        </p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                {/* Tasks */}
                <div>
                    <span style={labelStyle}>My tasks</span>
                    <div
                        style={{
                            background: '#141414',
                            border: '1px solid #1e1e1e',
                            borderRadius: '10px',
                            overflow: 'hidden',
                        }}
                    >
                        {activeTasks.length === 0 ? (
                            <div
                                style={{
                                    padding: '40px 20px',
                                    textAlign: 'center',
                                    color: '#374151',
                                    fontSize: '13px',
                                }}
                            >
                                No active tasks assigned to you.
                            </div>
                        ) : (
                            <div
                                className="task-scroll"
                                style={{ maxHeight: '460px', overflowY: 'auto' }}
                            >
                                {activeTasks.map((task, i) => {
                                    const due = task.dueDate ? new Date(task.dueDate) : null;
                                    const isOverdue = due ? isBefore(due, startOfToday()) : false;
                                    const isDueToday = due ? isToday(due) : false;
                                    return (
                                        <div
                                            key={task.id}
                                            style={{
                                                padding: '12px 16px',
                                                borderBottom: i < activeTasks.length - 1 ? '1px solid #1a1a1a' : 'none',
                                                borderLeft: isOverdue
                                                    ? '2px solid #ef4444'
                                                    : isDueToday
                                                    ? '2px solid #f59e0b'
                                                    : '2px solid transparent',
                                            }}
                                        >
                                            <p style={{ fontSize: '13px', fontWeight: 500, color: '#e5e7eb' }}>
                                                {task.title}
                                            </p>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    gap: '10px',
                                                    marginTop: '4px',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {task.project?.name && (
                                                    <span style={{ fontSize: '11px', color: '#10b981' }}>
                                                        {task.project.name}
                                                    </span>
                                                )}
                                                {isOverdue && (
                                                    <span style={{ fontSize: '11px', color: '#ef4444' }}>
                                                        Overdue · {due?.toLocaleDateString()}
                                                    </span>
                                                )}
                                                {isDueToday && !isOverdue && (
                                                    <span style={{ fontSize: '11px', color: '#f59e0b' }}>
                                                        Due today
                                                    </span>
                                                )}
                                                {due && !isOverdue && !isDueToday && (
                                                    <span style={{ fontSize: '11px', color: '#374151' }}>
                                                        Due {due.toLocaleDateString()}
                                                    </span>
                                                )}
                                                <span
                                                    style={{
                                                        marginLeft: 'auto',
                                                        fontSize: '10px',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        fontWeight: 500,
                                                        background:
                                                            task.status === 'IN_PROGRESS'
                                                                ? '#1a2e27'
                                                                : '#1e1e1e',
                                                        color:
                                                            task.status === 'IN_PROGRESS'
                                                                ? '#10b981'
                                                                : '#4b5563',
                                                    }}
                                                >
                                                    {task.status === 'IN_PROGRESS' ? 'In progress' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Projects */}
                <div>
                    <span style={labelStyle}>Projects</span>

                    {/* Create input */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '8px',
                            marginBottom: '10px',
                        }}
                    >
                        <input
                            placeholder="New project..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            style={{
                                flex: 1,
                                background: '#141414',
                                border: '1px solid #1e1e1e',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                fontSize: '13px',
                                color: '#f0f0f0',
                                outline: 'none',
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                            onBlur={(e) => (e.currentTarget.style.borderColor = '#1e1e1e')}
                        />
                        <button
                            onClick={handleCreate}
                            disabled={createProject.isPending || !name.trim()}
                            style={{
                                background: !name.trim() ? '#1a1a1a' : '#10b981',
                                color: !name.trim() ? '#374151' : '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 14px',
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: !name.trim() ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'background 0.15s',
                                flexShrink: 0,
                            }}
                        >
                            <Plus size={14} />
                            {createProject.isPending ? 'Creating...' : 'Add'}
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {!projects || projects.length === 0 ? (
                            <div
                                style={{
                                    background: '#141414',
                                    border: '1px solid #1e1e1e',
                                    borderRadius: '10px',
                                    padding: '32px 20px',
                                    textAlign: 'center',
                                    fontSize: '13px',
                                    color: '#374151',
                                }}
                            >
                                No projects yet. Create one above.
                            </div>
                        ) : (
                            projects.map((project: ProjectSummary) => (
                                <Link
                                    key={project.id}
                                    to={`/projects/${project.id}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: '#141414',
                                            border: '1px solid #1e1e1e',
                                            borderRadius: '8px',
                                            padding: '12px 14px',
                                            transition: 'border-color 0.15s',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.borderColor = '#2a2a2a')
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.borderColor = '#1e1e1e')
                                        }
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div
                                                style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    borderRadius: '6px',
                                                    background: '#1a2e27',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '12px',
                                                    fontWeight: 700,
                                                    color: '#10b981',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {project.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '13px', fontWeight: 500, color: '#e5e7eb' }}>
                                                    {project.name}
                                                </p>
                                                <p style={{ fontSize: '11px', color: '#374151', marginTop: '1px' }}>
                                                    {project.role}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight size={14} style={{ color: '#374151' }} />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
