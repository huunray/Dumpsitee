/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  initialUsers, 
  initialComplaints, 
  initialCollections, 
  initialTransactions, 
  initialNonCashRewards, 
  initialNotificationsHistory, 
  initialDisruptions, 
  initialAuditLogs 
} from './data';
import { AdminUser, AdminRole, UserProfile, Complaint, CollectionItem, Transaction, NonCashReward, NotificationHistoryItem, ServiceDisruption, AuditLog } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AuthPage from './components/AuthPage';

// Subcomponents
import DashboardOverview from './components/DashboardOverview';
import UserRoleManagement from './components/UserRoleManagement';
import ComplaintManagement from './components/ComplaintManagement';
import CollectionMonitoring from './components/CollectionMonitoring';
import FinancialTracking from './components/FinancialTracking';
import NotificationSystem from './components/NotificationSystem';

export default function App() {
  // Session Access Controls
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Unified Reactive Central states
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [collections, setCollections] = useState<CollectionItem[]>(initialCollections);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [rewards, setRewards] = useState<NonCashReward[]>(initialNonCashRewards);
  const [notifHistory, setNotifHistory] = useState<NotificationHistoryItem[]>(initialNotificationsHistory);
  const [disruptions, setDisruptions] = useState<ServiceDisruption[]>(initialDisruptions);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Helper routine to append security action logs dynamically
  const handleAddAudit = (actionText: string) => {
    if (!currentAdmin) return;
    const newLog: AuditLog = {
      id: `AUD-11${Math.floor(Math.random() * 90) + 10}`,
      timestamp: "2026-06-07 21:43",
      adminName: currentAdmin.name,
      adminRole: currentAdmin.role,
      action: actionText
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleRoleChange = (newRole: AdminRole) => {
    if (!currentAdmin) return;
    
    let resolvedName = 'Bolanle Yusuf';
    let resolvedEmail = currentAdmin.email;
    if (newRole === 'Ops Admin') {
      resolvedName = 'Olumide Alao';
      resolvedEmail = 'ops.admin@dumpsite.org';
    } else if (newRole === 'Support Agent') {
      resolvedName = 'Chidi Nwachukwu';
      resolvedEmail = 'support.desk@dumpsite.org';
    } else {
      resolvedName = 'Bolanle Yusuf';
      resolvedEmail = 'super.admin@dumpsite.org';
    }

    const updatedAdmin: AdminUser = {
      ...currentAdmin,
      role: newRole,
      name: resolvedName,
      email: resolvedEmail
    };

    setCurrentAdmin(updatedAdmin);
    
    // Commit to logs
    const newLog: AuditLog = {
      id: `AUD-11${Math.floor(Math.random() * 90) + 10}`,
      timestamp: "2026-06-07 21:43",
      adminName: resolvedName,
      adminRole: newRole,
      action: `Administative persona shell swapped to [${newRole}]`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleLogin = (admin: AdminUser) => {
    setCurrentAdmin(admin);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
  };

  // Determine missed collections count (for circular red sidebar badge layout)
  const missedCount = collections.filter(c => c.status === 'Missed').length;

  if (!currentAdmin) {
    return <AuthPage onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] flex font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-800">
      
      {/* Navigation Rail - fixed column */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        missedCollectionsCount={missedCount} 
        currentRole={currentAdmin.role}
      />

      {/* Main Container - offset by sidebar width (w-48 = pl-48) */}
      <div className="flex-1 min-h-screen flex flex-col pl-48">
        
        {/* Premium Header Dashboard Layout - sticky top */}
        <Header 
          currentAdmin={currentAdmin} 
          onRoleChange={handleRoleChange} 
          onLogout={handleLogout} 
          notificationsHistory={notifHistory}
          onUpdateNotifications={setNotifHistory}
        />

        {/* Dynamic Panel Workspace */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <div className="animate-fade-in duration-250">
            {activeTab === 'dashboard' && (
              <DashboardOverview 
                users={users} 
                collections={collections} 
                complaints={complaints}
                missedCount={missedCount}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'users' && (
              <UserRoleManagement 
                users={users} 
                onUpdateUsers={setUsers} 
                auditLogs={auditLogs}
                onAddAudit={handleAddAudit}
                currentRole={currentAdmin.role}
              />
            )}

            {activeTab === 'complaints' && (
              <ComplaintManagement 
                complaints={complaints} 
                onUpdateComplaints={setComplaints} 
                onAddAudit={handleAddAudit}
                currentAdmin={currentAdmin}
              />
            )}

            {activeTab === 'collections' && (
              <CollectionMonitoring 
                collections={collections} 
                onUpdateCollections={setCollections} 
                onAddAudit={handleAddAudit}
                currentRole={currentAdmin.role}
              />
            )}

            {activeTab === 'finances' && (
              <FinancialTracking 
                transactions={transactions} 
                onUpdateTransactions={setTransactions} 
                nonCashRewards={rewards}
                onUpdateRewards={setRewards}
                onAddAudit={handleAddAudit}
                currentRole={currentAdmin.role}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationSystem 
                notificationsHistory={notifHistory} 
                onUpdateHistory={setNotifHistory} 
                serviceDisruptions={disruptions}
                onUpdateDisruptions={setDisruptions}
                users={users}
                onAddAudit={handleAddAudit}
                adminName={currentAdmin.name}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
