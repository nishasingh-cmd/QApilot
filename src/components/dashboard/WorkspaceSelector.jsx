import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WORKSPACES = [
  { id: 'personal', name: "Nisha's Sandbox", role: 'Owner', logo: 'N' },
  { id: 'acme', name: 'Acme Corp Dev', role: 'Admin', logo: 'A' },
  { id: 'qapilot', name: 'QAPilot Main', role: 'Member', logo: 'Q' },
];

export function WorkspaceSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState(WORKSPACES[0]);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Selector trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-[13px] font-semibold text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select workspace"
      >
        <div className="w-5.5 h-5.5 rounded-lg bg-brand-blue flex items-center justify-center font-bold text-white text-[11px] select-none">
          {activeWorkspace.logo}
        </div>
        <span className="truncate max-w-[120px]">{activeWorkspace.name}</span>
        <ChevronDown size={14} className={`text-brand-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 mt-2 z-50 w-56 rounded-xl border border-white/[0.08] bg-brand-bg-secondary/95 backdrop-blur-xl p-1.5 shadow-2xl shadow-black/80"
            role="menu"
          >
            <div className="px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider text-brand-text-muted select-none">
              Workspaces
            </div>

            {WORKSPACES.map((workspace) => {
              const isSelected = workspace.id === activeWorkspace.id;
              return (
                <button
                  key={workspace.id}
                  role="menuitem"
                  onClick={() => {
                    setActiveWorkspace(workspace);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left text-[13px] transition-colors duration-150 select-none
                    ${isSelected 
                      ? 'bg-white/[0.04] text-white font-medium' 
                      : 'text-brand-text-secondary hover:bg-white/[0.03] hover:text-white'
                    }
                  `}
                >
                  <div className="w-5 h-5 rounded-md bg-white/[0.06] flex items-center justify-center font-bold text-[10px] text-brand-text-secondary">
                    {workspace.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{workspace.name}</p>
                    <p className="text-[10px] text-brand-text-muted leading-none">{workspace.role}</p>
                  </div>
                  {isSelected && (
                    <Check size={14} className="text-brand-cyan shrink-0" />
                  )}
                </button>
              );
            })}

            <div className="h-px bg-white/[0.06] my-1" />

            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-[12px] text-brand-blue hover:bg-brand-blue/5 hover:text-brand-cyan transition-colors duration-150 select-none"
            >
              <Building2 size={13} />
              <span>Create New Workspace</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
