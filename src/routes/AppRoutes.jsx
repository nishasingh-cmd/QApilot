import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Home } from '../pages/Home';
import { Dashboard } from '../pages/Dashboard';
import { NotFound } from '../pages/NotFound';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { VerifyEmail } from '../pages/auth/VerifyEmail';

/** Premium placeholder screen shown for all Phase 3.2+ pages */
function PlaceholderPage({ title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center select-none">
      <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-2xl">
        🚧
      </div>
      <div className="flex flex-col gap-2 max-w-sm">
        <h3 className="text-lg font-extrabold text-white tracking-tight">{title}</h3>
        <p className="text-[13px] text-brand-text-secondary leading-relaxed">{desc}</p>
        <span className="text-[11px] font-bold uppercase tracking-widest text-brand-blue/60 mt-1">Coming in next phase</span>
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Layout Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Auth Layout Routes */}
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />
      <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
      <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />
      <Route path="/verify-email" element={<AuthLayout><VerifyEmail /></AuthLayout>} />


      {/* Dashboard Layout Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Phase 3.2+ content — premium placeholder screens */}
        <Route path="/dashboard/repos" element={<PlaceholderPage title="Repositories" desc="Connect and manage your GitHub, GitLab, or Bitbucket repositories." />} />
        <Route path="/dashboard/scans" element={<PlaceholderPage title="AI Scans" desc="View all historical and running AI-powered quality scans across repositories." />} />
        <Route path="/dashboard/bugs" element={<PlaceholderPage title="Bug Reports" desc="Browse detected bugs, regressions, and security issues across all scans." />} />
        <Route path="/dashboard/runs" element={<PlaceholderPage title="Test Runs" desc="Inspect individual test run results, timings, and CI/CD pipeline outputs." />} />
        <Route path="/dashboard/analytics" element={<PlaceholderPage title="Analytics" desc="Visualise quality trends, test coverage, and deployment health over time." />} />
        <Route path="/dashboard/team" element={<PlaceholderPage title="Team" desc="Manage workspace members, roles, and permissions." />} />
        <Route path="/dashboard/notifications" element={<PlaceholderPage title="Notifications" desc="Review all alerts, scan summaries, and activity across your workspace." />} />
        <Route path="/dashboard/settings" element={<PlaceholderPage title="Settings" desc="Configure integrations, tokens, webhooks, billing, and account preferences." />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
