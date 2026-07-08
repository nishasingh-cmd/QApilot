import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNotifications } from '../../context/NotificationsContext';

export function AuthCallbackError() {
  const [searchParams] = useSearchParams();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const errorMessage = searchParams.get('error') || 'Authentication failed. Please try again.';

  useEffect(() => {
    addToast('Authentication Failed', 'error', errorMessage);
    
    const timeout = setTimeout(() => {
      navigate('/login');
    }, 4000);

    return () => clearTimeout(timeout);
  }, [errorMessage, navigate, addToast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center select-none">
      <div className="w-16 h-16 rounded-2xl bg-brand-danger/10 border border-brand-danger/25 flex items-center justify-center text-brand-danger text-2xl">
        <AlertTriangle size={28} />
      </div>
      <div className="flex flex-col gap-2 max-w-sm">
        <h3 className="text-sm font-bold text-white tracking-wide">Sign In Failed</h3>
        <p className="text-xs text-brand-danger leading-relaxed">
          {errorMessage}
        </p>
        <p className="text-[11px] text-brand-text-muted mt-1">
          Redirecting back to login portal...
        </p>
      </div>
      <button
        onClick={() => navigate('/login')}
        className="flex items-center gap-2 text-xs font-bold text-brand-blue hover:text-brand-cyan transition-colors mt-2"
      >
        <ArrowLeft size={14} />
        Back to Login
      </button>
    </div>
  );
}

export default AuthCallbackError;
