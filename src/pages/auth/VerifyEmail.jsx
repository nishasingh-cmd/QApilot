import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, RotateCw } from 'lucide-react';
import { AuthCard } from '../../components/auth/AuthCard';
import { LoadingButton } from '../../components/auth/LoadingButton';
import { authConfig } from '../../config/authConfig';

export function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  function handleResend() {
    setApiError('');
    setApiSuccess('');
    setIsLoading(true);

    // Simulate resend verification API call
    setTimeout(() => {
      setIsLoading(false);
      setApiSuccess('A fresh verification link has been sent to your registered email address.');
    }, authConfig.mockDelayMs);
  }

  return (
    <AuthCard>
      <div className="flex flex-col items-center text-center gap-5 py-2">
        {/* Large pulse check success wrapper icon */}
        <div className="relative flex items-center justify-center">
          <div 
            aria-hidden="true" 
            className="absolute inset-0 rounded-full bg-brand-blue/10 animate-ping pointer-events-none"
            style={{ animationDuration: '3s' }}
          />
          <div className="relative w-14 h-14 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
            <Mail size={26} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Verify Your Email</h2>
          <p className="text-[13px] text-brand-text-secondary leading-relaxed max-w-xs">
            We have sent a verification link to your email. Click on the link inside the email to activate your account.
          </p>
        </div>
      </div>

      {apiError && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-danger/10 border border-brand-danger/25 text-brand-danger" role="alert">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span className="text-[12px] font-semibold leading-relaxed">{apiError}</span>
        </div>
      )}

      {apiSuccess && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-success/10 border border-brand-success/25 text-brand-success" role="status">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          <span className="text-[12px] font-semibold leading-relaxed">{apiSuccess}</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <LoadingButton
          type="button"
          variant="secondary"
          isLoading={isLoading}
          disabled={!!apiSuccess}
          onClick={handleResend}
          className="gap-2"
        >
          <RotateCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Resend Verification Link
        </LoadingButton>

        <div className="text-center text-[13px] select-none mt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 font-bold text-brand-text-muted hover:text-white transition-colors focus-visible:outline-none"
          >
            <ArrowLeft size={14} />
            Back to Login
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
