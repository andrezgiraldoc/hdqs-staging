import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SimulatePageRoutingModule } from './simulate-routing.module';

import { SimulatePage } from './simulate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SimulatePageRoutingModule
  ],
  declarations: [SimulatePage]
})
export class SimulatePageModule {}
