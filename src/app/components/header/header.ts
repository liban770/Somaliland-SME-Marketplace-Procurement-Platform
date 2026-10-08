import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProcurementService } from '../../services/procurement.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <!-- Top Global Enterprise Masthead -->
    <header class="bg-[#111111] text-white border-b border-black select-none sticky top-0 z-40">
      <!-- Main Bar -->
      <div class="max-w-[1720px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <!-- Brand identity -->
        <div class="flex items-center space-x-3.5">
          <div class="w-9 h-9 rounded bg-[#d71920] flex items-center justify-center shadow-inner font-bold text-white text-base tracking-wider">
            SP
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-extrabold tracking-tight text-white text-lg">SAHAN<span class="text-[#d71920]">PROCURE</span></span>
              <span class="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-white/10 text-white/90 rounded-xs">DIRECT</span>
              <span class="hidden md:inline-flex items-center space-x-1 text-[11px] text-[#BBF7D0] bg-[#16A34A]/20 px-2 py-0.5 rounded-xs font-semibold">
                <mat-icon class="text-[13px]! w-3.5! h-3.5!">verified</mat-icon>
                <span>CHAMBER VERIFIED</span>
              </span>
            </div>
            <div class="text-[11px] text-white/50 tracking-wide font-normal">
              Somaliland Commercial Procurement & Berbera Port Logistics Exchange
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <nav class="flex items-center space-x-1 sm:space-x-1.5 bg-white/5 p-1 rounded-sm border border-white/10 text-xs font-medium">
          <button
            type="button"
            (click)="service.activeView.set('requisitions')"
            [class]="service.activeView() === 'requisitions'
              ? 'bg-[#d71920] text-white shadow-xs'
              : 'text-white/70 hover:text-white hover:bg-white/10'"
            class="px-2.5 py-1.5 rounded-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <mat-icon class="text-sm! w-4! h-4!">list_alt</mat-icon>
            <span>Tenders & RFQs</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-xs bg-black/40 font-semibold">{{ service.requisitions().length }}</span>
          </button>

          <button
            type="button"
            (click)="service.activeView.set('matrix')"
            [class]="service.activeView() === 'matrix'
              ? 'bg-[#d71920] text-white shadow-xs'
              : 'text-white/70 hover:text-white hover:bg-white/10'"
            class="px-2.5 py-1.5 rounded-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <mat-icon class="text-sm! w-4! h-4!">compare_arrows</mat-icon>
            <span>Bid Evaluation</span>
          </button>

          <button
            type="button"
            (click)="service.activeView.set('customs')"
            [class]="service.activeView() === 'customs'
              ? 'bg-[#d71920] text-white shadow-xs'
              : 'text-white/70 hover:text-white hover:bg-white/10'"
            class="px-2.5 py-1.5 rounded-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <mat-icon class="text-sm! w-4! h-4!">directions_boat</mat-icon>
            <span>Berbera Port Manifests</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-xs bg-blue-500/30 text-blue-200 font-semibold">{{ service.allCustomsManifests().length }}</span>
          </button>

          <button
            type="button"
            (click)="service.activeView.set('purchase-orders')"
            [class]="service.activeView() === 'purchase-orders'
              ? 'bg-[#d71920] text-white shadow-xs'
              : 'text-white/70 hover:text-white hover:bg-white/10'"
            class="px-2.5 py-1.5 rounded-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <mat-icon class="text-sm! w-4! h-4!">receipt_long</mat-icon>
            <span>Purchase Orders</span>
          </button>

          <button
            type="button"
            (click)="service.activeView.set('suppliers')"
            [class]="service.activeView() === 'suppliers'
              ? 'bg-[#d71920] text-white shadow-xs'
              : 'text-white/70 hover:text-white hover:bg-white/10'"
            class="px-2.5 py-1.5 rounded-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <mat-icon class="text-sm! w-4! h-4!">domain</mat-icon>
            <span>Suppliers Directory</span>
          </button>
        </nav>

        <!-- Right Tools & User Info -->
        <div class="flex items-center space-x-2.5">
          <!-- Currency Toggle -->
          <div class="flex items-center bg-white/10 border border-white/15 rounded-sm p-0.5 text-xs">
            <button
              type="button"
              (click)="service.currency.set('USD')"
              [class]="service.currency() === 'USD' ? 'bg-[#d71920] text-white font-bold' : 'text-white/60 hover:text-white'"
              class="px-2 py-1 rounded-xs transition-colors cursor-pointer"
              title="Show pricing in US Dollars"
            >
              USD ($)
            </button>
            <button
              type="button"
              (click)="service.currency.set('SLSH')"
              [class]="service.currency() === 'SLSH' ? 'bg-[#d71920] text-white font-bold' : 'text-white/60 hover:text-white'"
              class="px-2 py-1 rounded-xs transition-colors cursor-pointer"
              title="Show pricing in Somaliland Shillings (1 USD = 8,500 SLSH)"
            >
              SLSH
            </button>
          </div>

          <!-- Hub Filter -->
          <div class="hidden xl:flex items-center text-xs text-white/70 space-x-1 bg-white/5 border border-white/10 px-2 py-1 rounded-sm">
            <mat-icon class="text-xs! w-3.5! h-3.5! text-white/50">location_on</mat-icon>
            <span class="text-white/50">Hub:</span>
            <select
              [value]="service.selectedHubFilter()"
              (change)="onHubChange($event)"
              class="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL" class="bg-[#111111] text-white">All Somaliland Hubs</option>
              <option value="Hargeisa HQ" class="bg-[#111111] text-white">Hargeisa HQ (Capital)</option>
              <option value="Berbera Free Zone" class="bg-[#111111] text-white">Berbera Free Zone & Port</option>
              <option value="Burao Hub" class="bg-[#111111] text-white">Burao Logistics Hub</option>
              <option value="Borama Depot" class="bg-[#111111] text-white">Borama Regional Depot</option>
            </select>
          </div>

          <!-- Audit Log Drawer trigger -->
          <button
            type="button"
            (click)="service.isAuditDrawerOpen.set(!service.isAuditDrawerOpen())"
            class="px-2.5 py-1.5 rounded-sm bg-white/10 hover:bg-white/20 text-white/90 border border-white/15 flex items-center space-x-1.5 text-xs transition-colors cursor-pointer"
            title="Open Chamber Audit & Event Ledger"
          >
            <mat-icon class="text-sm! w-4! h-4!">history</mat-icon>
            <span class="hidden md:inline">Audit Trail</span>
          </button>

          <!-- Primary Action: New RFQ -->
          <button
            type="button"
            (click)="service.isCreateModalOpen.set(true)"
            class="px-3 py-1.5 bg-[#d71920] hover:bg-[#b3141a] active:bg-[#93000d] text-white font-semibold text-xs rounded-sm shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <mat-icon class="text-sm! w-4! h-4!">add_circle</mat-icon>
            <span>New RFQ</span>
          </button>

          <!-- Signatory Badge -->
          <div class="hidden lg:flex items-center space-x-2 pl-2 border-l border-white/15 text-xs">
            <div class="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-[11px]">
              AL
            </div>
            <div class="leading-tight text-left">
              <div class="font-medium text-white text-[11px]">Eng. Ahmed Liban</div>
              <div class="text-[10px] text-white/50">CPO • Somaliland</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Institutional Ticker / Operational Sub-bar -->
      <div class="bg-[#1c1b1b] border-t border-white/10 px-4 sm:px-6 py-1 text-[11px] text-white/70 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-1.5 text-emerald-400">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="font-semibold">DP World Berbera Port:</span>
            <span class="text-white/80">Container Terminal Quay 1 & 2 Normal • Customs Fast-Track Active</span>
          </div>
          <div class="hidden md:flex items-center space-x-1.5 text-white/60">
            <mat-icon class="text-xs! w-3.5! h-3.5!">currency_exchange</mat-icon>
            <span>Official B2B Benchmark: 1 USD = 8,500 SLSH</span>
          </div>
        </div>
        <div class="flex items-center space-x-3 text-white/60 text-[11px]">
          <span class="hidden sm:inline">Chamber Registry Standard: Somaliland Commercial Code v4.2</span>
          <span class="px-2 py-0.2 rounded-xs bg-white/10 text-white/80 font-mono text-[10px]">SYSTEM READY</span>
        </div>
      </div>
    </header>
  `,
})
export class Header {
  readonly service = inject(ProcurementService);

  onHubChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.service.selectedHubFilter.set(val);
  }
}
