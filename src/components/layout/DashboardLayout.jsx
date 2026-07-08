import React, { useState, Suspense, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../dashboard/Sidebar';
import { TopNavbar } from '../dashboard/TopNavbar';
import { AnalyticsSkeleton } from '../analytics/AnalyticsSkeleton';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen bg-brand-bg items-center justify-center">
        <Loader2 size={36} className="text-brand-blue animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen bg-brand-bg text-brand-text-primary overflow-hidden font-sans relative">
      {/* Dynamic backdrop glows for total app atmosphere depth */}
      <div 
        aria-hidden="true" 
        className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] bg-brand-blue/3 rounded-full blur-[140px] pointer-events-none"
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-brand-cyan/2 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Persistent Left Sidebar */}
      <Sidebar 
        isOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
      />

      {/* Main viewport block container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Sticky Global Top Header */}
        <TopNavbar 
          onMenuToggle={() => setMobileSidebarOpen(true)} 
        />

        {/* Dynamic Nested Route Content Area */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-8 bg-brand-bg/40 relative">
          <Suspense fallback={<AnalyticsSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
