import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md bg-brand-surface border-brand-border p-8 text-center z-10 flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-danger/10 border border-brand-danger/25 flex items-center justify-center text-brand-danger">
          <Compass size={32} className="animate-spin duration-[4000ms]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-display text-white font-extrabold tracking-tight">404</h2>
          <h3 className="text-title text-white font-bold">Lost in Orbit</h3>
          <p className="text-sm text-brand-text-secondary leading-relaxed">
            The page you are looking for does not exist or has been moved to another coordinate.
          </p>
        </div>

        <Link to="/" className="w-full">
          <Button variant="outline" className="w-full gap-2">
            <ArrowLeft size={16} />
            <span>Return to Home</span>
          </Button>
        </Link>
      </Card>
    </div>
  );
}
