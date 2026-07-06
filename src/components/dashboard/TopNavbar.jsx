import React from 'react';
import { Menu, Search, HelpCircle, Sun } from 'lucide-react';
import { WorkspaceSelector } from './WorkspaceSelector';
import { NotificationBell } from './NotificationBell';
import { UserMenu } from './UserMenu';

export function TopNavbar({ onMenuToggle }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-white/[0.06] bg-brand-bg/60 backdrop-blur-xl">
      {/* Left side actions */}
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuToggle}
          className="p-1 md:hidden text-brand-text-secondary hover:text-white transition-colors focus-visible:outline-none"
          aria-label="Open navigation sidebar menu"
        >
          <Menu size={22} />
        </button>

        {/* Workspace selection dropdown wrapper */}
        <WorkspaceSelector />
      </div>

      {/* Center global search field (hidden on smaller mobile devices) */}
      <div className="hidden sm:flex items-center gap-2.5 max-w-xs w-full px-3 py-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-brand-text-secondary focus-within:border-brand-blue/40 focus-within:text-white transition-all duration-200">
        <Search size={15} className="shrink-0" />
        <input
          type="search"
          placeholder="Quick search... (⌘K)"
          className="bg-transparent border-none text-[12px] text-white outline-none w-full placeholder-brand-text-muted focus:ring-0"
        />
      </div>

      {/* Right side utility icons */}
      <div className="flex items-center gap-3.5">
        {/* Theme toggle placeholder */}
        <button
          className="p-2 text-brand-text-muted hover:text-white transition-colors rounded-xl hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue"
          aria-label="Theme settings (Dark theme active)"
        >
          <Sun size={17} />
        </button>

        {/* Help Center indicator links */}
        <a
          href="https://docs.qapilot.io"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-brand-text-muted hover:text-white transition-colors rounded-xl hover:bg-white/[0.03] focus-visible:outline-none"
          aria-label="Documentation Help Center"
        >
          <HelpCircle size={17} />
        </a>

        {/* Notification bells */}
        <NotificationBell />

        {/* User profile dropdown triggers */}
        <UserMenu />
      </div>
    </header>
  );
}
