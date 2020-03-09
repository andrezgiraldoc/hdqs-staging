import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ModalBaseComponent } from 'src/components/modal-base/modal-base.component';
import { QuditDetailsComponent } from './simulate/qudit-details/qudit-details.component';
import { FormsModule } from '@angular/forms';
import { GateDetailsComponent } from './simulate/gate-details/gate-details.component';

@NgModule({
  declarations: [
    AppComponent,
    ModalBaseComponent,
    QuditDetailsComponent,
    GateDetailsComponent
  ],
  entryComponents: [
    ModalBaseComponent,
    QuditDetailsComponent,
    GateDetailsComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
