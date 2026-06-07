import React, { useState } from 'react';
import { 
  Filter, 
  Search, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  CornerDownRight, 
  Tag, 
  User, 
  PlusSquare, 
  HelpCircle,
  FileText,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { Complaint, ComplaintStatus, ComplaintCategory, ComplaintNote, AdminUser } from '../types';
import { CustomDropdown } from './CustomDropdown';

interface ComplaintManagementProps {
  complaints: Complaint[];
  onUpdateComplaints: (updated: Complaint[]) => void;
  onAddAudit: (action: string) => void;
  currentAdmin: AdminUser;
}

export default function ComplaintManagement({ 
  complaints, 
  onUpdateComplaints, 
  onAddAudit, 
  currentAdmin 
}: ComplaintManagementProps) {
  
  // Selection
  const [selectedId, setSelectedId] = useState<string>(complaints[0]?.id || '');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ComplaintStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | ComplaintCategory>('All');
  const [reporterFilter, setReporterFilter] = useState<'All' | 'Dumper' | 'Collector'>('All');

  // Input states
  const [newInternalNote, setNewInternalNote] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [showResolutionBox, setShowResolutionBox] = useState(false);

  // Bulk operations states
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([]);
  const [bulkAgentAssign, setBulkAgentAssign] = useState('');

  const activeComplaint = complaints.find(c => c.id === selectedId);

  // Handle Note Submission
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternalNote.trim() || !activeComplaint) return;

    const newNoteObj: ComplaintNote = {
      id: `n-${Date.now()}`,
      timestamp: "2026-06-07 21:43",
      author: `${currentAdmin.name} (${currentAdmin.role})`,
      text: newInternalNote.trim()
    };

    const updatedComplaints = complaints.map(c => {
      if (c.id === activeComplaint.id) {
        return {
          ...c,
          notes: [...c.notes, newNoteObj],
          timeline: [
            ...c.timeline,
            {
              id: `t-${Date.now()}`,
              timestamp: "2026-06-07 21:43",
              title: "Internal Log Added",
              description: `Admin registered note: "${newInternalNote.substring(0, 30)}..."`
            }
          ]
        };
      }
      return c;
    });

    onUpdateComplaints(updatedComplaints);
    onAddAudit(`Added internal log annotation to claim ${activeComplaint.id}`);
    setNewInternalNote('');
  };

  // Stepper status change
  const handleStatusChange = (newStatus: ComplaintStatus) => {
    if (!activeComplaint) return;

    // Prevent direct marking resolved without summary
    if (newStatus === 'Resolved' && !resolutionSummary.trim()) {
      setShowResolutionBox(true);
      return;
    }

    const updatedComplaints = complaints.map(c => {
      if (c.id === activeComplaint.id) {
        return {
          ...c,
          status: newStatus,
          resolutionSummary: newStatus === 'Resolved' ? resolutionSummary : c.resolutionSummary,
          timeline: [
            ...c.timeline,
            {
              id: `t-${Date.now()}`,
              timestamp: "2026-06-07 21:43",
              title: `Status Changed to ${newStatus}`,
              description: `Compliance status manually updated by ${currentAdmin.name}.`
            }
          ]
        };
      }
      return c;
    });

    onUpdateComplaints(updatedComplaints);
    onAddAudit(`Modified status workflow bounds of claim ${activeComplaint.id} to '${newStatus}'`);
    setShowResolutionBox(false);
  };

  // Submit formal resolution
  const handleSubmitResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionSummary.trim() || !activeComplaint) return;

    const updatedComplaints = complaints.map(c => {
      if (c.id === activeComplaint.id) {
        return {
          ...c,
          status: 'Resolved' as const,
          resolutionSummary: resolutionSummary.trim(),
          timeline: [
            ...c.timeline,
            {
              id: `t-${Date.now()}`,
              timestamp: "2026-06-07 21:43",
              title: "Claim Case Resolved",
              description: `Resolution signed: "${resolutionSummary}"`
            }
          ]
        };
      }
      return c;
    });

    onUpdateComplaints(updatedComplaints);
    onAddAudit(`Signed off complaint ${activeComplaint.id} with resolution: "${resolutionSummary}"`);
    setShowResolutionBox(false);
    setResolutionSummary('');
  };

  // Assign agent
  const handleAssignAgent = (agentName: string) => {
    if (!activeComplaint) return;
    const updatedComplaints = complaints.map(c => {
      if (c.id === activeComplaint.id) {
        return {
          ...c,
          assignedAgent: agentName,
          status: c.status === 'Pending' ? ('In Review' as const) : c.status,
          timeline: [
            ...c.timeline,
            {
              id: `t-${Date.now()}`,
              timestamp: "2026-06-07 21:43",
              title: "Assigned to compliance officer",
              description: `Case ownership claimed by ${agentName}.`
            }
          ]
        };
      }
      return c;
    });
    onUpdateComplaints(updatedComplaints);
    onAddAudit(`Assigned desk claim ${activeComplaint.id} to officer ${agentName}`);
  };

  // Bulk operators
  const handleBulkAssign = () => {
    if (!bulkAgentAssign || bulkSelectedIds.length === 0) return;
    const updated = complaints.map(c => {
      if (bulkSelectedIds.includes(c.id)) {
        return {
          ...c,
          assignedAgent: bulkAgentAssign,
          status: c.status === 'Pending' ? ('In Review' as const) : c.status
        };
      }
      return c;
    });
    onUpdateComplaints(updated);
    onAddAudit(`Bulk assigned ${bulkSelectedIds.length} complaints to agent '${bulkAgentAssign}'`);
    setBulkSelectedIds([]);
    setBulkAgentAssign('');
  };

  // Filtering list
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.reporterEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesReporter = reporterFilter === 'All' || c.reporterType === reporterFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesReporter;
  });

  return (
    <div className="space-y-6">
      
      {/* Module Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Complaint Management Inbox</h2>
        <p className="text-xs text-slate-500">Track user SLA targets, review route incident logs, and commit timeline resolutions.</p>
      </div>

      {/* Grid: Inbox list left, Details View right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* --- LEFT: INBOX QUEUE (5 Columns) --- */}
        <div className="xl:col-span-5 bg-white rounded-xl border border-slate-100 p-4 space-y-3.5">
          
          {/* Filters controls */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute inset-y-0 left-0 pl-3 flex items-center h-full text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search ticket descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Micro chips filter controllers */}
            <div className="flex flex-wrap gap-2 pt-1 font-sans">
              <CustomDropdown
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'Pending', label: '🔴 Pending' },
                  { value: 'In Review', label: '🟡 In Review' },
                  { value: 'Resolved', label: '🟢 Resolved' },
                  { value: 'Closed', label: '⚫ Closed' }
                ]}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val as any)}
              />

              <CustomDropdown
                options={[
                  { value: 'All', label: 'All Categories' },
                  { value: 'Missed Pickup', label: 'Missed Pickup' },
                  { value: 'Overcharged', label: 'Overcharged' },
                  { value: 'Behavioral', label: 'Behavioral Issues' },
                  { value: 'Other', label: 'Other' }
                ]}
                value={categoryFilter}
                onChange={(val) => setCategoryFilter(val as any)}
              />
            </div>
          </div>

          {/* Bulk Assign Controller */}
          {bulkSelectedIds.length > 0 && (
            <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl text-[11px] flex flex-col gap-2 border border-emerald-100 font-sans shadow-xs">
              <p className="font-bold">Claim Selected: {bulkSelectedIds.length} tickets</p>
              <div className="flex gap-2.5">
                <CustomDropdown
                  options={[
                    { value: '', label: 'Select Compliance Agent...' },
                    { value: 'Adebisi Olomu (Support)', label: 'Adebisi Olomu(Support)' },
                    { value: 'Chidi Nwachukwu (Ops)', label: 'Chidi Nwachukwu (Ops)' },
                    { value: 'Bolanle Yusuf (Super)', label: 'Bolanle Yusuf (Super)' }
                  ]}
                  value={bulkAgentAssign}
                  onChange={(val) => setBulkAgentAssign(val)}
                />
                <button
                  onClick={handleBulkAssign}
                  className="bg-emerald-600 font-bold text-[10px] text-white px-2.5 py-1 rounded cursor-pointer"
                >
                  Assign Desk
                </button>
              </div>
            </div>
          )}

          {/* List items scroll container */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredComplaints.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-medium">
                No tickets matches filters. Clear search or filters to reset.
              </div>
            ) : (
              filteredComplaints.map((item) => {
                const isSelected = item.id === selectedId;
                const isChecked = bulkSelectedIds.includes(item.id);
                
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected 
                        ? 'bg-emerald-50/50 border-emerald-200 shadow-sm' 
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Checkbox trigger */}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkSelectedIds([...bulkSelectedIds, item.id]);
                          } else {
                            setBulkSelectedIds(bulkSelectedIds.filter(id => id !== item.id));
                          }
                        }}
                        className="cursor-pointer mt-0.5"
                      />

                      <div className="space-y-1.5 w-full">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] text-slate-400 font-bold">{item.id}</span>
                          
                          {/* Color status badge */}
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            item.status === 'Pending' ? 'bg-rose-50 text-rose-700' :
                            item.status === 'In Review' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-50 text-emerald-700'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <div>
                          <p className="font-bold text-slate-900 text-xs truncate max-w-[180px]">{item.reporterName}</p>
                          <p className="text-[10px] text-slate-400 italic font-medium">{item.category}</p>
                        </div>

                        <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span className="font-semibold">{item.neighborhood}</span>
                          <span className="inline-flex items-center gap-0.5 font-mono">
                            <Clock className="w-3 h-3 text-rose-400" />
                            {item.ageHours}h age
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* --- RIGHT: COMPLAINT DETAIL VIEW (7 Columns) --- */}
        <div className="xl:col-span-7">
          {activeComplaint ? (
            <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-6">
              
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-slate-900 tracking-tight font-mono">{activeComplaint.id}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded font-mono">
                        {activeComplaint.reporterType} ticket
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Submitted: {activeComplaint.submittedAt}</p>
                </div>

                {/* SLA clock indicator */}
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 p-2 rounded-lg self-start sm:self-auto">
                  <Clock className="w-4 h-4 text-rose-500 font-bold" />
                  <div className="text-left leading-none">
                    <p className="text-[10px] font-bold text-rose-500 uppercase">SLA LIMITS OVERRUN</p>
                    <p className="text-xs font-mono font-black text-rose-950 mt-0.5">{activeComplaint.ageHours} / {activeComplaint.slaLimitHours} Hours elapsed</p>
                  </div>
                </div>
              </div>

              {/* Workflow Stepper */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest block">Workflow Stepper Lifecycle Bounds</span>
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg text-xs font-semibold text-slate-500">
                  <button 
                    onClick={() => handleStatusChange('Pending')}
                    className={`flex-1 text-center py-1 rounded transition-colors cursor-pointer ${activeComplaint.status === 'Pending' ? 'bg-rose-100 text-rose-800' : 'hover:bg-slate-200'}`}
                  >
                    1. Pending
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1 shrink-0" />
                  <button 
                    onClick={() => handleStatusChange('In Review')}
                    className={`flex-1 text-center py-1 rounded transition-colors cursor-pointer ${activeComplaint.status === 'In Review' ? 'bg-amber-100 text-amber-800' : 'hover:bg-slate-200'}`}
                  >
                    2. In Review
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1 shrink-0" />
                  <button 
                    onClick={() => {
                      if (!activeComplaint.resolutionSummary) {
                        setShowResolutionBox(true);
                      } else {
                        handleStatusChange('Resolved');
                      }
                    }}
                    className={`flex-1 text-center py-1 rounded transition-colors cursor-pointer ${activeComplaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'}`}
                  >
                    3. Resolved
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1 shrink-0" />
                  <button 
                    onClick={() => handleStatusChange('Closed')}
                    className={`flex-1 text-center py-1 rounded transition-colors cursor-pointer ${activeComplaint.status === 'Closed' ? 'bg-slate-800 text-white' : 'hover:bg-slate-200'}`}
                  >
                    4. Closed
                  </button>
                </div>
              </div>

              {/* Reporter Info Cards */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1">
                  <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Lodger Details</p>
                  <p className="font-bold text-slate-900">{activeComplaint.reporterName}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{activeComplaint.reporterEmail}</p>
                </div>
                <div className="space-y-1 border-l border-slate-200 pl-4">
                  <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Sector Sector Bounds</p>
                  <p className="font-bold text-slate-900">{activeComplaint.neighborhood}</p>
                  <p className="text-[10px] text-slate-500 font-serif">Category: {activeComplaint.category}</p>
                </div>
              </div>

              {/* Decrypted Description context */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest block">Original Complaint Feed</span>
                <p className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-100 p-4 rounded-lg shadow-sm font-medium">
                  "{activeComplaint.description}"
                </p>
              </div>

              {/* Assignment Selector controls */}
              <div className="flex items-center justify-between py-2.5 text-xs font-sans">
                <span className="font-bold text-slate-600">Assigned Compliance Officer:</span>
                <div>
                  <CustomDropdown
                    options={[
                      { value: '', label: 'Unassigned' },
                      { value: 'Adebisi Olomu (Support)', label: 'Adebisi Olomu (Support)' },
                      { value: 'Chidi Nwachukwu (Ops)', label: 'Chidi Nwachukwu (Ops)' },
                      { value: 'Bolanle Yusuf (Super)', label: 'Bolanle Yusuf (Super Admin)' }
                    ]}
                    value={activeComplaint.assignedAgent || ''}
                    onChange={(val) => handleAssignAgent(val)}
                  />
                </div>
              </div>

              {/* Resolution Form or Saved resolution summary */}
              {showResolutionBox || activeComplaint.resolutionSummary ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4.5 space-y-3">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Resolution Summary Document
                  </div>

                  {activeComplaint.resolutionSummary ? (
                    <p className="text-xs text-slate-700 italic bg-white p-3 rounded-lg border border-emerald-100/30">
                      "{activeComplaint.resolutionSummary}"
                    </p>
                  ) : (
                    <form onSubmit={handleSubmitResolution} className="space-y-3">
                      <p className="text-[11px] text-emerald-900 font-medium">Please specify the actions taken. This publishes updates immediately to the reporter's mobile inbox.</p>
                      <textarea
                        required
                        rows={3}
                        value={resolutionSummary}
                        onChange={(e) => setResolutionSummary(e.target.value)}
                        placeholder="e.g., replacement bin voucher dispatched, collector verbal alert logged safely."
                        className="w-full text-xs p-2.5 bg-white border border-emerald-200 rounded-lg outline-none"
                      />
                      <div className="flex justify-end gap-2 text-xs pt-1">
                        <button
                          type="button"
                          onClick={() => setShowResolutionBox(false)}
                          className="px-3 py-1.5 text-slate-500 hover:text-slate-700 font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded cursor-pointer"
                        >
                          Publish Resolution
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : null}

              {/* INTERNAL NOTES PANEL (TIMESTAMPED & ATTRIBUTED) */}
              <div className="bg-amber-50/50 border border-amber-100/70 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2.5 py-0.5 rounded">
                    Internal — Not visible to user
                  </span>
                  <span className="text-[9px] text-slate-400">Timestamped logs</span>
                </div>

                {/* Notes Loop */}
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {activeComplaint.notes.map((note) => (
                    <div key={note.id} className="text-xs space-y-0.5 bg-white p-2.5 rounded border border-amber-100/40">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span className="font-bold text-slate-700">{note.author}</span>
                        <span>{note.timestamp}</span>
                      </div>
                      <p className="text-slate-600 font-medium leading-relaxed font-mono text-[10.5px]">
                        {note.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Note Adding Form */}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newInternalNote}
                    onChange={(e) => setNewInternalNote(e.target.value)}
                    placeholder="Log private notes to squad. Use @mention format..."
                    className="flex-1 text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-950 text-white text-[10px] font-bold px-3 py-2 rounded-lg cursor-pointer"
                  >
                    Commit File
                  </button>
                </form>
              </div>

              {/* VERTICAL TIMELINE BLOCK */}
              <div className="space-y-4 pt-2">
                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest block">Audit Activity History Timeline</span>
                
                <div className="relative pl-5 border-l border-slate-100 space-y-4 text-xs">
                  {activeComplaint.timeline.map((event) => (
                    <div key={event.id} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[26px] top-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-4 ring-white" />
                      
                      <div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="font-bold text-slate-900">{event.title}</span>
                          <span className="font-mono text-slate-400">{event.timestamp}</span>
                        </div>
                        <p className="text-slate-500 mt-0.5">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 font-medium">
              Identify a complaint ticket reference on the left to track workflow steppers or log resolving metrics.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
