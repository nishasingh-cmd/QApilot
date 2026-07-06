import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthCard } from '../../components/auth/AuthCard';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { LoadingButton } from '../../components/auth/LoadingButton';
import { SocialButton } from '../../components/ui/SocialButton';
import { authConfig } from '../../config/authConfig';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Error & Status states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [agreeTermsError, setAgreeTermsError] = useState('');
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function validateForm() {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Full name is required.');
      isValid = false;
    } else {
      setNameError('');
    }

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

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (!agreeTerms) {
      setAgreeTermsError('You must agree to the Terms of Service.');
      isValid = false;
    } else {
      setAgreeTermsError('');
    }

    return isValid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    setApiSuccess('');

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API registration request
    setTimeout(() => {
      setIsLoading(false);

      if (email === 'error@qapilot.io') {
        setApiError('This email is already registered. Please sign in or use another email.');
      } else {
        setApiSuccess('Account created successfully! Preparing verification email...');
        setTimeout(() => {
          navigate('/verify-email');
        }, 1000);
      }
    }, authConfig.mockDelayMs);
  }

  const isFormValid = name && email && password && confirmPassword && agreeTerms && 
                      !nameError && !emailError && !passwordError && !confirmPasswordError;

  return (
    <AuthCard>
      <div className="flex flex-col gap-1.5 text-center sm:text-left">
        <h2 className="text-xl font-bold text-white tracking-tight">Create Account</h2>
        <p className="text-[13px] text-brand-text-secondary">
          Set up your workspace and start running automated QA.
        </p>
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          required
          icon={User}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError('');
            if (apiError) setApiError('');
          }}
          error={nameError}
          disabled={isLoading || !!apiSuccess}
        />

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
          disabled={isLoading || !!apiSuccess}
        />

        <div className="flex flex-col gap-1.5 mt-1 select-none">
          <label className="flex items-start gap-2.5 text-brand-text-secondary cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (agreeTermsError) setAgreeTermsError('');
              }}
              disabled={isLoading || !!apiSuccess}
              className="w-4 h-4 rounded bg-white/[0.04] border border-white/[0.08] text-brand-blue focus:ring-0 focus:ring-offset-0 outline-none cursor-pointer mt-0.5 transition-colors"
            />
            <span className="text-[12px] leading-snug">
              I agree to the{' '}
              <a href="#" className="font-semibold text-brand-blue hover:text-brand-cyan hover:underline transition-colors">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="font-semibold text-brand-blue hover:text-brand-cyan hover:underline transition-colors">Privacy Policy</a>
            </span>
          </label>
          {agreeTermsError && (
            <p className="text-[11px] text-brand-danger px-1" role="alert">
              {agreeTermsError}
            </p>
          )}
        </div>

        <LoadingButton
          type="submit"
          isLoading={isLoading}
          disabled={!isFormValid || !!apiSuccess}
          className="mt-2"
        >
          Create Account
        </LoadingButton>
      </form>

      <div className="relative flex items-center justify-center my-1 select-none">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.06]" />
        </div>
        <span className="relative z-10 px-3 bg-brand-bg text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">
          Or continue with
        </span>
      </div>

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

      <div className="text-center text-[13px] text-brand-text-muted select-none mt-2">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-bold text-brand-cyan hover:text-brand-blue hover:underline transition-colors focus-visible:outline-none"
        >
          Sign In
        </Link>
      </div>
    </AuthCard>
  );
}
