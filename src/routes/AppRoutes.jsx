import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Home } from '../pages/Home';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { VerifyEmail } from '../pages/auth/VerifyEmail';
import { NotFound } from '../pages/NotFound';

// Lazy-loaded premium dashboard modules
const Dashboard = lazy(() => import('../pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Repositories = lazy(() => import('../pages/Repositories').then(module => ({ default: module.Repositories })));
const ConnectGithub = lazy(() => import('../pages/ConnectGithub').then(module => ({ default: module.ConnectGithub })));
const Scans = lazy(() => import('../pages/Scans').then(module => ({ default: module.Scans })));
const Findings = lazy(() => import('../pages/Findings').then(module => ({ default: module.Findings })));
const Analytics = lazy(() => import('../pages/Analytics').then(module => ({ default: module.Analytics })));
const Reports = lazy(() => import('../pages/Reports').then(module => ({ default: module.Reports })));
const Notifications = lazy(() => import('../pages/Notifications').then(module => ({ default: module.Notifications })));
const Activity = lazy(() => import('../pages/Activity').then(module => ({ default: module.Activity })));
const Settings = lazy(() => import('../pages/Settings').then(module => ({ default: module.Settings })));
const Jobs = lazy(() => import('../pages/Jobs').then(module => ({ default: module.Jobs })));
const AssistantPage = lazy(() => import('../pages/AssistantPage').then(module => ({ default: module.AssistantPage })));
const Deployments = lazy(() => import('../pages/Deployments').then(module => ({ default: module.Deployments })));
const Organization = lazy(() => import('../pages/Organization').then(module => ({ default: module.Organization })));
const Workspace = lazy(() => import('../pages/Workspace').then(module => ({ default: module.Workspace })));
const Members = lazy(() => import('../pages/Members').then(module => ({ default: module.Members })));
const Invitations = lazy(() => import('../pages/Invitations').then(module => ({ default: module.Invitations })));
const AuditLogs = lazy(() => import('../pages/AuditLogs').then(module => ({ default: module.AuditLogs })));
const Billing = lazy(() => import('../pages/Billing').then(module => ({ default: module.Billing })));
const Plans = lazy(() => import('../pages/Plans').then(module => ({ default: module.Plans })));
const Invoices = lazy(() => import('../pages/Invoices').then(module => ({ default: module.Invoices })));
const Usage = lazy(() => import('../pages/Usage').then(module => ({ default: module.Usage })));

/** Premium placeholder screen shown for all Phase 3.2+ pages */
function PlaceholderPage({ title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center select-none">
      <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-2xl">
        🚧
      </div>
      <div className="flex flex-col gap-2 max-w-sm">
        <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
        <p className="text-xs text-brand-text-secondary leading-relaxed">{desc}</p>
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
        {/* Phase 3.2+ content — premium pages */}
        <Route path="/dashboard/repos" element={<Repositories />} />
        <Route path="/dashboard/connect-github" element={<ConnectGithub />} />
        <Route path="/dashboard/scans" element={<Scans />} />
        <Route path="/dashboard/bugs" element={<Findings />} />
        <Route path="/dashboard/reports" element={<Reports />} />
        <Route path="/dashboard/runs" element={<PlaceholderPage title="Test Runs" desc="Inspect individual test run results, timings, and CI/CD pipeline outputs." />} />
        <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/team" element={<PlaceholderPage title="Team" desc="Manage workspace members, roles, and permissions." />} />
        <Route path="/dashboard/notifications" element={<Notifications />} />
        <Route path="/dashboard/activity" element={<Activity />} />
        <Route path="/dashboard/jobs" element={<Jobs />} />
        <Route path="/dashboard/assistant" element={<AssistantPage />} />
        <Route path="/dashboard/deployments" element={<Deployments />} />
        <Route path="/dashboard/organizations" element={<Organization />} />
        <Route path="/dashboard/workspaces" element={<Workspace />} />
        <Route path="/dashboard/members" element={<Members />} />
        <Route path="/dashboard/invitations" element={<Invitations />} />
        <Route path="/dashboard/audit" element={<AuditLogs />} />
        <Route path="/dashboard/billing" element={<Billing />} />
        <Route path="/dashboard/plans" element={<Plans />} />
        <Route path="/dashboard/invoices" element={<Invoices />} />
        <Route path="/dashboard/usage" element={<Usage />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default AppRoutes;
