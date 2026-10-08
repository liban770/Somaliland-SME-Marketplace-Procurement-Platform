import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProcurementService } from '../../services/procurement.service';
import { RequisitionStatus } from '../../models/procurement.models';

@Component({
  selector: 'app-requisition-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="bg-white border border-[#E5E7EB] rounded-md shadow-xs overflow-hidden">
      <!-- Table Header & Controls Bar -->
      <div class="p-4 border-b border-[#E5E7EB] bg-[#f8f9fa] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <!-- Search & Hub filters -->
        <div class="flex flex-wrap items-center gap-2.5 flex-1">
          <div class="relative min-w-[260px] sm:min-w-[320px]">
            <mat-icon class="absolute left-2.5 top-2.5 text-[#6B7280] text-sm! w-4! h-4!">search</mat-icon>
            <input
              type="text"
              placeholder="Search RFQ ID, equipment title, buyer entity..."
              [value]="service.searchQuery()"
              (input)="onSearchInput($event)"
              class="w-full h-9 pl-9 pr-3 text-xs bg-white border border-[#E5E7EB] rounded-sm text-[#171717] placeholder-[#6B7280] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]"
            />
          </div>

          <!-- Category dropdown -->
          <div class="flex items-center text-xs">
            <select
              [value]="service.selectedCategoryFilter()"
              (change)="onCategoryChange($event)"
              class="h-9 px-2.5 bg-white border border-[#E5E7EB] rounded-sm text-[#171717] text-xs font-medium focus:outline-none focus:border-[#111111]"
            >
              <option value="ALL">All Categories</option>
              <option value="Heavy Equipment & Fleet">Heavy Equipment & Fleet</option>
              <option value="Industrial Solar & Power">Industrial Solar & Power</option>
              <option value="Telecommunications & IT">Telecommunications & IT</option>
              <option value="Port Logistics & Stevedoring">Port Logistics & Stevedoring</option>
              <option value="Construction Materials">Construction Materials</option>
              <option value="Medical & Health Supplies">Medical & Health Supplies</option>
            </select>
          </div>

          <!-- Status dropdown -->
          <div class="flex items-center text-xs">
            <select
              [value]="service.selectedStatusFilter()"
              (change)="onStatusChange($event)"
              class="h-9 px-2.5 bg-white border border-[#E5E7EB] rounded-sm text-[#171717] text-xs font-medium focus:outline-none focus:border-[#111111]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Open">Open (Tendering)</option>
              <option value="Under Review">Under Review</option>
              <option value="Awarded">Awarded</option>
              <option value="Processing">Processing (In-Transit)</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        <!-- Action / Tally info -->
        <div class="flex items-center space-x-2 text-xs">
          <span class="text-[#6B7280]">
            Showing <strong class="text-[#171717]">{{ service.filteredRequisitions().length }}</strong> of {{ service.requisitions().length }} Requisitions
          </span>
          <button
            type="button"
            (click)="service.isCreateModalOpen.set(true)"
            class="px-3 py-1.5 bg-[#d71920] hover:bg-[#b3141a] text-white font-semibold text-xs rounded-sm shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <mat-icon class="text-xs! w-3.5! h-3.5!">add</mat-icon>
            <span>Publish New RFQ</span>
          </button>
        </div>
      </div>

      <!-- Quick Status Filter Pills Row -->
      <div class="px-4 py-2 border-b border-[#E5E7EB] bg-white flex flex-wrap items-center gap-1.5 text-xs">
        <span class="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mr-1">Workflow:</span>
        <button
          type="button"
          (click)="service.selectedStatusFilter.set('ALL')"
          [class]="service.selectedStatusFilter() === 'ALL' ? 'bg-[#111111] text-white font-semibold' : 'bg-[#f8f9fa] text-[#4b5563] hover:bg-[#e5e7eb]'"
          class="px-2.5 py-0.5 rounded-full text-[11px] transition-colors cursor-pointer"
        >
          All ({{ service.requisitions().length }})
        </button>
        <button
          type="button"
          (click)="service.selectedStatusFilter.set('Open')"
          [class]="service.selectedStatusFilter() === 'Open' ? 'bg-[#1d4ed8] text-white font-semibold' : 'bg-[#eff6ff] text-[#1d4ed8] hover:bg-blue-100'"
          class="px-2.5 py-0.5 rounded-full text-[11px] transition-colors cursor-pointer flex items-center space-x-1"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
          <span>Open</span>
        </button>
        <button
          type="button"
          (click)="service.selectedStatusFilter.set('Under Review')"
          [class]="service.selectedStatusFilter() === 'Under Review' ? 'bg-[#b45309] text-white font-semibold' : 'bg-[#fef3c7] text-[#b45309] hover:bg-amber-100'"
          class="px-2.5 py-0.5 rounded-full text-[11px] transition-colors cursor-pointer flex items-center space-x-1"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
          <span>Under Review</span>
        </button>
        <button
          type="button"
          (click)="service.selectedStatusFilter.set('Awarded')"
          [class]="service.selectedStatusFilter() === 'Awarded' ? 'bg-[#d71920] text-white font-semibold' : 'bg-[#fef2f2] text-[#b91c1c] hover:bg-red-100'"
          class="px-2.5 py-0.5 rounded-full text-[11px] transition-colors cursor-pointer flex items-center space-x-1"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-[#d71920]"></span>
          <span>Awarded</span>
        </button>
        <button
          type="button"
          (click)="service.selectedStatusFilter.set('Processing')"
          [class]="service.selectedStatusFilter() === 'Processing' ? 'bg-[#6d28d9] text-white font-semibold' : 'bg-[#f5f3ff] text-[#6d28d9] hover:bg-violet-100'"
          class="px-2.5 py-0.5 rounded-full text-[11px] transition-colors cursor-pointer flex items-center space-x-1"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]"></span>
          <span>Port Transit</span>
        </button>
        <button
          type="button"
          (click)="service.selectedStatusFilter.set('Delivered')"
          [class]="service.selectedStatusFilter() === 'Delivered' ? 'bg-[#15803d] text-white font-semibold' : 'bg-[#f0fdf4] text-[#15803d] hover:bg-emerald-100'"
          class="px-2.5 py-0.5 rounded-full text-[11px] transition-colors cursor-pointer flex items-center space-x-1"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
          <span>Delivered</span>
        </button>
      </div>

      <!-- Main Ledger Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#F8F9FA] border-b border-[#E5E7EB] text-[#4B5563] text-[11px] font-semibold uppercase tracking-[0.05em] select-none">
              <th class="py-2.5 px-3.5 whitespace-nowrap">Tender Ref</th>
              <th class="py-2.5 px-3.5">Requisition Title & Commercial Destination</th>
              <th class="py-2.5 px-3.5 whitespace-nowrap">Category</th>
              <th class="py-2.5 px-3.5 whitespace-nowrap text-right">Target Budget</th>
              <th class="py-2.5 px-3.5 whitespace-nowrap text-center">Bids</th>
              <th class="py-2.5 px-3.5 whitespace-nowrap">Workflow Status</th>
              <th class="py-2.5 px-3.5 whitespace-nowrap">Chamber Audit</th>
              <th class="py-2.5 px-3.5 whitespace-nowrap">Berbera Clearance</th>
              <th class="py-2.5 px-3.5 text-right whitespace-nowrap">Operations</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E5E7EB] text-[13px] text-[#171717]">
            @for (item of service.filteredRequisitions(); track item.id) {
              <tr
                (click)="onRowClick(item.id)"
                [class.bg-[#fef2f2]/35]="service.selectedRequisitionId() === item.id"
                class="hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
              >
                <!-- Tender Ref -->
                <td class="py-3 px-3.5 whitespace-nowrap">
                  <div class="font-mono font-bold text-xs text-[#111111] group-hover:text-[#d71920] transition-colors">
                    {{ item.id }}
                  </div>
                  <div class="text-[11px] text-[#6B7280]">
                    Closing: {{ item.deadline }}
                  </div>
                </td>

                <!-- Title & Destination -->
                <td class="py-3 px-3.5 max-w-[340px]">
                  <div class="font-semibold text-[#171717] line-clamp-1 group-hover:text-[#111111]">
                    {{ item.title }}
                  </div>
                  <div class="flex items-center space-x-2 mt-1 text-[11px] text-[#6B7280]">
                    <span class="inline-flex items-center space-x-0.5 text-[#111111] font-medium">
                      <mat-icon class="text-[12px]! w-3! h-3! text-[#d71920]">location_on</mat-icon>
                      <span>{{ item.hub }}</span>
                    </span>
                    <span>•</span>
                    <span class="truncate">{{ item.buyerEntity }}</span>
                  </div>
                </td>

                <!-- Category -->
                <td class="py-3 px-3.5 whitespace-nowrap">
                  <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-xs bg-[#f8f9fa] border border-[#E5E7EB] text-[11px] font-medium text-[#4B5563]">
                    <mat-icon class="text-[13px]! w-3.5! h-3.5! text-[#6B7280]">{{ getCategoryIcon(item.category) }}</mat-icon>
                    <span>{{ item.category }}</span>
                  </span>
                </td>

                <!-- Target Budget -->
                <td class="py-3 px-3.5 whitespace-nowrap text-right">
                  <div class="font-bold text-[#111111] tabular-nums">
                    {{ service.formatCurrency(item.targetBudgetUSD) }}
                  </div>
                  <div class="text-[10px] text-[#6B7280] tabular-nums">
                    ≈ {{ service.formatCurrency(item.targetBudgetUSD, service.currency() === 'USD' ? 'SLSH' : 'USD') }}
                  </div>
                </td>

                <!-- Bids Count -->
                <td class="py-3 px-3.5 whitespace-nowrap text-center">
                  @if (item.bids.length > 0) {
                    <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#111111] text-white">
                      {{ item.bids.length }} Bids
                    </span>
                  } @else {
                    <span class="text-[11px] text-[#6B7280] italic">
                      Awaiting Bids
                    </span>
                  }
                </td>

                <!-- Workflow Status Pill (matches design specs: 22px fixed height, uppercase label-sm, matching indicator dot) -->
                <td class="py-3 px-3.5 whitespace-nowrap">
                  <div [class]="getStatusPillClass(item.status)" class="h-[22px] inline-flex items-center space-x-1.5 px-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.05em]">
                    <span [class]="getStatusDotClass(item.status)" class="w-1.5 h-1.5 rounded-full"></span>
                    <span>{{ item.status }}</span>
                  </div>
                </td>

                <!-- Chamber Endorsement Badge -->
                <td class="py-3 px-3.5 whitespace-nowrap">
                  @if (item.chamberAuditRequired) {
                    <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-xs bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-[11px] font-bold uppercase tracking-[0.04em]">
                      <mat-icon class="text-[12px]! w-3! h-3!">verified</mat-icon>
                      <span>CHAMBER MANDATORY</span>
                    </span>
                  } @else {
                    <span class="text-[11px] text-[#6B7280]">Standard</span>
                  }
                </td>

                <!-- Berbera Clearance -->
                <td class="py-3 px-3.5 whitespace-nowrap">
                  @if (item.customsManifest) {
                    <div class="inline-flex items-center space-x-1 text-[11px] font-medium text-[#1d4ed8] bg-[#eff6ff] px-2 py-0.5 rounded-xs border border-[#bfdbfe]">
                      <mat-icon class="text-[12px]! w-3! h-3!">directions_boat</mat-icon>
                      <span>{{ item.customsManifest.dutyStatus }}</span>
                    </div>
                  } @else if (item.berberaCustomsFastTrack) {
                    <span class="text-[11px] text-[#6B7280] font-medium">Fast-Track Berth</span>
                  } @else {
                    <span class="text-[11px] text-[#9ca3af]">Domestic Supply</span>
                  }
                </td>

                <!-- Operational Action Buttons -->
                <td class="py-3 px-3.5 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end space-x-1.5">
                    <button
                      type="button"
                      (click)="onEvaluateBids($event, item.id)"
                      class="px-2.5 py-1 bg-[#d71920] hover:bg-[#b3141a] text-white font-semibold text-xs rounded-sm transition-colors cursor-pointer flex items-center space-x-1 shadow-xs"
                      title="Open Multi-Supplier Bid Comparison Grid"
                    >
                      <mat-icon class="text-[13px]! w-3.5! h-3.5!">compare</mat-icon>
                      <span>Evaluate Bids</span>
                    </button>
                    @if (item.po) {
                      <button
                        type="button"
                        (click)="onOpenPO($event, item.id)"
                        class="px-2 py-1 bg-[#111111] hover:bg-[#262626] text-white font-medium text-xs rounded-sm transition-colors cursor-pointer"
                        title="View Formal Purchase Order"
                      >
                        PO
                      </button>
                    }
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="9" class="py-12 text-center text-[#6B7280]">
                  <mat-icon class="text-3xl! w-8! h-8! text-[#9ca3af] mb-2">search_off</mat-icon>
                  <p class="font-medium text-sm text-[#111111]">No procurement tenders matched your active filters.</p>
                  <p class="text-xs mt-1">Try resetting the commercial hub, category, or search keywords.</p>
                  <button
                    type="button"
                    (click)="resetFilters()"
                    class="mt-3 px-3 py-1.5 bg-[#111111] text-white text-xs font-semibold rounded-sm cursor-pointer hover:bg-black"
                  >
                    Reset All Filters
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Table Footnote & SahanProcure Ledger Audit Note -->
      <div class="p-3 bg-[#F8F9FA] border-t border-[#E5E7EB] flex flex-wrap items-center justify-between text-[11px] text-[#6B7280]">
        <div class="flex items-center space-x-2">
          <span class="font-semibold text-[#111111]">Somaliland Tender Standards:</span>
          <span>All published RFQs enforce transparent sealed bid compliance in accordance with Somaliland Procurement Act.</span>
        </div>
        <div class="flex items-center space-x-3">
          <span>Dual Currency Benchmark: <strong>8,500 SLSH / 1 USD</strong></span>
          <span class="text-emerald-700 font-semibold">• DP World Berbera EDI Synced</span>
        </div>
      </div>
    </div>
  `,
})
export class RequisitionList {
  readonly service = inject(ProcurementService);

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.service.searchQuery.set(val);
  }

  onCategoryChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.service.selectedCategoryFilter.set(val);
  }

  onStatusChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.service.selectedStatusFilter.set(val);
  }

  onRowClick(id: string): void {
    this.service.selectRequisition(id, false);
  }

  onEvaluateBids(event: Event, id: string): void {
    event.stopPropagation();
    this.service.selectRequisition(id, true);
  }

  onOpenPO(event: Event, id: string): void {
    event.stopPropagation();
    this.service.selectRequisition(id, false);
    this.service.isPoModalOpen.set(true);
  }

  resetFilters(): void {
    this.service.selectedHubFilter.set('ALL');
    this.service.selectedStatusFilter.set('ALL');
    this.service.selectedCategoryFilter.set('ALL');
    this.service.searchQuery.set('');
  }

  getCategoryIcon(cat: string): string {
    switch (cat) {
      case 'Heavy Equipment & Fleet': return 'local_shipping';
      case 'Industrial Solar & Power': return 'solar_power';
      case 'Telecommunications & IT': return 'router';
      case 'Port Logistics & Stevedoring': return 'anchor';
      case 'Construction Materials': return 'foundation';
      case 'Medical & Health Supplies': return 'health_and_safety';
      default: return 'inventory_2';
    }
  }

  getStatusPillClass(status: RequisitionStatus): string {
    switch (status) {
      case 'Draft': return 'bg-[#F3F4F6] text-[#4B5563]';
      case 'Open': return 'bg-[#EFF6FF] text-[#1D4ED8]';
      case 'Under Review': return 'bg-[#FEF3C7] text-[#B45309]';
      case 'Approved': return 'bg-[#ECFDF5] text-[#047857]';
      case 'Awarded': return 'bg-[#FEF2F2] text-[#B91C1C]';
      case 'Processing': return 'bg-[#F5F3FF] text-[#6D28D9]';
      case 'Delivered': return 'bg-[#F0FDF4] text-[#15803D]';
    }
  }

  getStatusDotClass(status: RequisitionStatus): string {
    switch (status) {
      case 'Draft': return 'bg-[#9CA3AF]';
      case 'Open': return 'bg-[#3B82F6]';
      case 'Under Review': return 'bg-[#F59E0B]';
      case 'Approved': return 'bg-[#10B981]';
      case 'Awarded': return 'bg-[#D71920]';
      case 'Processing': return 'bg-[#8B5CF6]';
      case 'Delivered': return 'bg-[#22C55E]';
    }
  }
}
