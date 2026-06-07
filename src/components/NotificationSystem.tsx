import React, { useState } from 'react';
import { 
  Send, 
  Users, 
  Smartphone, 
  AlertTriangle, 
  Clock, 
  FileText, 
  ListChecks, 
  Settings, 
  ToggleLeft, 
  CheckCircle,
  Megaphone,
  History
} from 'lucide-react';
import { NotificationHistoryItem, ServiceDisruption, UserProfile } from '../types';
import { automatedReminderRules } from '../data';
import { CustomDropdown } from './CustomDropdown';

interface NotificationSystemProps {
  notificationsHistory: NotificationHistoryItem[];
  onUpdateHistory: (updated: NotificationHistoryItem[]) => void;
  serviceDisruptions: ServiceDisruption[];
  onUpdateDisruptions: (updated: ServiceDisruption[]) => void;
  users: UserProfile[];
  onAddAudit: (action: string) => void;
  adminName: string;
}

export default function NotificationSystem({ 
  notificationsHistory, 
  onUpdateHistory, 
  serviceDisruptions, 
  onUpdateDisruptions, 
  users, 
  onAddAudit,
  adminName 
}: NotificationSystemProps) {

  // Tabs inside Module
  const [notifSubTab, setNotifSubTab] = useState<'Composer' | 'Bulk Segment' | 'Automated Reminders' | 'Service Disruption' | 'Logs'>('Composer');

  // --- COMPOSER STATES ---
  const [notifTitle, setNotifTitle] = useState('Sanitation Day Services Notice');
  const [notifBody, setNotifBody] = useState('Please make sure your organic waste bin containers are placed at the primary street curbs before 10 AM on Saturday.');
  const [notifTarget, setNotifTarget] = useState('all_users');
  const [deliveryChannel, setDeliveryChannel] = useState<'Push' | 'In-app' | 'SMS'>('Push');
  const [composerFeedback, setComposerFeedback] = useState('');

  // --- BULK MESSAGE SEGMENT STATES ---
  const [segRole, setSegRole] = useState<'All' | 'Dumper' | 'Collector'>('All');
  const [segNeighborhood, setSegNeighborhood] = useState('All');
  const [segActivity, setSegActivity] = useState<'All' | 'High' | 'Dormant'>('All');
  const [bulkFeedback, setBulkFeedback] = useState('');

  // --- SERVICE DISRUPTION STATES ---
  const [affectedService, setAffectedService] = useState('Compactor Logistics');
  const [affectedArea, setAffectedArea] = useState('Yaba Interchange');
  const [estResolution, setEstResolution] = useState('8 Hours');
  const [disruptBody, setDisruptBody] = useState('Route compaction delays expected in Yaba area due to local infrastructural overpass repairs.');
  const [activeBannerMsg, setActiveBannerMsg] = useState('');

  // --- AUTOMATED REMINDER TEMPLATES (state mapped to initial props) ---
  const [reminderTemplates, setReminderTemplates] = useState(automatedReminderRules);

  // Character thresholds
  const TITLE_LIMIT = 60;
  const BODY_LIMIT = 180;

  // Calculators
  const calculateMatchingSegmentUsers = () => {
    let count = users.length;
    if (segRole !== 'All') {
      count = users.filter(u => u.role === (segRole === 'Collector' ? 'Collector' : 'Dumper')).length;
    }
    // Simple mock filter variation for demonstration
    if (segNeighborhood !== 'All') {
      count = Math.max(1, Math.round(count * 0.3));
    }
    if (segActivity === 'Dormant') {
      count = Math.max(1, Math.round(count * 0.2));
    }
    return count;
  };

  const matchedCount = calculateMatchingSegmentUsers();

  // Handlers
  const handleSendManualNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifTitle.length > TITLE_LIMIT || notifBody.length > BODY_LIMIT) {
      alert("Please trim your content to fit within characters limits.");
      return;
    }

    const newItem: NotificationHistoryItem = {
      id: `NOT-${Date.now().toString().substring(10)}`,
      timestamp: "2026-06-07 21:43",
      title: notifTitle,
      body: notifBody,
      targetSegment: notifTarget === 'all_users' ? 'All Channels Users' : `Target Segment Scope: ${notifTarget}`,
      sender: adminName,
      channel: deliveryChannel,
      stats: {
        sent: matchedCount,
        delivered: Math.round(matchedCount * 0.98),
        opened: Math.round(matchedCount * 0.65),
        failed: Math.round(matchedCount * 0.02)
      }
    };

    onUpdateHistory([newItem, ...notificationsHistory]);
    onAddAudit(`Dispatched manual system alert [${notifTitle}] via '${deliveryChannel}' to target segment: ${notifTarget}`);
    
    setComposerFeedback('Notification alert dispatched and logged to history stream successfully!');
    setNotifTitle('');
    setNotifBody('');
    setTimeout(() => setComposerFeedback(''), 5000);
  };

  const handleSendBulkSegment = (e: React.FormEvent) => {
    e.preventDefault();
    const mockTitle = `Unified Segment Broadcast [Role: ${segRole}]`;
    const mockBody = `Attention ${segRole}s in ${segNeighborhood} area. Please check your active operational panels.`;

    const newItem: NotificationHistoryItem = {
      id: `NOT-${Date.now().toString().substring(10)}`,
      timestamp: "2026-06-07 21:43",
      title: mockTitle,
      body: mockBody,
      targetSegment: `Bulk Rule: Role=${segRole}, Area=${segNeighborhood}`,
      sender: adminName,
      channel: 'Push',
      stats: {
        sent: matchedCount,
        delivered: Math.round(matchedCount * 0.97),
        opened: Math.round(matchedCount * 0.70),
        failed: Math.round(matchedCount * 0.03)
      }
    };

    onUpdateHistory([newItem, ...notificationsHistory]);
    onAddAudit(`Segment Broadcast: ${newItem.targetSegment} triggered by ${adminName}`);
    setBulkFeedback(`Segment Broadcast sent to ${matchedCount} matched subscribers.`);
    setTimeout(() => setBulkFeedback(''), 5000);
  };

  // Toggle Automated Reminders Rules
  const handleToggleReminder = (id: string) => {
    const updated = reminderTemplates.map(r => {
      if (r.id === id) {
        return { ...r, enabled: !r.enabled };
      }
      return r;
    });
    setReminderTemplates(updated);
    onAddAudit(`Modified automated pickup notification toggle state for rule reference #${id}`);
  };

  const handleEditTemplate = (id: string, newText: string) => {
    const updated = reminderTemplates.map(r => {
      if (r.id === id) {
        return { ...r, template: newText };
      }
      return r;
    });
    setReminderTemplates(updated);
  };

  // Handle active service disruption broadcast
  const handleCreateDisruption = (e: React.FormEvent) => {
    e.preventDefault();

    const newDisrupt: ServiceDisruption = {
      id: `DIS-0${Date.now().toString().substring(11)}`,
      affectedService: affectedService,
      affectedArea: affectedArea,
      estimatedResolution: estResolution,
      messageBody: disruptBody,
      timestamp: "2026-06-07 21:43",
      status: 'Active' as const
    };

    onUpdateDisruptions([newDisrupt, ...serviceDisruptions]);
    onAddAudit(`BROADCAST CRITICAL SERVICE DISRUPTION: ${affectedService} affecting ${affectedArea}`);
    
    // Add item to notifications history too
    const newItem: NotificationHistoryItem = {
      id: `NOT-${Date.now().toString().substring(10)}`,
      timestamp: "2026-06-07 21:43",
      title: `CRITICAL BLOCK: ${affectedService} Disrupted`,
      body: disruptBody,
      targetSegment: `All Users in ${affectedArea}`,
      sender: `${adminName} (Critical)`,
      channel: 'Push',
      stats: { sent: 1250, delivered: 1250, opened: 1100, failed: 0 }
    };
    onUpdateHistory([newItem, ...notificationsHistory]);

    setActiveBannerMsg(`Service Alert is LIVE across clients: "${affectedService} disrupted in ${affectedArea}. ETA: ${estResolution}"`);
  };

  const handleClearDisruptions = () => {
    onUpdateDisruptions([]);
    onAddAudit(`Cleared all service disruption alert boards. Dispatched CLEAR banners to client scopes.`);
    setActiveBannerMsg('');
    alert("Sent ALL CLEAR notifications to all users successfully!");
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Notification & Alerts Core</h2>
          <p className="text-xs text-slate-500 font-medium">Compose manual notifications, build audience segments, configure automated templates, and broadcast disruptions.</p>
        </div>

        {/* Sub-tabs inside Module */}
        <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl border border-slate-200 self-start lg:self-auto select-none">
          <button 
            onClick={() => setNotifSubTab('Composer')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${notifSubTab === 'Composer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Alert Composer
          </button>
          
          <button 
            onClick={() => setNotifSubTab('Bulk Segment')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${notifSubTab === 'Bulk Segment' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Segment Builder
          </button>

          <button 
            onClick={() => setNotifSubTab('Automated Reminders')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${notifSubTab === 'Automated Reminders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Pickup Reminders
          </button>

          <button 
            onClick={() => setNotifSubTab('Service Disruption')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${notifSubTab === 'Service Disruption' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Disruption Alerts
          </button>

          <button 
            onClick={() => setNotifSubTab('Logs')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${notifSubTab === 'Logs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Notif History
          </button>
        </div>
      </div>

      {activeBannerMsg && (
        <div className="bg-amber-600 text-white p-3.5 rounded-xl font-bold flex items-center justify-between text-xs animate-pulse">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-white" />
            {activeBannerMsg}
          </span>
          <button 
            onClick={handleClearDisruptions} 
            className="px-2.5 py-1 bg-white text-amber-950 rounded font-black hover:bg-slate-100 transition-colors cursor-pointer"
          >
            ✓ Trigger All Clear
          </button>
        </div>
      )}

      {/* --- SUBVIEW: MANUAL COMPOSER & ANDROID PREVIEW --- */}
      {notifSubTab === 'Composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Notification form input (7 Columns) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b">Manual Delivery Broadcast</h3>
            
            {composerFeedback && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-2.5 rounded-lg text-xs font-semibold leading-normal">
                {composerFeedback}
              </div>
            )}

            <form onSubmit={handleSendManualNotification} className="space-y-4 text-xs font-semibold text-slate-700">
              
              {/* Title input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Alert Title (60 Char limit)</label>
                  <span className={`text-[10px] font-mono ${notifTitle.length > TITLE_LIMIT ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                    {notifTitle.length} / {TITLE_LIMIT}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={TITLE_LIMIT}
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  placeholder="e.g. Rescheduling Sanitation Service Hours"
                />
              </div>

              {/* Body input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Message Body (180 Char limit)</label>
                  <span className={`text-[10px] font-mono ${notifBody.length > BODY_LIMIT ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                    {notifBody.length} / {BODY_LIMIT}
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  maxLength={BODY_LIMIT}
                  value={notifBody}
                  onChange={(e) => setNotifBody(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none leading-relaxed"
                  placeholder="Please specify concise messaging instructions here..."
                />
              </div>

              {/* Targets / Channels dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Target Audience</label>
                  <CustomDropdown
                    options={[
                      { value: 'all_users', label: `All registered users (${users.length})` },
                      { value: 'collectors', label: 'Verification-ready Collectors' },
                      { value: 'dumpers_lekki', label: 'Lekki sector residents only' }
                    ]}
                    value={notifTarget}
                    onChange={(val) => setNotifTarget(val)}
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Push Channel Gateway</label>
                  <CustomDropdown
                    options={[
                      { value: 'Push', label: 'Push Notification (Android Applet)' },
                      { value: 'In-app', label: 'In-App Banner Overlay' },
                      { value: 'SMS', label: 'Twilio SMS Integration' }
                    ]}
                    value={deliveryChannel}
                    onChange={(val) => setDeliveryChannel(val as any)}
                    fullWidth
                  />
                </div>
              </div>

              {/* Dispatch Action */}
              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
              >
                <Send className="w-4 h-4" />
                <span>Publish Target Dispatch</span>
              </button>

            </form>
          </div>

          {/* Android preview pane (5 Columns) */}
          <div className="lg:col-span-5 flex justify-center">
            
            <div className="w-[280px] h-[550px] bg-slate-950 border-[10px] border-slate-800 rounded-[38px] shadow-2xl relative p-3 font-sans select-none flex flex-col justify-between overflow-hidden">
              
              {/* Speaker and Camera dynamic island */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4.5 bg-slate-800 rounded-full flex items-center justify-center gap-1.5 p-1 z-20">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <div className="w-8 h-1 bg-slate-700 rounded-full" />
              </div>

              {/* Status bar */}
              <div className="flex justify-between items-center text-[9px] text-white/85 px-4 pt-3.5 z-10 font-mono font-bold">
                <span>09:43 AM</span>
                <div className="flex gap-1.5 items-center">
                  <span>5G</span>
                  <Smartphone className="w-3 h-3" />
                </div>
              </div>

              {/* Active Lockscreen notification card fallback */}
              <div className="flex-1 flex flex-col justify-start pt-12 text-white">
                
                {/* WasteCycle interactive mock lockscreen alert */}
                <div className="bg-slate-900/90 backdrop-blur rounded-2xl border border-white/10 p-3.5 space-y-1 my-3 animate-pulse">
                  <div className="flex justify-between items-center text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1">🟢 WasteCycle Alert</span>
                    <span>Just Now</span>
                  </div>

                  <h5 className="font-extrabold text-[11px] text-white line-clamp-1">
                    {notifTitle || 'Notification title placeholder'}
                  </h5>
                  
                  <p className="text-[10px] text-slate-300 leading-normal font-medium line-clamp-4">
                    {notifBody || 'Message body mockup description will render here reactively as you compose textual bounds.'}
                  </p>
                </div>

                <p className="text-center text-[9px] text-slate-500 font-serif pt-16 uppercase tracking-widest">Swipe up to unlock</p>
              </div>

              {/* Shell home swipe indicator bar */}
              <div className="w-24 h-1 bg-white/65 rounded-full mx-auto mb-1.5" />

            </div>

          </div>

        </div>
      )}

      {/* --- SUBVIEW: BROAD BROADCAST SEGMENT BUILDER --- */}
      {notifSubTab === 'Bulk Segment' && (
        <div className="bg-white p-5 rounded-xl border border-slate-100 space-y-6">
          <div className="flex justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">Dynamic Segment Broadcaster</h3>
              <p className="text-xs text-slate-500">Configure target segment variables based on demographic profile lists.</p>
            </div>
            
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-1 px-2.5 rounded font-bold font-mono text-[10px] uppercase flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> 24h Throttle Warning ACTIVE
            </div>
          </div>

          {bulkFeedback && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-2 text-xs font-semibold rounded">
              {bulkFeedback}
            </div>
          )}

          <form onSubmit={handleSendBulkSegment} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700 font-bold">
            
            <div className="space-y-4 font-sans">
              <div>
                <label className="block mb-1.5 font-sans uppercase text-[9px] font-bold tracking-wider text-slate-450">Target Role</label>
                <CustomDropdown
                  options={[
                    { value: 'All', label: 'All Registered Roles' },
                    { value: 'Dumper', label: 'Home Dumpers only' },
                    { value: 'Collector', label: 'Logistic Agents (Collectors)' }
                  ]}
                  value={segRole}
                  onChange={(val) => setSegRole(val as any)}
                  fullWidth
                />
              </div>

              <div>
                <label className="block mb-1.5 font-sans uppercase text-[9px] font-bold tracking-wider text-slate-450">Neighborhood Sector</label>
                <CustomDropdown
                  options={[
                    { value: 'All', label: 'All Neighborhood Bounds' },
                    { value: 'Yaba', label: 'Yaba Mainland' },
                    { value: 'Lekki Phase 1', label: 'Lekki Phase 1' },
                    { value: 'Iru', label: 'Iru / Victoria Island' }
                  ]}
                  value={segNeighborhood}
                  onChange={(val) => setSegNeighborhood(val)}
                  fullWidth
                />
              </div>
            </div>

            <div className="space-y-4 font-sans">
              <div>
                <label className="block mb-1.5 font-sans uppercase text-[9px] font-bold tracking-wider text-slate-450">Operational Engagement States</label>
                <CustomDropdown
                  options={[
                    { value: 'All', label: 'All Active Statuses' },
                    { value: 'High', label: 'Hyper-active Eco Champs' },
                    { value: 'Dormant', label: 'Dormant Accounts (>14 days silent)' }
                  ]}
                  value={segActivity}
                  onChange={(val) => setSegActivity(val as any)}
                  fullWidth
                />
              </div>

              {/* Live Count readouts */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Live Audience Match Counter</span>
                <p className="text-3xl font-mono text-emerald-600 font-extrabold">{matchedCount} matching users</p>
                <p className="text-[10px] text-slate-400 italic">Segment constitutes approx {Math.round((matchedCount/users.length)*100)}% of total registers.</p>
              </div>
            </div>

            {/* Suppressions Warning */}
            <div className="bg-amber-50 border border-amber-200 p-4.5 rounded-xl space-y-3 flex flex-col justify-between">
              <span className="text-amber-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                ⚠️ Opt-Out Suppressed Suppression Activated
              </span>
              <p className="text-amber-950 text-[11px] font-medium leading-normal">
                Dispatched broadcasts suppress the marketing opt-out check to force compliance for critical sanitation days, payouts updates, or local routing disruptions.
              </p>
              
              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 border text-white font-bold py-2 rounded text-center transition-all cursor-pointer text-xs"
              >
                Send Segment Broadcast
              </button>
            </div>

          </form>
        </div>
      )}

      {/* --- SUBVIEW: AUTOMATED PICKUP REMINDER TEMPLATES --- */}
      {notifSubTab === 'Automated Reminders' && (
        <div className="bg-white p-5 rounded-xl border border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase">Automated Reminder Dispatch Templates</h3>
          
          <div className="space-y-3.5">
            {reminderTemplates.map((rule) => (
              <div key={rule.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-3 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800">{rule.name}</span>
                    <span className="text-[9px] bg-slate-200 text-slate-600 font-mono rounded px-1.5">
                      {rule.delay}
                    </span>
                  </div>

                  {/* Template Textarea */}
                  <textarea
                    rows={1.5}
                    value={rule.template}
                    onChange={(e) => handleEditTemplate(rule.id, e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded p-2 focus:outline-none italic text-slate-600 leading-normal"
                    title="Live variables allowed: {dumper_name}, {collector_name}, {waste_category}"
                  />
                  <p className="text-[9.5px] text-slate-400 font-mono">Variables: <span className="font-bold text-slate-500">{"{dumper_name}, {collector_name}"}</span> allowed.</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Status Rule:</span>
                  <button
                    onClick={() => handleToggleReminder(rule.id)}
                    className={`px-3 py-1 text-xs font-bold rounded cursor-pointer ${rule.enabled ? 'bg-emerald-100 text-emerald-800 border border-emerald-250' : 'bg-slate-200 text-slate-500 border border-slate-250'}`}
                  >
                    {rule.enabled ? '🟢 Enabled' : '🔴 Suspended'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUBVIEW: SERVICE DISRUPTIONS PANEL BAR --- */}
      {notifSubTab === 'Service Disruption' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Critical Service Interruption Broadcast</h3>
            
            <form onSubmit={handleCreateDisruption} className="space-y-3.5 text-xs text-slate-700 font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1">Affected Core Service</label>
                  <input
                    type="text"
                    required
                    value={affectedService}
                    onChange={(e) => setAffectedService(e.target.value)}
                    className="w-full p-2 bg-slate-50 border rounded focus:outline-none"
                    placeholder="e.g. Organic Compactors"
                  />
                </div>
                <div>
                  <label className="block mb-1">Geographical Affected Area</label>
                  <input
                    type="text"
                    required
                    value={affectedArea}
                    onChange={(e) => setAffectedArea(e.target.value)}
                    className="w-full p-2 bg-slate-50 border rounded focus:outline-none"
                    placeholder="e.g. Yaba Bypass Overpass"
                  />
                </div>
                <div>
                  <label className="block mb-1">EST. Resolution Time</label>
                  <input
                    type="text"
                    required
                    value={estResolution}
                    onChange={(e) => setEstResolution(e.target.value)}
                    className="w-full p-2 bg-slate-50 border rounded focus:outline-none"
                    placeholder="e.g. 12 Hours"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Live Alert Message Body</label>
                <textarea
                  rows={3}
                  required
                  value={disruptBody}
                  onChange={(e) => setDisruptBody(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded focus:outline-none font-sans italic"
                  placeholder="Record public safety or rescheduling warnings..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Megaphone className="w-4 h-4 animate-bounce" />
                <span>Publish Service Disruption Banner Alert across clients</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-4 bg-slate-50 border p-5 rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-slate-950 uppercase inline-flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-amber-500" /> Disruption Status</h4>
            <p className="text-[11.5px] text-slate-500 leading-normal">
              Publishing a service disruption automatically injects a permanent high-visibility banner warning at the top of dumper and collector mobile screens.
            </p>
            {activeBannerMsg ? (
              <div className="p-3.5 bg-amber-100 text-amber-950 rounded-lg text-[10.5px] border border-amber-200">
                ⚠️ Interactive banner is active. <strong>System holds all routing SLAs.</strong>
              </div>
            ) : (
              <p className="text-xs text-emerald-700 italic">No interruptions active. System operates with optimal SLAs benchmarks.</p>
            )}
          </div>

        </div>
      )}

      {/* --- SUBVIEW: NOTIFICATION HISTORY LOG --- */}
      {notifSubTab === 'Logs' && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-sm font-bold text-slate-900 inline-flex items-center gap-1.5">
              <History className="w-4 h-4 text-emerald-600" />
              Unified Broadcast Log
            </h3>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[9px] tracking-wider border-b border-slate-100">
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Title Payload</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Sender Attributed</th>
                  <th className="p-3">Target Scope</th>
                  <th className="p-3 text-center">Inflow stats (Sent / Open)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {notificationsHistory.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono text-slate-400 font-bold">{log.id}</td>
                    <td className="p-3 font-mono text-[10px] text-slate-400">{log.timestamp}</td>
                    <td className="p-3 font-bold text-slate-900">{log.title}</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {log.channel}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 font-serif">{log.sender}</td>
                    <td className="p-3 italic text-xs text-slate-600">{log.targetSegment}</td>
                    <td className="p-3 text-center">
                      <span className="text-emerald-700 font-bold">{log.stats.sent}</span> Sent
                      <span className="text-slate-300 mx-1">/</span>
                      <span className="text-slate-500">{log.stats.opened}</span> Opened
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
