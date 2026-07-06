import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Bell, 
  Terminal, 
  FolderGit2, 
  TrendingUp, 
  ChevronRight 
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { Button } from '../ui/Button';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Test Runs', icon: Terminal, path: '/dashboard/runs' },
    { name: 'Repositories', icon: FolderGit2, path: '/dashboard/repos' },
    { name: 'Analytics', icon: TrendingUp, path: '/dashboard/analytics' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text-primary overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-brand-surface border-r border-brand-border transition-transform duration-300 md:translate-x-0 md:static md:inset-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-brand-border">
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            <Logo />
          </Link>
          <button 
            className="p-1 md:hidden text-brand-text-secondary hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-brand text-sm font-medium transition-all group
                  ${isActive 
                    ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/15' 
                    : 'text-brand-text-secondary hover:bg-brand-card hover:text-white border border-transparent hover:border-brand-border'
                  }
                `}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-brand-text-secondary group-hover:text-brand-cyan transition-colors'} />
                <span>{item.name}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Profile */}
        <div className="p-4 border-t border-brand-border bg-brand-bg/50">
          <div className="flex items-center gap-3 px-2 py-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-card border border-brand-border flex items-center justify-center text-brand-blue">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">John Doe</p>
              <p className="text-xs text-brand-text-secondary truncate">john@qapilot.io</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 hover:border-brand-danger/30 hover:text-brand-danger"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-brand-border bg-brand-surface/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              className="p-1 md:hidden text-brand-text-secondary hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold text-white tracking-wide">
              {menuItems.find(item => location.pathname === item.path)?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="relative p-2 text-brand-text-secondary hover:text-white border border-brand-border rounded-xl bg-brand-card hover:bg-brand-surface transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-cyan" />
            </button>

            {/* Quick Workspace Switcher / Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-brand-border bg-brand-card text-xs font-semibold text-brand-cyan">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse" />
              <span>Pilot Engine active</span>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-brand-bg/95">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
