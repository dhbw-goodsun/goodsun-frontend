import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesRoutingModule } from './resources-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ResourcesLandingComponent } from './resources-landing/resources-landing.component';


@NgModule({
  declarations: [
    ResourcesLandingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ResourcesRoutingModule
  ], 
  exports: [ ]
})
export class ResourcesModule { }
