import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraComponent } from './components/camera/camera.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component';
import { InverterControlComponent } from './components/inverter-control/inverter-control.component';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from './components/notification/notification.component';
import { SolarPanelControlComponent } from './components/solar-panel-control/solar-panel-control.component';
import { ObstacleDatasetControlComponent } from './components/obstacle-dataset-control/obstacle-dataset-control.component';


@NgModule({
  declarations: [ 
    NavbarComponent,
    FooterComponent,
    NotificationComponent,
    CameraComponent,
    InverterControlComponent,
    SolarPanelControlComponent,
    ObstacleDatasetControlComponent
  ],
  imports: [
    //To include the general Router Module (since no individual module is placed for "SHARED")
    RouterModule,
    CommonModule,
    FormsModule
  ], 
  exports: [
    NavbarComponent,
    FooterComponent,
    NotificationComponent,
    CameraComponent,
    InverterControlComponent,
    SolarPanelControlComponent,
    ObstacleDatasetControlComponent
  ]
})

export class SharedModule { }
