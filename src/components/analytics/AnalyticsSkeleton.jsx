import React from 'react';

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-24 animate-pulse select-none">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-white/[0.04] rounded" />
          <div className="h-6 w-48 bg-white/[0.06] rounded" />
          <div className="h-4 w-72 bg-white/[0.04] rounded" />
        </div>
        <div className="h-9 w-32 bg-white/[0.06] rounded-xl" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] h-24 space-y-4">
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-white/[0.04] rounded" />
              <div className="h-4 w-4 bg-white/[0.04] rounded" />
            </div>
            <div className="h-6 w-12 bg-white/[0.06] rounded" />
          </div>
        ))}
      </div>

      {/* Main Charts Split Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Quality Trend panel */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-white/[0.05] bg-white/[0.015] h-[360px] space-y-6">
          <div className="flex justify-between">
            <div className="h-4 w-32 bg-white/[0.05] rounded" />
            <div className="h-6 w-48 bg-white/[0.04] rounded-xl" />
          </div>
          <div className="h-[240px] w-full bg-white/[0.02] rounded-xl" />
        </div>

        {/* Severity panel */}
        <div className="p-5 rounded-2xl border border-white/[0.05] bg-white/[0.015] h-[360px] space-y-6">
          <div className="h-4 w-36 bg-white/[0.05] rounded" />
          <div className="h-[240px] w-full bg-white/[0.02] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
export default AnalyticsSkeleton;
