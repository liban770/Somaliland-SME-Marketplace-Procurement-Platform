import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProcurementService } from '../../services/procurement.service';

@Component({
  selector: 'app-supplier-directory',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="space-y-4">
      <div class="bg-white border border-[#E5E7EB] rounded-md shadow-xs p-4 sm:p-5">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
          <div>
            <h1 class="text-lg font-bold text-[#111111] uppercase tracking-[0.04em] flex items-center space-x-2">
              <mat-icon class="text-base! w-4! h-4! text-[#15803D]">verified</mat-icon>
              <span>Somaliland Chamber of Commerce Endorsed Suppliers</span>
            </h1>
            <p class="text-xs text-[#6B7280] mt-0.5">
              Audited enterprise suppliers registered with the Somaliland Ministry of Trade & Chamber of Commerce with bonded logistics facilities
            </p>
          </div>

          <div class="flex items-center space-x-2 text-xs">
            <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-sm bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] font-bold">
              <mat-icon class="text-xs! w-3.5! h-3.5!">check_circle</mat-icon>
              <span>100% Tax & Legal Compliance Verified</span>
            </span>
          </div>
        </div>

        <!-- Supplier Cards Grid -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (supplier of service.suppliers(); track supplier.id) {
            <div class="bg-white border border-[#E5E7EB] rounded-md p-4 shadow-xs hover:border-[#111111] transition-all flex flex-col justify-between">
              <div>
                <!-- Top info -->
                <div class="flex items-start justify-between gap-2">
                  <div class="font-bold text-sm text-[#111111] leading-tight">
                    {{ supplier.name }}
                  </div>
                  <div class="flex items-center space-x-1 text-xs font-bold text-[#15803D] bg-[#F0FDF4] px-1.5 py-0.5 rounded-xs border border-[#BBF7D0] whitespace-nowrap">
                    <mat-icon class="text-[12px]! w-3! h-3!">star</mat-icon>
                    <span>{{ supplier.rating }}</span>
                  </div>
                </div>

                <!-- Chamber Registry & Location -->
                <div class="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span class="inline-flex items-center space-x-1 font-mono font-bold text-[#15803D] bg-[#F0FDF4] px-1.5 py-0.2 rounded-xs border border-[#BBF7D0]">
                    <mat-icon class="text-[10px]! w-2.5! h-2.5!">verified</mat-icon>
                    <span>{{ supplier.chamberRegNo }}</span>
                  </span>
                  <span class="inline-flex items-center space-x-0.5 text-[#111111] font-medium bg-[#F8F9FA] px-1.5 py-0.2 rounded-xs border border-[#E5E7EB]">
                    <mat-icon class="text-[11px]! w-3! h-3! text-[#d71920]">location_on</mat-icon>
                    <span>{{ supplier.hub }}</span>
                  </span>
                </div>

                <!-- Categories -->
                <div class="mt-3 flex flex-wrap gap-1">
                  @for (cat of supplier.categories; track cat) {
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-xs bg-[#F3F4F6] text-[#4B5563]">
                      {{ cat }}
                    </span>
                  }
                </div>

                <!-- Stats: Warehousing & Completed Tenders -->
                <div class="mt-3 pt-3 border-t border-[#E5E7EB] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span class="text-[10px] uppercase tracking-wider text-[#6B7280]">Tenders Completed</span>
                    <div class="font-bold text-[#111111] mt-0.5">{{ supplier.tendersCompleted }} Orders</div>
                  </div>
                  <div>
                    <span class="text-[10px] uppercase tracking-wider text-[#6B7280]">Bonded Storage</span>
                    <div class="font-bold text-[#111111] mt-0.5">{{ supplier.bondedWarehouseSqM.toLocaleString() }} m²</div>
                  </div>
                </div>
              </div>

              <!-- Contact Footer -->
              <div class="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
                <div>
                  <div class="font-medium text-[#111111] text-[11px]">{{ supplier.contactPerson }}</div>
                  <div class="text-[10px] font-mono">{{ supplier.phone }}</div>
                </div>
                <button
                  type="button"
                  (click)="service.activeView.set('matrix')"
                  class="px-2.5 py-1 bg-[#111111] hover:bg-[#262626] text-white text-[11px] font-semibold rounded-xs transition-colors cursor-pointer"
                >
                  View Bids
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class SupplierDirectory {
  readonly service = inject(ProcurementService);
}
