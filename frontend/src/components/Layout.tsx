import { Link } from 'react-router-dom';
import { useLogout } from '@/hooks/useAuth';
import { LogOut, LayoutGrid } from 'lucide-react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const logout = useLogout();
    return (
        <div className="min-h-screen app-bg text-foreground font-sans antialiased flex flex-col">
            <header
                style={{
                    background: '#111111',
                    borderBottom: '1px solid #1e1e1e',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 24px',
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                        <Link
                            to="/dashboard"
                            style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                letterSpacing: '-0.3px',
                                color: '#fff',
                                textDecoration: 'none',
                            }}
                        >
                            flow<span style={{ color: '#10b981' }}>.</span>
                        </Link>
                        <nav style={{ display: 'flex', gap: '20px' }}>
                            <Link
                                to="/dashboard"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '13px',
                                    color: '#6b7280',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#d1d5db')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
                            >
                                <LayoutGrid size={14} />
                                Overview
                            </Link>
                        </nav>
                    </div>
                    <button
                        onClick={() => logout.mutate()}
                        disabled={logout.isPending}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#6b7280',
                            background: 'transparent',
                            border: '1px solid #2a2a2a',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#f0f0f0';
                            e.currentTarget.style.borderColor = '#3a3a3a';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#6b7280';
                            e.currentTarget.style.borderColor = '#2a2a2a';
                        }}
                    >
                        <LogOut size={13} />
                        {logout.isPending ? 'Logging out...' : 'Log out'}
                    </button>
                </div>
            </header>
            <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '28px 24px' }}>
                {children}
            </main>
        </div>
    );
};
