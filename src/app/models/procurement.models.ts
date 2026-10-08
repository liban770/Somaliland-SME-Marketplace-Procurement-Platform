export type RequisitionStatus =
  | 'Draft'
  | 'Open'
  | 'Under Review'
  | 'Approved'
  | 'Awarded'
  | 'Processing'
  | 'Delivered';

export type CommercialHub = 'Hargeisa HQ' | 'Berbera Free Zone' | 'Burao Hub' | 'Borama Depot';

export type ProcurementCategory =
  | 'Heavy Equipment & Fleet'
  | 'Industrial Solar & Power'
  | 'Telecommunications & IT'
  | 'Port Logistics & Stevedoring'
  | 'Construction Materials'
  | 'Medical & Health Supplies';

export interface LineItem {
  id: string;
  description: string;
  spec: string;
  qty: number;
  unit: string;
  estimatedUnitCostUSD: number;
}

export interface SupplierBidLineItem {
  lineItemId: string;
  unitPriceUSD: number;
  totalPriceUSD: number;
  brandSpec: string;
}

export interface SupplierBid {
  id: string;
  supplierId: string;
  supplierName: string;
  chamberVerified: boolean;
  chamberRegNo: string;
  rating: number;
  totalBidUSD: number;
  leadTimeDays: number;
  portHandlingIncluded: boolean;
  warrantyMonths: number;
  status: 'Pending' | 'Shortlisted' | 'Awarded' | 'Declined';
  variancePct: number;
  lineItemBids: SupplierBidLineItem[];
  submissionDate: string;
  complianceNotes: string;
  paymentTerms: string;
}

export interface CustomsManifest {
  manifestNumber: string;
  vesselName: string;
  billOfLading: string;
  containerCount: number;
  containerIds: string[];
  arrivalDate: string;
  berthLocation: string;
  customsDeclarationNo: string;
  dutyStatus: 'Exempt (Govt Priority)' | 'Duty Settled' | 'Assessment Pending' | 'Inspection Cleared';
  convoyStatus: 'Dispatched to Hargeisa' | 'In Bonded Yard B-3' | 'Customs Release Stamped' | 'En Route Burao';
  dpWorldGatePass: string;
}

export interface Signatory {
  name: string;
  title: string;
  role: 'Procurement Officer' | 'Financial Controller' | 'Managing Director';
  signed: boolean;
  signedAt?: string;
  signatureCode?: string;
}

export interface PurchaseOrder {
  poNumber: string;
  requisitionId: string;
  issueDate: string;
  vendorName: string;
  vendorChamberId: string;
  vendorContact: string;
  commercialHub: CommercialHub;
  paymentTerms: string;
  totalAmountUSD: number;
  totalAmountSLSH: number;
  status: 'Draft' | 'Pending Signatures' | 'Authorized' | 'Dispatched';
  signatories: Signatory[];
  shippingTerms: string;
  expectedDelivery: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  operator: string;
  badge: 'Info' | 'Chamber' | 'Customs' | 'Finance' | 'Warning';
  details: string;
}

export interface Requisition {
  id: string;
  title: string;
  category: ProcurementCategory;
  hub: CommercialHub;
  status: RequisitionStatus;
  currentStep: number; // 1 to 7
  targetBudgetUSD: number;
  deadline: string;
  publishedDate: string;
  buyerEntity: string;
  chamberAuditRequired: boolean;
  berberaCustomsFastTrack: boolean;
  lineItems: LineItem[];
  bids: SupplierBid[];
  customsManifest?: CustomsManifest;
  po?: PurchaseOrder;
  auditLogs: AuditLogItem[];
}

export interface SupplierProfile {
  id: string;
  name: string;
  hub: CommercialHub;
  chamberRegNo: string;
  verified: boolean;
  categories: ProcurementCategory[];
  rating: number;
  tendersCompleted: number;
  bondedWarehouseSqM: number;
  contactPerson: string;
  phone: string;
  email: string;
}
