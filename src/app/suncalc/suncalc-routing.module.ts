import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScansurroundingsComponent } from './scansurroundings/scansurroundings.component';
import { SetupscanComponent } from './setupscan/setupscan.component';
import { ResultsComponent } from './results/results.component';


const routes: Routes = [
  { 
    path: 'setup', 
    component: SetupscanComponent 
  },
  { 
    path: 'scan/:id', 
    component: ScansurroundingsComponent 
  },
  { 
    path: 'results', 
    component: ResultsComponent 
  },
  {
    path: '**',
    redirectTo: 'setup'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SuncalcRoutingModule { }


