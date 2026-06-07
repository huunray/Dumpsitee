import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Truck, 
  Coins, 
  Bell, 
  ShieldCheck
} from 'lucide-react';
import { AdminRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  missedCollectionsCount: number;
  currentRole: AdminRole;
}

export default function Sidebar({ activeTab, setActiveTab, missedCollectionsCount, currentRole }: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      roles: ['Super Admin', 'Ops Admin', 'Support Agent']
    },
    {
      id: 'users',
      label: 'Users & Roles',
      icon: Users,
      roles: ['Super Admin', 'Ops Admin', 'Support Agent']
    },
    {
      id: 'complaints',
      label: 'Complaints Inbox',
      icon: MessageSquare,
      roles: ['Super Admin', 'Ops Admin', 'Support Agent']
    },
    {
      id: 'collections',
      label: 'Collection Monitor',
      icon: Truck,
      roles: ['Super Admin', 'Ops Admin', 'Support Agent'],
      badge: missedCollectionsCount > 0 ? missedCollectionsCount : undefined
    },
    {
      id: 'finances',
      label: 'Financial Tracking',
      icon: Coins,
      roles: ['Super Admin', 'Ops Admin'] // Support Agent will get permission denied screen
    },
    {
      id: 'notifications',
      label: 'Notifications System',
      icon: Bell,
      roles: ['Super Admin', 'Ops Admin', 'Support Agent']
    }
  ];

  return (
    <aside className="w-48 bg-[#02130c] border-r border-emerald-950 flex flex-col justify-between h-screen fixed left-0 top-0 bottom-0 select-none shrink-0 z-30 shadow-lg text-white">
      <div>
        {/* Visual Identity & Logo - connected directly to top of sidebar */}
        <div className="px-4 border-b border-emerald-950/60 flex items-center gap-2.5 h-14 bg-[#010a06]">
          <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xs select-none shrink-0">
            d
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-black tracking-tight text-white leading-none truncate">dumpsite</h1>
            <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase block mt-0.5">Admin Portal</span>
          </div>
        </div>

        <div className="p-3">
          <p className="text-[9px] font-bold text-emerald-400/80 tracking-wider uppercase mb-3 px-1">
            Operations Modules
          </p>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isAuthorized = item.roles.includes(currentRole);
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-900/80 text-white shadow-xs border-l-2 border-emerald-500'
                      : 'text-emerald-100/70 hover:text-white hover:bg-emerald-950/80'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-emerald-200/50'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {/* Badges or locks */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!isAuthorized && (
                      <span 
                        className="text-[8px] tracking-wider uppercase font-black bg-amber-950 text-amber-400 px-1 py-0.5 rounded border border-amber-900/60"
                        title="Requires elevated authority to view"
                      >
                        Lock
                      </span>
                    )}
                    {item.badge !== undefined && (
                      <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse leading-none">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Admin Quick view details */}
      <div className="p-3.5 border-t border-emerald-950 bg-[#010905] text-[10px]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-bold text-white text-[10.5px]">Auth Token</span>
        </div>
        <p className="text-[9.5px] text-emerald-200/70 font-mono">
          Scope: <span className="font-extrabold text-emerald-400">{currentRole}</span>
        </p>
        <p className="text-[8.5px] text-emerald-300/40 mt-1 leading-snug">
          Commits logged to secure ledger.
        </p>
      </div>
    </aside>
  );
}
