import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthCard } from '../../components/auth/AuthCard';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { LoadingButton } from '../../components/auth/LoadingButton';
import { SocialButton } from '../../components/ui/SocialButton';
import { authConfig } from '../../config/authConfig';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Validation & UI states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function validateForm() {
    let isValid = true;

    if (!email) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!authConfig.validation.emailPattern.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < authConfig.validation.passwordMinLength) {
      setPasswordError(`Password must be at least ${authConfig.validation.passwordMinLength} characters.`);
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    setApiSuccess('');

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API request delay
    setTimeout(() => {
      setIsLoading(false);

      // Dummy state check for testing error UI
      if (email === 'error@qapilot.io') {
        setApiError('Invalid credentials. Use error@qapilot.io to test errors, or any other email for success.');
      } else {
        setApiSuccess('Successfully authenticated! Redirecting to workspace...');
        // Wait a brief moment to let user see success UI before redirecting
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    }, authConfig.mockDelayMs);
  }

  const isFormValid = email && password && !emailError && !passwordError;

  return (
    <AuthCard>
      <div className="flex flex-col gap-1.5 text-center sm:text-left">
        <h2 className="text-xl font-bold text-white tracking-tight">Sign In</h2>
        <p className="text-[13px] text-brand-text-secondary">
          Enter your credentials to access your QA workspace.
        </p>
      </div>

      {/* Global alert feedback states */}
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
          disabled={isLoading || !!apiSuccess}
        />

        <div className="flex flex-col gap-1.5">
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError('');
              if (apiError) setApiError('');
            }}
            error={passwordError}
            disabled={isLoading || !!apiSuccess}
          />
        </div>

        <div className="flex items-center justify-between text-[12px] select-none mt-1">
          <label className="flex items-center gap-2 text-brand-text-secondary cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading || !!apiSuccess}
              className="w-4 h-4 rounded bg-white/[0.04] border border-white/[0.08] text-brand-blue focus:ring-0 focus:ring-offset-0 outline-none cursor-pointer transition-colors"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="font-semibold text-brand-blue hover:text-brand-cyan hover:underline transition-colors focus-visible:outline-none"
          >
            Forgot Password?
          </Link>
        </div>

        <LoadingButton
          type="submit"
          isLoading={isLoading}
          disabled={!isFormValid || !!apiSuccess}
          className="mt-2"
        >
          Sign In
        </LoadingButton>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-1 select-none">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.06]" />
        </div>
        <span className="relative z-10 px-3 bg-brand-bg text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">
          Or continue with
        </span>
      </div>

      {/* Social Provider integration buttons */}
      <div className="flex gap-3">
        <SocialButton
          provider="github"
          onClick={() => {
            setApiSuccess('Redirecting to GitHub OAuth secure portal...');
            setTimeout(() => window.location.assign('https://github.com'), 1000);
          }}
          disabled={isLoading || !!apiSuccess}
        />
        <SocialButton
          provider="google"
          onClick={() => {
            setApiSuccess('Redirecting to Google OAuth secure portal...');
            setTimeout(() => window.location.assign('https://google.com'), 1000);
          }}
          disabled={isLoading || !!apiSuccess}
        />
      </div>

      {/* Navigation footer link */}
      <div className="text-center text-[13px] text-brand-text-muted select-none mt-2">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="font-bold text-brand-cyan hover:text-brand-blue hover:underline transition-colors focus-visible:outline-none"
        >
          Sign Up
        </Link>
      </div>
    </AuthCard>
  );
}
