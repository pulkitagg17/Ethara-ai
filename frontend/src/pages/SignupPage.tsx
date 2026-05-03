import { useState } from 'react';
import { useSignup } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#111',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '9px 12px',
    fontSize: '13px',
    color: '#f0f0f0',
    outline: 'none',
    boxSizing: 'border-box',
};

export const SignupPage = () => {
    const signup = useSignup();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !email || !password) return;
        signup.mutate({ name, email, password });
    };

    const isDisabled = signup.isPending || !name || !email || !password;

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
                    <h1 className="text-base font-semibold text-white mb-1">Create account</h1>
                    <p className="text-xs text-neutral-500 mb-6">Fill in the details below to get started</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5" htmlFor="name">
                                Full name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Jane Smith"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={signup.isPending}
                                style={inputStyle}
                                onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                                onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
                            />
                        </div>

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
                                disabled={signup.isPending}
                                style={inputStyle}
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
                                disabled={signup.isPending}
                                style={inputStyle}
                                onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                                onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
                            />
                        </div>

                        {signup.isError && (
                            <p className="text-xs text-red-400 text-center">
                                Something went wrong. Please try again.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isDisabled}
                            style={{
                                width: '100%',
                                background: isDisabled ? '#1a2e27' : '#10b981',
                                color: isDisabled ? '#4a7a63' : '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '9px',
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transition: 'background 0.15s',
                                marginTop: '4px',
                            }}
                        >
                            {signup.isPending && <Loader2 size={13} className="animate-spin" />}
                            {signup.isPending ? 'Creating account...' : 'Get started'}
                        </button>
                    </form>
                </div>

                <p className="text-xs text-neutral-600 text-center mt-5">
                    Already have an account?{' '}
                    <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};
