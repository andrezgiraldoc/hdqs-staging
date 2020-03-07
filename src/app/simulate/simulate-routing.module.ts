import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimulatePage } from './simulate.page';

const routes: Routes = [
  {
    path: '',
    component: SimulatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulatePageRoutingModule {}
