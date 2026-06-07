import React, { useState } from 'react';
import { 
  Menu, 
  MapPin, 
  Compass, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Navigation, 
  Upload, 
  Edit3, 
  ArrowRight,
  UserCheck,
  Search,
  FileSpreadsheet
} from 'lucide-react';
import { CollectionItem, CollectionStatus, AdminRole } from '../types';
import { CustomDropdown } from './CustomDropdown';

interface CollectionMonitoringProps {
  collections: CollectionItem[];
  onUpdateCollections: (updated: CollectionItem[]) => void;
  onAddAudit: (action: string) => void;
  currentRole: AdminRole;
}

export default function CollectionMonitoring({ 
  collections, 
  onUpdateCollections, 
  onAddAudit, 
  currentRole 
}: CollectionMonitoringProps) {
  
  // Monitoring Modes
  const [monitorMode, setMonitorMode] = useState<CollectionStatus | 'Map View'>('Scheduled');
  const [selectedCol, setSelectedCol] = useState<CollectionItem | null>(collections[0] || null);

  // Search/Filters states
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('All');
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overridedWeight, setOverridedWeight] = useState('');
  const [overrideReason, setOverrideReason] = useState('');

  // Reassign States
  const [reassigningId, setReassigningId] = useState<string | null>(null);
  const [newCollectorName, setNewCollectorName] = useState('Green Collect Ltd');

  // Trigger reassign collector
  const handleReassignCollector = (id: string) => {
    const updated = collections.map(c => {
      if (c.id === id) {
        return { 
          ...c, 
          collector: newCollectorName,
          status: 'Scheduled' as const // reset missed back to scheduled if assigned
        };
      }
      return c;
    });
    onUpdateCollections(updated);
    onAddAudit(`Reassigned collector for job ${id} manually to ${newCollectorName}`);
    
    // sync selected
    if (selectedCol?.id === id) {
      setSelectedCol({ ...selectedCol, collector: newCollectorName, status: 'Scheduled' as const });
    }
    setReassigningId(null);
  };

  // Trigger Notify Dumper
  const handleNotifyDumper = (id: string, name: string) => {
    onAddAudit(`Dispatched urgent missed pickup apology push notification template to dumper ${name} (#${id})`);
    alert(`Apology notification dispatched to ${name} regarding Collection #${id}!`);
  };

  // Trigger Weight override audit note (Super Admin restricted)
  const handleWeightOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCol) return;
    const weightNum = parseFloat(overridedWeight);
    if (isNaN(weightNum)) {
      alert("Please enter a valid numeric value.");
      return;
    }

    const updated = collections.map(c => {
      if (c.id === selectedCol.id) {
        return {
          ...c,
          confirmedWeight: weightNum,
          discrepancyFlag: false, // reset or keep based on logic
          auditNote: overrideReason
        };
      }
      return c;
    });

    onUpdateCollections(updated);
    onAddAudit(`Super Admin override weight for ${selectedCol.id} to ${weightNum} tons with note: "${overrideReason}"`);
    
    setSelectedCol({
      ...selectedCol,
      confirmedWeight: weightNum,
      discrepancyFlag: false,
      auditNote: overrideReason
    });

    setShowOverrideModal(false);
    setOverridedWeight('');
    setOverrideReason('');
  };

  // Mock Anonymized CSV export download
  const handleCsvExport = () => {
    onAddAudit(`Exported anonymized collections telemetry spreadsheet data.`);
    
    // Simulate generation
    const headers = "Collection_ID,Dumper_Anon,Collector_Anon,Category,Weight_Tons,Neighborhood,Status\n";
    const body = collections.map(c => `${c.id},D_USER,C_OPERATOR,${c.wasteCategory},${c.confirmedWeight || 'Pending'},${c.neighborhood},${c.status}`).join('\n');
    const blob = new Blob([headers + body], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `WasteCycle_Collections_${monitorMode}_Anonymized.csv`);
    a.click();
  };

  // Map representation data
  // Color-coded dots coordinates
  const mapDots = [
    { id: "COL-7729", x: 25, y: 35, neighborhood: "Lekki Phase 1", color: "bg-amber-500", status: "Scheduled", dumper: "Adebayo Chukwu" },
    { id: "COL-7730", x: 45, y: 65, neighborhood: "Yaba", color: "bg-amber-500", status: "Scheduled", dumper: "Olumide Johnson" },
    { id: "COL-7731", x: 60, y: 25, neighborhood: "Surulere", color: "bg-amber-300", status: "Scheduled", dumper: "Vivian Cole" },
    { id: "COL-7601", x: 30, y: 55, neighborhood: "Victoria Island", color: "bg-emerald-500", status: "Completed", dumper: "Chioma Nnaji" },
    { id: "COL-7602", x: 38, y: 40, neighborhood: "Iru", color: "bg-emerald-500", status: "Completed", dumper: "Kemi Adesina" },
    { id: "COL-7603", x: 15, y: 70, neighborhood: "Ikoyi", color: "bg-emerald-500", status: "Completed", dumper: "Adejoke Coker" },
    { id: "COL-7501", x: 80, y: 15, neighborhood: "Ikeja", color: "bg-rose-500", status: "Missed", dumper: "Bisi Akande" },
    { id: "COL-7502", x: 50, y: 80, neighborhood: "Yaba", color: "bg-rose-500", status: "Missed", dumper: "Obi Nwosu" }
  ];

  // Filters calculation
  const filteredList = collections.filter(c => {
    const matchesMode = c.status === monitorMode;
    const matchesNeighborhood = neighborhoodFilter === 'All' || c.neighborhood === neighborhoodFilter;
    return matchesMode && matchesNeighborhood;
  });

  const getNeighborhoodsList = () => {
    return Array.from(new Set(collections.map(c => c.neighborhood)));
  };

  const isSuperAdmin = currentRole === 'Super Admin';

  return (
    <div className="space-y-6">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Collection Monitoring Center</h2>
          <p className="text-xs text-slate-500 font-medium">Verify vehicle schedules, audit actual weight records, and map geographical dumping distribution.</p>
        </div>

        {/* Exporter */}
        <button 
          onClick={handleCsvExport}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export CSV Telemetry</span>
        </button>
      </div>

      {/* Primary tab bar controllers */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start select-none">
        {(['Scheduled', 'Completed', 'Missed', 'Map View'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setMonitorMode(mode)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              monitorMode === mode 
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {mode === 'Map View' ? '🗺️ Map View' : `${mode} Cases`}
          </button>
        ))}
      </div>

      {/* Neighbourhood and telemetry Filters */}
      <div className="flex gap-2 items-center bg-white p-3.5 rounded-xl border border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" /> Filter Zone Location:
        </span>
        <CustomDropdown
          options={[
            { value: 'All', label: 'All Neighborhood Areas' },
            ...getNeighborhoodsList().map((loc) => ({ value: loc, label: loc }))
          ]}
          value={neighborhoodFilter}
          onChange={(val) => setNeighborhoodFilter(val)}
        />
      </div>

      {/* --- RENDER MAP VIEW IF SELECTED --- */}
      {monitorMode === 'Map View' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Visual Interactive Map Wrapper */}
          <div className="lg:col-span-8 bg-slate-50 border border-slate-200 rounded-2xl h-[400px] relative p-5 overflow-hidden shadow-inner flex items-center justify-center select-none">
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70" />
            
            {/* Neighborhood Boundaries illustration */}
            <div className="absolute inset-10 border border-dashed border-emerald-500/10 rounded-full animate-pulse" />
            <div className="absolute inset-28 border border-dashed border-sky-500/10 rounded-full" />

            {/* Geographical Markers */}
            {mapDots.filter(dot => neighborhoodFilter === 'All' || dot.neighborhood === neighborhoodFilter).map((dot) => {
              const isSelected = selectedCol?.id === dot.id;
              return (
                <button
                  key={dot.id}
                  style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                  onClick={() => {
                    const found = collections.find(c => c.id === dot.id);
                    if (found) setSelectedCol(found);
                  }}
                  className={`absolute w-3.5 h-3.5 rounded-full ring-4 ${dot.color} transition-all cursor-pointer transform hover:scale-150 ${
                    isSelected ? 'ring-emerald-600 animate-bounce bg-emerald-950 scale-125' : 'ring-white'
                  }`}
                  title={`${dot.id} - ${dot.dumper} (${dot.neighborhood}) - status: ${dot.status}`}
                />
              );
            })}

            {/* Map Legend Banner floating at bottom */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-700 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Waste Map Dots Legend:</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Collected</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Scheduled</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Missed Target</span>
              </div>
            </div>
          </div>

          {/* Quick inspect details on hover/click */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Geographical Inspector</h3>
            {selectedCol ? (
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="font-bold text-slate-400">{selectedCol.id}</span>
                  <span className="font-bold text-emerald-600">{selectedCol.status}</span>
                </div>
                <p>• Dumper: <strong>{selectedCol.dumper}</strong></p>
                <p>• Mapped collector: <strong>{selectedCol.collector}</strong></p>
                <p>• Neighborhood Zone: <strong>{selectedCol.neighborhood}</strong></p>
                <p>• Weight declared: <strong>{selectedCol.volume}</strong></p>
                {selectedCol.confirmedWeight !== undefined && (
                  <p>• Physical weighbridge payload: <strong className="text-emerald-700">{selectedCol.confirmedWeight} Tons</strong></p>
                )}
                
                <button
                  onClick={() => setMonitorMode(selectedCol.status)}
                  className="w-full text-center bg-slate-50 hover:bg-slate-150 py-2 rounded border border-slate-200 text-[10px] font-bold text-slate-600 transition-all cursor-pointer"
                >
                  Retrieve Case Log Tables →
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-10 font-mono">Select a map coordinate dot to trace payload telemetry.</p>
            )}
          </div>

        </div>
      ) : (
        /* --- RENDER DATA TABLES BASED ON ACTIVE TABS --- */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main collections monitor lists table */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase mb-3 px-1">{monitorMode} Collections Queue</h3>
            
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[9px] border-b border-slate-100">
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Dumper Name</th>
                    <th className="p-3">Assigned Operator</th>
                    <th className="p-3">Waste Stream Category</th>
                    <th className="p-3">Volume Est.</th>
                    
                    {/* Unique columns based on tab */}
                    {monitorMode === 'Completed' && (
                      <>
                        <th className="p-3">Weighed Payload</th>
                        <th className="p-3">Timestamp</th>
                      </>
                    )}
                    {monitorMode === 'Scheduled' && (
                      <th className="p-3">Operational Frame</th>
                    )}
                    {monitorMode === 'Missed' && (
                      <th className="p-3 text-rose-600">SLA Lag Clock</th>
                    )}

                    <th className="p-3 text-right">Action Desk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-slate-400 font-mono">
                        No active collections matched filters under the {monitorMode} tab.
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((col) => {
                      const isHighlightedMin = col.status === 'Missed';
                      return (
                        <tr 
                          key={col.id} 
                          className={`cursor-pointer transition-colors ${
                            selectedCol?.id === col.id ? 'bg-emerald-50/40 font-semibold' : 'hover:bg-slate-50/70'
                          } ${isHighlightedMin ? 'bg-rose-50/25' : ''}`}
                          onClick={() => setSelectedCol(col)}
                        >
                          <td className="p-3 font-mono text-slate-400 font-bold">{col.id}</td>
                          <td className="p-3 text-slate-900 font-bold">{col.dumper}</td>
                          <td className="p-3">{col.collector}</td>
                          <td className="p-3 text-[11px] italic text-slate-500">{col.wasteCategory}</td>
                          <td className="p-3 font-mono text-[10.5px]">{col.volume}</td>
                          
                          {/* Completed tab dynamic layout columns */}
                          {monitorMode === 'Completed' && (
                            <>
                              <td className="p-3 font-mono text-emerald-700 font-bold">
                                {col.confirmedWeight ? `${col.confirmedWeight} T` : 'Unweighed'}
                              </td>
                              <td className="p-3 font-mono text-slate-400 text-[10px]">{col.timestamp}</td>
                            </>
                          )}

                          {/* Scheduled tab dynamic layout columns */}
                          {monitorMode === 'Scheduled' && (
                            <td className="p-3 font-semibold text-slate-600 font-sans">{col.scheduledWindow}</td>
                          )}

                          {/* Missed tab dynamic layout columns */}
                          {monitorMode === 'Missed' && (
                            <td className="p-3 font-mono text-rose-600 font-bold animate-pulse text-[11px]">
                              ⚠️ OVERRUN {col.ageHours} Hrs
                            </td>
                          )}

                          <td className="p-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                            {monitorMode === 'Scheduled' && (
                              <button
                                onClick={() => setReassigningId(col.id)}
                                className="px-2 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-700 font-bold transition-all cursor-pointer"
                              >
                                Reassign
                              </button>
                            )}

                            {monitorMode === 'Missed' && (
                              <div className="flex gap-1 justify-end">
                                <button
                                  onClick={() => setReassigningId(col.id)}
                                  className="px-2 py-1 text-[10px] bg-rose-600 hover:bg-rose-700 text-white rounded font-bold transition-all cursor-pointer"
                                  title="Dispatch new rescue collector"
                                >
                                  Reassign
                                </button>
                                <button
                                  onClick={() => handleNotifyDumper(col.id, col.dumper)}
                                  className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-900 text-white rounded font-bold transition-all cursor-pointer"
                                  title="Dispatch push apology note to user client"
                                >
                                  Apologize
                                </button>
                              </div>
                            )}

                            {monitorMode === 'Completed' && (
                              <span className="text-[10px] text-emerald-600 font-bold">✔ Locked</span>
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

          {/* RIGHT SIDE: COLLECTION DETAIL VIEW (4 Columns) */}
          <div className="lg:col-span-4">
            {selectedCol ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase block">Audit Lifecycle Logs</span>
                    <h4 className="text-sm font-bold text-slate-900">Collection details ({selectedCol.id})</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    selectedCol.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                    selectedCol.status === 'Scheduled' ? 'bg-sky-50 text-sky-700' :
                    'bg-rose-50 text-rose-700 animate-pulse'
                  }`}>
                    {selectedCol.status}
                  </span>
                </div>

                {/* LIFECYCLE CHRONICLE STEPPER */}
                <div className="space-y-4">
                  <span className="text-[9px] font-semibold uppercase text-slate-400 tracking-wider block">Operational Timeline Tracking</span>
                  
                  <div className="relative pl-5 border-l border-slate-100 space-y-4 text-xs font-medium">
                    {/* Lifecycle Step 1 (Assigned) */}
                    <div className="relative">
                      <div className="absolute -left-[24.5px] top-1 w-2 h-2 rounded-full bg-emerald-500" />
                      <div>
                        <p className="text-slate-800 font-bold">Stage 1: Collection Assigned</p>
                        <p className="text-[10px] text-slate-400 font-mono">Triggered via WasteCycle router</p>
                      </div>
                    </div>

                    {/* Lifecycle Step 2 (Confirmed) */}
                    <div className="relative">
                      <div className={`absolute -left-[24.5px] top-1 w-2 h-2 rounded-full ${selectedCol.status !== 'Missed' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <div>
                        <p className={`${selectedCol.status !== 'Missed' ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>Stage 2: Operator Confirmed Agenda</p>
                        <p className="text-[10px] text-slate-400 font-mono">Assigned to: {selectedCol.collector}</p>
                      </div>
                    </div>

                    {/* Lifecycle Step 3 (Weighed Entry) */}
                    <div className="relative">
                      <div className={`absolute -left-[24.5px] top-1 w-2 h-2 rounded-full ${selectedCol.status === 'Completed' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <div>
                        <p className={`${selectedCol.status === 'Completed' ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>Stage 3: Physical Weights Verified</p>
                        {selectedCol.confirmedWeight !== undefined ? (
                          <p className="text-[11px] text-emerald-700 font-mono">Confirm Weight: <strong>{selectedCol.confirmedWeight} Tons</strong></p>
                        ) : (
                          <p className="text-[10px] text-slate-400">Payload weight scales pending entry</p>
                        )}
                      </div>
                    </div>

                    {/* Lifecycle Step 4 (Closed Log) */}
                    <div className="relative">
                      <div className={`absolute -left-[24.5px] top-1 w-2 h-2 rounded-full ${selectedCol.status === 'Completed' ? 'bg-slate-900' : 'bg-slate-300'}`} />
                      <div>
                        <p className={`${selectedCol.status === 'Completed' ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>Stage 4: Collection Closed & Sealed</p>
                        <p className="text-[10px] text-slate-400 font-mono">Audit commit signed off</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DISCREPANCY WARNING CHECKS */}
                {selectedCol.status === 'Completed' && selectedCol.discrepancyFlag && (
                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-xs text-rose-800 space-y-1.5 animate-pulse">
                    <span className="font-extrabold uppercase text-[9px] tracking-wider text-rose-700 block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> High Margin Discrepancy Alert!
                    </span>
                    <p className="leading-relaxed">
                      Confirmed physical weight variations exceed declared volume bounds by <strong>&gt;50%</strong> (Declared volume est: <i>{selectedCol.volume}</i> vs confirmed: <i>{selectedCol.confirmedWeight} Tons</i>).
                    </p>
                    
                    {/* Super admin override button */}
                    {isSuperAdmin ? (
                      <button
                        onClick={() => {
                          setOverridedWeight(String(selectedCol.confirmedWeight || ''));
                          setShowOverrideModal(true);
                        }}
                        className="w-full text-center bg-rose-600 hover:bg-rose-700 text-white font-bold py-1 px-2 rounded mt-2 transition-all cursor-pointer font-mono text-[9px]"
                      >
                        ✎ ADMIN OVERRIDE WEIGHTS
                      </button>
                    ) : (
                      <p className="text-[9.5px] text-rose-600 italic">🔒 Super Admin clearance required to modify confirmed weight limits.</p>
                    )}
                  </div>
                )}

                {/* Retain audit override information if already overrided */}
                {selectedCol.auditNote && (
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-xs text-emerald-800">
                    <p className="font-bold text-[9px] tracking-wider uppercase">✓ Admin override commit registered:</p>
                    <p className="italic mt-1 leading-normal font-mono text-[10.5px]">"{selectedCol.auditNote}"</p>
                  </div>
                )}

              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-10 font-mono bg-white p-4 rounded-xl border">Select a collection line to monitor stage progression.</p>
            )}
          </div>

        </div>
      )}

      {/* --- REASSIGN INTERACTIVE MODAL OVERLAYS --- */}
      {reassigningId && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-100 w-full max-w-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Disruptive Dispatch Reassignment</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Reassign collection <strong>{reassigningId}</strong> to a verified service vehicle. We will dispatch new route directions automatically.
            </p>

            <div className="space-y-1.5 text-xs text-slate-700">
              <label className="font-bold">Select target replacement collector:</label>
              <CustomDropdown
                options={[
                  { value: 'Green Collect Ltd', label: 'Green Collect Ltd (Lagos Mainland)' },
                  { value: 'EcoRoute Hub Operations', label: 'EcoRoute Hub Operations' },
                  { value: 'Emeka Okoye (Ecological)', label: 'Emeka Okoye (Ecological)' },
                  { value: 'Tunde Bakare (Independent)', label: 'Tunde Bakare (Independent)' }
                ]}
                value={newCollectorName}
                onChange={(val) => setNewCollectorName(val)}
                fullWidth
              />
            </div>

            <div className="flex justify-end gap-2 text-xs font-bold pt-2">
              <button 
                onClick={() => setReassigningId(null)}
                className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded cursor-pointer"
              >
                Go Back
              </button>
              <button 
                onClick={() => handleReassignCollector(reassigningId)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
              >
                ✓ Re-routing dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- WEIGHT OVERRIDE DIALOG --- */}
      {showOverrideModal && selectedCol && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <form onSubmit={handleWeightOverride} className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Super Admin Weight Discrepancy Override</h3>
            
            <p className="text-xs text-rose-700 leading-normal bg-rose-50 p-2.5 rounded">
              Warning: Modifying confirmed weighbridge weights directly overrides verified physical logs. This generates an item in the system-wide Audit Action trail.
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold text-[9px] uppercase mb-1">Confirmed weight override (Tons)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={overridedWeight}
                  onChange={(e) => setOverridedWeight(e.target.value)}
                  placeholder="e.g. 0.45"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-[9px] uppercase mb-1">MANDATORY OVERRIDE COMPLIANCE NOTE</label>
                <textarea
                  required
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Please state audit validation context..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs font-bold pt-2">
              <button 
                type="button"
                onClick={() => setShowOverrideModal(false)}
                className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
              >
                ✓ Commit Audit Note
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
