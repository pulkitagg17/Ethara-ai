import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(4px)',
                padding: '16px',
                animation: 'fadeIn 0.15s ease-out',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#161616',
                    border: '1px solid #272727',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '440px',
                    overflow: 'hidden',
                    animation: 'scaleIn 0.15s ease-out',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 20px',
                        borderBottom: '1px solid #1e1e1e',
                    }}
                >
                    <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f0f0f0' }}>{title}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#4b5563',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px',
                            borderRadius: '6px',
                            transition: 'color 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#d1d5db')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#4b5563')}
                    >
                        <X size={16} />
                    </button>
                </div>
                <div style={{ padding: '20px' }}>{children}</div>
            </div>
        </div>
    );
};
