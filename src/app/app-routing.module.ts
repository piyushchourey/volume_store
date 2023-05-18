import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BlockComponent } from './block/block.component';
import { BlocklistComponent } from './block/blocklist/blocklist.component';
import { BookingComponent } from './booking/booking.component';
import { BookinglistComponent } from './booking/bookinglist/bookinglist.component';
import { BrokerComponent } from './broker/broker.component';
import { BrokerlistComponent } from './broker/brokerlist/brokerlist.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { PlotListComponent } from './plots/list/list.component';
import { PlotsComponent } from './plots/plots.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserlistComponent } from './registration/userlist/userlist.component';
import { ReportsComponent } from './reports/reports.component';
import { ListComponent } from './township/list/list.component';
import { TownshipComponent } from './township/township.component';
import { AuthGuard } from './_helpers/auth.guard';
import { SendmailComponent } from './booking/sendmail/sendmail.component';

const routes: Routes = [
  { path: '',  redirectTo: 'admin',pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'product/add', component: RegistrationComponent,canActivate: [AuthGuard]  },
  { path: 'products', component: UserlistComponent,canActivate: [AuthGuard]  },
  { path: 'broker', component: BrokerComponent,canActivate: [AuthGuard] },
  { path: 'block/:id', component: BlockComponent,canActivate: [AuthGuard] },
  { path: 'blocklist', component: BlocklistComponent,canActivate: [AuthGuard] },
  { path: 'broker/list', component: BrokerlistComponent,canActivate: [AuthGuard] },
  { path: 'township', redirectTo: 'township/view',pathMatch: 'full' },
  { path: 'township/view', component: TownshipComponent, canActivate: [AuthGuard] },
  { path: 'township/view/:id', component: TownshipComponent, canActivate: [AuthGuard] },
  { path: 'plots', component: PlotsComponent, canActivate: [AuthGuard] },
  { path: 'plots/view/:id', component: PlotsComponent, canActivate: [AuthGuard] },
  { path: 'plots/list', component: PlotListComponent,canActivate: [AuthGuard]  },
  { path: 'booking', component: BookingComponent, canActivate: [AuthGuard] },
  { path: 'booking/edit/:id', component: BookingComponent, canActivate: [AuthGuard] },
  { path: 'booking/compose/:id', component: SendmailComponent, canActivate: [AuthGuard] },
  { path: 'booking/list', component: BookinglistComponent,canActivate: [AuthGuard]  },
  { path: 'township/list', component: ListComponent,canActivate: [AuthGuard]  },
  { path: 'reports/:type', component: ReportsComponent,canActivate: [AuthGuard]  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }