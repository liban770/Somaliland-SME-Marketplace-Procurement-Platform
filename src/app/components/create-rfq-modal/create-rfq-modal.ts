import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProcurementService } from '../../services/procurement.service';
import { CommercialHub, ProcurementCategory } from '../../models/procurement.models';

@Component({
  selector: 'app-create-rfq-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    @if (service.isCreateModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none overflow-y-auto">
        <div class="bg-white border border-[#E5E7EB] rounded-lg shadow-xl w-full max-w-3xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
          <!-- Modal Top Cap (Enterprise Obsidian #111111) -->
          <div class="bg-[#111111] text-white px-5 py-3.5 flex items-center justify-between border-b border-black">
            <div class="flex items-center space-x-2.5">
              <div class="w-6 h-6 rounded-xs bg-[#d71920] flex items-center justify-center font-bold text-white text-xs">
                +
              </div>
              <div>
                <h2 class="text-sm font-bold tracking-tight text-white uppercase">
                  Publish New Requisition & Tender (RFQ)
                </h2>
                <p class="text-[11px] text-white/60">
                  SahanProcure Direct Commercial Exchange • Somaliland Hubs
                </p>
              </div>
            </div>

            <button
              type="button"
              (click)="service.isCreateModalOpen.set(false)"
              class="w-7 h-7 rounded-sm bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <mat-icon class="text-sm! w-4! h-4!">close</mat-icon>
            </button>
          </div>

          <!-- Form Body -->
          <form [formGroup]="rfqForm" (ngSubmit)="onSubmit()" class="flex-1 overflow-y-auto p-5 space-y-4">
            <!-- Row 1: Title -->
            <div>
              <label for="rfq-title" class="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-1">
                Tender Title & Requisition Purpose *
              </label>
              <input
                id="rfq-title"
                type="text"
                formControlName="title"
                placeholder="e.g. Supply of 6x Heavy Off-Road Water Tankers for Togdheer Drought Resilience"
                class="w-full h-9 px-3 text-xs bg-white border border-[#E5E7EB] rounded-sm text-[#171717] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]"
              />
            </div>

            <!-- Row 2: Category & Hub -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label for="rfq-category" class="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-1">
                  Procurement Category *
                </label>
                <select
                  id="rfq-category"
                  formControlName="category"
                  class="w-full h-9 px-3 text-xs bg-white border border-[#E5E7EB] rounded-sm text-[#171717] focus:outline-none focus:border-[#111111]"
                >
                  <option value="Heavy Equipment & Fleet">Heavy Equipment & Fleet</option>
                  <option value="Industrial Solar & Power">Industrial Solar & Power</option>
                  <option value="Telecommunications & IT">Telecommunications & IT</option>
                  <option value="Port Logistics & Stevedoring">Port Logistics & Stevedoring</option>
                  <option value="Construction Materials">Construction Materials</option>
                  <option value="Medical & Health Supplies">Medical & Health Supplies</option>
                </select>
              </div>

              <div>
                <label for="rfq-hub" class="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-1">
                  Destination Commercial Hub *
                </label>
                <select
                  id="rfq-hub"
                  formControlName="hub"
                  class="w-full h-9 px-3 text-xs bg-white border border-[#E5E7EB] rounded-sm text-[#171717] focus:outline-none focus:border-[#111111]"
                >
                  <option value="Hargeisa HQ">Hargeisa Commercial HQ (Capital)</option>
                  <option value="Berbera Free Zone">Berbera Free Zone / Port Facility</option>
                  <option value="Burao Hub">Burao Logistics & Livestock Hub</option>
                  <option value="Borama Depot">Borama Regional Depot</option>
                </select>
              </div>
            </div>

            <!-- Row 3: Buyer Entity & Target Budget -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label for="rfq-buyer" class="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-1">
                  Procuring Institution / Buyer Entity *
                </label>
                <input
                  id="rfq-buyer"
                  type="text"
                  formControlName="buyerEntity"
                  placeholder="e.g. Somaliland Water Authority (SWA)"
                  class="w-full h-9 px-3 text-xs bg-white border border-[#E5E7EB] rounded-sm text-[#171717] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label for="rfq-budget" class="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-1">
                  Target Requisition Budget (USD $) *
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-xs font-bold text-[#6B7280]">$</span>
                  <input
                    id="rfq-budget"
                    type="number"
                    formControlName="targetBudgetUSD"
                    placeholder="250000"
                    class="w-full h-9 pl-7 pr-3 text-xs font-bold bg-white border border-[#E5E7EB] rounded-sm text-[#171717] focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>
            </div>

            <!-- Row 4: Deadline & Compliance Toggles -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-center">
              <div>
                <label for="rfq-deadline" class="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-1">
                  Submission Deadline *
                </label>
                <input
                  id="rfq-deadline"
                  type="date"
                  formControlName="deadline"
                  class="w-full h-9 px-3 text-xs bg-white border border-[#E5E7EB] rounded-sm text-[#171717] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div class="pt-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="chamberReq"
                  formControlName="chamberAuditRequired"
                  class="w-4 h-4 rounded text-[#d71920] focus:ring-black cursor-pointer"
                />
                <label for="chamberReq" class="text-xs font-semibold text-[#111111] cursor-pointer">
                  Require Chamber Endorsement
                </label>
              </div>

              <div class="pt-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="customsFast"
                  formControlName="berberaCustomsFastTrack"
                  class="w-4 h-4 rounded text-[#d71920] focus:ring-black cursor-pointer"
                />
                <label for="customsFast" class="text-xs font-semibold text-[#111111] cursor-pointer">
                  Berbera Customs Fast-Track
                </label>
              </div>
            </div>

            <!-- Line Items Schedule -->
            <div class="border-t border-[#E5E7EB] pt-4">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <span class="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Requisition Line Items Schedule
                  </span>
                  <p class="text-[11px] text-[#6B7280]">Itemize required equipment specifications</p>
                </div>
                <button
                  type="button"
                  (click)="addLineItem()"
                  class="px-2.5 py-1 bg-[#F8F9FA] hover:bg-[#E5E7EB] text-[#111111] border border-[#E5E7EB] text-xs font-semibold rounded-xs flex items-center space-x-1 cursor-pointer"
                >
                  <mat-icon class="text-xs! w-3! h-3!">add</mat-icon>
                  <span>Add Line Item</span>
                </button>
              </div>

              <div formArrayName="lineItems" class="space-y-2">
                @for (item of lineItemsControls.controls; track $index) {
                  <div [formGroupName]="$index" class="p-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xs grid grid-cols-12 gap-2 items-center text-xs">
                    <div class="col-span-5">
                      <input
                        type="text"
                        formControlName="description"
                        placeholder="Item Description"
                        class="w-full h-8 px-2 bg-white border border-[#E5E7EB] rounded-xs text-xs focus:outline-none focus:border-[#111111]"
                      />
                    </div>
                    <div class="col-span-3">
                      <input
                        type="text"
                        formControlName="spec"
                        placeholder="Engineering Spec"
                        class="w-full h-8 px-2 bg-white border border-[#E5E7EB] rounded-xs text-xs focus:outline-none focus:border-[#111111]"
                      />
                    </div>
                    <div class="col-span-2">
                      <input
                        type="number"
                        formControlName="qty"
                        placeholder="Qty"
                        class="w-full h-8 px-2 bg-white border border-[#E5E7EB] rounded-xs text-xs font-bold focus:outline-none focus:border-[#111111]"
                      />
                    </div>
                    <div class="col-span-2 flex items-center space-x-1">
                      <input
                        type="number"
                        formControlName="estimatedUnitCostUSD"
                        placeholder="Est $"
                        class="w-full h-8 px-2 bg-white border border-[#E5E7EB] rounded-xs text-xs focus:outline-none focus:border-[#111111]"
                      />
                      @if (lineItemsControls.length > 1) {
                        <button
                          type="button"
                          (click)="removeLineItem($index)"
                          class="text-[#DC2626] hover:bg-red-50 p-1 rounded-xs cursor-pointer"
                          title="Remove item"
                        >
                          <mat-icon class="text-sm! w-4! h-4!">delete</mat-icon>
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Modal Footer Action Buttons -->
            <div class="border-t border-[#E5E7EB] pt-4 flex items-center justify-between">
              <div class="text-xs text-[#6B7280]">
                Automatic notice sent to certified Somaliland suppliers via B2B Gateway.
              </div>

              <div class="flex items-center space-x-2">
                <button
                  type="button"
                  (click)="service.isCreateModalOpen.set(false)"
                  class="px-3.5 py-2 bg-white hover:bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB] text-xs font-semibold rounded-sm cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="!rfqForm.valid"
                  class="px-4 py-2 bg-[#D71920] hover:bg-[#B3141A] active:bg-[#93000D] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-sm shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
                >
                  <mat-icon class="text-xs! w-3.5! h-3.5!">publish</mat-icon>
                  <span>Publish to SahanProcure Direct</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class CreateRfqModal {
  readonly service = inject(ProcurementService);

  readonly rfqForm = new FormGroup({
    title: new FormControl('Procurement of 8x 40,000L Fuel Tankers for Berbera Oil Terminal Logistics', [Validators.required]),
    category: new FormControl<ProcurementCategory>('Heavy Equipment & Fleet', [Validators.required]),
    hub: new FormControl<CommercialHub>('Berbera Free Zone', [Validators.required]),
    buyerEntity: new FormControl('Somaliland Petroleum Regulatory Authority', [Validators.required]),
    targetBudgetUSD: new FormControl<number>(680000, [Validators.required, Validators.min(1000)]),
    deadline: new FormControl('2026-10-24', [Validators.required]),
    chamberAuditRequired: new FormControl(true),
    berberaCustomsFastTrack: new FormControl(true),
    lineItems: new FormArray([
      new FormGroup({
        description: new FormControl('40,000L Tri-Axle Semi-Trailer Fuel Tanker (Aluminium 5182)', [Validators.required]),
        spec: new FormControl('Bottom Loading API Couplers, Vapor Recovery System, BPW Axles', [Validators.required]),
        qty: new FormControl(8, [Validators.required, Validators.min(1)]),
        unit: new FormControl('Units', [Validators.required]),
        estimatedUnitCostUSD: new FormControl(85000, [Validators.required]),
      }),
    ]),
  });

  get lineItemsControls(): FormArray {
    return this.rfqForm.get('lineItems') as FormArray;
  }

  addLineItem(): void {
    this.lineItemsControls.push(
      new FormGroup({
        description: new FormControl('', [Validators.required]),
        spec: new FormControl(''),
        qty: new FormControl(1, [Validators.required]),
        unit: new FormControl('Units', [Validators.required]),
        estimatedUnitCostUSD: new FormControl(5000, [Validators.required]),
      })
    );
  }

  removeLineItem(index: number): void {
    if (this.lineItemsControls.length > 1) {
      this.lineItemsControls.removeAt(index);
    }
  }

  onSubmit(): void {
    if (!this.rfqForm.valid) return;
    const v = this.rfqForm.value;

    const rawItems = (v.lineItems ?? []) as {
      description?: string | null;
      spec?: string | null;
      qty?: number | null;
      unit?: string | null;
      estimatedUnitCostUSD?: number | null;
    }[];

    const typedLineItems = rawItems.map((item) => ({
      description: item.description ?? 'Equipment Item',
      spec: item.spec ?? 'Standard Commercial Spec',
      qty: Number(item.qty ?? 1),
      unit: item.unit ?? 'Units',
      estimatedUnitCostUSD: Number(item.estimatedUnitCostUSD ?? 0),
    }));

    this.service.createRequisition({
      title: v.title!,
      category: v.category as ProcurementCategory,
      hub: v.hub as CommercialHub,
      buyerEntity: v.buyerEntity!,
      targetBudgetUSD: v.targetBudgetUSD!,
      deadline: v.deadline!,
      chamberAuditRequired: !!v.chamberAuditRequired,
      berberaCustomsFastTrack: !!v.berberaCustomsFastTrack,
      lineItems: typedLineItems,
    });

    this.service.isCreateModalOpen.set(false);
  }
}
