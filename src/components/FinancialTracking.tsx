import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Download, 
  HelpCircle, 
  Award, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  FileSpreadsheet, 
  ShieldAlert,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { Transaction, TransactionType, TransactionStatus, NonCashReward, AdminRole } from '../types';
import { CustomDropdown } from './CustomDropdown';

interface FinancialTrackingProps {
  transactions: Transaction[];
  onUpdateTransactions: (updated: Transaction[]) => void;
  nonCashRewards: NonCashReward[];
  onUpdateRewards: (updated: NonCashReward[]) => void;
  onAddAudit: (action: string) => void;
  currentRole: AdminRole;
}

export default function FinancialTracking({ 
  transactions, 
  onUpdateTransactions, 
  nonCashRewards, 
  onUpdateRewards, 
  onAddAudit, 
  currentRole 
}: FinancialTrackingProps) {

  // Inner sub-views
  const [finSubTab, setFinSubTab] = useState<'Overview' | 'Ledger' | 'Non-Cash Rewards'>('Overview');

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'All'>('All');
  const [timeframe, setTimeframe] = useState<'Today' | 'Week' | 'Month'>('Month');

  // Selected Detail Models
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [exportModalScope, setExportModalScope] = useState(false);
  const [overlayProjected, setOverlayProjected] = useState(true);

  // Check role authorization bounds
  // (Financial Tracking: Super Admin & Ops Admin only)
  const isAuthorized = currentRole === 'Super Admin' || currentRole === 'Ops Admin';

  if (!isAuthorized) {
    return (
      <div className="bg-white rounded-2xl border border-rose-100 p-8 text-center max-w-2xl mx-auto space-y-4 animate-fade-in my-10">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Permission Restrained — Section Restricted</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Access to MODULE 05 (Financial Tracking Ledger, Cashflows, and Revenue Forecast tools) is restricted to <strong>Super Admin</strong> and <strong>Ops Admin</strong>. 
        </p>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] text-slate-500 font-mono italic">
          Logged in role: "{currentRole}" 
        </div>
        <p className="text-[11px] text-slate-400">
          Use the quick switcher at the top right to grant yourself Super Admin or Ops Admin permissions to inspect these financial layers.
        </p>
      </div>
    );
  }

  // Cashflows calculations
  const calculateTotals = () => {
    let inflows = 0;
    let outflows = 0;
    transactions.forEach(tx => {
      if (tx.status === 'Settled' || tx.status === 'Processing') {
        if (tx.amount > 0) inflows += tx.amount;
        else outflows += Math.abs(tx.amount);
      }
    });
    return { inflows, outflows, balance: inflows - outflows };
  };

  const totals = calculateTotals();

  // Retry Failed payout (Super Admin only trigger)
  const handleRetryPayout = (txId: string) => {
    if (currentRole !== 'Super Admin') {
      alert("Requires Super Admin role to re-route payout channels!");
      return;
    }

    const updated = transactions.map(tx => {
      if (tx.id === txId) {
        return {
          ...tx,
          status: 'Processing' as const,
          auditTrail: [
            ...tx.auditTrail,
            { timestamp: "2026-06-07 21:43", status: 'Processing' as const, note: "Super Admin initiated retry callback on payment server." }
          ]
        };
      }
      return tx;
    });

    onUpdateTransactions(updated);
    onAddAudit(`Initiated Flutterwave payout retry routine for payout #_${txId}`);
    
    // Sync Selected
    const found = updated.find(tx => tx.id === txId);
    if (found) setSelectedTx(found);
    
    alert(`Re-route dispatch triggered successfully for ${txId}! Status set to Processing.`);
  };

  const handleDispatchReward = (id: string) => {
    const updated = nonCashRewards.map(reward => {
      if (reward.id === id) {
        return { ...reward, status: 'Dispatched' as const };
      }
      return reward;
    });
    onUpdateRewards(updated);
    onAddAudit(`Dispatched non-cash ecological reward parcel reference #${id}`);
  };

  // Export CSV
  const triggerCsvExport = () => {
    onAddAudit(`Finances ledger CSV file exported. Filterscope type: '${typeFilter}', status: '${statusFilter}'`);
    setExportModalScope(false);
    
    // CSV file download simulation
    const headers = "TX_ID,Date,Type,Party,Amount,Status,ProcessorRef\n";
    const body = transactions.map(tx => `${tx.id},${tx.date},${tx.type},${tx.party},${tx.amount},${tx.status},${tx.processorReference}`).join('\n');
    const blob = new Blob([headers + body], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `WasteCycle_Transaction_Ledger_${timeframe}.csv`);
    a.click();
  };

  // Searching LEDGER lists
  const filteredLedger = transactions.filter(tx => {
    const matchesSearch = tx.party.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.processorReference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Financial Auditing & Revenue</h2>
          <p className="text-xs text-slate-500 font-medium">Audit subscription inflows, monitor reward channel outflows, and authorize payout retries.</p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto select-none">
          <button 
            onClick={() => setFinSubTab('Overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${finSubTab === 'Overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Cashflow Overview
          </button>
          
          <button 
            onClick={() => setFinSubTab('Ledger')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${finSubTab === 'Ledger' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Transaction Ledger ({transactions.length})
          </button>

          <button 
            onClick={() => setFinSubTab('Non-Cash Rewards')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${finSubTab === 'Non-Cash Rewards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Non-Cash Rewards
          </button>
        </div>
      </div>

      {/* --- SUBVIEW: FINANCIAL OVERVIEW & GRAPHS --- */}
      {finSubTab === 'Overview' && (
        <div className="space-y-6">
          
          {/* Cashflow total blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Inflows Block */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inflows ({timeframe})</p>
                <p className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                  ₦{(totals.inflows).toLocaleString()}
                </p>
                <p className="text-[10px] text-emerald-600 font-medium">Subscriptions & Fee splits</p>
              </div>
            </div>

            {/* Outflows Block */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <ArrowDownLeft className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Outflows ({timeframe})</p>
                <p className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                  ₦{(totals.outflows).toLocaleString()}
                </p>
                <p className="text-[10px] text-orange-600 font-medium font-sans">Payouts & Eco Incentives</p>
              </div>
            </div>

            {/* Balances Block */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-3 opacity-5">
                <Sparkles className="w-32 h-32" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6 animate-pulse" />
              </div>
              <div className="z-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net Revenue</p>
                <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                  ₦{(totals.balance).toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400">Direct operational net yields</p>
              </div>
            </div>

          </div>

          {/* CEO Revenue Line Chart/Stacked Bar simulation with Overlay */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Strategic Financial overlay</span>
                <h3 className="text-sm font-bold text-slate-900">Revenue Stream Contribution & MRR Pipeline</h3>
              </div>

              {/* Toggle switch for projected */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Show Projected MRR Overlay:</span>
                <button
                  onClick={() => setOverlayProjected(!overlayProjected)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${overlayProjected ? 'bg-emerald-600' : 'bg-slate-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${overlayProjected ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* MRR Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">MRR KPI Baseline</span>
                  <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">₦480,000</p>
                  <p className="text-[10px] text-emerald-600 font-medium">✓ Steady 18% growth month-over-month</p>
                </div>
                <p className="text-[10px] text-slate-400 leading-snug pt-3 border-t border-slate-200">
                  Calculated from 32 active commercial collectors and sorting facility memberships.
                </p>
              </div>

              {/* Trends bar charts representation */}
              <div className="md:col-span-3 space-y-4">
                <p className="text-xs font-bold text-slate-500">Monthly Contribution Trends (Est. Tons processed vs Fees):</p>
                
                <div className="space-y-2 text-xs">
                  {/* Row 1 */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600 font-mono font-bold">Collector Subscriptions</span>
                      <span className="font-mono text-slate-500">₦285,000 (60%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-600 h-full" style={{ width: '60%' }} />
                      {overlayProjected && <div className="bg-emerald-300 h-full w-[15%] animate-pulse" title="Projected pipeline expansion" />}
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600 font-mono font-bold">Dumping Webhook Processing Fees</span>
                      <span className="font-mono text-slate-500">₦142,500 (30%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                      <div className="bg-teal-600 h-full" style={{ width: '30%' }} />
                      {overlayProjected && <div className="bg-teal-300 h-full w-[10%] animate-pulse" />}
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600 font-mono font-bold">Premium Enterprise Sorting Tier</span>
                      <span className="font-mono text-slate-500">₦47,500 (10%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                      <div className="bg-sky-600 h-full" style={{ width: '10%' }} />
                      {overlayProjected && <div className="bg-sky-300 h-full w-[8%] animate-pulse" />}
                    </div>
                  </div>
                </div>

                {overlayProjected && (
                  <p className="text-[10px] text-emerald-700 italic font-mono bg-emerald-50 px-2.5 py-1.5 rounded border border-emerald-100">
                    💡 **Projected Overlay Engaged:** Projected MRR expansion indicates a further ₦110,000 pipeline as Apapa region collectors resume subscription routes.
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* --- SUBVIEW: TRANSACTION LEDGER TABLES --- */}
      {finSubTab === 'Ledger' && (
        <div className="space-y-4 font-sans text-xs">
          
          {/* Filters shelf */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-100">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute inset-y-0 left-0 pl-3 flex items-center h-full text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search transaction logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 font-sans">
              <CustomDropdown
                options={[
                  { value: 'All', label: 'All Types' },
                  { value: 'Subscription', label: 'Subscriptions' },
                  { value: 'Payout', label: 'Payouts' },
                  { value: 'Fee', label: 'Fees' },
                  { value: 'Prize', label: 'Prizes' }
                ]}
                value={typeFilter}
                onChange={(val) => setTypeFilter(val as any)}
              />

              <CustomDropdown
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'Settled', label: 'Settled' },
                  { value: 'Processing', label: 'Processing' },
                  { value: 'Failed', label: 'Failed' }
                ]}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val as any)}
              />

              <button
                onClick={() => setExportModalScope(true)}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded font-bold cursor-pointer hover:bg-emerald-700 flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export ledger CSV</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Table */}
            <div className="lg:col-span-8 bg-white p-4 rounded-xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[9px] tracking-wider border-b border-slate-100">
                      <th className="p-3">TX_ID Ref</th>
                      <th className="p-3">Logged Date</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Party Name</th>
                      <th className="p-3">Amount Raw</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700">
                    {filteredLedger.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 font-mono">No accounts/transactions matched ledger filters.</td>
                      </tr>
                    ) : (
                      filteredLedger.map((tx) => (
                        <tr 
                          key={tx.id} 
                          onClick={() => setSelectedTx(tx)}
                          className={`cursor-pointer hover:bg-slate-50 transition-colors ${selectedTx?.id === tx.id ? 'bg-emerald-50/40 font-semibold' : ''}`}
                        >
                          <td className="p-3 font-mono text-slate-400 font-bold">{tx.id}</td>
                          <td className="p-3 font-mono text-[10px] text-slate-400">{tx.date}</td>
                          <td className="p-3">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              tx.type === 'Subscription' ? 'bg-sky-50 text-sky-700' :
                              tx.type === 'Payout' ? 'bg-orange-50 text-orange-700' :
                              tx.type === 'Fee' ? 'bg-slate-100 text-slate-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="p-3 text-slate-900 font-bold">{tx.party}</td>
                          <td className={`p-3 font-mono font-bold ${tx.amount > 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                            {tx.amount > 0 ? '+' : ''}₦{(tx.amount).toLocaleString()}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                              tx.status === 'Settled' ? 'bg-emerald-50 text-emerald-700' :
                              tx.status === 'Processing' ? 'bg-amber-50 text-amber-700' :
                              'bg-rose-50 text-rose-700'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedTx(tx)}
                              className="text-[10px] text-emerald-600 font-bold hover:underline cursor-pointer"
                            >
                              Detail Panel
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inspect panel */}
            <div className="lg:col-span-4">
              {selectedTx ? (
                <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase block">Processor Audit Log</span>
                      <h4 className="text-sm font-bold text-slate-900">{selectedTx.id} details</h4>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">{selectedTx.processorReference}</span>
                  </div>

                  <div className="space-y-4 text-xs font-semibold">
                    <p>• Transacting party: <span className="font-bold text-slate-900">{selectedTx.party}</span></p>
                    <p>• Settlement channel: <span className="font-mono text-slate-600">{selectedTx.processorReference.startsWith('OPY') ? 'OPay Web Gateway' : 'Flutterwave Core API'}</span></p>
                    
                    {/* gross / fee / net breakdown */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 font-mono text-[11px] text-slate-600">
                      <div className="flex justify-between">
                        <span>Gross Transaction payload:</span>
                        <span>₦{(selectedTx.grossAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-rose-600">
                        <span>Processor gateway fee:</span>
                        <span>-₦{(selectedTx.feeAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-1.5 text-slate-900 font-bold text-xs">
                        <span>Net operational credit:</span>
                        <span>₦{(selectedTx.netAmount).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* audit status logs */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Status progression checks:</span>
                      <div className="space-y-2 pl-3 border-l border-slate-200 font-normal">
                        {selectedTx.auditTrail.map((log, idx) => (
                          <div key={idx} className="relative">
                            <p className="font-bold text-slate-800 text-[10.5px]">Status initialized: {log.status}</p>
                            <p className="text-[9.5px] text-slate-400 font-mono">{log.timestamp}</p>
                            {log.note && <p className="text-[10px] text-slate-500 italic mt-0.5">Note: "{log.note}"</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* failed payout retry action (Super Admin restricted) */}
                    {selectedTx.status === 'Failed' && (
                      <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg space-y-2.5">
                        <p className="text-[10.5px] text-rose-800 font-medium leading-relaxed">
                          This payout failed due to recipient bank status validation overrides. Click below to retry.
                        </p>
                        
                        {currentRole === 'Super Admin' ? (
                          <button
                            onClick={() => handleRetryPayout(selectedTx.id)}
                            className="w-full text-center bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded transition-all cursor-pointer text-xs"
                          >
                            ✓ Authorize Handshake Payout Retry
                          </button>
                        ) : (
                          <p className="text-[10px] text-rose-600 text-center font-bold">🔒 Super Admin authority required to retry automated OPay gateway transfers.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center bg-white p-5 rounded-xl border border-dashed text-slate-400">Click any financial row in the transaction table to open the detailed gateway inspect panel.</p>
              )}
            </div>

          </div>

        </div>
      )}

      {/* --- SUBVIEW: NON CASH REWARDS --- */}
      {finSubTab === 'Non-Cash Rewards' && (
        <div className="bg-white p-5 rounded-xl border border-slate-100 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight inline-flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                Non-Monetary Ecological Incentive Records
              </h3>
              <p className="text-xs text-slate-500">Log points redemptions, manage physical dispatch packaging, and route ecological gears.</p>
            </div>
            
            <span className="text-[10px] bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold text-emerald-700 border border-emerald-100">
              Audit Enabled
            </span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[9px] tracking-wider border-b border-slate-50">
                  <th className="p-2.5">Claim Ref</th>
                  <th className="p-2.5">Member Name</th>
                  <th className="p-2.5">Eco Gear Reward Description</th>
                  <th className="p-2.5">Points Expended</th>
                  <th className="p-2.5">Redemption Date</th>
                  <th className="p-2.5">Dispatch State</th>
                  <th className="p-2.5 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {nonCashRewards.map((reward) => (
                  <tr key={reward.id}>
                    <td className="p-2.5 font-mono text-slate-400 font-bold">{reward.id}</td>
                    <td className="p-2.5 font-bold text-slate-900">{reward.userName}</td>
                    <td className="p-2.5 text-slate-600">{reward.rewardName}</td>
                    <td className="p-2.5 font-mono text-emerald-600 font-bold">{reward.pointsRedeemed} pts</td>
                    <td className="p-2.5 font-mono font-normal text-slate-400">{reward.issuedDate}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        reward.status === 'Pending Dispatch' ? 'bg-amber-100 text-amber-800' :
                        reward.status === 'Dispatched' ? 'bg-sky-50 text-sky-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {reward.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      {reward.status === 'Pending Dispatch' ? (
                        <button
                          onClick={() => handleDispatchReward(reward.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] cursor-pointer"
                        >
                          Mark Dispatched
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">✓ Complete</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- CSV SCOPE FILTER EXPORT CONFIRMATION MODAL --- */}
      {exportModalScope && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-100 w-full max-w-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Verify Spreadsheet Scope Clearance</h3>
            <p className="text-xs text-slate-500 leading-normal">
              You are downloading financial ledger entries based on the following configured filtering rules:
            </p>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono space-y-1.5 text-slate-600">
              <p>• Auth Admin Name: <strong>{currentRole}</strong></p>
              <p>• Type Rule scope: <strong>{typeFilter}</strong></p>
              <p>• status scope: <strong>{statusFilter}</strong></p>
              <p>• Timeframe constraints: <strong>{timeframe}</strong></p>
            </div>

            <p className="text-[10px] text-rose-600 italic">
              Note: System policy dictates that financial downloads map directly to action audit trail files.
            </p>

            <div className="flex justify-end gap-2 text-xs font-bold pt-2">
              <button 
                onClick={() => setExportModalScope(false)}
                className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded cursor-pointer"
              >
                Go Back
              </button>
              <button 
                onClick={triggerCsvExport}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
              >
                ✓ Finalize spreadsheet export
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
