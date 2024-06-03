import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IPanelObstacleData, ISolarPanel } from 'src/app/core/models/UserData';
import { UserDataService } from 'src/app/core/services/user-data.service';

@Component({
  selector: 'app-obstacle-dataset-control',
  templateUrl: './obstacle-dataset-control.component.html',
  styleUrl: './obstacle-dataset-control.component.css'
})


export class ObstacleDatasetControlComponent implements OnInit {

  constructor(private router: Router, private uds: UserDataService) {}

  @Input() solarPanel: ISolarPanel = { };
  @Output() updatedSolarPanel = new EventEmitter<ISolarPanel>();

  obstacleDatasets =  new Map<number, IPanelObstacleData>(); 


  ngOnInit(): void {
    /* Map an array to a map with key, value. Unique ID is used as key */
    if (this.solarPanel.panelObstacleDatasets) {
      this.obstacleDatasets = new Map(this.solarPanel.panelObstacleDatasets!.map(s => [s.dataSetID!, s]));
    } else {
      this.obstacleDatasets = new Map();
    }   
  }

  
  getAmountOfDataPoints(dataset: IPanelObstacleData): number {
    return dataset.dataPoints!.length;
  }


  /**
   * Make militimestamp to clock time.
   * 
   * @param timestamp in milis
   * @returns clock time (in hours)
   */
  getTimeFromTimestamp(timestamp: number): string {
    let currentDate: Date = new Date(timestamp);
    let currentHour: number = currentDate.getHours();
    let currentMinute: number = currentDate.getMinutes(); 

    return currentHour + ":" + currentMinute;
  }


  /**
   * Navigate to scan-page for new scan.
   */
  addScan() {
    this.router.navigate(['/calc/scan', this.solarPanel.panelID]);
  }

  
  /**
   * Delete obstacle dataset and emits event for parent component (Solar-Panel-Control), to update the User Data Service.
   * */
  deleteDataset(id: number) {
    this.obstacleDatasets.delete(id);
    this.solarPanel.panelObstacleDatasets = Array.from(this.obstacleDatasets.values())

    this.updatedSolarPanel.emit(this.solarPanel);
  }
}
