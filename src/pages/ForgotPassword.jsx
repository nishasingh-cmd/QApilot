import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md bg-brand-surface border-brand-border p-8 z-10">
        {!isSubmitted ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-title text-white font-bold mb-2">Reset Password</h2>
              <p className="text-sm text-brand-text-secondary">
                We'll email you instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text-secondary mb-2" htmlFor="email">
                  Work Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-11 px-4 rounded-xl bg-brand-card border border-brand-border text-white text-sm placeholder-brand-text-secondary/50 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-success/10 border border-brand-success/20 flex items-center justify-center text-brand-success">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="text-title text-white font-bold">Check your email</h2>
            <p className="text-sm text-brand-text-secondary leading-relaxed max-w-sm">
              We have sent a temporary password reset link to <strong className="text-white">{email}</strong>. Please follow the instructions to secure your account.
            </p>
          </div>
        )}

        <div className="text-center mt-6 text-sm text-brand-text-secondary">
          Remember your password?{' '}
          <Link to="/login" className="text-brand-cyan hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
