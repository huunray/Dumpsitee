export type AdminRole = 'Super Admin' | 'Ops Admin' | 'Support Agent';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export type UserRole = 'Dumper' | 'Collector' | 'Recycling Company';
export type UserStatus = 'Active' | 'Pending Approval' | 'Suspended';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  location: string;
  idStatus: 'Not Uploaded' | 'Pending Verification' | 'Verified' | 'Flagged';
  idImageUrl?: string;
  submittedTime?: string;
  suspensionReason?: string;
  suspensionNote?: string;
  // Logistic Agent / Collector Specifics
  vehicleDetails?: {
    model: string;
    plateNumber: string;
    type: string;
    year: string;
  };
  docsChecklist?: {
    photoId: boolean;
    vehicleOwnership: boolean;
    storageAddress: boolean;
    businessReg: boolean;
  };
  coverageArea?: string;
}

export type ComplaintCategory = 'Missed Pickup' | 'Overcharged' | 'App Issue' | 'Behavioral' | 'Hazardous' | 'Sewerage/Odour' | 'Other';
export type ComplaintStatus = 'Pending' | 'In Review' | 'Resolved' | 'Closed';

export interface ComplaintNote {
  id: string;
  timestamp: string;
  author: string;
  text: string;
}

export interface ComplaintTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
}

export interface Complaint {
  id: string;
  reporterName: string;
  reporterEmail: string;
  reporterType: 'Dumper' | 'Collector' | 'Company';
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  assignedAgent?: string;
  neighborhood: string;
  submittedAt: string;
  ageHours: number;
  slaLimitHours: number;
  notes: ComplaintNote[];
  timeline: ComplaintTimelineEvent[];
  resolutionSummary?: string;
}

export type CollectionStatus = 'Scheduled' | 'Completed' | 'Missed';

export interface CollectionItem {
  id: string;
  dumper: string;
  collector: string;
  wasteCategory: string;
  volume: string; // e.g. "0.8 Tons (Est.)"
  scheduledWindow: string; // e.g. "08:00 AM - 12:00 PM"
  neighborhood: string;
  status: CollectionStatus;
  confirmedWeight?: number; // e.g. 0.9
  timestamp?: string;
  discrepancyFlag?: boolean;
  auditNote?: string;
  ageHours?: number; // for missed collections
}

export type TransactionType = 'Subscription' | 'Payout' | 'Fee' | 'Prize' | 'Refund' | 'Reversal';
export type TransactionStatus = 'Pending' | 'Processing' | 'Settled' | 'Failed' | 'Reversed';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  party: string;
  amount: number;
  status: TransactionStatus;
  processorReference: string; // e.g. "OPY-92931-FW"
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  auditTrail: { timestamp: string; status: TransactionStatus; note?: string }[];
}

export interface NonCashReward {
  id: string;
  userId: string;
  userName: string;
  rewardName: string; // e.g. "Compost Bin", "Eco-friendly Toolkit"
  pointsRedeemed: number;
  issuedDate: string;
  status: 'Pending Dispatch' | 'Dispatched' | 'Claimed';
}

export interface NotificationHistoryItem {
  id: string;
  timestamp: string;
  title: string;
  body: string;
  targetSegment: string;
  sender: string; // admin name or "System"
  channel: 'Push' | 'In-app' | 'SMS';
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    failed: number;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
}

export interface ServiceDisruption {
  id: string;
  affectedService: string;
  affectedArea: string;
  estimatedResolution: string;
  messageBody: string;
  timestamp: string;
  status: 'Active' | 'Resolved';
}
