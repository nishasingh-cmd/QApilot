import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { AuthCard } from '../../components/auth/AuthCard';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { LoadingButton } from '../../components/auth/LoadingButton';
import { authConfig } from '../../config/authConfig';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Validation states
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function validateForm() {
    let isValid = true;

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < authConfig.validation.passwordMinLength) {
      setPasswordError(`Password must be at least ${authConfig.validation.passwordMinLength} characters.`);
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate reset request
    setTimeout(() => {
      setIsLoading(false);

      // Error demo toggle
      if (password === 'error1234') {
        setApiError('Unable to update your password. Token might be expired or invalid.');
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2200);
      }
    }, authConfig.mockDelayMs);
  }

  const isFormValid = password && confirmPassword && !passwordError && !confirmPasswordError;

  return (
    <AuthCard>
      {!isSuccess ? (
        <>
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <h2 className="text-xl font-bold text-white tracking-tight">Reset Password</h2>
            <p className="text-[13px] text-brand-text-secondary">
              Please enter your new password details below.
            </p>
          </div>

          {apiError && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-danger/10 border border-brand-danger/25 text-brand-danger" role="alert">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span className="text-[12px] font-semibold leading-relaxed">{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <PasswordInput
              label="New Password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
                if (apiError) setApiError('');
              }}
              error={passwordError}
              disabled={isLoading}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmPasswordError) setConfirmPasswordError('');
                if (apiError) setApiError('');
              }}
              error={confirmPasswordError}
              disabled={isLoading}
            />

            <LoadingButton
              type="submit"
              isLoading={isLoading}
              disabled={!isFormValid}
              className="mt-2"
            >
              Reset Password
            </LoadingButton>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center text-center gap-5 py-4">
          <div className="w-12 h-12 rounded-full bg-brand-success/10 border border-brand-success/20 flex items-center justify-center text-brand-success">
            <CheckCircle2 size={24} />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold text-white">Password Updated</h3>
            <p className="text-[13px] text-brand-text-secondary leading-relaxed max-w-xs">
              Your password has been reset successfully. Redirecting you to login screen...
            </p>
          </div>
        </div>
      )}

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
