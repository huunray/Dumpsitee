import React, { useState } from 'react';
import { 
  Users, 
  AlertTriangle,
  ArrowRight,
  Scale,
  Trash2,
  BarChart3,
  Clock,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { UserProfile, CollectionItem, Complaint } from '../types';

interface DashboardOverviewProps {
  users: UserProfile[];
  collections: CollectionItem[];
  complaints: Complaint[];
  missedCount: number;
  setActiveTab: (tab: string) => void;
}

export default function DashboardOverview({ users, collections, complaints, missedCount, setActiveTab }: DashboardOverviewProps) {
  const [timeframe, setTimeframe] = useState<'Today' | 'This week' | 'This month' | 'All time'>('This week');

  const pendingComplaints = complaints.filter(c => c.status === 'Pending');
  const pCount = pendingComplaints.length;

  // Timeframe statistics for Funnel pipeline (Dump Posted -> Collector Notified -> Collection Confirmed)
  const getFunnelStats = () => {
    switch (timeframe) {
      case 'Today':
        return {
          posted: 142,
          notified: 120,
          notifiedPercent: 85,
          confirmed: 98,
          confirmedPercent: 69,
          conversionRate: 69
        };
      case 'This week':
        return {
          posted: 1240,
          notified: 1054,
          notifiedPercent: 85,
          confirmed: 893,
          confirmedPercent: 72,
          conversionRate: 72
        };
      case 'This month':
        return {
          posted: 4960,
          notified: 4116,
          notifiedPercent: 83,
          confirmed: 3571,
          confirmedPercent: 72,
          conversionRate: 72
        };
      case 'All time':
        return {
          posted: 59200,
          notified: 50320,
          notifiedPercent: 85,
          confirmed: 42624,
          confirmedPercent: 72,
          conversionRate: 72
        };
    }
  };

  // Timeframe-dependent statistics for Waste Volume Collected (Plastics, Paper, Metal, Organic)
  const getVolumeStats = () => {
    switch (timeframe) {
      case 'Today':
        return {
          current: '184 kg',
          allTime: '24,812 kg',
          categories: [
            { name: 'Plastics', value: 45, color: '#06b6d4' }, // Cyan
            { name: 'Paper', value: 38, color: '#eab308' },    // Yellow
            { name: 'Metal', value: 29, color: '#94a3b8' },    // Slate
            { name: 'Organic', value: 72, color: '#10b981' }   // Emerald
          ]
        };
      case 'This week':
        return {
          current: '4,812 kg',
          allTime: '24,812 kg',
          categories: [
            { name: 'Plastics', value: 1140, color: '#06b6d4' },
            { name: 'Paper', value: 920, color: '#eab308' },
            { name: 'Metal', value: 682, color: '#94a3b8' },
            { name: 'Organic', value: 2070, color: '#10b981' }
          ]
        };
      case 'This month':
        return {
          current: '14,832 kg',
          allTime: '24,812 kg',
          categories: [
            { name: 'Plastics', value: 3840, color: '#06b6d4' },
            { name: 'Paper', value: 2950, color: '#eab308' },
            { name: 'Metal', value: 2112, color: '#94a3b8' },
            { name: 'Organic', value: 5930, color: '#10b981' }
          ]
        };
      case 'All time':
        return {
          current: '24,812 kg',
          allTime: '24,812 kg',
          categories: [
            { name: 'Plastics', value: 6420, color: '#06b6d4' },
            { name: 'Paper', value: 4890, color: '#eab308' },
            { name: 'Metal', value: 3412, color: '#94a3b8' },
            { name: 'Organic', value: 10090, color: '#10b981' }
          ]
        };
    }
  };

  const volumeStats = getVolumeStats();
  const funnelStats = getFunnelStats();
  const categoriesSum = volumeStats.categories.reduce((sum, item) => sum + item.value, 0);
  
  // Custom visual scale for escalation classes based on pending complaints volume: green (0–2), amber (3–9), red (10+)
  const getComplaintsEscalation = (count: number) => {
    if (count <= 2) {
      return {
        cardBg: 'bg-emerald-50/70 border-emerald-100 hover:border-emerald-200 text-emerald-950',
        badgeBg: 'bg-emerald-600/10 text-emerald-700 border-emerald-200',
        textColor: 'text-emerald-800',
        accentBorder: 'border-emerald-200',
        indicatorDot: 'bg-emerald-500'
      };
    } else if (count <= 9) {
      return {
        cardBg: 'bg-amber-50/70 border-amber-100 hover:border-amber-200 text-amber-950',
        badgeBg: 'bg-amber-600/10 text-amber-700 border-amber-200',
        textColor: 'text-amber-800',
        accentBorder: 'border-amber-200',
        indicatorDot: 'bg-amber-500'
      };
    } else {
      return {
        cardBg: 'bg-rose-50/70 border-rose-100 hover:border-rose-200 text-rose-950',
        badgeBg: 'bg-rose-600/10 text-rose-700 border-rose-200',
        textColor: 'text-rose-800',
        accentBorder: 'border-rose-200',
        indicatorDot: 'bg-rose-500'
      };
    }
  };

  const compStyles = getComplaintsEscalation(pCount);

  return (
    <div className="space-y-6">
      
      {/* Sleek, Premium Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
          <p className="text-xs text-slate-500 font-medium">A real-time health snapshot of the entire Dumpsite ecosystem.</p>
        </div>

        {/* Global Timeframe Toggle */}
        <div className="flex bg-slate-100/80 p-0.5 rounded-lg border border-slate-200 self-start sm:self-auto shadow-xs">
          {(['Today', 'This week', 'This month', 'All time'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                timeframe === t 
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION: Total Users by Category */}
      <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4 shadow-2xs">
        {/* Module Header, Icon & Title */}
        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-50">
          <BarChart3 className="w-4 h-4 text-emerald-600 shrink-0" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Total Users by Category</h3>
        </div>

        {/* Beautiful high-contrast responsive grid (6 cards) */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 pt-1">
          {/* Card 1: Total Users */}
          <div className="bg-slate-50 hover:bg-slate-100/50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between transition-colors shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total users</span>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono leading-none">
                {(4821 + (users.length - 10)).toLocaleString()}
              </span>
              <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                ↑ +218 this week
              </p>
            </div>
          </div>

          {/* Card 2: Individual Users */}
          <div className="bg-slate-50 hover:bg-slate-100/50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between transition-colors shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Individual users</span>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono leading-none">
                {(3104 + (users.filter(u => u.role === 'Dumper').length - 2)).toLocaleString()}
              </span>
              <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                ↑ +97 this week
              </p>
            </div>
          </div>

          {/* Card 3: Recycling Companies */}
          <div className="bg-slate-50 hover:bg-slate-100/50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between transition-colors shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recycling companies</span>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono leading-none">
                {(892 + (users.filter(u => u.role === 'Recycling Company').length - 2)).toLocaleString()}
              </span>
              <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                ↑ +14 this week
              </p>
            </div>
          </div>

          {/* Card 4: Logistic Agents */}
          <div className="bg-slate-50 hover:bg-slate-100/50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between transition-colors shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Logistic Agents</span>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono leading-none">
                {(312 + (users.filter(u => u.role === 'Collector').length - 3)).toLocaleString()}
              </span>
              <p className="text-[10px] font-bold text-slate-500 mt-1 flex items-center gap-1">
                → Stable
              </p>
            </div>
          </div>

          {/* Card 5: Pending Verification */}
          <div className="bg-slate-50 hover:bg-slate-100/50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between transition-colors shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending verification</span>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono leading-none">
                {(47 + (users.filter(u => u.idStatus === 'Pending Verification' || u.status === 'Pending Approval').length - 2)).toLocaleString()}
              </span>
              <p className="text-[10px] font-bold text-amber-600 mt-1 flex items-center gap-1">
                ↑ Needs action
              </p>
            </div>
          </div>

          {/* Card 6: Suspended Accounts */}
          <div className="bg-slate-50 hover:bg-slate-100/50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between transition-colors shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Suspended accounts</span>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono leading-none">
                {(13 + (users.filter(u => u.status === 'Suspended').length - 2)).toLocaleString()}
              </span>
              <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                → No change
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Total Dumps and Collections Completed [ Activity Metrics ] */}
      <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Total Dumps and Collections</h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Activity Metrics</span>
        </div>

        {/* Funnel Pipeline Visualizer */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-100 space-y-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Operational Dispatch Funnel Journey</span>
            <span className="font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-2.5 py-0.5 text-[11px]">
              SLA conversion rate: {funnelStats.conversionRate}%
            </span>
          </div>

          {/* Process Steppers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Dump Posted */}
            <div className="bg-white p-4 rounded-lg border border-slate-100 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>01</span>
                  <span>100% Entry Volume</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">Dump Posted</h4>
                <p className="text-xl font-bold text-slate-950 font-mono tracking-tight mt-1">
                  {funnelStats.posted.toLocaleString()} <span className="text-xs text-slate-500 font-sans font-medium">listings</span>
                </p>
              </div>
              <div className="mt-3">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full w-full" />
                </div>
              </div>
            </div>

            {/* Step 2: Collector Notified */}
            <div className="bg-white p-4 rounded-lg border border-slate-100 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>02</span>
                  <span className="text-amber-600">{funnelStats.notifiedPercent}% Handshake</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">Collector Notified</h4>
                <p className="text-xl font-bold text-slate-950 font-mono tracking-tight mt-1">
                  {funnelStats.notified.toLocaleString()} <span className="text-xs text-slate-500 font-sans font-medium">pings</span>
                </p>
              </div>
              <div className="mt-3">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: `${funnelStats.notifiedPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Step 3: Collection Confirmed */}
            <div className="bg-white p-4 rounded-lg border border-slate-100 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>03</span>
                  <span className="text-emerald-600">{funnelStats.confirmedPercent}% Completed</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">Collection Confirmed</h4>
                <p className="text-xl font-bold text-slate-950 font-mono tracking-tight mt-1">
                  {funnelStats.confirmed.toLocaleString()} <span className="text-xs text-slate-500 font-sans font-medium">cycles</span>
                </p>
              </div>
              <div className="mt-3">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full" style={{ width: `${funnelStats.confirmedPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Horizontal Funnel bar chart */}
          <div className="border-t border-slate-200/60 pt-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Funnel Visualisation (Dump Posted ⟶ Collector Notified ⟶ Collection Confirmed)
            </h4>
            
            <div className="bg-slate-100 p-2 rounded-lg border border-slate-200">
              <div className="h-5 w-full bg-slate-200 rounded-md flex overflow-hidden shadow-inner">
                <div className="bg-slate-400 h-full text-[9px] font-bold text-white flex items-center justify-center" style={{ width: '33.33%' }}>
                  100% Listed
                </div>
                <div className="bg-amber-500 h-full text-[9px] font-bold text-white flex items-center justify-center border-l border-white/20" style={{ width: `${funnelStats.notifiedPercent / 3}%` }}>
                  {funnelStats.notifiedPercent}% Notified
                </div>
                <div className="bg-emerald-600 h-full text-[9px] font-bold text-white flex items-center justify-center border-l border-white/20" style={{ width: `${funnelStats.confirmedPercent / 3}%` }}>
                  {funnelStats.confirmedPercent}% Confirmed
                </div>
              </div>
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 mt-1.5 px-0.5">
                <span>Dump Posted</span>
                <span>⟶</span>
                <span>Collector Notified ({funnelStats.notifiedPercent}%)</span>
                <span>⟶</span>
                <span>Collection Confirmed ({funnelStats.confirmedPercent}%)</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* SECTION: Pending Complaints [ Attention Required ] */}
        <div className="lg:col-span-5 flex">
          <button 
            type="button"
            onClick={() => setActiveTab('complaints')}
            className={`w-full text-left rounded-xl border ${compStyles.cardBg} ${compStyles.accentBorder} p-5 flex flex-col justify-between shadow-2xs transition-all duration-200 group cursor-pointer hover:shadow-xs hover:scale-[1.005]`}
            title="Click to manage all unresolved complaints in complaints inbox"
          >
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-900/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pending Complaints</h3>
                </div>
                <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wider">
                  Attention Required
                </span>
              </div>

              {/* Dynamic volume indicator badge built from constraints */}
              <div className="flex items-center gap-3">
                <span className="text-4xl font-extrabold tracking-tight font-mono text-slate-950">
                  {pCount}
                </span>
                <div className="text-[10px] font-semibold text-slate-600 space-y-0.5">
                  <p className="font-extrabold text-rose-800">🛑 High Alert Status</p>
                  <p className="text-slate-400">Escalation is volume-adjusted</p>
                </div>
              </div>
            </div>

            {/* Oldest unresolved label displays age to create urgency */}
            <div className="mt-8 pt-3 border-t border-slate-900/10 w-full flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5 text-rose-800">
                <Clock className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                <span className="bg-rose-100 hover:bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded transition-colors">
                  Oldest unresolved: 3 days ago
                </span>
              </div>
              <span className="text-[11px] text-slate-900 font-extrabold uppercase tracking-wider flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                Open Inbox <ArrowRight className="w-3 H-3 text-slate-800 ml-0.5" />
              </span>
            </div>
          </button>
        </div>

        {/* SECTION: Waste Volume Collected [ Impact Metric ] */}
        <div className="lg:col-span-7 flex">
          <div className="w-full bg-white rounded-xl border border-slate-100 p-5 flex flex-col justify-between space-y-4 shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Waste Volume Collected</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Impact Metric</span>
              </div>

              {/* Main prominent displays (Cumulative & Current) */}
              <div className="mt-4 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Selected timeframe volume</span>
                  {/* Largest font counter element */}
                  <p className="text-3xl font-extrabold text-emerald-800 tracking-tight font-mono mt-1">
                    {volumeStats.current}
                  </p>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cumulative All-time</span>
                  <p className="text-xl font-bold text-slate-700 tracking-tight font-mono mt-1">
                    {volumeStats.allTime}
                  </p>
                </div>
              </div>

              {/* Horizontal proportion stacked bar */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Category Split Proportion</span>
                  <span className="font-mono text-slate-400">Total metrics</span>
                </div>

                <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden border border-slate-200">
                  {volumeStats.categories.map((item, idx) => {
                    const percentage = categoriesSum > 0 ? (item.value / categoriesSum) * 100 : 0;
                    return (
                      <div 
                        key={idx}
                        style={{ width: `${percentage}%`, backgroundColor: item.color }}
                        className="h-full transition-all duration-300"
                        title={`${item.name}: ${item.value} kg (${Math.round(percentage)}%)`}
                      />
                    );
                  })}
                </div>

                {/* Submetrics list below split bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1.5">
                  {volumeStats.categories.map((cat, idx) => {
                    const pct = categoriesSum > 0 ? (cat.value / categoriesSum) * 100 : 0;
                    return (
                      <div key={idx} className="bg-slate-50/50 p-2 rounded-lg border border-slate-100 flex flex-col justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                          <span className="text-[10px] font-bold text-slate-550 truncate">{cat.name}</span>
                        </div>
                        <p className="text-[11.5px] font-bold text-slate-900 font-mono mt-1 leading-none">
                          {cat.value.toLocaleString()} <span className="text-[9px] text-slate-400 font-sans font-medium">kg</span>
                          <span className="block text-[8px] text-slate-400 font-sans font-normal mt-0.5">({Math.round(pct)}%)</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
