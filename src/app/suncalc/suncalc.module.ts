import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuncalcRoutingModule } from './suncalc-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ScansurroundingsComponent } from './scansurroundings/scansurroundings.component';
import { SetupscanComponent } from './setupscan/setupscan.component';
import { ResultsComponent } from './results/results.component';


@NgModule({
  declarations: [
    SetupscanComponent,
    ScansurroundingsComponent,
    ResultsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SuncalcRoutingModule
  ],
  exports: [ ]
})

export class SuncalcModule { }