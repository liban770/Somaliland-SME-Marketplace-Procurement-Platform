import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProcurementService } from '../../services/procurement.service';

@Component({
  selector: 'app-purchase-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="space-y-4">
      <div class="bg-white border border-[#E5E7EB] rounded-md shadow-xs p-4 sm:p-5">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
          <div>
            <h1 class="text-lg font-bold text-[#111111] uppercase tracking-[0.04em] flex items-center space-x-2">
              <mat-icon class="text-base! w-4! h-4! text-[#d71920]">receipt_long</mat-icon>
              <span>Authorized Commercial Purchase Orders (PO)</span>
            </h1>
            <p class="text-xs text-[#6B7280] mt-0.5">
              Binding institutional procurement contracts with dual signatory authentication and Chamber verification
            </p>
          </div>

          <div class="flex items-center space-x-2 text-xs">
            <span class="text-[#6B7280]">Total Orders:</span>
            <span class="font-bold text-[#111111] bg-[#F8F9FA] px-2.5 py-1 rounded-sm border border-[#E5E7EB]">
              {{ service.allPurchaseOrders().length }} Active Orders
            </span>
          </div>
        </div>

        @if (service.allPurchaseOrders().length === 0) {
          <div class="p-12 text-center text-[#6B7280]">
            <mat-icon class="text-4xl! w-10! h-10! text-[#9ca3af] mb-2">receipt</mat-icon>
            <p class="font-semibold text-sm text-[#111111]">No Purchase Orders Issued Yet</p>
            <p class="text-xs mt-1">
              Select an active tender from the Bid Evaluation Matrix and click "Award Tender & Issue PO".
            </p>
            <button
              type="button"
              (click)="service.activeView.set('matrix')"
              class="mt-4 px-4 py-2 bg-[#d71920] text-white text-xs font-semibold rounded-sm cursor-pointer hover:bg-[#b3141a]"
            >
              Go to Bid Evaluation Matrix
            </button>
          </div>
        } @else {
          <div class="mt-4 overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#F8F9FA] border-b border-[#E5E7EB] text-[#4B5563] text-[11px] font-semibold uppercase tracking-[0.05em]">
                  <th class="py-3 px-3.5">PO Number</th>
                  <th class="py-3 px-3.5">Supplier & Chamber Reg</th>
                  <th class="py-3 px-3.5">Associated Tender</th>
                  <th class="py-3 px-3.5 text-right">Total Amount</th>
                  <th class="py-3 px-3.5">Settlement Terms</th>
                  <th class="py-3 px-3.5">Signatory Status</th>
                  <th class="py-3 px-3.5">Status</th>
                  <th class="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E5E7EB] text-[13px] text-[#171717]">
                @for (item of service.allPurchaseOrders(); track item.po.poNumber) {
                  <tr class="hover:bg-[#F9FAFB] transition-colors">
                    <!-- PO Number -->
                    <td class="py-3.5 px-3.5 whitespace-nowrap">
                      <div class="font-mono font-bold text-xs text-[#111111]">
                        {{ item.po.poNumber }}
                      </div>
                      <div class="text-[11px] text-[#6B7280]">
                        Issued: {{ item.po.issueDate }}
                      </div>
                    </td>

                    <!-- Supplier -->
                    <td class="py-3.5 px-3.5">
                      <div class="font-bold text-[#111111]">
                        {{ item.po.vendorName }}
                      </div>
                      <div class="inline-flex items-center space-x-1 text-[10px] text-[#15803D] bg-[#F0FDF4] px-1.5 py-0.2 rounded-xs border border-[#BBF7D0] mt-0.5 font-bold uppercase">
                        <mat-icon class="text-[10px]! w-2.5! h-2.5!">verified</mat-icon>
                        <span>{{ item.po.vendorChamberId }}</span>
                      </div>
                    </td>

                    <!-- Tender Title -->
                    <td class="py-3.5 px-3.5 max-w-[240px]">
                      <div class="font-semibold text-xs text-[#171717] line-clamp-1">
                        {{ item.requisition.title }}
                      </div>
                      <div class="text-[11px] text-[#6B7280]">
                        Ref: <strong class="font-mono">{{ item.requisition.id }}</strong> ({{ item.po.commercialHub }})
                      </div>
                    </td>

                    <!-- Financials -->
                    <td class="py-3.5 px-3.5 whitespace-nowrap text-right">
                      <div class="font-bold text-[#111111] tabular-nums">
                        {{ service.formatCurrency(item.po.totalAmountUSD) }}
                      </div>
                      <div class="text-[10px] text-[#6B7280] tabular-nums">
                        ≈ {{ service.formatCurrency(item.po.totalAmountUSD, service.currency() === 'USD' ? 'SLSH' : 'USD') }}
                      </div>
                    </td>

                    <!-- Payment Terms -->
                    <td class="py-3.5 px-3.5 text-xs text-[#4B5563]">
                      {{ item.po.paymentTerms }}
                    </td>

                    <!-- Signatories -->
                    <td class="py-3.5 px-3.5 whitespace-nowrap">
                      <div class="space-y-1">
                        @for (sig of item.po.signatories; track sig.role) {
                          <div class="flex items-center space-x-1 text-[11px]">
                            @if (sig.signed) {
                              <mat-icon class="text-xs! w-3! h-3! text-[#15803D]">check_circle</mat-icon>
                              <span class="font-medium text-[#111111]">{{ sig.role }}: Signed</span>
                            } @else {
                              <mat-icon class="text-xs! w-3! h-3! text-[#F59E0B]">pending</mat-icon>
                              <span class="text-[#B45309] font-medium">{{ sig.role }}: Pending</span>
                            }
                          </div>
                        }
                      </div>
                    </td>

                    <!-- Status Pill -->
                    <td class="py-3.5 px-3.5 whitespace-nowrap">
                      @if (item.po.status === 'Authorized') {
                        <span class="h-[22px] px-2 rounded-full bg-[#ECFDF5] text-[#047857] text-[11px] font-bold uppercase tracking-wider inline-flex items-center space-x-1 border border-[#A7F3D0]">
                          <span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                          <span>Authorized</span>
                        </span>
                      } @else {
                        <span class="h-[22px] px-2 rounded-full bg-[#FEF3C7] text-[#B45309] text-[11px] font-bold uppercase tracking-wider inline-flex items-center space-x-1 border border-[#FDE68A]">
                          <span class="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                          <span>Pending Signatures</span>
                        </span>
                      }
                    </td>

                    <!-- Action -->
                    <td class="py-3.5 px-3.5 whitespace-nowrap text-right">
                      <button
                        type="button"
                        (click)="onOpenPODocument(item.requisition.id)"
                        class="px-3 py-1.5 bg-[#111111] hover:bg-[#262626] text-white font-semibold text-xs rounded-sm shadow-xs transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <mat-icon class="text-xs! w-3.5! h-3.5!">visibility</mat-icon>
                        <span>Inspect PO Slip</span>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
})
export class PurchaseOrders {
  readonly service = inject(ProcurementService);

  onOpenPODocument(requisitionId: string): void {
    this.service.selectRequisition(requisitionId, false);
    this.service.isPoModalOpen.set(true);
  }
}
