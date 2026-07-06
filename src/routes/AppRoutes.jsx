import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { ForgotPassword } from '../pages/ForgotPassword';
import { Dashboard } from '../pages/Dashboard';
import { NotFound } from '../pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Layout Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Dashboard Layout Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Placeholders for additional dashboard views */}
        <Route path="/dashboard/runs" element={<div className="text-brand-text-secondary py-10">Test Runs view configuration is coming in Phase 2.0...</div>} />
        <Route path="/dashboard/repos" element={<div className="text-brand-text-secondary py-10">Repositories integration module is coming in Phase 2.0...</div>} />
        <Route path="/dashboard/analytics" element={<div className="text-brand-text-secondary py-10">Analytics & metrics view is coming in Phase 2.0...</div>} />
        <Route path="/dashboard/settings" element={<div className="text-brand-text-secondary py-10">Settings dashboard panel is coming in Phase 2.0...</div>} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
