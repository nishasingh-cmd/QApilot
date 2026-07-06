import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { AuthCard } from '../../components/auth/AuthCard';
import { Input } from '../../components/ui/Input';
import { LoadingButton } from '../../components/auth/LoadingButton';
import { authConfig } from '../../config/authConfig';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    if (!email) {
      setEmailError('Email is required.');
      return false;
    } else if (!authConfig.validation.emailPattern.test(email)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API reset request
    setTimeout(() => {
      setIsLoading(false);

      if (email === 'error@qapilot.io') {
        setApiError('Unable to send link to this email address. Please try another one.');
      } else {
        setIsSuccess(true);
      }
    }, authConfig.mockDelayMs);
  }

  return (
    <AuthCard>
      {!isSuccess ? (
        <>
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <h2 className="text-xl font-bold text-white tracking-tight">Forgot password?</h2>
            <p className="text-[13px] text-brand-text-secondary">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {apiError && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-danger/10 border border-brand-danger/25 text-brand-danger" role="alert">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span className="text-[12px] font-semibold leading-relaxed">{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              required
              icon={Mail}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
                if (apiError) setApiError('');
              }}
              error={emailError}
              disabled={isLoading}
            />

            <LoadingButton
              type="submit"
              isLoading={isLoading}
              disabled={!email || !!emailError}
              className="mt-2"
            >
              Send Reset Link
            </LoadingButton>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center text-center gap-5 py-4">
          <div className="w-12 h-12 rounded-full bg-brand-success/10 border border-brand-success/20 flex items-center justify-center text-brand-success">
            <CheckCircle2 size={24} />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold text-white">Reset Link Sent</h3>
            <p className="text-[13px] text-brand-text-secondary leading-relaxed max-w-xs">
              Check your inbox at <strong className="text-white">{email}</strong> and follow the link to reset your password.
            </p>
          </div>
        </div>
      )}

      {/* Back to sign in link */}
      <div className="text-center text-[13px] select-none mt-2">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-bold text-brand-text-muted hover:text-white transition-colors focus-visible:outline-none"
        >
          <ArrowLeft size={14} />
          Back to Login
        </Link>
      </div>
    </AuthCard>
  );
}
