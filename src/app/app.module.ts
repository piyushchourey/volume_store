import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppheaderComponent } from './appheader/appheader.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';
import { TextTransformPipe } from './custom-pipes/text-transform.pipe';
import { TownshipComponent } from './township/township.component';
import { ScriptService } from './_services/scriptService';
import { AgmCoreModule } from '@agm/core';
import { ListComponent } from './township/list/list.component';
import { PlotsComponent } from './plots/plots.component';
import { PlotListComponent } from './plots/list/list.component';
import { ReportsComponent } from './reports/reports.component';
import { NotifierModule,NotifierOptions } from 'angular-notifier';
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { UserlistComponent } from './registration/userlist/userlist.component';
import { BookingComponent } from './booking/booking.component';
import { BookinglistComponent } from './booking/bookinglist/bookinglist.component';
import { BrokerComponent } from './broker/broker.component';
import { BrokerlistComponent } from './broker/brokerlist/brokerlist.component';
import { BlockComponent } from './block/block.component';
import { BlocklistComponent } from './block/blocklist/blocklist.component';
import { DataTablesModule } from "angular-datatables";

import { ChartsModule } from 'ng2-charts';
import { RouteReuseStrategy  } from '@angular/router';
import {CustomRouteReuseStrategy}from './routerstatragi';
import { SendmailComponent } from './booking/sendmail/sendmail.component'
const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'right',
			distance: 12
		},
		vertical: {
			position: 'top',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 3000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};


@NgModule({
  declarations: [
    AppComponent,
    AppheaderComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    LoginComponent,
    RegistrationComponent,
    TextTransformPipe,
    TownshipComponent,
    ListComponent,
    PlotsComponent,
    PlotListComponent,
    ReportsComponent,
    UserlistComponent,
    BookingComponent,
    BookinglistComponent,
    BrokerComponent,
    BrokerlistComponent,
    BlockComponent,
    BlocklistComponent,
    SendmailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDR3sf_Kv7KnoC15dzDiKgCoeCUOMjppVs',
      libraries: ['places']
    }),
    NotifierModule.withConfig(customNotifierOptions),
    NgxUiLoaderModule,
    DataTablesModule,
    ChartsModule

  ],
  providers: [
    ScriptService,
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
