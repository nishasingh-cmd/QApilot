import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock authentication transition
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
      
      <Card className="w-full max-w-md bg-brand-surface border-brand-border p-8 z-10">
        <div className="text-center mb-8">
          <h2 className="text-title text-white font-bold mb-2">Welcome Back</h2>
          <p className="text-sm text-brand-text-secondary">Sign in to your QAPilot workspace</p>
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

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text-secondary" htmlFor="password">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-brand-blue hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-4 rounded-xl bg-brand-card border border-brand-border text-white text-sm placeholder-brand-text-secondary/50 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="text-center mt-6 text-sm text-brand-text-secondary">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-cyan hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
