import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Header } from './components/header/header';
import { MetricsBar } from './components/metrics-bar/metrics-bar';
import { RequisitionList } from './components/requisition-list/requisition-list';
import { RfqComparison } from './components/rfq-comparison/rfq-comparison';
import { CustomsManifests } from './components/customs-manifests/customs-manifests';
import { PurchaseOrders } from './components/purchase-orders/purchase-orders';
import { SupplierDirectory } from './components/supplier-directory/supplier-directory';
import { CreateRfqModal } from './components/create-rfq-modal/create-rfq-modal';
import { PoModal } from './components/po-modal/po-modal';
import { AuditDrawer } from './components/audit-drawer/audit-drawer';
import { ProcurementService } from './services/procurement.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    MatIconModule,
    Header,
    MetricsBar,
    RequisitionList,
    RfqComparison,
    CustomsManifests,
    PurchaseOrders,
    SupplierDirectory,
    CreateRfqModal,
    PoModal,
    AuditDrawer,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly service = inject(ProcurementService);
}

