import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProcurementService } from '../../services/procurement.service';

@Component({
  selector: 'app-metrics-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 my-4">
      <!-- Metric 1: Active Tenders -->
      <div class="bg-white border border-[#E5E7EB] rounded-md p-3.5 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6B7280]">Active Requisitions</span>
          <div class="w-7 h-7 rounded-xs bg-[#f8f9fa] border border-[#E5E7EB] flex items-center justify-center text-[#111111]">
            <mat-icon class="text-sm! w-4! h-4!">assignment</mat-icon>
          </div>
        </div>
        <div class="mt-2">
          <div class="text-[22px] font-bold text-[#111111] leading-tight">
            {{ service.metrics().activeCount }} <span class="text-xs font-normal text-[#6B7280]">/ {{ service.metrics().totalCount }} tenders</span>
          </div>
          <div class="mt-2 inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-xs text-[11px] font-medium bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]">
            <mat-icon class="text-[12px]! w-3! h-3!">trending_up</mat-icon>
            <span>+2 Closing This Week</span>
          </div>
        </div>
      </div>

      <!-- Metric 2: Committed Capital -->
      <div class="bg-white border border-[#E5E7EB] rounded-md p-3.5 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6B7280]">Committed Capital</span>
          <div class="w-7 h-7 rounded-xs bg-[#f8f9fa] border border-[#E5E7EB] flex items-center justify-center text-[#d71920]">
            <mat-icon class="text-sm! w-4! h-4!">account_balance_wallet</mat-icon>
          </div>
        </div>
        <div class="mt-2">
          <div class="text-[20px] font-bold text-[#111111] leading-tight tabular-nums truncate">
            {{ service.formatCurrency(service.metrics().committedUSD) }}
          </div>
          <div class="text-[11px] text-[#6B7280] tabular-nums mt-0.5 truncate">
            ≈ {{ service.formatCurrency(service.metrics().committedUSD, service.currency() === 'USD' ? 'SLSH' : 'USD') }}
          </div>
          <div class="mt-1.5 inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-xs text-[11px] font-medium bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]">
            <mat-icon class="text-[12px]! w-3! h-3!">lock</mat-icon>
            <span>Central Bank Fixed Ledger</span>
          </div>
        </div>
      </div>

      <!-- Metric 3: Berbera Port Customs Cleared -->
      <div class="bg-white border border-[#E5E7EB] rounded-md p-3.5 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6B7280]">Berbera Customs Cleared</span>
          <div class="w-7 h-7 rounded-xs bg-[#f8f9fa] border border-[#E5E7EB] flex items-center justify-center text-[#2563eb]">
            <mat-icon class="text-sm! w-4! h-4!">anchor</mat-icon>
          </div>
        </div>
        <div class="mt-2">
          <div class="text-[22px] font-bold text-[#111111] leading-tight">
            {{ service.metrics().customsClearanceRate }}% <span class="text-xs font-normal text-[#15803d]">On-Schedule</span>
          </div>
          <div class="mt-2 inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-xs text-[11px] font-medium bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]">
            <mat-icon class="text-[12px]! w-3! h-3!">directions_boat</mat-icon>
            <span>DP World Quay 1 & 2 Fast-Track</span>
          </div>
        </div>
      </div>

      <!-- Metric 4: Tender Velocity -->
      <div class="bg-white border border-[#E5E7EB] rounded-md p-3.5 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6B7280]">Procurement Velocity</span>
          <div class="w-7 h-7 rounded-xs bg-[#f8f9fa] border border-[#E5E7EB] flex items-center justify-center text-[#111111]">
            <mat-icon class="text-sm! w-4! h-4!">speed</mat-icon>
          </div>
        </div>
        <div class="mt-2">
          <div class="text-[22px] font-bold text-[#111111] leading-tight">
            {{ service.metrics().avgTenderDays }} <span class="text-xs font-normal text-[#6B7280]">Days avg cycle</span>
          </div>
          <div class="mt-2 inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-xs text-[11px] font-medium bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]">
            <mat-icon class="text-[12px]! w-3! h-3!">arrow_downward</mat-icon>
            <span>-2.1 Days vs regional average</span>
          </div>
        </div>
      </div>

      <!-- Metric 5: Chamber Compliance -->
      <div class="bg-white border border-[#E5E7EB] rounded-md p-3.5 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6B7280]">Chamber Compliance</span>
          <div class="w-7 h-7 rounded-xs bg-[#f8f9fa] border border-[#E5E7EB] flex items-center justify-center text-[#15803d]">
            <mat-icon class="text-sm! w-4! h-4!">verified_user</mat-icon>
          </div>
        </div>
        <div class="mt-2">
          <div class="text-[22px] font-bold text-[#15803d] leading-tight">
            {{ service.metrics().chamberCompliancePct }}%
          </div>
          <div class="mt-2 inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-xs text-[11px] font-medium bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]">
            <mat-icon class="text-[12px]! w-3! h-3!">shield</mat-icon>
            <span>Somaliland Chamber Endorsed</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MetricsBar {
  readonly service = inject(ProcurementService);
}
