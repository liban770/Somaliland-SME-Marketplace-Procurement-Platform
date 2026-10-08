import { Injectable, computed, signal } from '@angular/core';
import {
  CommercialHub,
  CustomsManifest,
  ProcurementCategory,
  PurchaseOrder,
  Requisition,
  RequisitionStatus,
  SupplierBid,
  SupplierProfile,
} from '../models/procurement.models';

export const USD_TO_SLSH_RATE = 8500;

@Injectable({
  providedIn: 'root',
})
export class ProcurementService {
  // Global settings
  readonly currency = signal<'USD' | 'SLSH'>('USD');
  readonly selectedHubFilter = signal<string>('ALL');
  readonly selectedStatusFilter = signal<string>('ALL');
  readonly selectedCategoryFilter = signal<string>('ALL');
  readonly searchQuery = signal<string>('');

  // Active views: 'requisitions' | 'matrix' | 'customs' | 'purchase-orders' | 'suppliers'
  readonly activeView = signal<'requisitions' | 'matrix' | 'customs' | 'purchase-orders' | 'suppliers'>('requisitions');
  readonly selectedRequisitionId = signal<string>('RFQ-2026-089');

  // Modals & Drawers state
  readonly isCreateModalOpen = signal<boolean>(false);
  readonly isPoModalOpen = signal<boolean>(false);
  readonly isAuditDrawerOpen = signal<boolean>(false);

  // Master Requisitions Data
  readonly requisitions = signal<Requisition[]>([
    {
      id: 'RFQ-2026-089',
      title: 'Procurement of 12x 500kVA Cummins Industrial Generators for Berbera Port Corridor',
      category: 'Industrial Solar & Power',
      hub: 'Berbera Free Zone',
      status: 'Under Review',
      currentStep: 4, // Chamber Audit & Technical Evaluation
      targetBudgetUSD: 420000,
      deadline: '2026-10-18',
      publishedDate: '2026-10-02',
      buyerEntity: 'Berbera Port Economic Free Zone Authority',
      chamberAuditRequired: true,
      berberaCustomsFastTrack: true,
      lineItems: [
        {
          id: 'LI-101',
          description: 'Cummins QSK19-G4 500kVA Sound-Attenuated Diesel Generator Set',
          spec: '50Hz, 400V/230V, Prime Rated, Deep Sea 7320 Controller, Tropical Radiator 50°C',
          qty: 12,
          unit: 'Units',
          estimatedUnitCostUSD: 31000,
        },
        {
          id: 'LI-102',
          description: 'Automatic Transfer Switch (ATS) 800A 4-Pole Motorized',
          spec: 'IP65 Enclosure, Microprocessor Dual Source Synchronizer, Berbera Marine Coating',
          qty: 12,
          unit: 'Units',
          estimatedUnitCostUSD: 4000,
        },
      ],
      bids: [
        {
          id: 'BID-401',
          supplierId: 'SUP-01',
          supplierName: 'Dahabshiil Logistics & Industrial Supply',
          chamberVerified: true,
          chamberRegNo: 'SL-CHAMBER-2021-0044',
          rating: 4.9,
          totalBidUSD: 408000,
          leadTimeDays: 14,
          portHandlingIncluded: true,
          warrantyMonths: 24,
          status: 'Shortlisted',
          variancePct: -2.85,
          submissionDate: '2026-10-05',
          complianceNotes: 'Full Chamber endorsed ISO-9001 certified. Bonded warehouse storage in Berbera yard ready.',
          paymentTerms: '30% Advance LC / 70% Berbera Port Release',
          lineItemBids: [
            { lineItemId: 'LI-101', unitPriceUSD: 30200, totalPriceUSD: 362400, brandSpec: 'Cummins UK Genuine with Marine Radiator' },
            { lineItemId: 'LI-102', unitPriceUSD: 3800, totalPriceUSD: 45600, brandSpec: 'ABB 800A ATS Marine Grade IP65' },
          ],
        },
        {
          id: 'BID-402',
          supplierId: 'SUP-02',
          supplierName: 'Horn Import-Export Ltd',
          chamberVerified: true,
          chamberRegNo: 'SL-CHAMBER-2020-0198',
          rating: 4.7,
          totalBidUSD: 432000,
          leadTimeDays: 21,
          portHandlingIncluded: true,
          warrantyMonths: 18,
          status: 'Pending',
          variancePct: 2.86,
          submissionDate: '2026-10-06',
          complianceNotes: 'Valid Ministry of Trade license. Consignment via Dubai Jebel Ali feeder vessel.',
          paymentTerms: 'Dahabshiil Commercial Wire (Net 30)',
          lineItemBids: [
            { lineItemId: 'LI-101', unitPriceUSD: 32000, totalPriceUSD: 384000, brandSpec: 'Perkins / Stamford 500kVA Alternative' },
            { lineItemId: 'LI-102', unitPriceUSD: 4000, totalPriceUSD: 48000, brandSpec: 'Schneider Electric Compact ATS' },
          ],
        },
        {
          id: 'BID-403',
          supplierId: 'SUP-03',
          supplierName: 'Red Sea Industrial Supplies',
          chamberVerified: true,
          chamberRegNo: 'SL-CHAMBER-2023-0912',
          rating: 4.6,
          totalBidUSD: 396000,
          leadTimeDays: 10,
          portHandlingIncluded: false,
          warrantyMonths: 12,
          status: 'Pending',
          variancePct: -5.71,
          submissionDate: '2026-10-07',
          complianceNotes: 'Ex-works Berbera Free Zone. Port customs clearance fee excluded from quoted price.',
          paymentTerms: '100% Irrevocable Letter of Credit',
          lineItemBids: [
            { lineItemId: 'LI-101', unitPriceUSD: 29500, totalPriceUSD: 354000, brandSpec: 'Cummins C550D5e Heavy Duty' },
            { lineItemId: 'LI-102', unitPriceUSD: 3500, totalPriceUSD: 42000, brandSpec: 'Socomec ATyS d M 800A' },
          ],
        },
      ],
      customsManifest: {
        manifestNumber: 'BBR-MANIFEST-2026-1142',
        vesselName: 'MV Red Sea Navigator',
        billOfLading: 'BL-DPW-BER-90812',
        containerCount: 6,
        containerIds: ['MSKU-892104-1', 'MSKU-892105-7', 'MSKU-892106-2', 'CMAU-441029-0', 'CMAU-441030-3', 'CMAU-441031-9'],
        arrivalDate: '2026-10-22',
        berthLocation: 'DP World Berbera Quay 2',
        customsDeclarationNo: 'SL-MOF-DEC-84192',
        dutyStatus: 'Duty Settled',
        convoyStatus: 'In Bonded Yard B-3',
        dpWorldGatePass: 'GP-DPW-2026-7811',
      },
      auditLogs: [
        {
          id: 'LOG-01',
          timestamp: '2026-10-02 09:15',
          action: 'Requisition Created & Tender Published',
          operator: 'A. Liban (Chief Procurement Officer)',
          badge: 'Info',
          details: 'Official tender published across Somaliland commercial hubs with Berbera Free Zone delivery stipulation.',
        },
        {
          id: 'LOG-02',
          timestamp: '2026-10-05 14:30',
          action: 'Sealed Bid Submitted',
          operator: 'Dahabshiil Logistics Commercial Desk',
          badge: 'Chamber',
          details: 'Bid #BID-401 lodged with SL Chamber Verification Hash #SL-CHAMBER-2021-0044. Price: $408,000.',
        },
        {
          id: 'LOG-03',
          timestamp: '2026-10-07 11:00',
          action: 'Chamber Compliance Clearance Validated',
          operator: 'Somaliland Chamber of Commerce Automated Gateway',
          badge: 'Chamber',
          details: 'All 3 submitted bidding vendors verified in good standing. Ministry of Finance tax clearance confirmed.',
        },
      ],
    },
    {
      id: 'RFQ-2026-092',
      title: 'Heavy Civil Road Graders & Dump Trucks for Hargeisa-Berbera Dual Carriageway',
      category: 'Heavy Equipment & Fleet',
      hub: 'Hargeisa HQ',
      status: 'Awarded',
      currentStep: 5, // PO Authorized
      targetBudgetUSD: 780000,
      deadline: '2026-10-12',
      publishedDate: '2026-09-28',
      buyerEntity: 'Ministry of Transport and Road Development',
      chamberAuditRequired: true,
      berberaCustomsFastTrack: true,
      lineItems: [
        {
          id: 'LI-201',
          description: 'CAT 140K Motor Grader 190HP Tier 3',
          spec: 'Variable Horsepower, Heavy Duty Blade 14ft, ROPS Cabin, Air Conditioned, Ripper',
          qty: 2,
          unit: 'Units',
          estimatedUnitCostUSD: 240000,
        },
        {
          id: 'LI-202',
          description: 'Mercedes-Benz Actros 3340K 6x4 Tipper Dump Truck (18m³)',
          spec: 'Euro 3 Tropicalized engine, Reinforced suspension, Hardox 450 steel body, 400HP',
          qty: 3,
          unit: 'Units',
          estimatedUnitCostUSD: 100000,
        },
      ],
      bids: [
        {
          id: 'BID-410',
          supplierId: 'SUP-04',
          supplierName: 'Berbera Gateway Heavy Machinery Ltd',
          chamberVerified: true,
          chamberRegNo: 'SL-CHAMBER-2019-0012',
          rating: 4.8,
          totalBidUSD: 765000,
          leadTimeDays: 12,
          portHandlingIncluded: true,
          warrantyMonths: 36,
          status: 'Awarded',
          variancePct: -1.92,
          submissionDate: '2026-10-04',
          complianceNotes: 'Official Caterpillar & Mercedes regional dealer partner. Somaliland warranty support center.',
          paymentTerms: 'Letter of Credit / Dahabshiil Commercial Escrow',
          lineItemBids: [
            { lineItemId: 'LI-201', unitPriceUSD: 235000, totalPriceUSD: 470000, brandSpec: 'CAT 140K Heavy Duty Ripper' },
            { lineItemId: 'LI-202', unitPriceUSD: 98333, totalPriceUSD: 295000, brandSpec: 'Actros 3340K 18m³ Hardox body' },
          ],
        },
      ],
      po: {
        poNumber: 'PO-SL-2026-0043',
        requisitionId: 'RFQ-2026-092',
        issueDate: '2026-10-07',
        vendorName: 'Berbera Gateway Heavy Machinery Ltd',
        vendorChamberId: 'SL-CHAMBER-2019-0012',
        vendorContact: 'Farah Ismail (+252 63 4210981)',
        commercialHub: 'Hargeisa HQ',
        paymentTerms: 'Dahabshiil Commercial Wire (Net 30)',
        totalAmountUSD: 765000,
        totalAmountSLSH: 765000 * USD_TO_SLSH_RATE,
        status: 'Authorized',
        signatories: [
          {
            name: 'Eng. Ahmed Liban Mohamed',
            title: 'Chief Procurement Officer',
            role: 'Procurement Officer',
            signed: true,
            signedAt: '2026-10-07 10:45 AM',
            signatureCode: 'SIG-PO-77189-ALM',
          },
          {
            name: 'Khadra Duale Egal',
            title: 'Director of Treasury & Finance',
            role: 'Financial Controller',
            signed: true,
            signedAt: '2026-10-07 11:20 AM',
            signatureCode: 'SIG-FC-99120-KDE',
          },
        ],
        shippingTerms: 'CIF DP World Berbera Port + Delivery to Hargeisa Ministry Depot',
        expectedDelivery: '2026-11-15',
      },
      auditLogs: [
        {
          id: 'LOG-11',
          timestamp: '2026-10-07 10:45',
          action: 'Purchase Order #PO-SL-2026-0043 Authorized',
          operator: 'A. Liban & K. Duale',
          badge: 'Finance',
          details: 'Dual institutional authorization complete. Tender formally awarded to Berbera Gateway Heavy Machinery Ltd.',
        },
      ],
    },
    {
      id: 'RFQ-2026-095',
      title: 'Bulk Portland Cement Type 1 (42.5N) for Burao Livestock Market Expansion',
      category: 'Construction Materials',
      hub: 'Burao Hub',
      status: 'Open',
      currentStep: 2, // RFQ Published & Tendering
      targetBudgetUSD: 145000,
      deadline: '2026-10-25',
      publishedDate: '2026-10-06',
      buyerEntity: 'Togdheer Regional Municipality',
      chamberAuditRequired: true,
      berberaCustomsFastTrack: false,
      lineItems: [
        {
          id: 'LI-301',
          description: 'Ordinary Portland Cement CEM I 42.5N (50kg bags in 2-ton sling bags)',
          spec: 'BS EN 197-1 certified, Moisture-barrier craft paper packaging, Berbera Port import',
          qty: 1200,
          unit: 'Metric Tons',
          estimatedUnitCostUSD: 120.83,
        },
      ],
      bids: [
        {
          id: 'BID-415',
          supplierId: 'SUP-05',
          supplierName: 'Red Sea Building Materials & Trade',
          chamberVerified: true,
          chamberRegNo: 'SL-CHAMBER-2022-0451',
          rating: 4.5,
          totalBidUSD: 141600,
          leadTimeDays: 7,
          portHandlingIncluded: true,
          warrantyMonths: 6,
          status: 'Pending',
          variancePct: -2.34,
          submissionDate: '2026-10-08',
          complianceNotes: 'Sourced from Oman Raysut Cement plant. Discharged at Berbera Port berth 1.',
          paymentTerms: 'Zaad Enterprise Settlement / 50% on offload in Burao',
          lineItemBids: [
            { lineItemId: 'LI-301', unitPriceUSD: 118, totalPriceUSD: 141600, brandSpec: 'Raysut CEM I 42.5N Oman' },
          ],
        },
      ],
      auditLogs: [
        {
          id: 'LOG-21',
          timestamp: '2026-10-06 16:00',
          action: 'Requisition Initiated by Togdheer Municipality',
          operator: 'Hassan Abdi (Burao City Engineer)',
          badge: 'Info',
          details: 'RFQ opened for verified Somaliland construction suppliers.',
        },
      ],
    },
    {
      id: 'RFQ-2026-081',
      title: 'Fiber Optic Subsea Feeder & Carrier-Grade DWDM Switches',
      category: 'Telecommunications & IT',
      hub: 'Hargeisa HQ',
      status: 'Processing',
      currentStep: 6, // Port Customs & In-Transit
      targetBudgetUSD: 310000,
      deadline: '2026-09-20',
      publishedDate: '2026-09-05',
      buyerEntity: 'Somaliland National Telecommunications & Datacenter Corp',
      chamberAuditRequired: true,
      berberaCustomsFastTrack: true,
      lineItems: [
        {
          id: 'LI-401',
          description: 'Cisco NCS 2006 DWDM Optical Transport Node Chassis',
          spec: 'Dual AC Power, 100G/200G Transponders, 40-Channel DWDM Mux/Demux',
          qty: 4,
          unit: 'Units',
          estimatedUnitCostUSD: 55000,
        },
        {
          id: 'LI-402',
          description: 'Armored Single-Mode 96-Core Fiber Optic Cable (Heavy Rodent Protected)',
          spec: 'G.652D, ITU-T Standard, Double Steel Tape Armor, Berbera to Hargeisa burial spec',
          qty: 60,
          unit: 'Kilometers',
          estimatedUnitCostUSD: 1500,
        },
      ],
      bids: [
        {
          id: 'BID-422',
          supplierId: 'SUP-06',
          supplierName: 'Telesom Infrastructure & Networking Solutions',
          chamberVerified: true,
          chamberRegNo: 'SL-CHAMBER-2018-0005',
          rating: 4.95,
          totalBidUSD: 298000,
          leadTimeDays: 16,
          portHandlingIncluded: true,
          warrantyMonths: 36,
          status: 'Awarded',
          variancePct: -3.87,
          submissionDate: '2026-09-12',
          complianceNotes: 'Certified Cisco Gold Partner. Full Berbera customs inspection completed.',
          paymentTerms: 'Dahabshiil Bank Commercial Wire',
          lineItemBids: [
            { lineItemId: 'LI-401', unitPriceUSD: 52000, totalPriceUSD: 208000, brandSpec: 'Cisco NCS 2006 Redundant' },
            { lineItemId: 'LI-402', unitPriceUSD: 1500, totalPriceUSD: 90000, brandSpec: 'Fujikura 96-core Double Armored' },
          ],
        },
      ],
      customsManifest: {
        manifestNumber: 'BBR-MANIFEST-2026-0988',
        vesselName: 'MV Gulf Express IV',
        billOfLading: 'BL-DPW-BER-88419',
        containerCount: 3,
        containerIds: ['MSKU-330198-4', 'MSKU-330199-0', 'MSKU-330200-8'],
        arrivalDate: '2026-10-04',
        berthLocation: 'Berbera Container Terminal Quay 1',
        customsDeclarationNo: 'SL-MOF-DEC-81204',
        dutyStatus: 'Exempt (Govt Priority)',
        convoyStatus: 'Dispatched to Hargeisa',
        dpWorldGatePass: 'GP-DPW-2026-6912',
      },
      auditLogs: [
        {
          id: 'LOG-31',
          timestamp: '2026-10-07 08:30',
          action: 'Customs Release Stamped & Convoy Dispatched',
          operator: 'Berbera Port Authority Customs Inspector',
          badge: 'Customs',
          details: 'Ministry of Finance exemption stamp applied. Escorted convoy dispatched towards Hargeisa Datacenter.',
        },
      ],
    },
    {
      id: 'RFQ-2026-077',
      title: 'Solar PV Cold-Chain Milk & Meat Refrigeration Units for Borama Regional Depot',
      category: 'Industrial Solar & Power',
      hub: 'Borama Depot',
      status: 'Delivered',
      currentStep: 7, // Received & Dispatched at Destination Hub
      targetBudgetUSD: 95000,
      deadline: '2026-09-10',
      publishedDate: '2026-08-22',
      buyerEntity: 'Ministry of Agriculture and Livestock Development',
      chamberAuditRequired: true,
      berberaCustomsFastTrack: false,
      lineItems: [
        {
          id: 'LI-501',
          description: 'Solar Cold Room 20m³ (-5°C to +4°C) with Lithium Energy Storage',
          spec: '10kWp Bifacial Solar Panels, 28kWh LiFePO4 Battery, Inverter, Remote GSM monitoring',
          qty: 2,
          unit: 'Systems',
          estimatedUnitCostUSD: 47500,
        },
      ],
      bids: [
        {
          id: 'BID-430',
          supplierId: 'SUP-01',
          supplierName: 'Dahabshiil Logistics & Industrial Supply',
          chamberVerified: true,
          chamberRegNo: 'SL-CHAMBER-2021-0044',
          rating: 4.9,
          totalBidUSD: 92400,
          leadTimeDays: 14,
          portHandlingIncluded: true,
          warrantyMonths: 36,
          status: 'Awarded',
          variancePct: -2.74,
          submissionDate: '2026-08-29',
          complianceNotes: 'Turnkey installation verified in Borama.',
          paymentTerms: 'Zaad Enterprise / 100% on acceptance',
          lineItemBids: [
            { lineItemId: 'LI-501', unitPriceUSD: 46200, totalPriceUSD: 92400, brandSpec: 'Dometic / Victron Solar Cold Room' },
          ],
        },
      ],
      auditLogs: [
        {
          id: 'LOG-41',
          timestamp: '2026-09-28 15:40',
          action: 'Final Site Acceptance Certificate Signed',
          operator: 'Director of Livestock (Awdal Region)',
          badge: 'Info',
          details: 'Cold storage units commissioned and operating at Borama Regional Depot.',
        },
      ],
    },
  ]);

  // Master Suppliers
  readonly suppliers = signal<SupplierProfile[]>([
    {
      id: 'SUP-01',
      name: 'Dahabshiil Logistics & Industrial Supply',
      hub: 'Hargeisa HQ',
      chamberRegNo: 'SL-CHAMBER-2021-0044',
      verified: true,
      categories: ['Industrial Solar & Power', 'Heavy Equipment & Fleet', 'Telecommunications & IT'],
      rating: 4.9,
      tendersCompleted: 84,
      bondedWarehouseSqM: 14500,
      contactPerson: 'Mohamed Jama Hersi',
      phone: '+252 63 4429000',
      email: 'procurement@dahabshiil-supply.com',
    },
    {
      id: 'SUP-02',
      name: 'Horn Import-Export Ltd',
      hub: 'Berbera Free Zone',
      chamberRegNo: 'SL-CHAMBER-2020-0198',
      verified: true,
      categories: ['Construction Materials', 'Industrial Solar & Power', 'Port Logistics & Stevedoring'],
      rating: 4.7,
      tendersCompleted: 52,
      bondedWarehouseSqM: 8200,
      contactPerson: 'Ayan Suleiman Barre',
      phone: '+252 63 4215544',
      email: 'tenders@hornimportexport.sl',
    },
    {
      id: 'SUP-03',
      name: 'Red Sea Industrial Supplies',
      hub: 'Berbera Free Zone',
      chamberRegNo: 'SL-CHAMBER-2023-0912',
      verified: true,
      categories: ['Heavy Equipment & Fleet', 'Industrial Solar & Power'],
      rating: 4.6,
      tendersCompleted: 39,
      bondedWarehouseSqM: 6000,
      contactPerson: 'Mustafe Gedi',
      phone: '+252 63 4881122',
      email: 'sales@redseasupplies.com',
    },
    {
      id: 'SUP-04',
      name: 'Berbera Gateway Heavy Machinery Ltd',
      hub: 'Berbera Free Zone',
      chamberRegNo: 'SL-CHAMBER-2019-0012',
      verified: true,
      categories: ['Heavy Equipment & Fleet', 'Port Logistics & Stevedoring'],
      rating: 4.8,
      tendersCompleted: 61,
      bondedWarehouseSqM: 22000,
      contactPerson: 'Farah Ismail Omer',
      phone: '+252 63 4210981',
      email: 'fleet@berberagateway.com',
    },
    {
      id: 'SUP-05',
      name: 'Red Sea Building Materials & Trade',
      hub: 'Burao Hub',
      chamberRegNo: 'SL-CHAMBER-2022-0451',
      verified: true,
      categories: ['Construction Materials'],
      rating: 4.5,
      tendersCompleted: 43,
      bondedWarehouseSqM: 9500,
      contactPerson: 'Osman Warsame',
      phone: '+252 63 4478120',
      email: 'trade@redseabuilding.sl',
    },
    {
      id: 'SUP-06',
      name: 'Telesom Infrastructure & Networking Solutions',
      hub: 'Hargeisa HQ',
      chamberRegNo: 'SL-CHAMBER-2018-0005',
      verified: true,
      categories: ['Telecommunications & IT'],
      rating: 4.95,
      tendersCompleted: 112,
      bondedWarehouseSqM: 11000,
      contactPerson: 'Abdirahman Keyse',
      phone: '+252 63 4400011',
      email: 'b2b@telesom.com',
    },
  ]);

  // Derived Active Requisition
  readonly activeRequisition = computed<Requisition | null>(() => {
    const id = this.selectedRequisitionId();
    return this.requisitions().find((r) => r.id === id) || this.requisitions()[0] || null;
  });

  // Filtered Requisitions
  readonly filteredRequisitions = computed<Requisition[]>(() => {
    const list = this.requisitions();
    const hub = this.selectedHubFilter();
    const status = this.selectedStatusFilter();
    const cat = this.selectedCategoryFilter();
    const q = this.searchQuery().toLowerCase().trim();

    return list.filter((item) => {
      if (hub !== 'ALL' && item.hub !== hub) return false;
      if (status !== 'ALL' && item.status !== status) return false;
      if (cat !== 'ALL' && item.category !== cat) return false;
      if (q) {
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        const matchBuyer = item.buyerEntity.toLowerCase().includes(q);
        const matchHub = item.hub.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchBuyer && !matchHub) return false;
      }
      return true;
    });
  });

  // Summary Metrics computed
  readonly metrics = computed(() => {
    const all = this.requisitions();
    const active = all.filter((r) => r.status === 'Open' || r.status === 'Under Review' || r.status === 'Approved');
    const totalCommittedUSD = all.reduce((sum, r) => sum + r.targetBudgetUSD, 0);
    const totalCommittedSLSH = totalCommittedUSD * USD_TO_SLSH_RATE;
    const customsCount = all.filter((r) => !!r.customsManifest).length;
    const customsCleared = all.filter((r) => r.customsManifest?.dutyStatus === 'Duty Settled' || r.customsManifest?.dutyStatus === 'Exempt (Govt Priority)').length;
    const customsPct = customsCount > 0 ? Math.round((customsCleared / customsCount) * 100) : 94;

    return {
      activeCount: active.length,
      totalCount: all.length,
      committedUSD: totalCommittedUSD,
      committedSLSH: totalCommittedSLSH,
      customsClearanceRate: customsPct,
      avgTenderDays: 8.4,
      chamberCompliancePct: 98.6,
    };
  });

  // Customs Manifests list
  readonly allCustomsManifests = computed(() => {
    const manifests: { manifest: CustomsManifest; requisition: Requisition }[] = [];
    for (const req of this.requisitions()) {
      if (req.customsManifest) {
        manifests.push({ manifest: req.customsManifest, requisition: req });
      }
    }
    return manifests;
  });

  // Purchase Orders list
  readonly allPurchaseOrders = computed(() => {
    const pos: { po: PurchaseOrder; requisition: Requisition }[] = [];
    for (const req of this.requisitions()) {
      if (req.po) {
        pos.push({ po: req.po, requisition: req });
      }
    }
    return pos;
  });

  // Format amount with currency toggle
  formatCurrency(usdAmount: number, forceCurrency?: 'USD' | 'SLSH'): string {
    const cur = forceCurrency || this.currency();
    if (cur === 'SLSH') {
      const slsh = Math.round(usdAmount * USD_TO_SLSH_RATE);
      return `${slsh.toLocaleString('en-US')} SLSH`;
    }
    return `$${usdAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  // Dual Currency readout helper: returns formatted string with secondary in brackets
  formatDualCurrency(usdAmount: number): { primary: string; secondary: string } {
    const cur = this.currency();
    const slsh = Math.round(usdAmount * USD_TO_SLSH_RATE);
    if (cur === 'SLSH') {
      return {
        primary: `${slsh.toLocaleString('en-US')} SLSH`,
        secondary: `($${usdAmount.toLocaleString('en-US')} USD)`,
      };
    }
    return {
      primary: `$${usdAmount.toLocaleString('en-US')} USD`,
      secondary: `(${slsh.toLocaleString('en-US')} SLSH)`,
    };
  }

  toggleCurrency(): void {
    this.currency.update((c) => (c === 'USD' ? 'SLSH' : 'USD'));
  }

  selectRequisition(id: string, switchToMatrix = false): void {
    this.selectedRequisitionId.set(id);
    if (switchToMatrix) {
      this.activeView.set('matrix');
    }
  }

  // Award a specific bid
  awardBid(requisitionId: string, bidId: string): void {
    this.requisitions.update((list) =>
      list.map((req) => {
        if (req.id !== requisitionId) return req;

        const updatedBids = req.bids.map((b) => ({
          ...b,
          status: (b.id === bidId ? 'Awarded' : 'Declined') as 'Awarded' | 'Declined',
        }));

        const winningBid = req.bids.find((b) => b.id === bidId);

        // Auto-generate or update PO
        const poNumber = `PO-SL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const newPO: PurchaseOrder = {
          poNumber,
          requisitionId: req.id,
          issueDate: new Date().toISOString().split('T')[0],
          vendorName: winningBid?.supplierName || 'Awarded Vendor',
          vendorChamberId: winningBid?.chamberRegNo || 'SL-CHAMBER-VERIFIED',
          vendorContact: 'Procurement Representative (+252 63 4400192)',
          commercialHub: req.hub,
          paymentTerms: winningBid?.paymentTerms || '30% Advance LC / 70% Berbera Port Release',
          totalAmountUSD: winningBid?.totalBidUSD || req.targetBudgetUSD,
          totalAmountSLSH: (winningBid?.totalBidUSD || req.targetBudgetUSD) * USD_TO_SLSH_RATE,
          status: 'Pending Signatures',
          signatories: [
            {
              name: 'Eng. Ahmed Liban Mohamed',
              title: 'Chief Procurement Officer',
              role: 'Procurement Officer',
              signed: true,
              signedAt: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' }),
              signatureCode: `SIG-PO-${Math.floor(10000 + Math.random() * 90000)}-ALM`,
            },
            {
              name: 'Khadra Duale Egal',
              title: 'Director of Treasury & Finance',
              role: 'Financial Controller',
              signed: false,
            },
          ],
          shippingTerms: `CIF DP World Berbera Port + Delivery to ${req.hub}`,
          expectedDelivery: '30 Days from Port Clearance',
        };

        const newLogs = [
          {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' }),
            action: `Tender Awarded to ${winningBid?.supplierName}`,
            operator: 'A. Liban (Procurement Officer)',
            badge: 'Chamber' as const,
            details: `Bid #${bidId} officially selected. Requisition progressed to PO Authorization with total ${this.formatCurrency(winningBid?.totalBidUSD || 0, 'USD')}.`,
          },
          ...req.auditLogs,
        ];

        return {
          ...req,
          status: 'Awarded' as RequisitionStatus,
          currentStep: 5,
          bids: updatedBids,
          po: newPO,
          auditLogs: newLogs,
        };
      })
    );
  }

  // Sign purchase order
  signPO(requisitionId: string, signatoryRole: 'Financial Controller' | 'Managing Director'): void {
    this.requisitions.update((list) =>
      list.map((req) => {
        if (req.id !== requisitionId || !req.po) return req;

        const updatedSignatories = req.po.signatories.map((sig) => {
          if (sig.role === signatoryRole) {
            return {
              ...sig,
              signed: true,
              signedAt: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' }),
              signatureCode: `SIG-FC-${Math.floor(10000 + Math.random() * 90000)}-SL`,
            };
          }
          return sig;
        });

        const allSigned = updatedSignatories.every((s) => s.signed);

        const newLogs = [
          {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' }),
            action: `Signatory Authorization: ${signatoryRole}`,
            operator: 'Khadra Duale (Director of Treasury & Finance)',
            badge: 'Finance' as const,
            details: `Dual institutional authorization verified. PO #${req.po.poNumber} is now fully Authorized.`,
          },
          ...req.auditLogs,
        ];

        return {
          ...req,
          po: {
            ...req.po,
            status: allSigned ? 'Authorized' : 'Pending Signatures',
            signatories: updatedSignatories,
          },
          auditLogs: newLogs,
        };
      })
    );
  }

  // Create new Requisition
  createRequisition(payload: {
    title: string;
    category: ProcurementCategory;
    hub: CommercialHub;
    buyerEntity: string;
    targetBudgetUSD: number;
    deadline: string;
    chamberAuditRequired: boolean;
    berberaCustomsFastTrack: boolean;
    lineItems: { description: string; spec: string; qty: number; unit: string; estimatedUnitCostUSD: number }[];
  }): Requisition {
    const newId = `RFQ-2026-${Math.floor(100 + Math.random() * 900)}`;
    const lineItems = payload.lineItems.map((li, idx) => ({
      ...li,
      id: `LI-${newId}-${idx + 1}`,
    }));

    const newReq: Requisition = {
      id: newId,
      title: payload.title,
      category: payload.category,
      hub: payload.hub,
      status: 'Open',
      currentStep: 2, // Published & Tendering
      targetBudgetUSD: payload.targetBudgetUSD,
      deadline: payload.deadline,
      publishedDate: new Date().toISOString().split('T')[0],
      buyerEntity: payload.buyerEntity,
      chamberAuditRequired: payload.chamberAuditRequired,
      berberaCustomsFastTrack: payload.berberaCustomsFastTrack,
      lineItems,
      bids: [],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' }),
          action: 'RFQ Published on SahanProcure Direct Exchange',
          operator: 'A. Liban (Chief Procurement Officer)',
          badge: 'Info',
          details: `Published with budget of ${this.formatCurrency(payload.targetBudgetUSD, 'USD')}. Chamber compliance validation active.`,
        },
      ],
    };

    this.requisitions.update((prev) => [newReq, ...prev]);
    this.selectRequisition(newReq.id, true);
    return newReq;
  }

  // Quick simulate inbound supplier bid
  simulateSupplierBid(requisitionId: string): void {
    const req = this.requisitions().find((r) => r.id === requisitionId);
    if (!req) return;

    const availableSuppliers = this.suppliers().filter((s) => !req.bids.some((b) => b.supplierName === s.name));
    if (availableSuppliers.length === 0) return;

    const supplier = availableSuppliers[0];
    const variance = (Math.random() * 8 - 4); // between -4% and +4%
    const totalBidUSD = Math.round(req.targetBudgetUSD * (1 + variance / 100));

    const newBid: SupplierBid = {
      id: `BID-${Math.floor(450 + Math.random() * 100)}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      chamberVerified: supplier.verified,
      chamberRegNo: supplier.chamberRegNo,
      rating: supplier.rating,
      totalBidUSD,
      leadTimeDays: Math.floor(10 + Math.random() * 10),
      portHandlingIncluded: true,
      warrantyMonths: 24,
      status: 'Pending',
      variancePct: parseFloat(variance.toFixed(2)),
      submissionDate: new Date().toISOString().split('T')[0],
      complianceNotes: 'Sealed commercial quote lodged via verified Chamber of Commerce electronic signature token.',
      paymentTerms: 'Dahabshiil Commercial Wire (Net 30)',
      lineItemBids: req.lineItems.map((li) => {
        const itemUnitPrice = Math.round((li.estimatedUnitCostUSD * (1 + variance / 100)));
        return {
          lineItemId: li.id,
          unitPriceUSD: itemUnitPrice,
          totalPriceUSD: itemUnitPrice * li.qty,
          brandSpec: `Genuine OEM Verified Spec for ${li.description.substring(0, 30)}`,
        };
      }),
    };

    this.requisitions.update((list) =>
      list.map((r) => {
        if (r.id !== requisitionId) return r;
        return {
          ...r,
          status: 'Under Review' as RequisitionStatus,
          currentStep: 3,
          bids: [...r.bids, newBid],
          auditLogs: [
            {
              id: `LOG-${Date.now()}`,
              timestamp: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' }),
              action: `Sealed Bid Lodged: ${supplier.name}`,
              operator: supplier.name,
              badge: 'Chamber' as const,
              details: `Bid #${newBid.id} entered tender matrix. Total: ${this.formatCurrency(totalBidUSD, 'USD')}.`,
            },
            ...r.auditLogs,
          ],
        };
      })
    );
  }

  // Advance Requisition step manually
  advanceRequisitionStep(requisitionId: string): void {
    this.requisitions.update((list) =>
      list.map((r) => {
        if (r.id !== requisitionId) return r;
        const nextStep = Math.min(7, r.currentStep + 1);
        let nextStatus = r.status;
        if (nextStep === 3) nextStatus = 'Under Review';
        if (nextStep === 4) nextStatus = 'Under Review';
        if (nextStep === 5) nextStatus = 'Awarded';
        if (nextStep === 6) nextStatus = 'Processing';
        if (nextStep === 7) nextStatus = 'Delivered';

        return {
          ...r,
          currentStep: nextStep,
          status: nextStatus,
          auditLogs: [
            {
              id: `LOG-${Date.now()}`,
              timestamp: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' }),
              action: `Requisition Advanced to Step ${nextStep}`,
              operator: 'A. Liban (Procurement Officer)',
              badge: 'Info' as const,
              details: `Procurement workflow progressed along the institutional lifecycle tracker.`,
            },
            ...r.auditLogs,
          ],
        };
      })
    );
  }
}
