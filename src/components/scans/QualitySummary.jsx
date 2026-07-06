import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ShieldCheck, Zap, HelpCircle, Code, LineChart } from 'lucide-react';

function CircularMeter({ value, label, size = 70, strokeWidth = 5, icon: Icon, colorClass = 'text-brand-blue' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/[0.005] border border-white/[0.03] text-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Circle track */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-white/[0.04]"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Animated score stroke */}
          <motion.circle
            className={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
          <span className="text-[12.5px] font-extrabold text-white leading-none">{value}%</span>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2.5 text-[11px] font-bold text-white uppercase tracking-wider">
        {Icon && <Icon className="w-3.5 h-3.5 text-brand-text-secondary" />}
        <span>{label}</span>
      </div>
    </div>
  );
}

export function QualitySummary({ scorecard }) {
  // Determine overall score color coding
  let overallColor = 'text-brand-blue';
  if (scorecard.overallScore < 80 && scorecard.overallScore >= 70) {
    overallColor = 'text-amber-400';
  } else if (scorecard.overallScore < 70) {
    overallColor = 'text-red-400';
  }

  return (
    <div className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6 backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
          <BarChart3 className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quality Summary Scorecard</h4>
          <p className="text-[10px] text-brand-text-secondary">Average quality parameters calculated over all scanned assets.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-between">
        {/* Large overall score dial */}
        <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-white/[0.005] border border-white/[0.04] lg:w-1/3 min-w-[200px]">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-white/[0.04]"
                strokeWidth={8}
                stroke="currentColor"
                fill="transparent"
                r={48}
                cx={56}
                cy={56}
              />
              <motion.circle
                className={overallColor}
                strokeWidth={8}
                strokeDasharray={48 * 2 * Math.PI}
                initial={{ strokeDashoffset: 48 * 2 * Math.PI }}
                animate={{ strokeDashoffset: 48 * 2 * Math.PI - (scorecard.overallScore / 100) * 48 * 2 * Math.PI }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={48}
                cx={56}
                cy={56}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
              <span className="text-2xl font-extrabold text-white">{scorecard.overallScore}%</span>
              <span className="text-[7.5px] uppercase tracking-wider font-bold text-brand-text-secondary mt-0.5">Overall Grade</span>
            </div>
          </div>
          <h5 className="text-xs font-bold text-white mt-4 uppercase tracking-wider">Quality Grade: A-</h5>
        </div>

        {/* Small metric dials */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <CircularMeter
            value={scorecard.codeCoverage}
            label="Code Coverage"
            icon={Code}
            colorClass="text-brand-blue"
          />
          <CircularMeter
            value={scorecard.testCoverage}
            label="Test Coverage"
            icon={LineChart}
            colorClass="text-cyan-400"
          />
          <CircularMeter
            value={scorecard.securityScore}
            label="Security"
            icon={ShieldCheck}
            colorClass="text-emerald-400"
          />
          <CircularMeter
            value={scorecard.performanceScore}
            label="Performance"
            icon={Zap}
            colorClass="text-amber-400"
          />
          <CircularMeter
            value={scorecard.maintainabilityScore}
            label="Maintainability"
            icon={HelpCircle}
            colorClass="text-brand-blue"
          />
        </div>
      </div>
    </div>
  );
}
export default QualitySummary;
