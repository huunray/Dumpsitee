import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XSquare, 
  AlertOctagon, 
  UserX, 
  UserCheck, 
  ShieldAlert, 
  Plus, 
  MapPin, 
  FileText, 
  Cpu, 
  Compass, 
  Maximize2,
  Lock,
  ExternalLink,
  Users,
  MoreVertical,
  Eye,
  AlertTriangle,
  Sparkles,
  Send,
  BellRing,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, UserRole, UserStatus, AdminRole, AuditLog } from '../types';
import { permissionsMatrix } from '../data';
import { CustomDropdown } from './CustomDropdown';

interface UserRoleManagementProps {
  users: UserProfile[];
  onUpdateUsers: (updated: UserProfile[]) => void;
  auditLogs: AuditLog[];
  onAddAudit: (action: string) => void;
  currentRole: AdminRole;
}

export default function UserRoleManagement({ 
  users, 
  onUpdateUsers, 
  auditLogs, 
  onAddAudit, 
  currentRole 
}: UserRoleManagementProps) {
  
  // Tab within module
  const [subTab, setSubTab] = useState<'All Users' | 'Pending Approvals' | 'Roles & Audits'>('All Users');

  // Filter/Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'All'>('All');
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);

  // Interactivity Overlays / Panels States
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [zoomIdPhoto, setZoomIdPhoto] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('Fraudulent listing');
  const [suspendNote, setSuspendNote] = useState('');
  
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [reminderFeed, setReminderFeed] = useState<string | null>(null);
  const [drawerShowSuspend, setDrawerShowSuspend] = useState(false);
  
  // Admin Invitation Form States
  const [invitedEmail, setInvitedEmail] = useState('');
  const [invitedRole, setInvitedRole] = useState<AdminRole>('Support Agent');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteFeedback, setInviteFeedback] = useState('');

  // Dropdown / Popover / Advanced View states
  const [activeDropdownUserId, setActiveDropdownUserId] = useState<string | null>(null);
  const [viewUserDetail, setViewUserDetail] = useState<UserProfile | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Simulated feedback flow overlay states
  const [actionStage, setActionStage] = useState<'idle' | 'loading' | 'success'>('idle');
  const [actionLoadingMessage, setActionLoadingMessage] = useState('');
  const [actionSuccessData, setActionSuccessData] = useState<{
    title: string;
    subtitle: string;
    description: string;
    details: { label: string; value: string }[];
    type: 'success' | 'warning';
  } | null>(null);

  // Bulk actions triggers
  const handleBulkApprove = () => {
    const updated = users.map(u => {
      if (bulkSelected.includes(u.id)) {
        return { ...u, status: 'Active' as const, idStatus: 'Verified' as const };
      }
      return u;
    });
    onUpdateUsers(updated);
    onAddAudit(`Bulk approved verifications for users: [${bulkSelected.join(', ')}]`);
    setBulkSelected([]);
  };

  const handleBulkReject = () => {
    const updated = users.map(u => {
      if (bulkSelected.includes(u.id)) {
        return { ...u, status: 'Suspended' as const, idStatus: 'Flagged' as const };
      }
      return u;
    });
    onUpdateUsers(updated);
    onAddAudit(`Bulk rejected files for: [${bulkSelected.join(', ')}]`);
    setBulkSelected([]);
  };

  // Single Action Triggers
  const handleApproveUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setActionLoadingMessage(`Running automated background validation and authorizing secure clearance for ${user.name}...`);
    setActionStage('loading');

    setTimeout(() => {
      const updated = users.map(u => {
        if (u.id === userId) {
          return { ...u, status: 'Active' as const, idStatus: 'Verified' as const };
        }
        return u;
      });
      onUpdateUsers(updated);
      onAddAudit(`Manually verified identity documentation and enabled routing for ${user.name}`);
      
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, status: 'Active', idStatus: 'Verified' });
      }
      if (viewUserDetail?.id === userId) {
        setViewUserDetail({ ...viewUserDetail, status: 'Active', idStatus: 'Verified' });
      }

      setActionSuccessData({
        title: "Identity Verified Successfully",
        subtitle: "Role Clearance Enabled",
        description: `Credentials for ${user.name} have been fully verified under compliance SLA. Dispatch system routing is now active.`,
        details: [
          { label: "Account ID", value: user.id },
          { label: "Account Name", value: user.name },
          { label: "Role Classification", value: user.role },
          { label: "Audit Authorization", value: `AUTH-TKN-${Math.floor(100000 + Math.random() * 899999)}` },
          { label: "Execution Timestamp", value: new Date().toISOString() }
        ],
        type: 'success'
      });
      setActionStage('success');
    }, 1500);
  };

  const handleFlagUser = (userId: string) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, idStatus: 'Flagged' as const };
      }
      return u;
    });
    onUpdateUsers(updated);
    onAddAudit(`Flagged uploaded verification credentials as questionable for ${users.find(u => u.id === userId)?.name}`);
    if (selectedUser?.id === userId) {
      setSelectedUser({ ...selectedUser, idStatus: 'Flagged' });
    }
  };

  const handleOpenSuspend = (user: UserProfile) => {
    setSelectedUser(user);
    setSuspendModalOpen(true);
  };

  const submitSuspend = () => {
    if (!selectedUser) return;
    const user = selectedUser;

    setActionLoadingMessage(`Disabling routing endpoints and suspending administrative tokens for ${user.name}...`);
    setActionStage('loading');
    setSuspendModalOpen(false);

    setTimeout(() => {
      const updated = users.map(u => {
        if (u.id === user.id) {
          return { 
            ...u, 
            status: 'Suspended' as const, 
            suspensionReason: suspendReason, 
            suspensionNote: suspendNote 
          };
        }
        return u;
      });
      onUpdateUsers(updated);
      onAddAudit(`Suspended account ${user.name} (${user.id}). Reason: ${suspendReason}.`);
      
      if (viewUserDetail?.id === user.id) {
        setViewUserDetail({ 
          ...viewUserDetail, 
          status: 'Suspended', 
          suspensionReason: suspendReason, 
          suspensionNote: suspendNote 
        });
      }

      setActionSuccessData({
        title: "Profile Lock Engaged",
        subtitle: "Audit Lockdown Enabled",
        description: `Active account state for ${user.name} has been suspended due to compliance concerns: "${suspendReason}".`,
        details: [
          { label: "Account ID", value: user.id },
          { label: "Account Name", value: user.name },
          { label: "Suspension Reason", value: suspendReason },
          { label: "Transaction Lock", value: `LCK-ID-${Math.floor(200000 + Math.random() * 799999)}` },
          { label: "Auditor Note", value: suspendNote || "N/A" }
        ],
        type: 'warning'
      });
      setActionStage('success');
      setSelectedUser(null);
      setSuspendNote('');
    }, 1500);
  };

  const handleOpenReactivate = (user: UserProfile) => {
    setSelectedUser(user);
    setReactivateModalOpen(true);
  };

  const submitReactivate = () => {
    if (!selectedUser) return;
    const user = selectedUser;

    setActionLoadingMessage(`Refreshing compliance profiles and lifting route locking restrictions for ${user.name}...`);
    setActionStage('loading');
    setReactivateModalOpen(false);

    setTimeout(() => {
      const updated = users.map(u => {
        if (u.id === user.id) {
          return { 
            ...u, 
            status: 'Active' as const, 
            suspensionReason: undefined, 
            suspensionNote: undefined 
          };
        }
        return u;
      });
      onUpdateUsers(updated);
      onAddAudit(`Reactivated suspended account ${user.name} (${user.id}) after comprehensive compliance log check.`);
      
      if (viewUserDetail?.id === user.id) {
        setViewUserDetail({ 
          ...viewUserDetail, 
          status: 'Active', 
          suspensionReason: undefined, 
          suspensionNote: undefined 
        });
      }

      setActionSuccessData({
        title: "Account Restored Successfully",
        subtitle: "Operational Clearance Re-issued",
        description: `Suspension lift complete. ${user.name} is now approved to conduct full workflow operations.`,
        details: [
          { label: "Account ID", value: user.id },
          { label: "Account Name", value: user.name },
          { label: "Routing Status", value: "ACTIVE / OPERATIONAL" },
          { label: "Compliance Reference", value: "REF-CMP-909" }
        ],
        type: 'success'
      });
      setActionStage('success');
      setSelectedUser(null);
    }, 1500);
  };

  // Submit invited staff with secure role confirmation
  const handleInviteStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitedEmail.trim() || !confirmPassword.trim()) {
      setInviteFeedback('Please fill out email and re-enter supervisor password.');
      return;
    }
    
    // Simulate check
    if (confirmPassword.length < 4) {
      setInviteFeedback('Invalid supervisor confirmation password.');
      return;
    }

    onAddAudit(`Invited new administrator: ${invitedEmail} with credentials level ${invitedRole}`);
    setInviteFeedback(`Successfully sent encrypted security invite to ${invitedEmail} for role: ${invitedRole}.`);
    setInvitedEmail('');
    setConfirmPassword('');
    setTimeout(() => setInviteFeedback(''), 5000);
  };

  // Filter lists based on widgets status
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const pendingQueue = users.filter(u => u.status === 'Pending Approval' || u.idStatus === 'Pending Verification');

  // Verify access flags
  const isSuperAdmin = currentRole === 'Super Admin';
  const isOpsAdmin = currentRole === 'Ops Admin';
  const hasManagementAccess = isSuperAdmin || isOpsAdmin;

  return (
    <div className="space-y-6">
      
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Users & Role Management</h2>
            <button
              onClick={() => setInviteModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xs shrink-0 uppercase tracking-wider"
              title="Invite a new administrator or team member"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Invite Member</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">Conduct identity audits, manage service suspends/reactivations, and assign operational clearances.</p>
        </div>

        {/* Inner sub-tabs switcher */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto select-none">
          <button 
            onClick={() => setSubTab('All Users')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${subTab === 'All Users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            All Accounts ({users.length})
          </button>
          
          <button 
            onClick={() => setSubTab('Pending Approvals')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all relative cursor-pointer ${subTab === 'Pending Approvals' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Approvals Queue ({pendingQueue.length})
            {pendingQueue.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500" />
            )}
          </button>

          <button 
            onClick={() => setSubTab('Roles & Audits')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${subTab === 'Roles & Audits' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Roles & Logs
          </button>
        </div>
      </div>

      {/* --- ALL USERS TAB --- */}
      {subTab === 'All Users' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-100">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute inset-y-0 left-0 pl-3 flex items-center h-full text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search registered accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {/* Role filter */}
              <CustomDropdown
                options={[
                  { value: 'All', label: 'All User Roles' },
                  { value: 'Dumper', label: 'Dumper' },
                  { value: 'Collector', label: 'Logistic Agent (Collector)' },
                  { value: 'Recycling Company', label: 'Recycling Company' }
                ]}
                value={roleFilter}
                onChange={(val) => setRoleFilter(val as any)}
              />

              {/* Status filter */}
              <CustomDropdown
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Pending Approval', label: 'Pending Approval' },
                  { value: 'Suspended', label: 'Suspended' }
                ]}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val as any)}
                align="right"
              />
            </div>
          </div>

          {/* Bulk actions status readout */}
          {bulkSelected.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg p-3 text-xs flex items-center justify-between">
              <span>Selected <strong>{bulkSelected.length}</strong> items for admin action</span>
              <div className="flex gap-2">
                <button 
                  onClick={handleBulkApprove} 
                  disabled={!hasManagementAccess}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold cursor-pointer disabled:opacity-50"
                >
                  Approve Selected
                </button>
                <button 
                  onClick={handleBulkReject} 
                  disabled={!hasManagementAccess}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold cursor-pointer disabled:opacity-50"
                >
                  Reject & Suspend Selected
                </button>
              </div>
            </div>
          )}

          {/* Table of all users */}
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5 w-10 text-center">
                      <input 
                        type="checkbox" 
                        checked={bulkSelected.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkSelected(filteredUsers.map(u => u.id));
                          } else {
                            setBulkSelected([]);
                          }
                        }}
                        className="cursor-pointer"
                      />
                    </th>
                    <th className="p-3.5">Registration Ref</th>
                    <th className="p-3.5">Human Identity</th>
                    <th className="p-3.5">Account Role</th>
                    <th className="p-3.5">Sector (Neighborhood)</th>
                    <th className="p-3.5">Identity Verification</th>
                    <th className="p-3.5">Operational Status</th>
                    <th className="p-3.5 text-right">Moderations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                        No user accounts matched the search criteria. Try modifying your queries.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isSelected = bulkSelected.includes(user.id);
                      return (
                        <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-3.5 text-center">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBulkSelected([...bulkSelected, user.id]);
                                } else {
                                  setBulkSelected(bulkSelected.filter(id => id !== user.id));
                                }
                              }}
                              className="cursor-pointer"
                            />
                          </td>
                          <td className="p-3.5 font-mono text-slate-400 font-semibold">{user.id}</td>
                          <td className="p-3.5">
                            <div>
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              user.role === 'Dumper' ? 'bg-slate-100 text-slate-700' :
                              user.role === 'Collector' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
                              'bg-indigo-50 text-indigo-700 border border-indigo-100'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3.5 font-medium text-slate-700">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {user.location}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1 font-bold ${
                              user.idStatus === 'Verified' ? 'text-emerald-600' :
                              user.idStatus === 'Pending Verification' ? 'text-amber-500 animate-pulse' :
                              user.idStatus === 'Flagged' ? 'text-rose-500' : 'text-slate-400'
                            }`}>
                              ● {user.idStatus}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                              user.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700' :
                              'bg-rose-50 text-rose-700'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right relative">
                            {!hasManagementAccess ? (
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">Locked to Ops</span>
                            ) : (
                              <div className="inline-block text-left">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdownUserId(activeDropdownUserId === user.id ? null : user.id);
                                  }}
                                  className="p-1 px-2 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                                >
                                  <MoreVertical className="w-3.5 h-3.5" />
                                  <span className="text-[10px] font-bold">Actions</span>
                                </button>

                                {activeDropdownUserId === user.id && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-30 bg-transparent" 
                                      onClick={() => setActiveDropdownUserId(null)} 
                                    />
                                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-slate-100 shadow-lg py-1 z-40 text-left font-sans text-[11px] animate-fade-in text-slate-850">
                                      <p className="px-3 py-1.5 text-[9px] uppercase font-bold text-slate-400 bg-slate-50/50 rounded-t-xl border-b border-slate-100">
                                        Ref: {user.id}
                                      </p>
                                      
                                      <button
                                        onClick={() => {
                                          setActiveDropdownUserId(null);
                                          setViewUserDetail(user);
                                        }}
                                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
                                      >
                                        <Eye className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span>View Page Details</span>
                                      </button>
                                      
                                      {user.status === 'Suspended' ? (
                                        <button
                                          onClick={() => {
                                            setActiveDropdownUserId(null);
                                            handleOpenReactivate(user);
                                          }}
                                          className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 font-bold text-emerald-750 flex items-center gap-2 transition-colors cursor-pointer border-t border-slate-50"
                                        >
                                          <UserCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                          <span>Reactivate Profile</span>
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setActiveDropdownUserId(null);
                                            handleOpenSuspend(user);
                                          }}
                                          className="w-full text-left px-3.5 py-2 hover:bg-rose-50 font-bold text-rose-650 flex items-center gap-2 transition-colors cursor-pointer border-t border-slate-50"
                                        >
                                          <UserX className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                          <span>Suspend Profile</span>
                                        </button>
                                      )}
                                      
                                      {user.role === 'Collector' && (
                                        <button
                                          onClick={() => {
                                            setActiveDropdownUserId(null);
                                            setSelectedUser(user);
                                            setSubTab('Pending Approvals');
                                          }}
                                          className="w-full text-left px-3.5 py-2 hover:bg-sky-50 font-bold text-sky-700 flex items-center gap-2 transition-colors cursor-pointer border-t border-slate-105"
                                        >
                                          <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                          <span>Audit Documents</span>
                                        </button>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- PENDING APPROVALS QUEUE --- */}
      {subTab === 'Pending Approvals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Pending queue list table */}
          <div className="lg:col-span-12 xl:col-span-7 bg-white rounded-xl border border-slate-100 p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Accounts Awaiting Review Queue</h3>
            
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[9px] tracking-wider border-b border-slate-50">
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5">Role Applied</th>
                    <th className="p-2.5">Submitted Timestamp</th>
                    <th className="p-2.5">ID Status</th>
                    <th className="p-2.5 text-right">Process</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pendingQueue.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                        All clear! No accounts are currently awaiting verification.
                      </td>
                    </tr>
                  ) : (
                    pendingQueue.map((user) => (
                      <tr 
                        key={user.id} 
                        className={`cursor-pointer transition-colors ${viewUserDetail?.id === user.id ? 'bg-emerald-50/40 font-semibold' : 'hover:bg-slate-50'}`}
                        onClick={() => {
                          setSelectedUser(user);
                          setViewUserDetail(user);
                        }}
                      >
                        <td className="p-2.5">
                          <div>
                            <p className="text-slate-900 font-bold">{user.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
                          </div>
                        </td>
                        <td className="p-2.5">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 uppercase border border-amber-100">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-400 font-mono text-[10px]">{user.submittedTime || 'N/A'}</td>
                        <td className="p-2.5 text-slate-500 font-bold font-mono">
                          ⚠️ {user.idStatus}
                        </td>
                        <td className="p-2.5 text-right">
                          <button 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[9px] px-2.5 py-1.5 rounded-lg shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95 text-center uppercase tracking-wider"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(user);
                              setViewUserDetail(user);
                            }}
                          >
                            Verify Panel
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Inspection Workspace Side Panel */}
          <div className="lg:col-span-12 xl:col-span-5">
            {selectedUser ? (
              <div className="bg-white rounded-xl border border-emerald-100 p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Verification Review Office</span>
                    <h3 className="text-sm font-bold text-slate-900">{selectedUser.name} Review</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">{selectedUser.id}</span>
                </div>

                {/* ID Card Display with comparative check */}
                <div className="bg-slate-950 text-white rounded-xl p-4.5 font-mono relative overflow-hidden text-[10px] border border-slate-800 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-[11px] font-bold tracking-tight text-emerald-500">DIGITAL NATIONAL IDENTITY</h4>
                      <p className="text-[8px] text-slate-500">REPUBLIC OF WEST AFRICA</p>
                    </div>
                    <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
                  </div>

                  <div className="flex gap-3">
                    <div className="space-y-2 shrink-0">
                      {/* Photo Placeholder */}
                      <div className="w-16 h-20 bg-slate-900 rounded-md border border-slate-800 flex items-center justify-center relative overflow-hidden">
                        <span className="text-slate-700 text-xs text-center leading-none">Photo Signed</span>
                        <div className="absolute top-1 left-1.5 w-1 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      
                      {/* Zoom Trigger */}
                      <button 
                        onClick={() => setZoomIdPhoto(!zoomIdPhoto)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-1 rounded flex items-center justify-center gap-1 cursor-pointer text-[9px]"
                      >
                        <Maximize2 className="w-2.5 h-2.5" />
                        {zoomIdPhoto ? 'Contract ID' : 'Zoom Card'}
                      </button>
                    </div>

                    <div className="space-y-1.5 text-slate-300 w-full">
                      <p><span className="text-slate-500">REG_NAME:</span> {selectedUser.name.toUpperCase()}</p>
                      <p><span className="text-slate-500">ID_REF_NO:</span> WA-ID-88192312-NG</p>
                      <p><span className="text-slate-500">ROLE_REQ:</span> {selectedUser.role.toUpperCase()}</p>
                      <p><span className="text-slate-500">RESIDENCE:</span> {selectedUser.location.toUpperCase()}</p>
                      <p><span className="text-slate-500">ID_STATUS:</span> <span className="text-emerald-500 font-bold">{selectedUser.idStatus.toUpperCase()}</span></p>
                    </div>
                  </div>

                  {/* Simulated Zoomed state in block */}
                  {zoomIdPhoto && (
                    <div className="mt-4 p-3 bg-slate-900 rounded border border-slate-800 text-slate-400 text-[9px] leading-relaxed">
                      <p className="text-emerald-400 font-bold mb-1">🔍 Comparative Name Matrix Check:</p>
                      <p>• System Registered Text: <span className="text-white font-mono">"{selectedUser.name}"</span></p>
                      <p>• Optical Character Scan: <span className="text-white font-mono">"{selectedUser.name.toUpperCase()}"</span></p>
                      <p className="text-emerald-500 font-bold">✓ 100% Matching character sequence. Verification safe.</p>
                    </div>
                  )}
                </div>

                {/* Logistic Support specific verification panels */}
                {selectedUser.role === 'Collector' && selectedUser.vehicleDetails && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-3">
                    <p className="font-bold text-slate-700 inline-flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-sky-500" /> Logistic Vehicle & Document Audits
                    </p>

                    {/* Document Checklist checkboxes */}
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <input 
                          type="checkbox" 
                          checked={selectedUser.docsChecklist?.photoId} 
                          onChange={() => {
                            if (!selectedUser.docsChecklist) return;
                            const checklist = { ...selectedUser.docsChecklist, photoId: !selectedUser.docsChecklist.photoId };
                            const updated = users.map(u => u.id === selectedUser.id ? { ...u, docsChecklist: checklist } : u);
                            onUpdateUsers(updated);
                            setSelectedUser({ ...selectedUser, docsChecklist: checklist });
                          }}
                          className="cursor-pointer"
                        />
                        <span className="text-slate-600 truncate font-semibold">Photo ID Verification</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input 
                          type="checkbox" 
                          checked={selectedUser.docsChecklist?.vehicleOwnership} 
                          onChange={() => {
                            if (!selectedUser.docsChecklist) return;
                            const checklist = { ...selectedUser.docsChecklist, vehicleOwnership: !selectedUser.docsChecklist.vehicleOwnership };
                            const updated = users.map(u => u.id === selectedUser.id ? { ...u, docsChecklist: checklist } : u);
                            onUpdateUsers(updated);
                            setSelectedUser({ ...selectedUser, docsChecklist: checklist });
                          }}
                          className="cursor-pointer"
                        />
                        <span className="text-slate-600 truncate font-semibold">Vehicle Ownership Log</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input 
                          type="checkbox" 
                          checked={selectedUser.docsChecklist?.storageAddress} 
                          onChange={() => {
                            if (!selectedUser.docsChecklist) return;
                            const checklist = { ...selectedUser.docsChecklist, storageAddress: !selectedUser.docsChecklist.storageAddress };
                            const updated = users.map(u => u.id === selectedUser.id ? { ...u, docsChecklist: checklist } : u);
                            onUpdateUsers(updated);
                            setSelectedUser({ ...selectedUser, docsChecklist: checklist });
                          }}
                          className="cursor-pointer"
                        />
                        <span className="text-slate-600 truncate font-semibold">Registry Address Log</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input 
                          type="checkbox" 
                          checked={selectedUser.docsChecklist?.businessReg} 
                          onChange={() => {
                            if (!selectedUser.docsChecklist) return;
                            const checklist = { ...selectedUser.docsChecklist, businessReg: !selectedUser.docsChecklist.businessReg };
                            const updated = users.map(u => u.id === selectedUser.id ? { ...u, docsChecklist: checklist } : u);
                            onUpdateUsers(updated);
                            setSelectedUser({ ...selectedUser, docsChecklist: checklist });
                          }}
                          className="cursor-pointer"
                        />
                        <span className="text-slate-600 truncate font-semibold">Business Reg Certification</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600 font-mono">
                      <p>• Vehicle: <strong>{selectedUser.vehicleDetails.model} ({selectedUser.vehicleDetails.year})</strong></p>
                      <p>• Plates Checked: <strong>{selectedUser.vehicleDetails.plateNumber}</strong></p>
                      <p>• Target Sector Coverage: <strong>{selectedUser.coverageArea}</strong></p>
                    </div>

                    {/* Simple coverage map widget illustration */}
                    <div className="h-20 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100 p-2 text-center text-[10px] text-emerald-800 relative overflow-hidden select-none">
                      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1.2px,transparent_1.2px)] [background-size:12px_12px] opacity-25" />
                      <div className="z-10 flex flex-col items-center">
                        <Compass className="w-3.5 h-3.5 text-emerald-600 mb-1" />
                        <span>Map Bounds Coverage Area Loaded:</span>
                        <span className="font-bold font-mono text-[9px]">{selectedUser.coverageArea}</span>
                      </div>
                    </div>

                    {/* Documents checklist alert warnings */}
                    {(!selectedUser.docsChecklist?.photoId || !selectedUser.docsChecklist?.vehicleOwnership || !selectedUser.docsChecklist?.storageAddress || !selectedUser.docsChecklist?.businessReg) && (
                      <div className="bg-amber-50 text-amber-800 p-2 rounded text-[10px] leading-snug">
                        ⚠️ <strong>Verification Expiry Warning:</strong> This operator has incomplete registration records. Standard routing SLAs are restricted until all boxes are audited.
                      </div>
                    )}
                  </div>
                )}

                {/* Approval Action Trigger Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApproveUser(selectedUser.id)}
                    disabled={!hasManagementAccess}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded shadow transition-colors cursor-pointer disabled:opacity-50"
                  >
                    ✓ Verify & Approve
                  </button>
                  <button 
                    onClick={() => handleFlagUser(selectedUser.id)}
                    disabled={!hasManagementAccess}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2 rounded transition-colors cursor-pointer disabled:opacity-50"
                  >
                    ⚠ Flag Account
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 font-medium">
                Click on any user pending verification in the approvals table to launch character checks, inspect uploaded documents, and sign credentials.
              </div>
            )}
          </div>

        </div>
      )}

      {/* --- ROLES & AUDITS TAB --- */}
      {subTab === 'Roles & Audits' && (
        <div className="space-y-6">
          
          {/* Permission matrix segment */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* invite new admin and settings matrix */}
            <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Administrative Permissions Matrix</h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 py-1 px-2 rounded-full font-bold">
                  Active Configuration
                </span>
              </div>

              {/* Visual Matrix Table */}
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[9px] tracking-wider border-b border-slate-50">
                      <th className="p-2.5">Portal Module</th>
                      <th className="p-2.5">Permitted Admin Actions</th>
                      <th className="p-2.5 text-center">Super Admin</th>
                      <th className="p-2.5 text-center">Ops Admin</th>
                      <th className="p-2.5 text-center">Support Agent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {permissionsMatrix.map((perm, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-2.5 font-bold text-slate-900">{perm.module}</td>
                        <td className="p-2.5 text-slate-500">{perm.action}</td>
                        <td className="p-2.5 text-center font-bold text-emerald-600">
                          {perm['Super Admin'] ? '✓' : '—'}
                        </td>
                        <td className="p-2.5 text-center font-bold text-sky-600">
                          {perm['Ops Admin'] ? '✓' : '—'}
                        </td>
                        <td className="p-2.5 text-center font-bold text-slate-400">
                          {perm['Support Agent'] ? '✓' : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invite new admin staff form */}
            <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-2 inline-flex items-center gap-1">
                <Lock className="w-4 h-4 text-emerald-600" />
                Invite Team Member
              </h3>
              <p className="text-xs text-slate-400 mb-4">Provide supervisor credentials and select access scopes.</p>

              {inviteFeedback && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-2 rounded text-[11px] font-semibold mb-3 leading-snug">
                  {inviteFeedback}
                </div>
              )}

              <form onSubmit={handleInviteStaff} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 tracking-wide uppercase text-[9px] mb-1">
                    Staff Identity Email
                  </label>
                  <input
                    type="email"
                    value={invitedEmail}
                    onChange={(e) => setInvitedEmail(e.target.value)}
                    placeholder="teammember@dumpsite.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 tracking-wide uppercase text-[9px] mb-1">
                    Administrative Scope Clearance
                  </label>
                  <CustomDropdown
                    options={[
                      { value: 'Support Agent', label: 'Support Agent (Low tier clearance)' },
                      { value: 'Ops Admin', label: 'Ops Admin (Operational clearance)' },
                      { value: 'Super Admin', label: 'Super Admin (Universal clearance)' }
                    ]}
                    value={invitedRole}
                    onChange={(val) => setInvitedRole(val as AdminRole)}
                    fullWidth
                  />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <label className="block font-bold text-rose-800 tracking-wide uppercase text-[9px] mb-1">
                    Re-enter password to confirm
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Issuer Master Key"
                    className="w-full p-2.5 bg-slate-50 border border-rose-200 rounded focus:outline-none font-mono"
                    required
                  />
                  <p className="text-[9px] text-slate-400 mt-1 leading-snug">
                    Confirming new clearances requires active superkey verification checks before credentials commit.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!isSuperAdmin}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-center transition-all cursor-pointer disabled:opacity-50 mt-2 shadow"
                  title={isSuperAdmin ? 'Dispatch invite link' : 'Super Admin only action'}
                >
                  Configure Scope Signature
                </button>
              </form>
            </div>

          </div>

          {/* Audit trail chronological ledger */}
          <div className="bg-white p-5 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-0.5 uppercase tracking-wide inline-flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  Chronological Admin Action Audit Log
                </h3>
                <p className="text-[11px] text-slate-500">Secure immutable record of every action committed via the management suite.</p>
              </div>

              <span className="text-[10px] bg-rose-50 border border-rose-100 text-rose-700 px-2 py-0.5 rounded font-mono font-bold uppercase animate-pulse">
                Super Admin Only view
              </span>
            </div>

            {/* Check authorization */}
            {!isSuperAdmin ? (
              <div className="p-8 text-center bg-slate-50 border border-rose-100 rounded-lg text-rose-700 space-y-2">
                <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Access Restrained — Permission Denied</h4>
                <p className="text-[11px] text-slate-500 leading-normal max-w-md mx-auto">
                  You are logged in as <strong className="text-slate-800">{currentRole}</strong>. Access to the chronological audit trails requires elevated Super Admin clearance levels. Select "Super Admin" from the top switcher bar to view.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-80 overflow-y-auto pr-2 text-xs">
                {auditLogs.length === 0 ? (
                  <p className="text-center p-8 text-slate-400 font-medium">No actions committed yet.</p>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-50/80 transition-colors flex justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-slate-700 font-medium leading-normal">{log.action}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                          <span>Committer: <strong>{log.adminName}</strong></span>
                          <span>•</span>
                          <span className="bg-slate-200/60 px-1 py-0.5 rounded text-slate-600 font-bold uppercase text-[9px]">{log.adminRole}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-[10px] text-slate-400 block">{log.timestamp}</span>
                        <span className="font-mono text-[9px] text-emerald-600 bg-emerald-50 px-1 rounded block mt-1 font-bold">{log.id}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>
      )}

      {/* --- MODAL DIALOGS --- */}

      {/* 1. SUSPEND CARD MODAL */}
      {suspendModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl border border-slate-100 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <UserX className="w-5 h-5" />
              <h3 className="font-bold text-slate-900">Suspend Administrative Account</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-normal">
              You are applying high security temporary or permanent suspension labels on <strong>{selectedUser.name} ({selectedUser.id})</strong>. This revokes routing instantly.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase text-[9px] tracking-wide mb-1">
                  Mandatory Suspension Reason Dropdown
                </label>
                <CustomDropdown
                  options={[
                    { value: 'Fraudulent listing', label: 'Fraudulent listing / Discrepancy Records' },
                    { value: 'Payment dispute', label: 'Payment dispute or Invoice Failure' },
                    { value: 'Unverified collector', label: 'Unverified collector credentials' },
                    { value: 'Policy violation', label: 'Policy violation / Toxic Materials dumping' },
                    { value: 'Other', label: 'Other (Audit required)' }
                  ]}
                  value={suspendReason}
                  onChange={(val) => setSuspendReason(val)}
                  fullWidth
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[9px] tracking-wide mb-1">
                  Optional administrative reference notes
                </label>
                <textarea
                  value={suspendNote}
                  onChange={(e) => setSuspendNote(e.target.value)}
                  rows={3}
                  placeholder="Record specific investigation context here..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs font-bold pt-2">
              <button 
                onClick={() => setSuspendModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded text-slate-500 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={submitSuspend}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded cursor-pointer"
              >
                ✓ Confirm Suspension Penalty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. REACTIVATE CARD MODAL */}
      {reactivateModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl border border-slate-100 w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <UserCheck className="w-5 h-5 animate-bounce" />
              <h3 className="font-bold text-slate-900">Reactivate Account</h3>
            </div>

            <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg text-xs space-y-1">
              <p className="font-bold text-rose-800 uppercase text-[9px] tracking-wide">Historical Locking Reason:</p>
              <p className="text-rose-950 font-bold">"{selectedUser.suspensionReason || 'General lockdown record'}"</p>
              {selectedUser.suspensionNote && (
                <p className="text-[10px] text-rose-700 italic">Admin logs: "{selectedUser.suspensionNote}"</p>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-normal">
              Reactivating <strong>{selectedUser.name}</strong> reinstates routing algorithms, triggers notification dispatch logs, and clears discrepancy warnings.
            </p>

            <div className="flex justify-end gap-2 text-xs font-bold pt-2">
              <button 
                onClick={() => setReactivateModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded text-slate-500 hover:bg-slate-50 cursor-pointer"
              >
                Go Back
              </button>
              <button 
                onClick={submitReactivate}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
              >
                ✓ De-escalate & Unlock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. VIEW DETAILED USER INSPECTOR - RIGHT SIDE SLIDE DRAWER PANEL */}
      <AnimatePresence>
        {viewUserDetail && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans text-xs">
            {/* Backdrop with elegant blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
              onClick={() => {
                setViewUserDetail(null);
                setDrawerShowSuspend(false);
                setReminderFeed(null);
              }}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                className="w-screen max-w-md sm:max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-100 h-full text-slate-800 overflow-hidden"
              >
                {/* Drawer Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-950 text-sm leading-snug font-sans">Comprehensive Moderation Office</h3>
                      <p className="text-[10px] text-slate-500 tracking-wider uppercase font-mono">Ref Profile ID: {viewUserDetail.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase text-center tracking-wider shrink-0 border ${
                      viewUserDetail.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      viewUserDetail.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse' :
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {viewUserDetail.status}
                    </span>
                    <button
                      onClick={() => {
                        setViewUserDetail(null);
                        setDrawerShowSuspend(false);
                        setReminderFeed(null);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Drawer Body - Scrollable content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Warning Alerts or Reminder Dispatched states */}
                  {reminderFeed && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4.5 flex gap-2.5 items-start text-emerald-950 leading-relaxed font-semibold">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-emerald-800 font-sans">Operational Reminder Dispatched</p>
                        <p className="text-[10.5px] font-medium text-emerald-650 mt-0.5">{reminderFeed}</p>
                      </div>
                    </div>
                  )}

                  {viewUserDetail.status === 'Suspended' && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-2 text-rose-900">
                      <div className="flex items-center gap-1.5">
                        <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 animate-pulse" />
                        <span className="font-extrabold uppercase text-[10px] tracking-wider text-rose-800">
                          Operational Lockout Active
                        </span>
                      </div>
                      <p className="font-bold text-xs font-sans">Reason: "{viewUserDetail.suspensionReason || 'Compliance Breach'}"</p>
                      {viewUserDetail.suspensionNote && (
                        <p className="text-[10.5px] italic text-rose-700 font-medium">Log: "{viewUserDetail.suspensionNote}"</p>
                      )}
                    </div>
                  )}

                  {/* 1. Identity Segment */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-sans">Human Identity Summary</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 font-sans">Biological Identifier</span>
                        <p className="font-black text-slate-900 text-sm mt-0.5 leading-tight font-sans">{viewUserDetail.name}</p>
                        <p className="text-slate-500 font-mono mt-0.5 truncate text-[10.5px]">{viewUserDetail.email}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 font-sans">Assigned Sector Bounds</span>
                        <p className="font-bold text-slate-800 text-xs mt-1 inline-flex items-center gap-1 leading-snug font-sans">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {viewUserDetail.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Account Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1 font-sans">Clearance Profile Role</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase inline-block border ${
                        viewUserDetail.role === 'Dumper' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                        viewUserDetail.role === 'Collector' ? 'bg-sky-50 text-sky-700 border-sky-100' :
                        'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}>
                        {viewUserDetail.role}
                      </span>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-xl">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1 font-sans">ID Audit Status</span>
                      <span className={`font-bold inline-flex items-center gap-1 ${
                        viewUserDetail.idStatus === 'Verified' ? 'text-emerald-600' :
                        viewUserDetail.idStatus === 'Pending Verification' ? 'text-amber-500 font-bold' :
                        'text-rose-500'
                      }`}>
                        ● {viewUserDetail.idStatus}
                      </span>
                    </div>
                  </div>

                  {/* 3. National Identity Card Check */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-sans">National Identity Documentation Verification</h4>
                    <div className="bg-slate-900 text-white rounded-xl p-4 font-mono relative overflow-hidden border border-slate-800 shadow-md">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="text-[10px] font-bold tracking-tight text-emerald-400 font-sans">DIGITAL NATIONAL IDENTITY</h5>
                          <p className="text-[7.5px] text-slate-500 font-sans tracking-widest">REPUBLIC OF WEST AFRICA</p>
                        </div>
                        <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shrink-0" />
                      </div>

                      <div className="flex gap-4">
                        <div className="space-y-1.5 shrink-0">
                          <div className="w-14 h-16 bg-slate-950 rounded border border-slate-800 flex items-center justify-center relative overflow-hidden select-none">
                            <span className="text-slate-600 text-[8px] text-center leading-none font-sans">ID Watermark Verified</span>
                            <div className="absolute top-1 left-1 w-1 h-1 bg-emerald-500 animate-ping" />
                          </div>
                          
                          <button 
                            onClick={() => setZoomIdPhoto(!zoomIdPhoto)}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-1 px-1.5 rounded text-[8px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <Maximize2 className="w-2.5 h-2.5 text-slate-400" />
                            {zoomIdPhoto ? 'Hide Matrix' : 'Audit Check'}
                          </button>
                        </div>

                        <div className="space-y-1 text-slate-300 w-full text-[9px] leading-tight">
                          <p><span className="text-slate-500 font-sans">REGISTERED:</span> {viewUserDetail.name.toUpperCase()}</p>
                          <p><span className="text-slate-500 font-sans">LICENSE_REF:</span> ID-WA-9018228-CH</p>
                          <p><span className="text-slate-500 font-sans">CATEGORY:</span> {viewUserDetail.role.toUpperCase()}</p>
                          <p><span className="text-slate-500 font-sans">RESIDENCE:</span> {viewUserDetail.location.toUpperCase()}</p>
                          <p><span className="text-slate-500 font-sans">VERIFIED:</span> <span className="text-emerald-400 font-bold">100% SECURE</span></p>
                        </div>
                      </div>

                      {zoomIdPhoto && (
                        <div className="mt-3 p-3 bg-slate-950 rounded border border-slate-800 text-[8.5px] text-slate-400 leading-normal space-y-1">
                          <p className="text-emerald-400 font-bold mb-1">🔍 Optical Character Name Sequence Matrix Checklist:</p>
                          <p>• System Account Record: <span className="text-white font-mono">"{viewUserDetail.name}"</span></p>
                          <p>• Optical Identity Scan: <span className="text-white font-mono">"{viewUserDetail.name.toUpperCase()}"</span></p>
                          <p className="text-emerald-400 font-bold">✓ Direct matched character sequence. Audit check has green-light.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4. Logistics Details */}
                  {viewUserDetail.role === 'Collector' && viewUserDetail.vehicleDetails && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                      <p className="font-extrabold text-slate-800 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-sans">
                        <Cpu className="w-3.5 h-3.5 text-sky-500" /> Logistic Vehicle & Document Auditing
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="checkbox" 
                            checked={viewUserDetail.docsChecklist?.photoId ?? false} 
                            onChange={() => {
                              if (!viewUserDetail.docsChecklist) return;
                              const checklist = { ...viewUserDetail.docsChecklist, photoId: !viewUserDetail.docsChecklist.photoId };
                              const updated = users.map(u => u.id === viewUserDetail.id ? { ...u, docsChecklist: checklist } : u);
                              onUpdateUsers(updated);
                              setViewUserDetail({ ...viewUserDetail, docsChecklist: checklist });
                            }}
                            className="cursor-pointer"
                          />
                          <span className="text-slate-600 truncate font-semibold">Photo ID Approved</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="checkbox" 
                            checked={viewUserDetail.docsChecklist?.vehicleOwnership ?? false} 
                            onChange={() => {
                              if (!viewUserDetail.docsChecklist) return;
                              const checklist = { ...viewUserDetail.docsChecklist, vehicleOwnership: !viewUserDetail.docsChecklist.vehicleOwnership };
                              const updated = users.map(u => u.id === viewUserDetail.id ? { ...u, docsChecklist: checklist } : u);
                              onUpdateUsers(updated);
                              setViewUserDetail({ ...viewUserDetail, docsChecklist: checklist });
                            }}
                            className="cursor-pointer"
                          />
                          <span className="text-slate-600 truncate font-semibold">Vehicle Ownership Log</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="checkbox" 
                            checked={viewUserDetail.docsChecklist?.storageAddress ?? false} 
                            onChange={() => {
                              if (!viewUserDetail.docsChecklist) return;
                              const checklist = { ...viewUserDetail.docsChecklist, storageAddress: !viewUserDetail.docsChecklist.storageAddress };
                              const updated = users.map(u => u.id === viewUserDetail.id ? { ...u, docsChecklist: checklist } : u);
                              onUpdateUsers(updated);
                              setViewUserDetail({ ...viewUserDetail, docsChecklist: checklist });
                            }}
                            className="cursor-pointer"
                          />
                          <span className="text-slate-600 truncate font-semibold">Registry Address verified</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="checkbox" 
                            checked={viewUserDetail.docsChecklist?.businessReg ?? false} 
                            onChange={() => {
                              if (!viewUserDetail.docsChecklist) return;
                              const checklist = { ...viewUserDetail.docsChecklist, businessReg: !viewUserDetail.docsChecklist.businessReg };
                              const updated = users.map(u => u.id === viewUserDetail.id ? { ...u, docsChecklist: checklist } : u);
                              onUpdateUsers(updated);
                              setViewUserDetail({ ...viewUserDetail, docsChecklist: checklist });
                            }}
                            className="cursor-pointer"
                          />
                          <span className="text-slate-600 truncate font-semibold">Business Reg Check</span>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-slate-200 space-y-1 text-[10.5px] text-slate-650 font-mono">
                        <p>• Vehicle Profile: <strong className="text-slate-800 font-sans">{viewUserDetail.vehicleDetails.model} ({viewUserDetail.vehicleDetails.year})</strong></p>
                        <p>• Plates Registered: <strong className="text-slate-800">{viewUserDetail.vehicleDetails.plateNumber}</strong></p>
                        <p>• Fleet Sector Area: <strong className="text-slate-800">{viewUserDetail.coverageArea}</strong></p>
                      </div>

                      <div className="h-20 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100 p-2 text-center text-[10px] text-emerald-800 relative overflow-hidden select-none">
                        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1.2px,transparent_1.2px)] [background-size:12px_12px] opacity-25" />
                        <div className="z-10 flex flex-col items-center">
                          <Compass className="w-3.5 h-3.5 text-emerald-600 mb-1" />
                          <span className="font-sans">Fleet Zone Coverage Boundaries:</span>
                          <span className="font-extrabold font-mono text-[9px] text-slate-850">{viewUserDetail.coverageArea}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. Direct Collapsible Suspension Panel inside drawer instead of popups! */}
                  {drawerShowSuspend && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-3.5"
                    >
                      <p className="font-bold text-rose-800 uppercase text-[10px] tracking-wider flex items-center gap-1.5 pb-2 border-b border-rose-100 font-sans">
                        <UserX className="w-4 h-4 text-rose-600" />
                        Configure Operational Account Lockdown
                      </p>

                      <div className="space-y-3 font-sans">
                        <div>
                          <label className="block font-semibold text-rose-950 text-[10px] uppercase mb-1">
                            Locked Out Grounds Reason
                          </label>
                          <CustomDropdown
                            options={[
                              { value: 'Fraudulent listing', label: 'Fraudulent listing / Discrepancy Records' },
                              { value: 'Payment dispute', label: 'Payment dispute or Invoice Failure' },
                              { value: 'Unverified collector', label: 'Unverified collector credentials' },
                              { value: 'Policy violation', label: 'Policy violation / Toxic Materials dumping' },
                              { value: 'Other', label: 'Other compliance concern' }
                            ]}
                            value={suspendReason}
                            onChange={(val) => setSuspendReason(val)}
                            fullWidth
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-rose-950 text-[10px] uppercase mb-1">
                            Auditor Reference notes
                          </label>
                          <textarea
                            value={suspendNote}
                            onChange={(e) => setSuspendNote(e.target.value)}
                            rows={3}
                            placeholder="Type the legal or compliance reason for freezing account routing state..."
                            className="w-full p-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium"
                          />
                        </div>

                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => setDrawerShowSuspend(false)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer transition-colors"
                          >
                            Dismiss
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const user = viewUserDetail;
                              setActionLoadingMessage(`Initiating secure account freeze state for ${user.name}...`);
                              setActionStage('loading');
                              setDrawerShowSuspend(false);

                              setTimeout(() => {
                                const updated = users.map(u => {
                                  if (u.id === user.id) {
                                    const updatedUser = { 
                                      ...u, 
                                      status: 'Suspended' as const, 
                                      suspensionReason: suspendReason, 
                                      suspensionNote: suspendNote 
                                    };
                                    setViewUserDetail(updatedUser);
                                    return updatedUser;
                                  }
                                  return u;
                                });
                                onUpdateUsers(updated);
                                onAddAudit(`Suspended account ${user.name} (${user.id}). Reason: ${suspendReason}.`);

                                setActionSuccessData({
                                  title: "Account Frozen",
                                  subtitle: "Operational State: LOCKED",
                                  description: `Active operations and bookings for ${user.name} have been suspended under compliance directive: "${suspendReason}".`,
                                  details: [
                                    { label: "Target Account ID", value: user.id },
                                    { label: "Target Profile", value: user.name },
                                    { label: "Suspension Reference", value: `SUSP-DRAWER-${Math.floor(10000 + Math.random() * 89999)}` },
                                    { label: "Primary Infraction", value: suspendReason }
                                  ],
                                  type: 'warning'
                                });
                                setActionStage('success');
                                setSuspendNote('');
                              }, 1500);
                            }}
                            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-lg cursor-pointer shadow-sm transition-colors"
                          >
                            Confirm Lockdown Freezing
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Drawer Footer Actions panel */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-2.5 items-center justify-between font-sans">
                  <div className="flex flex-wrap gap-2">
                    {/* Send Reminder button: visible for Pending Approval / Pending Verification states */}
                    {(viewUserDetail.status === 'Pending Approval' || viewUserDetail.idStatus === 'Pending Verification') && (
                      <button
                        onClick={() => {
                          setReminderFeed(`Security onboarding activation instructions and credentials key dispatched to ${viewUserDetail.email}. Verification token successfully refreshed.`);
                          onAddAudit(`Dispatched security verification reminder alert token to user ${viewUserDetail.name} (${viewUserDetail.email})`);
                          setTimeout(() => setReminderFeed(null), 7000);
                        }}
                        className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-100 font-extrabold rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors"
                        title="Send secure invitation reminder instructions"
                      >
                        <BellRing className="w-3.5 h-3.5 text-sky-600" />
                        <span>Send Reminder</span>
                      </button>
                    )}

                    {viewUserDetail.status === 'Suspended' ? (
                      <button
                        onClick={() => {
                          const user = viewUserDetail;
                          setActionLoadingMessage(`Refreshing active operational tokens and lifting compliance lockdowns for ${user.name}...`);
                          setActionStage('loading');

                          setTimeout(() => {
                            const updated = users.map(u => {
                              if (u.id === user.id) {
                                const updatedUser = { 
                                  ...u, 
                                  status: 'Active' as const, 
                                  suspensionReason: undefined, 
                                  suspensionNote: undefined 
                                };
                                setViewUserDetail(updatedUser);
                                return updatedUser;
                              }
                              return u;
                            });
                            onUpdateUsers(updated);
                            onAddAudit(`Reactivated suspended account ${user.name} (${user.id}) from drawer panel.`);

                            setActionSuccessData({
                              title: "Account Reactivated Successfully",
                              subtitle: "Clearance Re-issued",
                              description: `All active locks on ${user.name}'s profile have been resolved. Dispatch, route scheduling, and audit tools are standard.`,
                              details: [
                                { label: "Account ID", value: user.id },
                                { label: "Account Name", value: user.name },
                                { label: "Clearance Level", value: "ADMIN / DRIVER FULL" },
                                { label: "Re-grant Token", value: `REGRANT-${Math.floor(100000 + Math.random() * 899999)}` }
                              ],
                              type: 'success'
                            });
                            setActionStage('success');
                          }, 1500);
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg cursor-pointer flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Reactivate Profile</span>
                      </button>
                    ) : (
                      <>
                        {/* Approve and Flag for Pending Approvals */}
                        {viewUserDetail.status === 'Pending Approval' && (
                          <button
                            onClick={() => handleApproveUser(viewUserDetail.id)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg cursor-pointer flex items-center gap-1 transition-all shadow-sm"
                          >
                            <span>✓ Approve & Verify</span>
                          </button>
                        )}

                        {!drawerShowSuspend && (
                          <button
                            onClick={() => {
                              setDrawerShowSuspend(true);
                            }}
                            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors"
                          >
                            <UserX className="w-3.5 h-3.5 text-rose-600" />
                            <span>Suspend Profile</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setViewUserDetail(null);
                      setDrawerShowSuspend(false);
                      setReminderFeed(null);
                    }}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-extrabold rounded-lg cursor-pointer border border-slate-200 text-center shrink-0 shadow-xs transition-colors"
                  >
                    Close Drawer
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. ONBOARDING / TEAM-MEMBER ADMISSION INVITE MODAL */}
      {inviteModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-xs font-sans">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-4xl p-8 grid grid-cols-1 md:grid-cols-12 gap-8 shadow-2xl text-slate-800">
            
            {/* Form Input Side (7 columns) */}
            <div className="md:col-span-7 space-y-6">
              <div className="flex items-center gap-3 border-b pb-4 border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-950 text-base leading-snug">Invite Administrative Team Member</h3>
                  <p className="text-xs text-slate-500">Provide corporate email coordinates and assign initial permission clearance level bounds.</p>
                </div>
              </div>
              
              {inviteFeedback && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-lg text-xs font-medium leading-relaxed">
                  {inviteFeedback}
                </div>
              )}

              <form onSubmit={handleInviteStaff} className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-600 uppercase text-[10px] mb-1.5 tracking-wider">
                    Staff Email Identification
                  </label>
                  <input
                    type="email"
                    value={invitedEmail}
                    onChange={(e) => setInvitedEmail(e.target.value)}
                    placeholder="teammember@dumpsite.org"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 uppercase text-[10px] mb-1.5 tracking-wider">
                    Scope of Action Clearance
                  </label>
                  <CustomDropdown
                    options={[
                      { value: 'Support Agent', label: 'Support Agent (Low level support clearance)' },
                      { value: 'Ops Admin', label: 'Ops Admin (Operational level clearance)' },
                      { value: 'Super Admin', label: 'Super Admin (Universal master clearance)' }
                    ]}
                    value={invitedRole}
                    onChange={(val) => setInvitedRole(val as AdminRole)}
                    fullWidth
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <label className="block font-bold text-rose-800 uppercase text-[10px] mb-1.5 tracking-wider">
                    Supervisor Authorization Passcode
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter security registration passcode verification"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-xs font-semibold font-mono"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-normal font-medium">
                    Invites require elevated clearance context. The passcode is logged to secure audits chronology.
                  </p>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setInviteModalOpen(false);
                      setInviteFeedback('');
                    }}
                    className="flex-1 bg-white hover:bg-slate-55 border border-slate-200 text-slate-700 font-extrabold py-2.5 rounded-xl cursor-pointer shadow-xs transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-xl shadow-md shadow-emerald-600/15 cursor-pointer transition-colors"
                  >
                    ✓ Dispatch Sign Invite
                  </button>
                </div>
              </form>
            </div>

            {/* PROCESS OUTLINE SIDE (5 columns) */}
            <div className="md:col-span-5 bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-b pb-3 border-slate-200/60">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Invitation Guideline Process
                </h4>

                <div className="space-y-3.5 text-[11px] leading-relaxed text-slate-600 font-sans">
                  <div className="flex gap-3 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0">1</span>
                    <p className="text-[10.5px]">
                      <strong>Input Corporate Data:</strong> Submit the team member's corporate coordinates and clearance level profile.
                    </p>
                  </div>

                  <div className="flex gap-3 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-800 text-[10px] flex items-center justify-center shrink-0 font-extrabold">2</span>
                    <p className="text-[10.5px]">
                      <strong>Audit Chronology:</strong> The system logs the invite transaction in the secure chronological administrative actions log.
                    </p>
                  </div>

                  <div className="flex gap-3 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-800 text-[10px] flex items-center justify-center shrink-0 font-extrabold">3</span>
                    <p className="text-[10.5px]">
                      <strong>Generate Key:</strong> The security service issues a transient single-session authentication token key automatically.
                    </p>
                  </div>

                  <div className="flex gap-3 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-800 text-[10px] flex items-center justify-center shrink-0 font-extrabold">4</span>
                    <p className="text-[10.5px]">
                      <strong>Activation Link:</strong> The participant receives a secure setup code invitation to complete activation bounds.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-[10px] text-amber-800 leading-normal font-medium mt-4 font-sans">
                <strong>Attention Required:</strong> Clearance levels restrict tab views and limit transactional moderation writes. Assign scopes correctly to align SLAs.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. TRANSACTIONAL INTERACTIVE FEEDBACK OVERLAYS */}
      <AnimatePresence>
        {actionStage === 'loading' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 z-55 text-center font-sans pointer-events-auto"
          >
            <div className="relative flex items-center justify-center w-24 h-24 mb-6">
              {/* Outer spinning ring */}
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 animate-spin" />
              {/* Secondary reverse spinning ring */}
              <div className="absolute inset-1.5 rounded-full border-4 border-transparent border-t-sky-400 border-b-sky-400 animate-spin-reverse" />
              {/* Pulsating core */}
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner animate-pulse">
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            <div className="space-y-2 max-w-sm">
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest block font-mono">
                SECURE TRANSACTION HANDSHAKE
              </span>
              <h4 className="text-sm font-bold text-white tracking-wide">
                Processing Administrative Command
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                {actionLoadingMessage}
              </p>
            </div>
          </motion.div>
        )}

        {actionStage === 'success' && actionSuccessData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 z-55 font-sans pointer-events-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 sm:p-8 max-w-md w-full text-slate-800 text-center flex flex-col items-center gap-5 relative"
            >
              {/* Brand Header Icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                actionSuccessData.type === 'success' 
                  ? 'bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-emerald-100/50' 
                  : 'bg-rose-50 border border-rose-100 text-rose-600 shadow-rose-100/50'
              }`}>
                {actionSuccessData.type === 'success' ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <AlertOctagon className="w-8 h-8" />
                )}
              </div>

              {/* Descriptions */}
              <div className="space-y-1.5">
                <span className={`text-[9px] tracking-widest uppercase font-black px-2.5 py-0.5 rounded-full border ${
                  actionSuccessData.type === 'success' 
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-100' 
                    : 'text-rose-700 bg-rose-50 border-rose-100'
                }`}>
                  {actionSuccessData.subtitle}
                </span>
                <h3 className="font-extrabold text-slate-950 text-lg tracking-tight">
                  {actionSuccessData.title}
                </h3>
                <p className="text-xs text-slate-500 leading-normal max-w-sm mx-auto">
                  {actionSuccessData.description}
                </p>
              </div>

              {/* Details table receipt */}
              <div className="w-full bg-slate-50/80 rounded-2xl border border-slate-150 p-4 space-y-2 text-left font-mono">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 border-b border-slate-200/80 pb-2 flex justify-between items-center">
                  <span>AUDIT RECEIPT RECORD</span>
                  <span className={`text-[9px] font-extrabold uppercase ${
                    actionSuccessData.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    ● COMPLIANT
                  </span>
                </div>
                {actionSuccessData.details.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-baseline gap-4 text-[10.5px]">
                    <span className="text-slate-400 font-medium uppercase tracking-tight shrink-0">{item.label}</span>
                    <span className="text-slate-800 font-bold truncate max-w-[210px] text-right" title={item.value}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={() => setActionStage('idle')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-950 active:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-transform active:scale-98 cursor-pointer"
              >
                Continue Operations
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
