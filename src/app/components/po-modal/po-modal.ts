import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProcurementService } from '../../services/procurement.service';

@Component({
  selector: 'app-po-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @let req = service.activeRequisition();
    @let po = req?.po;

    @if (service.isPoModalOpen() && req && po) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none overflow-y-auto">
        <div class="bg-white border border-[#E5E7EB] rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
          <!-- Modal Header (Enterprise Obsidian) -->
          <div class="bg-[#111111] text-white px-5 py-3 flex items-center justify-between border-b border-black">
            <div class="flex items-center space-x-2">
              <mat-icon class="text-[#d71920] text-base! w-4! h-4!">verified</mat-icon>
              <span class="text-xs font-bold uppercase tracking-wider text-white">
                Official Institutional Purchase Order — {{ po.poNumber }}
              </span>
              <span [class]="po.status === 'Authorized' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'" class="text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase">
                {{ po.status }}
              </span>
            </div>

            <div class="flex items-center space-x-2">
              <button
                type="button"
                (click)="printPO()"
                class="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xs flex items-center space-x-1 cursor-pointer transition-colors"
                title="Print or export document"
              >
                <mat-icon class="text-xs! w-3.5! h-3.5!">print</mat-icon>
                <span>Print PO</span>
              </button>
              <button
                type="button"
                (click)="service.isPoModalOpen.set(false)"
                class="w-7 h-7 rounded-sm bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <mat-icon class="text-sm! w-4! h-4!">close</mat-icon>
              </button>
            </div>
          </div>

          <!-- Formal Institutional PO Sheet (Audited Ledger Style) -->
          <div class="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#ffffff] space-y-6 text-[#171717]" id="printable-po">
            <!-- Masthead / Document Header -->
            <div class="border-b-2 border-[#111111] pb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 rounded-xs bg-[#d71920] flex items-center justify-center font-bold text-white text-sm">
                    SP
                  </div>
                  <span class="text-xl font-extrabold tracking-tight text-[#111111]">
                    SAHAN<span class="text-[#d71920]">PROCURE</span> DIRECT
                  </span>
                </div>
                <div class="text-[11px] text-[#6B7280] mt-1">
                  Somaliland B2B Commercial Procurement & Logistics Authority
                </div>
                <div class="text-[11px] text-[#6B7280]">
                  Headquarters: Independence Avenue, Hargeisa | Regional Hub: DP World Berbera Port
                </div>
              </div>

              <!-- Official Number & QR simulation -->
              <div class="text-right flex items-start justify-end space-x-4">
                <div>
                  <div class="text-xs uppercase tracking-wider font-bold text-[#6B7280]">PURCHASE ORDER</div>
                  <div class="text-lg font-mono font-bold text-[#111111]">{{ po.poNumber }}</div>
                  <div class="text-xs text-[#6B7280]">Date: {{ po.issueDate }}</div>
                  <div class="text-[11px] text-[#6B7280]">Tender: <strong class="font-mono text-[#111111]">{{ po.requisitionId }}</strong></div>
                </div>

                <!-- QR Stamp -->
                <div class="w-16 h-16 border border-[#E5E7EB] bg-[#F8F9FA] p-1 rounded-xs flex flex-col items-center justify-center text-center shadow-2xs">
                  <mat-icon class="text-2xl! w-6! h-6! text-[#111111]">qr_code_2</mat-icon>
                  <span class="text-[8px] font-mono text-[#6B7280] leading-none mt-0.5">SL-VERIFIED</span>
                </div>
              </div>
            </div>

            <!-- Party Details: Buyer & Vendor -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-[#E5E7EB] rounded-sm p-4 bg-[#F8F9FA] text-xs">
              <!-- Buyer -->
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Procuring Entity (Buyer)</span>
                <div class="font-bold text-sm text-[#111111] mt-0.5">{{ req.buyerEntity }}</div>
                <div class="text-xs text-[#4B5563] mt-0.5">Delivery Hub: <strong>{{ po.commercialHub }}</strong></div>
                <div class="text-xs text-[#4B5563]">Port Clearance: DP World Berbera Free Zone Dedicated Gate</div>
              </div>

              <!-- Supplier -->
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Awarded Supplier (Vendor)</span>
                <div class="font-bold text-sm text-[#111111] mt-0.5">{{ po.vendorName }}</div>
                <div class="flex items-center space-x-1 text-[11px] text-[#15803D] font-bold mt-0.5">
                  <mat-icon class="text-[12px]! w-3! h-3!">verified</mat-icon>
                  <span>Chamber Reg: {{ po.vendorChamberId }}</span>
                </div>
                <div class="text-xs text-[#4B5563]">{{ po.vendorContact }}</div>
              </div>
            </div>

            <!-- Commercial Terms Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-y border-[#E5E7EB] py-3">
              <div>
                <span class="text-[10px] font-semibold uppercase text-[#6B7280]">Payment Terms</span>
                <div class="font-bold text-[#111111] mt-0.5">{{ po.paymentTerms }}</div>
              </div>
              <div>
                <span class="text-[10px] font-semibold uppercase text-[#6B7280]">Shipping & Freight Terms</span>
                <div class="font-bold text-[#111111] mt-0.5">{{ po.shippingTerms }}</div>
              </div>
              <div>
                <span class="text-[10px] font-semibold uppercase text-[#6B7280]">Delivery Schedule</span>
                <div class="font-bold text-[#111111] mt-0.5">{{ po.expectedDelivery }}</div>
              </div>
            </div>

            <!-- Line Items Schedule -->
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                Contract Line-Item Schedule
              </div>
              <div class="border border-[#E5E7EB] rounded-xs overflow-hidden">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-[#F8F9FA] border-b border-[#E5E7EB] text-[#4B5563] text-[10px] font-bold uppercase tracking-wider">
                      <th class="py-2 px-3">Item #</th>
                      <th class="py-2 px-3">Description & Specification</th>
                      <th class="py-2 px-3 text-center">Quantity</th>
                      <th class="py-2 px-3 text-right">Unit Price (USD)</th>
                      <th class="py-2 px-3 text-right">Total Price (USD)</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#E5E7EB]">
                    @for (li of req.lineItems; track li.id) {
                      <tr>
                        <td class="py-2.5 px-3 font-mono text-[#6B7280]">{{ li.id }}</td>
                        <td class="py-2.5 px-3">
                          <div class="font-bold text-[#111111]">{{ li.description }}</div>
                          <div class="text-[11px] text-[#6B7280]">{{ li.spec }}</div>
                        </td>
                        <td class="py-2.5 px-3 text-center font-bold">{{ li.qty }} {{ li.unit }}</td>
                        <td class="py-2.5 px-3 text-right tabular-nums font-mono">
                          {{ service.formatCurrency(li.estimatedUnitCostUSD, 'USD') }}
                        </td>
                        <td class="py-2.5 px-3 text-right tabular-nums font-mono font-bold">
                          {{ service.formatCurrency(li.estimatedUnitCostUSD * li.qty, 'USD') }}
                        </td>
                      </tr>
                    }
                  </tbody>
                  <tfoot>
                    <tr class="bg-[#F8F9FA] border-t-2 border-[#111111]">
                      <td colspan="4" class="py-3 px-3 text-right font-bold uppercase text-xs text-[#111111]">
                        Total Contract Value (USD):
                      </td>
                      <td class="py-3 px-3 text-right font-bold text-base text-[#111111] tabular-nums font-mono">
                        {{ service.formatCurrency(po.totalAmountUSD, 'USD') }}
                      </td>
                    </tr>
                    <tr class="bg-[#F8F9FA] border-t border-[#E5E7EB]">
                      <td colspan="4" class="py-2 px-3 text-right font-semibold text-xs text-[#6B7280]">
                        Equivalent in Somaliland Shilling (Rate: 8,500 SLSH / 1 USD):
                      </td>
                      <td class="py-2 px-3 text-right font-bold text-xs text-[#d71920] tabular-nums font-mono">
                        {{ service.formatCurrency(po.totalAmountUSD, 'SLSH') }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Dual Signatory Approval Section (matches precision enterprise rules) -->
            <div class="border-t-2 border-[#111111] pt-4">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Institutional Signatory Authorizations
                </span>
                <span class="text-[11px] text-[#6B7280]">
                  Dual approval required pursuant to Somaliland Public Finance Act
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                @for (sig of po.signatories; track sig.role) {
                  <div class="border border-[#E5E7EB] rounded-sm p-4 bg-[#F8F9FA] space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                        {{ sig.role }}
                      </span>
                      @if (sig.signed) {
                        <span class="inline-flex items-center space-x-1 text-[10px] font-bold text-[#15803D] bg-[#F0FDF4] px-1.5 py-0.5 rounded-xs border border-[#BBF7D0]">
                          <mat-icon class="text-[10px]! w-2.5! h-2.5!">check_circle</mat-icon>
                          <span>AUTHENTICATED</span>
                        </span>
                      } @else {
                        <span class="text-[10px] font-bold text-[#B45309] bg-[#FEF3C7] px-1.5 py-0.5 rounded-xs border border-[#FDE68A]">
                          AWAITING SIGNATURE
                        </span>
                      }
                    </div>

                    <div class="font-bold text-xs text-[#111111]">{{ sig.name }}</div>
                    <div class="text-[11px] text-[#6B7280]">{{ sig.title }}</div>

                    <!-- Signature Box -->
                    <div class="h-14 border border-dashed border-[#CBD5E1] rounded-xs bg-white flex items-center justify-center p-2">
                      @if (sig.signed) {
                        <div class="text-center">
                          <div class="font-serif italic font-bold text-sm text-[#111111] tracking-wide">
                            {{ sig.name }}
                          </div>
                          <div class="text-[9px] font-mono text-[#6B7280]">{{ sig.signatureCode }} • {{ sig.signedAt }}</div>
                        </div>
                      } @else {
                        <button
                          type="button"
                          (click)="onSignPO(req.id, sig.role)"
                          class="px-3 py-1.5 bg-[#D71920] hover:bg-[#B3141A] text-white text-xs font-bold rounded-xs cursor-pointer shadow-xs flex items-center space-x-1 transition-colors"
                        >
                          <mat-icon class="text-xs! w-3.5! h-3.5!">draw</mat-icon>
                          <span>Authorize & Apply Digital Seal</span>
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Legal Compliance Endorsement Stamp -->
            <div class="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-sm text-xs text-[#15803D] flex items-center space-x-2">
              <mat-icon class="text-base! w-4! h-4!">verified_user</mat-icon>
              <span>
                <strong>Somaliland Chamber of Commerce Electronic Endorsement:</strong> Validated under Commercial Registration Act. Enforceable before the Regional Commercial Court of Hargeisa.
              </span>
            </div>
          </div>

          <!-- Modal Bottom Action Bar -->
          <div class="bg-[#F8F9FA] border-t border-[#E5E7EB] px-5 py-3 flex items-center justify-between">
            <span class="text-xs text-[#6B7280]">
              Status: <strong class="text-[#111111]">{{ po.status }}</strong>
            </span>
            <div class="flex items-center space-x-2">
              <button
                type="button"
                (click)="service.isPoModalOpen.set(false)"
                class="px-3.5 py-1.5 bg-white hover:bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB] text-xs font-semibold rounded-sm cursor-pointer transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                (click)="printPO()"
                class="px-3.5 py-1.5 bg-[#111111] hover:bg-[#262626] text-white text-xs font-bold rounded-sm cursor-pointer transition-colors flex items-center space-x-1"
              >
                <mat-icon class="text-xs! w-3.5! h-3.5!">print</mat-icon>
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class PoModal {
  readonly service = inject(ProcurementService);

  onSignPO(reqId: string, role: string): void {
    if (role === 'Financial Controller' || role === 'Managing Director') {
      this.service.signPO(reqId, role);
    }
  }

  printPO(): void {
    window.print();
  }
}
