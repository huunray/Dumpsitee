import { 
  UserProfile, 
  Complaint, 
  CollectionItem, 
  Transaction, 
  NonCashReward, 
  NotificationHistoryItem, 
  AuditLog, 
  ServiceDisruption,
  AdminRole
} from './types';

// Let's create high-fidelity, polished, minimal initial states

export const initialUsers: UserProfile[] = [
  {
    id: "USR-001",
    name: "Adebayo Chukwu",
    email: "adebayo.c@dumpermail.com",
    role: "Dumper",
    status: "Active",
    location: "Lekki Phase 1",
    idStatus: "Verified",
    idImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80",
    submittedTime: "2026-06-01 09:30 AM"
  },
  {
    id: "USR-002",
    name: "Emeka Okoye",
    email: "emeka.okoye@ecoroute.ng",
    role: "Collector",
    status: "Pending Approval",
    location: "Yaba",
    idStatus: "Pending Verification",
    idImageUrl: "/assets/sample-id-1.jpg", // We will build a beautiful interactive generated ID document in UI fallback
    submittedTime: "2026-06-06 04:15 PM",
    vehicleDetails: {
      model: "Isuzu NPR Tipper Dustbin Truck",
      plateNumber: "LAG-290-XB",
      type: "Heavy Compactor",
      year: "2020"
    },
    docsChecklist: {
      photoId: true,
      vehicleOwnership: true,
      storageAddress: true,
      businessReg: false
    },
    coverageArea: "Yaba, Ebute Metta, Akoka"
  },
  {
    id: "USR-003",
    name: "Chioma Nnaji",
    email: "chioma.nnaji@scrapworld.org",
    role: "Recycling Company",
    status: "Active",
    location: "Victoria Island",
    idStatus: "Verified",
    idImageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
    submittedTime: "2026-05-20 11:20 AM"
  },
  {
    id: "USR-004",
    name: "Musa Ibrahim",
    email: "musa.ibrahim@haulageking.com",
    role: "Collector",
    status: "Suspended",
    location: "Ikeja",
    idStatus: "Flagged",
    idImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    submittedTime: "2026-05-15 02:45 PM",
    suspensionReason: "Fraudulent listing",
    suspensionNote: "Repeatedly reported self-declaring weight double of actual values to inflate payouts."
  },
  {
    id: "USR-005",
    name: "Kemi Adesina",
    email: "kemi.adesina@greendump.com",
    role: "Dumper",
    status: "Active",
    location: "Iru",
    idStatus: "Verified",
    idImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    submittedTime: "2026-06-03 08:12 AM"
  },
  {
    id: "USR-006",
    name: "Tunde Bakare",
    email: "tunde.bakare@ecopickup.net",
    role: "Collector",
    status: "Pending Approval",
    location: "Surulere",
    idStatus: "Pending Verification",
    idImageUrl: "/assets/sample-id-2.jpg",
    submittedTime: "2026-06-07 10:00 AM",
    vehicleDetails: {
      model: "Foton Midi Garbage Collection Van",
      plateNumber: "KD-118-A7",
      type: "Light Truck",
      year: "2022"
    },
    docsChecklist: {
      photoId: true,
      vehicleOwnership: true,
      storageAddress: true,
      businessReg: true
    },
    coverageArea: "Surulere, Ojuelegba, Bode Thomas"
  },
  {
    id: "USR-007",
    name: "Fatima Yusuf",
    email: "fatima.y@dumpsmart.co",
    role: "Recycling Company",
    status: "Suspended",
    idStatus: "Verified",
    location: "Apapa",
    submittedTime: "2026-04-10 03:00 PM",
    suspensionReason: "Policy violation",
    suspensionNote: "Discarding toxic electronics scraps directly in unapproved public waterways."
  }
];

export const initialComplaints: Complaint[] = [
  {
    id: "CMP-4091",
    reporterName: "Kemi Adesina",
    reporterEmail: "kemi.adesina@greendump.com",
    reporterType: "Dumper",
    category: "Missed Pickup",
    description: "My scheduled collection for Saturday morning was completely missed. The compactor truck drove right past my street without stopping.",
    status: "Pending",
    neighborhood: "Iru",
    submittedAt: "2026-06-07 08:30 AM",
    ageHours: 13,
    slaLimitHours: 24,
    notes: [
      {
        id: "n-1",
        timestamp: "2026-06-07 09:12 AM",
        author: "System Bot",
        text: "Complaint automatically scanned. High confidence correlation found with scheduled collection #COL-7729."
      }
    ],
    timeline: [
      {
        id: "t-1",
        timestamp: "2026-06-07 08:30 AM",
        title: "Complaint Lodged",
        description: "Submitted online via WasteCycle mobile application under code MISSED_PICKUP."
      }
    ]
  },
  {
    id: "CMP-3910",
    reporterName: "Chioma Nnaji",
    reporterEmail: "chioma.nnaji@scrapworld.org",
    reporterType: "Company",
    category: "Overcharged",
    description: "Billed twice for transaction processing on organic fertilizer dispatch. The system deducted fees for OPay and Flutterwave both.",
    status: "In Review",
    assignedAgent: "Adebisi Olomu (Support)",
    neighborhood: "Victoria Island",
    submittedAt: "2026-06-06 02:22 PM",
    ageHours: 31,
    slaLimitHours: 48,
    notes: [
      {
        id: "n-2",
        timestamp: "2026-06-06 04:00 PM",
        author: "Adebisi Olomu",
        text: "Internal — not visible to user. I have pinged the integration team to query the Flutterwave duplicate payment logs. Looks like dynamic webhook retry issue."
      }
    ],
    timeline: [
      {
        id: "t-2",
        timestamp: "2026-06-06 02:22 PM",
        title: "Complaint Lodged",
        description: "Customer reported overcharge transaction fees."
      },
      {
        id: "t-3",
        timestamp: "2026-06-06 03:50 PM",
        title: "Assigned & Status Changed",
        description: "Assigned automatically to Support Agent Adebisi Olomu. Moved status to In Review."
      }
    ]
  },
  {
    id: "CMP-3819",
    reporterName: "Marcus Aliyu",
    reporterEmail: "marcus.a@dumpsitedumper.com",
    reporterType: "Dumper",
    category: "Behavioral",
    description: "The auxiliary collector crew was extremely coarse and threw our bin into the drainage curb, cracking the plastic wheel.",
    status: "Resolved",
    assignedAgent: "Chidi Nwachukwu (Ops)",
    neighborhood: "Lekki Phase 1",
    submittedAt: "2026-06-05 11:00 AM",
    ageHours: 58,
    slaLimitHours: 72,
    resolutionSummary: "Issued replacement heavy-duty bin voucher to user. Handled verbal caution call with collector truck company partner.",
    notes: [
      {
        id: "n-3",
        timestamp: "2026-06-05 03:00 PM",
        author: "Chidi Nwachukwu",
        text: "Checked log of route. Truck was #TRK-889. Staff has been notified of mandatory bin restoration policies. Replacement voucher code generated: REPL-BIN-LEK."
      }
    ],
    timeline: [
      {
        id: "t-4",
        timestamp: "2026-06-05 11:00 AM",
        title: "Complaint Created",
        description: "Lodged from mobile client app version 2.4.1"
      },
      {
        id: "t-5",
        timestamp: "2026-06-05 02:30 PM",
        title: "Under Investigation",
        description: "Assigned to Chidi Nwachukwu."
      },
      {
        id: "t-6",
        timestamp: "2026-06-05 05:12 PM",
        title: "Marked Resolved",
        description: "Resolution summary entered. Automated credit code dispatched to Kemi."
      }
    ]
  }
];

export const initialCollections: CollectionItem[] = [
  // Scheduled collections
  {
    id: "COL-7729",
    dumper: "Adebayo Chukwu",
    collector: "Emeka Okoye (Ecological)",
    wasteCategory: "Organic & Kitchen Waste",
    volume: "0.5 Tons (Est.)",
    scheduledWindow: "08:00 AM - 12:00 PM (Today)",
    neighborhood: "Lekki Phase 1",
    status: "Scheduled"
  },
  {
    id: "COL-7730",
    dumper: "Olumide Johnson",
    collector: "Green Collect Ltd",
    wasteCategory: "Plastics & Synthetics",
    volume: "1.2 Tons (Est.)",
    scheduledWindow: "01:00 PM - 04:00 PM (Today)",
    neighborhood: "Yaba",
    status: "Scheduled"
  },
  {
    id: "COL-7731",
    dumper: "Vivian Cole",
    collector: "Tunde Bakare (Unconfirmed)",
    wasteCategory: "Glass & Bottles",
    volume: "0.2 Tons (Est.)",
    scheduledWindow: "02:00 PM - 05:00 PM (Today)",
    neighborhood: "Surulere",
    status: "Scheduled"
  },

  // Completed collections
  {
    id: "COL-7601",
    dumper: "Chioma Nnaji",
    collector: "Emeka Okoye (Ecological)",
    wasteCategory: "Paper & Cardboard",
    volume: "0.8 Tons (Est.)",
    scheduledWindow: "Yesterday",
    neighborhood: "Victoria Island",
    status: "Completed",
    confirmedWeight: 0.85,
    timestamp: "2026-06-06 03:15 PM"
  },
  {
    id: "COL-7602",
    dumper: "Kemi Adesina",
    collector: "Musa Ibrahim",
    wasteCategory: "Electronic Scrap",
    volume: "0.4 Tons (Est.)",
    scheduledWindow: "Two Days Ago",
    neighborhood: "Iru",
    status: "Completed",
    confirmedWeight: 0.95, // Discrepancy >50%! (0.4 vs 0.95 tons)
    discrepancyFlag: true,
    timestamp: "2026-06-05 11:22 AM"
  },
  {
    id: "COL-7603",
    dumper: "Adejoke Coker",
    collector: "Green Collect Ltd",
    wasteCategory: "Compost Bin Delivery",
    volume: "0.1 Tons (Est.)",
    scheduledWindow: "Three Days Ago",
    neighborhood: "Ikoyi",
    status: "Completed",
    confirmedWeight: 0.12,
    timestamp: "2026-06-04 05:00 PM"
  },

  // Missed collections
  {
    id: "COL-7501",
    dumper: "Bisi Akande",
    collector: "Musa Ibrahim (Unassigned)",
    wasteCategory: "Organic & Kitchen Waste",
    volume: "0.6 Tons (Est.)",
    scheduledWindow: "24h Ago",
    neighborhood: "Ikeja",
    status: "Missed",
    ageHours: 26
  },
  {
    id: "COL-7502",
    dumper: "Obi Nwosu",
    collector: "Emeka Okoye",
    wasteCategory: "Construction Scrap",
    volume: "2.5 Tons (Est.)",
    scheduledWindow: "48h Ago",
    neighborhood: "Yaba",
    status: "Missed",
    ageHours: 48
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: "TXN-882910",
    date: "2026-06-07 10:12 AM",
    type: "Subscription",
    party: "Emeka Okoye (Collector Hub)",
    amount: 15000,
    status: "Settled",
    processorReference: "FLW_1929312093",
    grossAmount: 15450,
    feeAmount: 450,
    netAmount: 15000,
    auditTrail: [
      { timestamp: "2026-06-07 10:12 AM", status: "Pending", note: "Subscription initialized from portal checkout." },
      { timestamp: "2026-06-07 10:13 AM", status: "Settled", note: "Verification callback received from Flutterwave." }
    ]
  },
  {
    id: "TXN-882911",
    date: "2026-06-07 08:30 AM",
    type: "Payout",
    party: "Adebayo Chukwu (Dumper)",
    amount: -4500,
    status: "Processing",
    processorReference: "OPY_28381920",
    grossAmount: -4500,
    feeAmount: 120,
    netAmount: -4620,
    auditTrail: [
      { timestamp: "2026-06-07 08:30 AM", status: "Pending", note: "Admin initiated reward payout request." },
      { timestamp: "2026-06-07 08:35 AM", status: "Processing", note: "Sent to OPay payment server." }
    ]
  },
  {
    id: "TXN-882912",
    date: "2026-06-06 05:14 PM",
    type: "Fee",
    party: "WasteCycle Operations Core",
    amount: 3200,
    status: "Settled",
    processorReference: "SYS_2112213",
    grossAmount: 3200,
    feeAmount: 0,
    netAmount: 3200,
    auditTrail: [
      { timestamp: "2026-06-06 05:14 PM", status: "Settled", note: "Automatic service fee split." }
    ]
  },
  {
    id: "TXN-882913",
    date: "2026-06-05 02:40 PM",
    type: "Payout",
    party: "Musa Ibrahim (Collector)",
    amount: -35000,
    status: "Failed",
    processorReference: "FLW_FAIL_99321",
    grossAmount: -35000,
    feeAmount: 500,
    netAmount: -35500,
    auditTrail: [
      { timestamp: "2026-06-05 02:40 PM", status: "Pending" },
      { timestamp: "2026-06-05 02:41 PM", status: "Processing" },
      { timestamp: "2026-06-05 02:43 PM", status: "Failed", note: "Recipient bank server rejected transaction. Error: INVALID_ACCOUNT_STATUS." }
    ]
  },
  {
    id: "TXN-882914",
    date: "2026-06-04 11:20 AM",
    type: "Prize",
    party: "Kemi Adesina (Eco-Champion Winner)",
    amount: -10000,
    status: "Settled",
    processorReference: "OPY_9012382",
    grossAmount: -10000,
    feeAmount: 150,
    netAmount: -10150,
    auditTrail: [
      { timestamp: "2026-06-04 11:20 AM", status: "Settled", note: "Awarded and paid via OPay client." }
    ]
  }
];

export const initialNonCashRewards: NonCashReward[] = [
  {
    id: "NCR-001",
    userId: "USR-001",
    userName: "Adebayo Chukwu",
    rewardName: "Industrial Plastic Compactor Bin (Symmetric)",
    pointsRedeemed: 450,
    issuedDate: "2026-06-06",
    status: "Pending Dispatch"
  },
  {
    id: "NCR-002",
    userId: "USR-005",
    userName: "Kemi Adesina",
    rewardName: "Premium Home Compost Aerator Tool",
    pointsRedeemed: 200,
    issuedDate: "2026-06-05",
    status: "Dispatched"
  },
  {
    id: "NCR-003",
    userId: "USR-003",
    userName: "Chioma Nnaji",
    rewardName: "Heavy Duty Recyclable Waste Collection Sacks (5x Packs)",
    pointsRedeemed: 150,
    issuedDate: "2026-06-02",
    status: "Claimed"
  }
];

export const initialNotificationsHistory: NotificationHistoryItem[] = [
  {
    id: "NOT-901",
    timestamp: "2026-06-07 11:00 AM",
    title: "Sanitation Day Service Rescheduling Support Alert",
    body: "Please note that because of national sanitation regulations, all scheduled pickups for next Saturday will commence at 10:00 AM instead of 06:00 AM. Plan accordingly.",
    targetSegment: "All Collectors & Dumpers in Lekki & Yaba",
    sender: "Tunde Yusuf (Ops Super)",
    channel: "Push",
    stats: { sent: 1450, delivered: 1420, opened: 980, failed: 30 }
  },
  {
    id: "NOT-902",
    timestamp: "2026-06-06 04:30 PM",
    title: "Payment Security Verification Required",
    body: "Reminder: Update your registered bank collection details to prevent automatic payout failures before the upcoming weekly settlement.",
    targetSegment: "Logistic Agents (Payout Pending)",
    sender: "System Bot",
    channel: "SMS",
    stats: { sent: 82, delivered: 80, opened: 75, failed: 2 }
  },
  {
    id: "NOT-903",
    timestamp: "2026-06-03 09:00 AM",
    title: "Eco-Champion Non-Cash Rewards Refresh!",
    body: "New home composting starter kits, composters, and utility gloves are now available in the rewards catalog. Redeem your earned environmental points now!",
    targetSegment: "All Registered Dumpers",
    sender: "Chidi Nwachukwu (Support)",
    channel: "In-app",
    stats: { sent: 4890, delivered: 4890, opened: 3120, failed: 0 }
  }
];

export const automatedReminderRules = [
  { id: "R1", name: "T-24hrs Dumper Scheduled Pickup Reminder", enabled: true, delay: "24 Hours Before", target: "Dumper", template: "Hi {dumper_name}, your pickup for {waste_category} is scheduled for tomorrow within {scheduled_window}. Please ensure the collection point is accessible." },
  { id: "R2", name: "T-2hrs Dumper Instant ETA Sync", enabled: true, delay: "2 Hours Before", target: "Dumper", template: "Hello {dumper_name}, collector {collector_name} is wrapping up their preceding route and is set to arrive in approx. 2 hours." },
  { id: "R3", name: "T-0 Dumper Collection Handover Notice", enabled: true, delay: "On Arrival", target: "Dumper", template: "{dumper_name}, your designated WasteCycle agent {collector_name} has arrived at your neighborhood address." },
  { id: "R4", name: "T-24hrs Collector Duty Dispatch Warning", enabled: true, delay: "24 Hours Before", target: "Collector", template: "Hi {collector_name}, you have {collection_count} collection cycles assigned for tomorrow starting {start_time}." },
  { id: "R5", name: "T-1hr Collector Impending SLA Overrun Penalty", enabled: true, delay: "1 Hour Before", target: "Collector", template: "URGENT: Collection ID {collection_id} for {dumper_name} starts in 1 hour. Confirm vehicle layout to prevent missed cycle flags." }
];

export const initialDisruptions: ServiceDisruption[] = [
  {
    id: "DIS-001",
    affectedService: "Compactor Heavy Truck Ingress",
    affectedArea: "Apapa Drainage Overpass Area",
    estimatedResolution: "Within 48 hours",
    messageBody: "Major structural road repairs on the Apapa interchange bridge limit heavy truck transit. Our compactors will reroute via the outer expressway.",
    timestamp: "2026-06-07 09:12 AM",
    status: "Active"
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: "AUD-1001",
    timestamp: "2026-06-07 11:22 AM",
    adminName: "Bolanle Yusuf",
    adminRole: "Super Admin",
    action: "Approved reactivated application for collector Emeka Okoye (USR-002) following identity confirmation."
  },
  {
    id: "AUD-1002",
    timestamp: "2026-06-07 09:30 AM",
    adminName: "Chidi Nwachukwu",
    adminRole: "Support Agent",
    action: "Assigned pending complaint CMP-4091 (Kemi Adesina) to Ops Team investigation queue."
  },
  {
    id: "AUD-1003",
    timestamp: "2026-06-06 05:40 PM",
    adminName: "Olumide Alao",
    adminRole: "Ops Admin",
    action: "Modified collection scheduled weight for COL-7602 with note: Verified physical weight discrepancy via weighbridge logs."
  },
  {
    id: "AUD-1004",
    timestamp: "2026-06-05 01:15 PM",
    adminName: "Bolanle Yusuf",
    adminRole: "Super Admin",
    action: "Suspended user account USR-004 (Musa Ibrahim) due to fraudulent weight declaration records."
  }
];

// Visual matrix of role permissions Settings
// Super Admin / Ops Admin / Support Agent
export interface PermissionRow {
  module: string;
  action: string;
  'Super Admin': boolean;
  'Ops Admin': boolean;
  'Support Agent': boolean;
}

export const permissionsMatrix: PermissionRow[] = [
  { module: "Dashboard Overview", action: "View main metrics and time toggles", "Super Admin": true, "Ops Admin": true, "Support Agent": true },
  { module: "User Management", action: "Approve/Reject new collectors", "Super Admin": true, "Ops Admin": true, "Support Agent": false },
  { module: "User Management", action: "Suspend / Reactivate accounts", "Super Admin": true, "Ops Admin": true, "Support Agent": false },
  { module: "User Management", action: "View Team members and Invite Admins", "Super Admin": true, "Ops Admin": false, "Support Agent": false },
  { module: "User Management", action: "Access system-wide Audit Action Log", "Super Admin": true, "Ops Admin": false, "Support Agent": false },
  { module: "Complaint Management", action: "Update statuses & internal log note updates", "Super Admin": true, "Ops Admin": true, "Support Agent": true },
  { module: "Complaint Management", action: "Submit Resolution summary & close cases", "Super Admin": true, "Ops Admin": true, "Support Agent": true },
  { module: "Collection Monitoring", action: "View charts & assign/reassign collectors", "Super Admin": true, "Ops Admin": true, "Support Agent": true },
  { module: "Collection Monitoring", action: "Edit actual weights and override records", "Super Admin": true, "Ops Admin": false, "Support Agent": false },
  { module: "Financial Tracking", action: "Access cashflows & search transaction ledger", "Super Admin": true, "Ops Admin": true, "Support Agent": false },
  { module: "Financial Tracking", action: "Retry failed payments & payout triggers", "Super Admin": true, "Ops Admin": false, "Support Agent": false },
  { module: "Notification System", action: "Dispatch global or segment push alerts", "Super Admin": true, "Ops Admin": true, "Support Agent": false },
  { module: "Notification System", action: "Trigger service disruption banners", "Super Admin": true, "Ops Admin": true, "Support Agent": true }
];
