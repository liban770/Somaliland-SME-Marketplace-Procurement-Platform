import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProcurementService } from '../../services/procurement.service';

@Component({
  selector: 'app-audit-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @let req = service.activeRequisition();

    @if (service.isAuditDrawerOpen() && req) {
      <div class="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs select-none">
        <div class="w-full max-w-md bg-white h-full shadow-2xl border-l border-[#E5E7EB] flex flex-col justify-between overflow-hidden">
          <!-- Drawer Header (Enterprise Obsidian) -->
          <div class="bg-[#111111] text-white p-4 border-b border-black flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <mat-icon class="text-sm! w-4! h-4! text-[#d71920]">history_edu</mat-icon>
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider text-white">
                  Audited Ledger & Event Trail
                </h3>
                <div class="text-[10px] text-white/60 font-mono">
                  Ref: {{ req.id }}
                </div>
              </div>
            </div>

            <button
              type="button"
              (click)="service.isAuditDrawerOpen.set(false)"
              class="w-7 h-7 rounded-sm bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <mat-icon class="text-sm! w-4! h-4!">close</mat-icon>
            </button>
          </div>

          <!-- Drawer Content: Timeline -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            <!-- Requisition Summary banner -->
            <div class="bg-[#F8F9FA] border border-[#E5E7EB] rounded-sm p-3 text-xs">
              <div class="font-bold text-[#111111] leading-tight">{{ req.title }}</div>
              <div class="text-[#6B7280] text-[11px] mt-1 flex items-center justify-between">
                <span>Hub: <strong>{{ req.hub }}</strong></span>
                <span class="font-bold text-[#d71920]">{{ req.status }}</span>
              </div>
            </div>

            <div class="text-xs font-bold uppercase tracking-wider text-[#4B5563]">
              Chronological Audit Log
            </div>

            <div class="relative pl-5 space-y-4 border-l-2 border-[#E5E7EB] ml-2">
              @for (log of req.auditLogs; track log.id) {
                <div class="relative group">
                  <!-- Timeline indicator dot -->
                  <div class="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#111111] flex items-center justify-center">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#d71920]"></span>
                  </div>

                  <div class="space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-xs text-[#111111]">{{ log.action }}</span>
                      <span [class]="getBadgeClass(log.badge)" class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-xs">
                        {{ log.badge }}
                      </span>
                    </div>

                    <div class="text-[11px] text-[#4B5563] leading-relaxed">
                      {{ log.details }}
                    </div>

                    <div class="text-[10px] text-[#6B7280] flex items-center justify-between pt-0.5">
                      <span>Operator: <strong>{{ log.operator }}</strong></span>
                      <span class="font-mono">{{ log.timestamp }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Security & Blockchain Ledger Hash -->
            <div class="bg-[#F0FDF4] border border-[#BBF7D0] rounded-sm p-3 text-xs text-[#15803D] space-y-1">
              <div class="flex items-center space-x-1 font-bold">
                <mat-icon class="text-xs! w-3.5! h-3.5!">shield</mat-icon>
                <span>Chamber Cryptographic Seal</span>
              </div>
              <p class="text-[11px] text-[#166534]">
                All bids and evaluations are registered under the Somaliland Public Procurement Authority. Tampering invalidates the tender.
              </p>
              <div class="text-[9px] font-mono text-[#15803D] pt-1 truncate">
                Hash: 0x8a92f01bb492019488aefc008271...
              </div>
            </div>
          </div>

          <!-- Drawer Footer -->
          <div class="p-3 bg-[#F8F9FA] border-t border-[#E5E7EB] flex items-center justify-between text-xs">
            <button
              type="button"
              (click)="service.isAuditDrawerOpen.set(false)"
              class="w-full py-2 bg-[#111111] hover:bg-black text-white font-semibold text-xs rounded-sm cursor-pointer transition-colors text-center"
            >
              Close Audit Inspector
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class AuditDrawer {
  readonly service = inject(ProcurementService);

  getBadgeClass(badge: string): string {
    switch (badge) {
      case 'Chamber': return 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]';
      case 'Customs': return 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]';
      case 'Finance': return 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]';
      case 'Warning': return 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]';
      default: return 'bg-[#F3F4F6] text-[#4B5563]';
    }
  }
}
