import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProcurementService } from '../../services/procurement.service';

@Component({
  selector: 'app-customs-manifests',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="space-y-4">
      <!-- Port Status Header & Overview Banner -->
      <div class="bg-[#111111] text-white rounded-md p-4 sm:p-5 border border-black shadow-xs">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="text-xs font-bold text-emerald-400 tracking-wider uppercase">PORT OF BERBERA • DP WORLD OPERATIONS</span>
              <span class="text-[10px] px-2 py-0.5 rounded-xs bg-white/10 text-white font-mono">BERBERA CORRIDOR V3.4</span>
            </div>
            <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Inbound Procurement Customs & Container Manifests
            </h1>
            <p class="text-xs text-white/60 max-w-2xl">
              Real-time maritime tracking for institutional cargo arriving via Red Sea / Gulf of Aden feeder vessels, with automated Ministry of Finance customs clearance and secure inland road dispatch.
            </p>
          </div>

          <!-- Port Quick Stats -->
          <div class="flex items-center gap-3">
            <div class="bg-white/5 border border-white/10 rounded-sm px-3.5 py-2 text-center">
              <div class="text-[10px] uppercase tracking-wider text-white/50">Berth Waiting</div>
              <div class="text-base font-bold text-white">0.4 Days</div>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-sm px-3.5 py-2 text-center">
              <div class="text-[10px] uppercase tracking-wider text-white/50">Customs Clearance</div>
              <div class="text-base font-bold text-emerald-400">94.2% Rate</div>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-sm px-3.5 py-2 text-center">
              <div class="text-[10px] uppercase tracking-wider text-white/50">Active Convoys</div>
              <div class="text-base font-bold text-white">4 En Route</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Manifests Cards and Table -->
      <div class="bg-white border border-[#E5E7EB] rounded-md shadow-xs overflow-hidden">
        <div class="p-4 bg-[#F8F9FA] border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-sm font-bold text-[#111111] uppercase tracking-[0.04em] flex items-center space-x-2">
              <mat-icon class="text-base! w-4! h-4! text-[#2563EB]">directions_boat</mat-icon>
              <span>Vessel Manifests & Bill of Lading Ledger</span>
            </h2>
            <p class="text-xs text-[#6B7280]">
              Showing active consignment manifests assigned to SahanProcure tenders
            </p>
          </div>

          <div class="flex items-center space-x-2 text-xs">
            <span class="text-[#6B7280]">Active Manifests:</span>
            <span class="font-bold text-[#111111] bg-white px-2 py-0.5 rounded-xs border border-[#E5E7EB]">
              {{ service.allCustomsManifests().length }}
            </span>
          </div>
        </div>

        <div class="divide-y divide-[#E5E7EB]">
          @for (item of service.allCustomsManifests(); track item.manifest.manifestNumber) {
            <div class="p-4 sm:p-5 hover:bg-[#F9FAFB] transition-colors">
              <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <!-- Vessel & Consignment Details -->
                <div class="space-y-2 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="font-mono text-xs font-bold text-[#111111] bg-[#F3F4F6] px-2 py-0.5 rounded-xs border border-[#E5E7EB]">
                      {{ item.manifest.manifestNumber }}
                    </span>
                    <span class="font-semibold text-xs text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-xs border border-[#BFDBFE]">
                      <mat-icon class="text-[12px]! w-3! h-3! inline mr-1">directions_boat</mat-icon>
                      {{ item.manifest.vesselName }}
                    </span>
                    <span class="text-xs text-[#6B7280]">
                      Berth: <strong>{{ item.manifest.berthLocation }}</strong>
                    </span>
                    <span class="text-xs text-[#6B7280]">
                      B/L: <strong class="font-mono text-[#111111]">{{ item.manifest.billOfLading }}</strong>
                    </span>
                  </div>

                  <!-- Requisition Link -->
                  <div>
                    <h3 class="font-bold text-sm text-[#111111]">
                      {{ item.requisition.title }}
                    </h3>
                    <div class="text-xs text-[#6B7280] flex items-center space-x-2 mt-0.5">
                      <span>Tender ID: <strong class="font-mono text-[#d71920]">{{ item.requisition.id }}</strong></span>
                      <span>•</span>
                      <span>Destination Hub: <strong class="text-[#111111]">{{ item.requisition.hub }}</strong></span>
                      <span>•</span>
                      <span>Gate Pass: <strong class="font-mono">{{ item.manifest.dpWorldGatePass }}</strong></span>
                    </div>
                  </div>

                  <!-- Container Badges list -->
                  <div class="flex flex-wrap items-center gap-1.5 pt-1">
                    <span class="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                      Containers ({{ item.manifest.containerCount }}x 40ft HQ):
                    </span>
                    @for (cId of item.manifest.containerIds; track cId) {
                      <span class="font-mono text-[11px] px-2 py-0.5 rounded-xs bg-white border border-[#E5E7EB] text-[#111111] font-medium shadow-2xs">
                        {{ cId }}
                      </span>
                    }
                  </div>
                </div>

                <!-- Customs Status & Convoy Dispatch Details -->
                <div class="lg:w-[320px] bg-[#F8F9FA] border border-[#E5E7EB] rounded-sm p-3 space-y-2 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between text-xs mb-1">
                      <span class="text-[#6B7280]">Customs Duty Status:</span>
                      <span [class]="getDutyStatusClass(item.manifest.dutyStatus)" class="font-bold text-xs px-2 py-0.5 rounded-full">
                        {{ item.manifest.dutyStatus }}
                      </span>
                    </div>
                    <div class="text-[11px] text-[#6B7280] font-mono">
                      Dec. Ref: {{ item.manifest.customsDeclarationNo }}
                    </div>
                  </div>

                  <div class="border-t border-[#E5E7EB] pt-2">
                    <div class="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                      Inland Convoy Logistics:
                    </div>
                    <div class="flex items-center space-x-1.5 text-xs font-bold text-[#111111]">
                      <mat-icon class="text-sm! w-4! h-4! text-[#d71920]">local_shipping</mat-icon>
                      <span>{{ item.manifest.convoyStatus }}</span>
                    </div>
                  </div>

                  <div class="pt-2 flex items-center justify-between border-t border-[#E5E7EB]">
                    <button
                      type="button"
                      (click)="service.selectRequisition(item.requisition.id, true)"
                      class="text-xs font-semibold text-[#d71920] hover:underline cursor-pointer flex items-center space-x-1"
                    >
                      <span>View Tender Bids</span>
                      <mat-icon class="text-xs! w-3! h-3!">chevron_right</mat-icon>
                    </button>
                    <button
                      type="button"
                      (click)="service.isAuditDrawerOpen.set(true)"
                      class="text-xs text-[#6B7280] hover:text-[#111111] cursor-pointer"
                    >
                      Audit Stamps
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class CustomsManifests {
  readonly service = inject(ProcurementService);

  getDutyStatusClass(dutyStatus: string): string {
    switch (dutyStatus) {
      case 'Duty Settled': return 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]';
      case 'Exempt (Govt Priority)': return 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]';
      case 'Assessment Pending': return 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]';
      case 'Inspection Cleared': return 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
