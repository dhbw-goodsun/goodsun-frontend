import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IDataPoint, IPanelObstacleData } from 'src/app/core/models/UserData';
import { AttitudeDataService } from 'src/app/core/services/attitude-data.service';
import { UserDataService } from 'src/app/core/services/user-data.service';


@Component({
  selector: 'app-scansurroundings',
  templateUrl: './scansurroundings.component.html',
  styleUrl: './scansurroundings.component.css'
})


export class ScansurroundingsComponent implements OnDestroy {

  constructor(private route: ActivatedRoute, private router: Router, private ads: AttitudeDataService, private uds: UserDataService) { 
    /* Get solarPanelID from URL */
    this.route.params.subscribe((params: Params) => {
      this.panelID = params['id']
    });
  }

  dataPoints: IDataPoint[] = [];

  compassHeading: number | undefined;
  attitudeData: number | undefined;

  panelID: number | undefined;

  isScanning: boolean = false;
  isCameraActive: boolean = false;

  /* Help to guarantee a full circle has been made. */
  startAzimuth: number | undefined;
  isTurnedOverNorth: boolean = false;
  isTurnedOverStartAzimuth: boolean = false;


  /** 
   * Reset when component is unloaded.
   */
  ngOnDestroy() {
    this.isScanning = false;
  }


  /** 
   * Handle start button push in child component and save start azimuth.
   */
  handleStartScan(buttonHandler: boolean) {
    this.isScanning = buttonHandler;

    /* Only if startAzimuth is not defined. Avaoid overwriting old starting point
    since sometiems the camera link breakes and the recording needs to be restarted. */
    if (!this.startAzimuth) {
      this.startAzimuth = this.compassHeading!; //Save azimuth when recording starts
    }
  }


  /** 
   * Handle stop button push in child component.
   */
  handleEndScan() {
    this.saveScanData();
    this.returnToSetupScanComponent();
  }


  /** 
   * Subscribe to data services which provide all neccesary data when camera is opened.
   */
  openCamera() {
    this.ads.getCompassHeadingObservable()?.subscribe((res) => { 
      this.compassHeading = res;
      this.compassHeadingHandler();
    });

    this.ads.getAttitudeDataObservable()?.subscribe((res) => { 
      this.attitudeData = res; 
    });

    this.isCameraActive = true;
  }


  /**
   * Handle compass heading and set new datapoints. 
   * Also check if a full turn (not checking if 360 data points are collected) has been made.
   */
  private compassHeadingHandler() {
    if (this.isScanning) {
      this.setNewDatapoint(this.compassHeading!, this.attitudeData! - 90 );

      /* See if user turned over north. Interval from 356 - 4 is valid */
      if (this.compassHeading! % 360 >= 356 || this.compassHeading! % 360 < 4) {
        this.isTurnedOverNorth = true;
      }

      /* User has turned over north and is ince again past starting point. */
      if (this.isTurnedOverNorth && (this.compassHeading! > this.startAzimuth! && this.compassHeading! <= (this.startAzimuth! + 5) % 360)) {
        this.isTurnedOverStartAzimuth = true;
      }
    }
  }


  /**
   * Handle all new incoming datapoints from sensors. Decide if new datapoint is really "new" or if exisiting is updated.
   * 
   * @param azimut azimut in ° as number
   * @param elevation elevation in ° as number
   */
  private setNewDatapoint(azimut: number, elevation: number) {
    let newDataPoint: IDataPoint = { azimuth: azimut, elevation: elevation };
    
    /* Check if dataPoints array alread contains one object with certain azimut */
    let existingIndex = this.dataPoints.findIndex(dp => dp.azimuth === newDataPoint.azimuth);

    if (existingIndex != -1) {
      this.dataPoints[existingIndex] = newDataPoint;
    } else {
      this.dataPoints.push(newDataPoint);
    }
  }


  /** 
   * Return with router.
   */
  private returnToSetupScanComponent() {
    this.router.navigate(['/calc']);
  }


  /** 
   * Save the scanned data and updates userDataService.
   */
  private saveScanData() {
    /* Needs to be Date.now() since the time is being derivated in the table view from this dataSetID */
    let dataset: IPanelObstacleData = { dataSetID: Date.now(), dataPoints: this.dataPoints }

    let userData = this.uds.getUserData()
    let userSolarPanels = userData!.userPanels!;

    /* Finds index of that panel (this.panelID) in array */
    let panelIndexInArray = userSolarPanels.findIndex(x => x.panelID == this.panelID);

    /* Not pretty. Checks if that panel already has an array for IObstacleData. If not, a new one is created. 
    If it has one, then the new Dataset is added on the next free position. */
    if (userSolarPanels[panelIndexInArray].panelObstacleDatasets == undefined ) {
      userData!.userPanels![panelIndexInArray]!.panelObstacleDatasets = [ dataset ];
    } else {
      let amountOfObstacleDatasetsForPanel = userSolarPanels![panelIndexInArray]!.panelObstacleDatasets!.length!
      userData!.userPanels![panelIndexInArray]!.panelObstacleDatasets![amountOfObstacleDatasetsForPanel] = dataset;
    }

    /* Set new userData */
    this.uds.setUserData({ userPanels: Array.from(userData.userPanels!.values())  });
  }


  /**
   * Determine if the user has made a full revolution (well kind of).
   * 
   * @returns true or false depending on user actions.
   */
  isFullCircleCompleted(): boolean {
    return (this.isTurnedOverNorth && this.isTurnedOverStartAzimuth);
  }
}