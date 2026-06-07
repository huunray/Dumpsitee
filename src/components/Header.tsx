import React, { useState } from 'react';
import { Shield, LogOut, Bell, Clock, Trash2, Check, ExternalLink, MessageSquare, Tv, Smartphone, Info, X } from 'lucide-react';
import { AdminRole, AdminUser, NotificationHistoryItem } from '../types';
import { CustomDropdown } from './CustomDropdown';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentAdmin: AdminUser;
  onRoleChange: (role: AdminRole) => void;
  onLogout: () => void;
  notificationsHistory: NotificationHistoryItem[];
  onUpdateNotifications: (updated: NotificationHistoryItem[]) => void;
}

export default function Header({ 
  currentAdmin, 
  onRoleChange, 
  onLogout,
  notificationsHistory,
  onUpdateNotifications
}: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<NotificationHistoryItem | null>(null);
  const [telemetrySpeed, setTelemetrySpeed] = useState('Optimized Real-time Polling (Standard SLA)');

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleClearAllNotifs = () => {
    onUpdateNotifications([]);
  };

  const handleRemoveNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateNotifications(notificationsHistory.filter(n => n.id !== id));
  };

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-20 h-14 w-full">
      {/* Left side spacer - we removed the logo as it is now integrated into the Sidebar */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 rounded px-2 py-0.5">
          Workspace Session Active
        </span>
      </div>

      {/* Session Controls or Quick Admin Switcher on the Right */}
      <div className="flex items-center gap-4">
        {/* Quick Admin Role Swapper */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1 flex items-center gap-2">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider hidden sm:inline">
            Aura:
          </span>
          <CustomDropdown
            options={[
              { value: 'Super Admin', label: 'Super Admin (Full Core)' },
              { value: 'Ops Admin', label: 'Ops Admin (Operational)' },
              { value: 'Support Agent', label: 'Support Agent (Assistance)' }
            ]}
            value={currentAdmin.role}
            onChange={(val) => onRoleChange(val as AdminRole)}
          />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* --- NOTIFICATIONS BELL ICON WITH DROPDOWN POPULAR --- */}
        <div className="relative flex items-center">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="p-1.5 rounded-full text-slate-500 hover:text-emerald-700 hover:bg-slate-50 transition-all cursor-pointer relative focus:outline-none"
            title="System dispatch logs feed"
          >
            <Bell className="w-4.5 h-4.5" />
            {notificationsHistory.length > 0 && (
              <>
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
              </>
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent cursor-default" 
                  onClick={() => setIsNotifOpen(false)} 
                />
                <motion.div 
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-[420px] sm:w-[460px] md:w-[480px] max-w-lg bg-white rounded-2xl border border-slate-150 shadow-2xl z-50 text-xs overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 text-sm block">System Notification Center</span>
                        <span className="text-[10px] text-slate-500 font-medium">Real-time alert dispatch log queue</span>
                      </div>
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full ml-1.5">
                        {notificationsHistory.length}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {notificationsHistory.length > 0 && (
                        <button
                          onClick={handleClearAllNotifs}
                          className="text-[11px] text-rose-600 hover:text-white hover:bg-rose-600 font-bold flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-100 hover:border-rose-600 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear All</span>
                        </button>
                      )}
                      <button 
                        onClick={() => setIsNotifOpen(false)}
                        className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Notification items list */}
                  <div className="max-h-[420px] overflow-y-auto refine-scrollbar divide-y divide-slate-100 bg-white">
                    {notificationsHistory.length === 0 ? (
                      <div className="px-6 py-12 text-center text-slate-400 font-medium flex flex-col items-center gap-3 bg-slate-50/30">
                        <div className="p-3 bg-slate-50 rounded-full text-slate-300">
                          <Bell className="w-8 h-8 stroke-[1.5]" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 text-xs">All notifications cleared</p>
                          <p className="text-[10.5px] text-slate-400 mt-0.5">No active alert dispatches logged in memory.</p>
                        </div>
                      </div>
                    ) : (
                      notificationsHistory.map((notif) => {
                        // Determine the channel icon
                        let channelIcon = <Info className="w-3.5 h-3.5" />;
                        let badgeStyle = "bg-slate-100 text-slate-700";
                        if (notif.channel === "Push") {
                          channelIcon = <Smartphone className="w-3.5 h-3.5 text-blue-600" />;
                          badgeStyle = "bg-blue-50 text-blue-700 border border-blue-105";
                        } else if (notif.channel === "SMS") {
                          channelIcon = <MessageSquare className="w-3.5 h-3.5 text-amber-600" />;
                          badgeStyle = "bg-amber-50 text-amber-700 border border-amber-105";
                        } else if (notif.channel === "In-app") {
                          channelIcon = <Tv className="w-3.5 h-3.5 text-emerald-600" />;
                          badgeStyle = "bg-emerald-50 text-emerald-700 border border-emerald-105";
                        }

                        return (
                          <div
                            key={notif.id}
                            onClick={() => {
                              setSelectedNotif(notif);
                              setIsNotifOpen(false);
                            }}
                            className="p-4 hover:bg-slate-50/80 cursor-pointer transition-all block text-left relative group border-l-3 border-transparent hover:border-emerald-500"
                          >
                            <div className="flex justify-between items-start gap-3 mb-1.5">
                              <span className="font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors text-[12px] block leading-tight">
                                {notif.title}
                              </span>
                              
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wide font-sans ${badgeStyle}`}>
                                  {channelIcon}
                                  {notif.channel}
                                </span>
                                
                                <button
                                  onClick={(e) => handleRemoveNotif(notif.id, e)}
                                  className="text-slate-300 hover:text-rose-600 p-1 rounded-md hover:bg-slate-100 md:opacity-0 group-hover:opacity-100 transition-all shrink-0 cursor-pointer"
                                  title="Remove notification"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-2 mb-2">
                              {notif.body}
                            </p>
                            
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-2 border-t border-slate-50 pt-2 font-mono">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-slate-300" />
                                {notif.timestamp}
                              </span>
                              <span className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 font-bold group-hover:underline">
                                Inspect Payload <ExternalLink className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Current User Profile Dropdown container */}
        <div className="relative pl-3 border-l border-slate-150 flex items-center">
          <button 
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 hover:scale-105 transition-all text-white font-black text-xs flex items-center justify-center border-2 border-white ring-2 ring-emerald-500/20 shadow-xs focus:outline-none cursor-pointer"
            title="Open Admin Profile options"
          >
            {getInitials(currentAdmin.name)}
          </button>

          {isProfileOpen && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-transparent cursor-default" 
                onClick={() => setIsProfileOpen(false)} 
              />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-slate-100 shadow-lg py-1 z-50 text-xs animate-fade-in">
                {/* Profile User Info Header */}
                <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                  <p className="font-bold text-slate-900 truncate">{currentAdmin.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{currentAdmin.email}</p>
                </div>

                {/* Dropdown Options */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setShowSettingsModal(true);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 font-semibold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Control Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-rose-50 font-bold text-rose-600 flex items-center gap-2 border-t border-slate-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Logout Core</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Admin Settings Modal Panel */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-sm p-5 space-y-4 shadow-xl border border-slate-100 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Administrative Profile Settings</h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Configure local control panel parameters. These settings are persisted temporarily for this session.
            </p>

            <div className="space-y-3 font-semibold text-slate-700">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-2">
                <p className="font-bold text-slate-700 uppercase text-[9px] tracking-wider">Account Role Scope</p>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Privilege Level:</span>
                  <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                    {currentAdmin.role}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Assigned Identity:</span>
                  <span className="font-bold text-slate-800">{currentAdmin.name}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-500 font-bold text-[9px] uppercase">Telemetry Handshake Speed</label>
                <CustomDropdown
                  options={[
                    { value: 'Optimized Real-time Polling (Standard SLA)', label: 'Optimized Real-time Polling (Standard SLA)' },
                    { value: 'Balanced Interval (10s latency margin)', label: 'Balanced Interval (10s latency margin)' },
                    { value: 'Low Bandwidth Saver (Manual reload)', label: 'Low Bandwidth Saver (Manual reload)' }
                  ]}
                  value={telemetrySpeed}
                  onChange={(val) => setTelemetrySpeed(val)}
                  fullWidth
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-500 font-bold text-[9px] uppercase">Theme Presets</label>
                <p className="text-[10px] text-slate-400 font-medium leading-normal italic">
                  🔒 Theme presets frozen. Adhering to visual guidelines: "Clean, elegant, high-contrast light theme with rich custom accents."
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs font-bold pt-2 border-t">
              <button 
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
              >
                ✓ Apply Profile Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- NOTIFICATION DETAIL POPUP DIRECT VIEW --- */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in text-xs">
          <div className="bg-white rounded-xl border border-slate-100 w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-start border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Log Ref: {selectedNotif.id}
                </span>
                <h3 className="font-black text-slate-900 text-sm mt-1">{selectedNotif.title}</h3>
              </div>
              <span className="text-[9px] font-mono text-slate-400 shrink-0">{selectedNotif.timestamp}</span>
            </div>

            <div className="space-y-3.5 py-1">
              <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {selectedNotif.body}
              </p>

              <div className="grid grid-cols-2 gap-3.5 text-[11px] font-semibold text-slate-600">
                <div className="p-2 border rounded-lg bg-slate-50/50">
                  <span className="text-[9px] uppercase text-slate-400 block mb-0.5">Author Sender</span>
                  <span className="text-slate-900 font-bold">{selectedNotif.sender}</span>
                </div>
                <div className="p-2 border rounded-lg bg-slate-50/50">
                  <span className="text-[9px] uppercase text-slate-400 block mb-0.5">Channel Gateway</span>
                  <span className="text-slate-900 font-bold">{selectedNotif.channel} Push</span>
                </div>
              </div>

              <div className="p-3.5 border rounded-xl bg-emerald-50/20 border-emerald-100/40">
                <span className="text-[9px] uppercase text-emerald-800 font-bold block mb-1.5 tracking-wider">Estimated Delivery Analytics</span>
                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  <div>
                    <span className="block text-lg font-extrabold text-slate-900">{selectedNotif.stats?.sent ?? 0}</span>
                    <span className="text-[8px] text-slate-400 uppercase">Sent</span>
                  </div>
                  <div>
                    <span className="block text-lg font-extrabold text-emerald-600">{selectedNotif.stats?.delivered ?? 0}</span>
                    <span className="text-[8px] text-slate-400 uppercase">Delivered</span>
                  </div>
                  <div>
                    <span className="block text-lg font-extrabold text-sky-600">{selectedNotif.stats?.opened ?? 0}</span>
                    <span className="text-[8px] text-slate-400 uppercase">Opened</span>
                  </div>
                  <div>
                    <span className="block text-lg font-extrabold text-rose-500">{selectedNotif.stats?.failed ?? 0}</span>
                    <span className="text-[8px] text-slate-400 uppercase">Failed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs font-bold pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedNotif(null)}
                className="px-5 py-2 bg-slate-150 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
