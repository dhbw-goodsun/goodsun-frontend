import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IResults, IUserData } from 'src/app/core/models/UserData';
import { ApiService } from 'src/app/core/services/api.service';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})


export class ResultsComponent implements OnInit {

  constructor(private uds: UserDataService, private api: ApiService) {}


  userData: IUserData = { };
  result: IResults | undefined;

  isLoading: boolean = false;

  errors : Map<string, string> = new Map<string, string>();


  ngOnInit(): void {
    this.userData = this.uds.getUserData();
  }


  /**
   * Check input data with separate method. Set button state.
   */
  async preCheckUserDataForCalculation() {
    let clearedForCalculation = this.isUserDataClearedForCalculation(this.userData)

    if (clearedForCalculation) {
      this.isLoading = true;

      await this.api.postUserData(this.userData
      ).then((res) => {                   //When result comes thru
        this.result = res;
        this.isLoading = false;
      })
      .catch((err: HttpErrorResponse) => { //Catch errors
        this.addNotification(err.message + ". Please try again later.");
        this.isLoading = false;
      })
    }
  }


  /**
   * Check if userData meets all critera to be used for calculation. This includes to check, if GPS coordinates are present; every solar panel has at least one dataset of obstacle data and if an inverter is set.
   * 
   * @param userData UserData from entered by user
   * @returns true or false
   */
  isUserDataClearedForCalculation(userData: IUserData): boolean {

    let errorsExist = false;

    /* Check for User GPS Coords */
    if (userData.userGPSCoords == undefined || Object.keys(userData.userGPSCoords).length == 0) {
      errorsExist = true;
      this.addNotification("No GPS Coordinates were saved.");
    }


    /* Check for Solar Panels */
    if (userData.userPanels == undefined || Object.keys(userData.userPanels).length == 0) {
      errorsExist = true;
      this.addNotification("No Solar Panels were specified.");

      /* If Solar Panels are there, check if there is at least one dataset per solar panel */
    } else {

      /* Iterate through all panels */
      userData.userPanels.forEach((panel) => {

        /* Check if Solar Panel contains Obstacle data */
        if (panel.panelObstacleDatasets == undefined || Object.keys(panel.panelObstacleDatasets).length == 0) {
          let panelName: string; 

          /* Either display Panel Description or Wattage in notification*/
          if (panel.panelDescription) {
            panelName = panel.panelDescription;
          } else {
            panelName = panel.panelWatts!.toString() + " Watts ";
          }

          errorsExist = true;
          this.addNotification(panelName + " Panel has no obstacle data.")
        }
      });
    }


    /* Check for Inverter(s)  */
    if (userData.userInverters == undefined || Object.keys(userData.userInverters).length == 0) {
      errorsExist = true;
      this.addNotification("No Inverters were specified.");
    }
    return !errorsExist;
  }


  closeNotification(id: string) {
    this.errors.delete(id)
  }

  addNotification(text: string) {
    this.errors.set(uuidv4(), text);
  }
}