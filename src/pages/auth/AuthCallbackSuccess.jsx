import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';

export function AuthCallbackSuccess() {
  const { checkAuth, user } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function handleSuccess() {
      try {
        await checkAuth();
      } catch (err) {
        console.error('Failed to sync authentication session:', err);
      }
    }

    handleSuccess();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (user) {
      addToast('Successfully authenticated!', 'success', 'Welcome to your QAPilot dashboard.');
      navigate('/dashboard');
    }
  }, [user, navigate, addToast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center select-none">
      <Loader2 size={36} className="text-brand-blue animate-spin shrink-0" />
      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-sm font-bold text-white tracking-wide">Syncing Session</h3>
        <p className="text-xs text-brand-text-secondary leading-relaxed">
          Retrieving secure authentication keys and updating your dashboard. Please wait...
        </p>
      </div>
    </div>
  );
}

export default AuthCallbackSuccess;
