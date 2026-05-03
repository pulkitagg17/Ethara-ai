import { useState } from 'react';
import { useLogin } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export const LoginPage = () => {
    const login = useLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) return;
        login.mutate({ email, password });
    };

    return (
        <div className="auth-bg min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-[360px] fade-up">
                {/* Logo */}
                <div className="mb-10 text-center">
                    <span className="text-2xl font-semibold tracking-tight text-white">
                        flow<span className="text-emerald-400">.</span>
                    </span>
                    <p className="text-sm text-neutral-500 mt-1">Task management, simplified.</p>
                </div>

                <div
                    style={{
                        background: '#181818',
                        border: '1px solid #242424',
                        borderRadius: '12px',
                        padding: '28px',
                    }}
                >
                    <h1 className="text-base font-semibold text-white mb-1">Sign in</h1>
                    <p className="text-xs text-neutral-500 mb-6">Enter your credentials to continue</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={login.isPending}
                                style={{
                                    width: '100%',
                                    background: '#111',
                                    border: '1px solid #2a2a2a',
                                    borderRadius: '8px',
                                    padding: '9px 12px',
                                    fontSize: '13px',
                                    color: '#f0f0f0',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                                onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={login.isPending}
                                style={{
                                    width: '100%',
                                    background: '#111',
                                    border: '1px solid #2a2a2a',
                                    borderRadius: '8px',
                                    padding: '9px 12px',
                                    fontSize: '13px',
                                    color: '#f0f0f0',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                                onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
                            />
                        </div>

                        {login.isError && (
                            <p className="text-xs text-red-400 text-center">Invalid email or password.</p>
                        )}

                        <button
                            type="submit"
                            disabled={login.isPending || !email || !password}
                            style={{
                                width: '100%',
                                background: login.isPending || !email || !password ? '#1a2e27' : '#10b981',
                                color: login.isPending || !email || !password ? '#4a7a63' : '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '9px',
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: login.isPending || !email || !password ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transition: 'background 0.15s',
                                marginTop: '4px',
                            }}
                        >
                            {login.isPending && <Loader2 size={13} className="animate-spin" />}
                            {login.isPending ? 'Signing in...' : 'Continue'}
                        </button>
                    </form>
                </div>

                <p className="text-xs text-neutral-600 text-center mt-5">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};
