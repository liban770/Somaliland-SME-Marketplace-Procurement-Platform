import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProcurementService } from '../../services/procurement.service';
import { SupplierBid } from '../../models/procurement.models';

@Component({
  selector: 'app-rfq-comparison',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @let req = service.activeRequisition();

    @if (!req) {
      <div class="bg-white border border-[#E5E7EB] rounded-md p-12 text-center text-[#6B7280]">
        <mat-icon class="text-4xl! w-10! h-10! text-[#9ca3af] mb-2">assignment_late</mat-icon>
        <p class="font-semibold text-base text-[#111111]">No Requisition Selected</p>
        <p class="text-xs mt-1">Please select an active tender from the list to evaluate supplier bids.</p>
        <button
          type="button"
          (click)="service.activeView.set('requisitions')"
          class="mt-4 px-4 py-2 bg-[#d71920] text-white text-xs font-semibold rounded-sm cursor-pointer hover:bg-[#b3141a]"
        >
          Browse All Tenders
        </button>
      </div>
    } @else {
      <div class="space-y-4">
        <!-- Requisition Header & Control Ribbon -->
        <div class="bg-white border border-[#E5E7EB] rounded-md shadow-xs p-4 sm:p-5">
          <!-- Top Row: Select tender, Back button, and quick actions -->
          <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
            <div class="flex items-center space-x-3">
              <button
                type="button"
                (click)="service.activeView.set('requisitions')"
                class="px-2.5 py-1 text-xs font-medium text-[#4B5563] bg-[#F8F9FA] hover:bg-[#E5E7EB] border border-[#E5E7EB] rounded-sm flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <mat-icon class="text-sm! w-4! h-4!">arrow_back</mat-icon>
                <span>Back to Ledger</span>
              </button>

              <div class="flex items-center space-x-2">
                <span class="text-xs font-bold font-mono text-[#d71920] bg-[#fef2f2] px-2 py-0.5 rounded-xs border border-[#fecaca]">
                  {{ req.id }}
                </span>
                <span class="text-xs text-[#6B7280]">Select Requisition:</span>
                <select
                  [value]="req.id"
                  (change)="onRequisitionSelect($event)"
                  class="text-xs font-semibold bg-[#F8F9FA] border border-[#E5E7EB] rounded-sm px-2.5 py-1 text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
                >
                  @for (item of service.requisitions(); track item.id) {
                    <option [value]="item.id">
                      {{ item.id }} — {{ item.title.substring(0, 48) }}...
                    </option>
                  }
                </select>
              </div>
            </div>

            <!-- Quick Simulation Actions -->
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                (click)="service.simulateSupplierBid(req.id)"
                class="px-3 py-1.5 bg-[#111111] hover:bg-[#262626] text-white text-xs font-semibold rounded-sm flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                title="Simulate a new sealed bid from a certified Somaliland supplier"
              >
                <mat-icon class="text-xs! w-3.5! h-3.5!">add_task</mat-icon>
                <span>Simulate Inbound Bid</span>
              </button>

              <button
                type="button"
                (click)="service.advanceRequisitionStep(req.id)"
                class="px-3 py-1.5 bg-[#F8F9FA] hover:bg-[#E5E7EB] text-[#111111] border border-[#E5E7EB] text-xs font-semibold rounded-sm flex items-center space-x-1.5 cursor-pointer transition-colors"
                title="Advance this requisition to the next lifecycle milestone"
              >
                <mat-icon class="text-xs! w-3.5! h-3.5!">fast_forward</mat-icon>
                <span>Advance Lifecycle Step</span>
              </button>

              @if (req.po) {
                <button
                  type="button"
                  (click)="service.isPoModalOpen.set(true)"
                  class="px-3 py-1.5 bg-[#d71920] hover:bg-[#b3141a] text-white text-xs font-semibold rounded-sm flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <mat-icon class="text-xs! w-3.5! h-3.5!">receipt_long</mat-icon>
                  <span>View PO (#{{ req.po.poNumber }})</span>
                </button>
              }
            </div>
          </div>

          <!-- Main Requisition Summary Card -->
          <div class="pt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
            <div class="lg:col-span-3">
              <div class="flex items-center space-x-2 text-xs text-[#6B7280]">
                <span class="inline-flex items-center space-x-1 font-semibold text-[#111111]">
                  <mat-icon class="text-xs! w-3.5! h-3.5! text-[#d71920]">location_on</mat-icon>
                  <span>{{ req.hub }}</span>
                </span>
                <span>•</span>
                <span>Buyer: <strong class="text-[#171717]">{{ req.buyerEntity }}</strong></span>
                <span>•</span>
                <span>Category: <strong class="text-[#171717]">{{ req.category }}</strong></span>
              </div>
              <h1 class="text-lg sm:text-xl font-bold text-[#111111] tracking-tight mt-1 leading-snug">
                {{ req.title }}
              </h1>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                @if (req.chamberAuditRequired) {
                  <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-xs bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-[11px] font-bold uppercase tracking-[0.04em]">
                    <mat-icon class="text-[12px]! w-3! h-3!">verified</mat-icon>
                    <span>Somaliland Chamber Endorsed Mandatory</span>
                  </span>
                }
                @if (req.berberaCustomsFastTrack) {
                  <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-xs bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-[11px] font-bold uppercase tracking-[0.04em]">
                    <mat-icon class="text-[12px]! w-3! h-3!">directions_boat</mat-icon>
                    <span>Berbera Port Direct Customs Fast-Track</span>
                  </span>
                }
                <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-xs bg-[#F3F4F6] text-[#4B5563] text-[11px] font-medium">
                  <mat-icon class="text-[12px]! w-3! h-3!">schedule</mat-icon>
                  <span>Tender Deadline: {{ req.deadline }}</span>
                </span>
              </div>
            </div>

            <!-- Financial Callout Box -->
            <div class="bg-[#F8F9FA] border border-[#E5E7EB] rounded-sm p-3.5 flex flex-col justify-between">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">Target Requisition Budget</span>
              <div class="mt-1">
                <div class="text-xl sm:text-2xl font-bold text-[#111111] tabular-nums">
                  {{ service.formatCurrency(req.targetBudgetUSD) }}
                </div>
                <div class="text-[11px] text-[#6B7280] tabular-nums mt-0.5">
                  ≈ {{ service.formatCurrency(req.targetBudgetUSD, service.currency() === 'USD' ? 'SLSH' : 'USD') }}
                </div>
              </div>
              <div class="mt-2 text-[10px] text-[#6B7280] border-t border-[#E5E7EB] pt-1.5 flex items-center justify-between">
                <span>{{ req.lineItems.length }} Line Items Defined</span>
                <span class="font-semibold text-[#111111]">{{ req.bids.length }} Bids Received</span>
              </div>
            </div>
          </div>

          <!-- Requisition Lifecycle Step Progress Indicator (matches exact prompt specs) -->
          <div class="mt-6 pt-5 border-t border-[#E5E7EB]">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Requisition Lifecycle Tracker</span>
              <span class="text-[11px] font-semibold text-[#d71920]">
                Stage {{ req.currentStep }} of 7: {{ getStepLabel(req.currentStep) }}
              </span>
            </div>

            <div class="relative">
              <!-- Tracker steps grid -->
              <div class="grid grid-cols-7 gap-2 items-center">
                @for (step of lifecycleSteps; track step.num) {
                  <button type="button" class="flex flex-col items-center text-center group cursor-pointer focus:outline-none w-full" (click)="onStepClick(req.id, step.num)">
                    <!-- Step connector top bar -->
                    <div class="w-full flex items-center justify-center relative mb-1.5">
                      <!-- Left connector -->
                      @if (step.num > 1) {
                        <div
                          [class]="step.num <= req.currentStep ? 'bg-[#111111]' : 'bg-[#E5E7EB]'"
                          class="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-[4px]"
                        ></div>
                      }
                      <!-- Right connector -->
                      @if (step.num < 7) {
                        <div
                          [class]="step.num < req.currentStep ? 'bg-[#111111]' : (step.num === req.currentStep ? 'bg-[#D71920]' : 'bg-[#E5E7EB]')"
                          class="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[4px]"
                        ></div>
                      }
                      <!-- 24x24px rounded enclosure with high-contrast numerical label -->
                      <div
                        [class]="getStepCircleClass(step.num, req.currentStep)"
                        class="relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-xs transition-transform group-hover:scale-110"
                      >
                        @if (step.num < req.currentStep) {
                          <mat-icon class="text-xs! w-3! h-3!">check</mat-icon>
                        } @else {
                          <span>{{ step.num }}</span>
                        }
                      </div>
                    </div>
                    <!-- Step Label -->
                    <span
                      [class]="step.num === req.currentStep ? 'font-bold text-[#D71920]' : (step.num < req.currentStep ? 'font-semibold text-[#111111]' : 'text-[#6B7280]')"
                      class="text-[10px] leading-tight line-clamp-2 max-w-[100px]"
                    >
                      {{ step.title }}
                    </span>
                  </button>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- RFQ Side-by-Side Multi-Supplier Comparison Matrix -->
        <div class="bg-white border border-[#E5E7EB] rounded-md shadow-xs overflow-hidden">
          <div class="p-4 bg-[#F8F9FA] border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="text-sm font-bold text-[#111111] uppercase tracking-[0.04em] flex items-center space-x-2">
                <mat-icon class="text-base! w-4! h-4! text-[#d71920]">compare_arrows</mat-icon>
                <span>Supplier Sealed Bid Evaluation Matrix</span>
              </h2>
              <p class="text-xs text-[#6B7280] mt-0.5">
                Side-by-side technical, financial, and Chamber endorsement audit for {{ req.id }}
              </p>
            </div>

            <div class="flex items-center space-x-2 text-xs">
              <span class="inline-flex items-center space-x-1 px-2 py-1 rounded-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                <mat-icon class="text-xs! w-3.5! h-3.5!">gavel</mat-icon>
                <span>Lowest Qualified Chamber Bid Highlighted</span>
              </span>
            </div>
          </div>

          @if (req.bids.length === 0) {
            <div class="p-12 text-center text-[#6B7280]">
              <mat-icon class="text-4xl! w-10! h-10! text-[#9ca3af] mb-2">inbox</mat-icon>
              <p class="font-semibold text-sm text-[#111111]">No sealed bids received yet for this tender.</p>
              <p class="text-xs mt-1 max-w-md mx-auto">
                Tender is currently open on the SahanProcure Direct exchange. Suppliers in Hargeisa, Berbera, and Burao are preparing quotations.
              </p>
              <button
                type="button"
                (click)="service.simulateSupplierBid(req.id)"
                class="mt-4 px-3.5 py-2 bg-[#d71920] hover:bg-[#b3141a] text-white text-xs font-semibold rounded-sm cursor-pointer shadow-xs inline-flex items-center space-x-1.5"
              >
                <mat-icon class="text-xs! w-3.5! h-3.5!">add</mat-icon>
                <span>Simulate Inbound Supplier Bid</span>
              </button>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-[#F8F9FA] border-b border-[#E5E7EB]">
                    <!-- Evaluation Criteria Column Header -->
                    <th class="py-3 px-4 text-[11px] font-bold uppercase tracking-[0.05em] text-[#4B5563] w-[240px] sticky left-0 bg-[#F8F9FA] z-20 shadow-xs border-r border-[#E5E7EB]">
                      Evaluation Parameter
                    </th>
                    <!-- Dynamic Supplier Bid Headers -->
                    @for (bid of req.bids; track bid.id) {
                      <th
                        [class.bg-[#fef2f2]/60]="bid.status === 'Awarded'"
                        class="py-3 px-4 min-w-[280px] border-r border-[#E5E7EB] last:border-r-0 relative"
                      >
                        <!-- Top status chip -->
                        <div class="flex items-center justify-between mb-1">
                          <span class="font-mono text-[10px] font-bold text-[#6B7280]">{{ bid.id }}</span>
                          @if (bid.status === 'Awarded') {
                            <span class="h-[22px] px-2 rounded-full bg-[#d71920] text-white text-[10px] font-bold uppercase tracking-wider inline-flex items-center space-x-1">
                              <mat-icon class="text-[11px]! w-3! h-3!">star</mat-icon>
                              <span>AWARDED</span>
                            </span>
                          } @else if (bid.variancePct <= 0) {
                            <span class="px-1.5 py-0.5 rounded-xs bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              BEST VALUE
                            </span>
                          }
                        </div>

                        <div class="font-bold text-[#111111] text-sm leading-tight">
                          {{ bid.supplierName }}
                        </div>

                        <!-- Chamber Verified Badge (Official Chamber badge format) -->
                        <div class="mt-1.5">
                          @if (bid.chamberVerified) {
                            <div class="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-xs bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-[10px] font-bold uppercase tracking-[0.04em]">
                              <mat-icon class="text-[12px]! w-3! h-3!">verified</mat-icon>
                              <span>{{ bid.chamberRegNo }}</span>
                            </div>
                          }
                        </div>
                      </th>
                    }
                  </tr>
                </thead>

                <tbody class="divide-y divide-[#E5E7EB] text-[13px]">
                  <!-- Row 1: Total Bid Amount -->
                  <tr class="hover:bg-[#F9FAFB] transition-colors">
                    <td class="py-3 px-4 font-semibold text-[#111111] text-xs bg-[#F8F9FA] sticky left-0 z-10 border-r border-[#E5E7EB]">
                      Total Tender Price
                    </td>
                    @for (bid of req.bids; track bid.id) {
                      <td [class.bg-[#fef2f2]/30]="bid.status === 'Awarded'" class="py-3 px-4 border-r border-[#E5E7EB] last:border-r-0">
                        <div class="text-base font-extrabold text-[#111111] tabular-nums">
                          {{ service.formatCurrency(bid.totalBidUSD) }}
                        </div>
                        <div class="text-[11px] text-[#6B7280] tabular-nums">
                          ≈ {{ service.formatCurrency(bid.totalBidUSD, service.currency() === 'USD' ? 'SLSH' : 'USD') }}
                        </div>
                      </td>
                    }
                  </tr>

                  <!-- Row 2: Variance vs Target Budget -->
                  <tr class="hover:bg-[#F9FAFB] transition-colors">
                    <td class="py-3 px-4 font-semibold text-[#111111] text-xs bg-[#F8F9FA] sticky left-0 z-10 border-r border-[#E5E7EB]">
                      Budget Variance Flag
                    </td>
                    @for (bid of req.bids; track bid.id) {
                      <td [class.bg-[#fef2f2]/30]="bid.status === 'Awarded'" class="py-3 px-4 border-r border-[#E5E7EB] last:border-r-0">
                        @if (bid.variancePct <= 0) {
                          <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-xs bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] font-bold text-xs tabular-nums">
                            <mat-icon class="text-xs! w-3! h-3!">arrow_downward</mat-icon>
                            <span>{{ bid.variancePct }}% Under Budget (Cost Savings)</span>
                          </span>
                        } @else {
                          <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-xs bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] font-bold text-xs tabular-nums">
                            <mat-icon class="text-xs! w-3! h-3!">arrow_upward</mat-icon>
                            <span>+{{ bid.variancePct }}% Exceeds Target</span>
                          </span>
                        }
                      </td>
                    }
                  </tr>

                  <!-- Row 3: Delivery Lead Time -->
                  <tr class="hover:bg-[#F9FAFB] transition-colors">
                    <td class="py-3 px-4 font-semibold text-[#111111] text-xs bg-[#F8F9FA] sticky left-0 z-10 border-r border-[#E5E7EB]">
                      Delivery Lead Time
                    </td>
                    @for (bid of req.bids; track bid.id) {
                      <td [class.bg-[#fef2f2]/30]="bid.status === 'Awarded'" class="py-3 px-4 border-r border-[#E5E7EB] last:border-r-0">
                        <div class="font-bold text-[#111111]">
                          {{ bid.leadTimeDays }} Calendar Days
                        </div>
                        <div class="text-[11px] text-[#6B7280]">
                          Arrival at {{ req.hub }}
                        </div>
                      </td>
                    }
                  </tr>

                  <!-- Row 4: Berbera Port Customs Handling -->
                  <tr class="hover:bg-[#F9FAFB] transition-colors">
                    <td class="py-3 px-4 font-semibold text-[#111111] text-xs bg-[#F8F9FA] sticky left-0 z-10 border-r border-[#E5E7EB]">
                      Berbera Port Handling
                    </td>
                    @for (bid of req.bids; track bid.id) {
                      <td [class.bg-[#fef2f2]/30]="bid.status === 'Awarded'" class="py-3 px-4 border-r border-[#E5E7EB] last:border-r-0">
                        @if (bid.portHandlingIncluded) {
                          <div class="inline-flex items-center space-x-1 text-[11px] font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-xs border border-[#BBF7D0]">
                            <mat-icon class="text-[12px]! w-3! h-3!">check_circle</mat-icon>
                            <span>Included (Turnkey DDP)</span>
                          </div>
                        } @else {
                          <div class="inline-flex items-center space-x-1 text-[11px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-xs border border-[#FDE68A]">
                            <mat-icon class="text-[12px]! w-3! h-3!">warning</mat-icon>
                            <span>Excluded (Buyer Port Duties)</span>
                          </div>
                        }
                      </td>
                    }
                  </tr>

                  <!-- Row 5: Warranty & Guarantees -->
                  <tr class="hover:bg-[#F9FAFB] transition-colors">
                    <td class="py-3 px-4 font-semibold text-[#111111] text-xs bg-[#F8F9FA] sticky left-0 z-10 border-r border-[#E5E7EB]">
                      Warranty & Support
                    </td>
                    @for (bid of req.bids; track bid.id) {
                      <td [class.bg-[#fef2f2]/30]="bid.status === 'Awarded'" class="py-3 px-4 border-r border-[#E5E7EB] last:border-r-0">
                        <span class="font-bold text-[#111111]">{{ bid.warrantyMonths }} Months</span>
                        <div class="text-[11px] text-[#6B7280]">OEM Certified Technical Service</div>
                      </td>
                    }
                  </tr>

                  <!-- Row 6: Payment Terms & Settlement Method -->
                  <tr class="hover:bg-[#F9FAFB] transition-colors">
                    <td class="py-3 px-4 font-semibold text-[#111111] text-xs bg-[#F8F9FA] sticky left-0 z-10 border-r border-[#E5E7EB]">
                      Payment Settlement Method
                    </td>
                    @for (bid of req.bids; track bid.id) {
                      <td [class.bg-[#fef2f2]/30]="bid.status === 'Awarded'" class="py-3 px-4 border-r border-[#E5E7EB] last:border-r-0">
                        <div class="font-semibold text-xs text-[#111111]">{{ bid.paymentTerms }}</div>
                        <div class="text-[10px] text-[#6B7280] mt-0.5">Somaliland Central Bank / Escrow Supported</div>
                      </td>
                    }
                  </tr>

                  <!-- Row 7: Chamber Compliance Notes -->
                  <tr class="hover:bg-[#F9FAFB] transition-colors">
                    <td class="py-3 px-4 font-semibold text-[#111111] text-xs bg-[#F8F9FA] sticky left-0 z-10 border-r border-[#E5E7EB]">
                      Chamber Compliance Notes
                    </td>
                    @for (bid of req.bids; track bid.id) {
                      <td [class.bg-[#fef2f2]/30]="bid.status === 'Awarded'" class="py-3 px-4 border-r border-[#E5E7EB] last:border-r-0 text-xs text-[#4B5563]">
                        <p class="line-clamp-2">{{ bid.complianceNotes }}</p>
                        <div class="text-[11px] text-[#15803D] font-semibold mt-1 flex items-center space-x-1">
                          <mat-icon class="text-[11px]! w-3! h-3!">star</mat-icon>
                          <span>Supplier Rating: {{ bid.rating }} / 5.0</span>
                        </div>
                      </td>
                    }
                  </tr>

                  <!-- Action Footer Row: Award Tender Button -->
                  <tr class="bg-[#F8F9FA]">
                    <td class="py-4 px-4 font-bold text-[#111111] text-xs bg-[#F8F9FA] sticky left-0 z-10 border-r border-[#E5E7EB]">
                      Procurement Decision
                    </td>
                    @for (bid of req.bids; track bid.id) {
                      <td [class.bg-[#fef2f2]/50]="bid.status === 'Awarded'" class="py-4 px-4 border-r border-[#E5E7EB] last:border-r-0">
                        @if (bid.status === 'Awarded') {
                          <div class="space-y-1.5">
                            <div class="px-3 py-1.5 bg-[#15803D] text-white font-bold text-xs rounded-sm text-center flex items-center justify-center space-x-1 shadow-xs">
                              <mat-icon class="text-sm! w-4! h-4!">check_circle</mat-icon>
                              <span>TENDER AWARDED</span>
                            </div>
                            <button
                              type="button"
                              (click)="service.isPoModalOpen.set(true)"
                              class="w-full px-2 py-1 bg-[#111111] text-white hover:bg-black font-semibold text-xs rounded-sm text-center cursor-pointer transition-colors"
                            >
                              Open Authorized PO
                            </button>
                          </div>
                        } @else {
                          <div class="space-y-1.5">
                            <button
                              type="button"
                              (click)="onAwardBid(req.id, bid.id)"
                              class="w-full px-3 py-1.5 bg-[#D71920] hover:bg-[#B3141A] active:bg-[#93000D] text-white font-bold text-xs rounded-sm shadow-xs flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                            >
                              <mat-icon class="text-xs! w-3.5! h-3.5!">gavel</mat-icon>
                              <span>Award Tender & Issue PO</span>
                            </button>
                            <button
                              type="button"
                              (click)="service.isAuditDrawerOpen.set(true)"
                              class="w-full px-2 py-1 bg-white hover:bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB] font-medium text-xs rounded-sm text-center cursor-pointer transition-colors"
                            >
                              Audit Dossier
                            </button>
                          </div>
                        }
                      </td>
                    }
                  </tr>
                </tbody>
              </table>
            </div>
          }
        </div>

        <!-- Line Item Rate Comparison Ledger -->
        <div class="bg-white border border-[#E5E7EB] rounded-md shadow-xs p-4 sm:p-5">
          <div class="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div>
              <h3 class="font-bold text-sm text-[#111111] uppercase tracking-[0.04em]">
                Itemized Schedule & Unit Pricing Breakdown
              </h3>
              <p class="text-xs text-[#6B7280]">
                Granular line-item quotes against estimated baseline costs
              </p>
            </div>
            <span class="text-xs font-semibold text-[#6B7280]">
              {{ req.lineItems.length }} Line Items
            </span>
          </div>

          <div class="mt-3 overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F8F9FA] border-b border-[#E5E7EB] text-[#4B5563] text-[11px] font-semibold uppercase tracking-[0.05em]">
                  <th class="py-2.5 px-3">Item #</th>
                  <th class="py-2.5 px-3">Description & Engineering Spec</th>
                  <th class="py-2.5 px-3 text-center">Qty & Unit</th>
                  <th class="py-2.5 px-3 text-right">Est. Unit (USD)</th>
                  @for (bid of req.bids; track bid.id) {
                    <th class="py-2.5 px-3 text-right">
                      {{ bid.supplierName.substring(0, 18) }}...
                    </th>
                  }
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E5E7EB]">
                @for (li of req.lineItems; track li.id) {
                  <tr class="hover:bg-[#F9FAFB]">
                    <td class="py-2.5 px-3 font-mono text-[11px] font-semibold text-[#6B7280]">{{ li.id }}</td>
                    <td class="py-2.5 px-3 max-w-[320px]">
                      <div class="font-bold text-[#111111]">{{ li.description }}</div>
                      <div class="text-[11px] text-[#6B7280] font-mono mt-0.5">{{ li.spec }}</div>
                    </td>
                    <td class="py-2.5 px-3 text-center font-bold text-[#111111]">
                      {{ li.qty }} {{ li.unit }}
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono font-semibold tabular-nums text-[#6B7280]">
                      {{ service.formatCurrency(li.estimatedUnitCostUSD, 'USD') }}
                    </td>
                    @for (bid of req.bids; track bid.id) {
                      <td class="py-2.5 px-3 text-right font-mono tabular-nums">
                        @let itemBid = getLineItemBid(bid, li.id);
                        @if (itemBid) {
                          <div class="font-bold text-[#111111]">
                            {{ service.formatCurrency(itemBid.unitPriceUSD, 'USD') }}
                          </div>
                          <div class="text-[10px] text-[#6B7280]">
                            Total: {{ service.formatCurrency(itemBid.totalPriceUSD, 'USD') }}
                          </div>
                        } @else {
                          <span class="text-[#9CA3AF]">—</span>
                        }
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    }
  `,
})
export class RfqComparison {
  readonly service = inject(ProcurementService);

  readonly lifecycleSteps = [
    { num: 1, title: 'Drafted' },
    { num: 2, title: 'Published RFQ' },
    { num: 3, title: 'Sealed Bids In' },
    { num: 4, title: 'Chamber Audit' },
    { num: 5, title: 'PO Authorized' },
    { num: 6, title: 'Port Clearance' },
    { num: 7, title: 'Delivered' },
  ];

  onRequisitionSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.service.selectRequisition(val, true);
  }

  onStepClick(reqId: string, stepNum: number): void {
    // Allows user to click step or inspect
    const req = this.service.requisitions().find((r) => r.id === reqId);
    if (!req) return;
    if (stepNum > req.currentStep) {
      this.service.advanceRequisitionStep(reqId);
    }
  }

  onAwardBid(reqId: string, bidId: string): void {
    this.service.awardBid(reqId, bidId);
  }

  getStepLabel(step: number): string {
    switch (step) {
      case 1: return 'Requisition Drafted in Local Hub';
      case 2: return 'Published on Somaliland B2B Tender Exchange';
      case 3: return 'Sealed Bids Received & Registered';
      case 4: return 'Chamber Audit & Technical Evaluation';
      case 5: return 'Institutional Purchase Order Authorized';
      case 6: return 'DP World Berbera Port Customs & In-Transit';
      case 7: return 'Delivered & Accepted at Destination Hub';
      default: return 'In Progress';
    }
  }

  getStepCircleClass(stepNum: number, currentStep: number): string {
    if (stepNum < currentStep) {
      return 'bg-[#111111] text-white';
    } else if (stepNum === currentStep) {
      return 'bg-[#D71920] text-white ring-2 ring-[#D71920]/30 ring-offset-1';
    } else {
      return 'bg-[#E5E7EB] text-[#6B7280]';
    }
  }

  getLineItemBid(bid: SupplierBid, lineItemId: string) {
    return bid.lineItemBids.find((b) => b.lineItemId === lineItemId);
  }
}
