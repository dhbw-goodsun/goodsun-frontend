import { GpsPositionService } from 'src/app/core/services/gps-position.service';
import { Component, OnInit } from '@angular/core';
import { IUserData } from 'src/app/core/models/UserData';
import { UserDataService } from 'src/app/core/services/user-data.service';

@Component({
  selector: 'app-setupscan',
  templateUrl: './setupscan.component.html',
  styleUrl: './setupscan.component.css'
})


export class SetupscanComponent implements OnInit {

  constructor(private gpss: GpsPositionService, private uds: UserDataService) {}

  userData: IUserData = {  };


  ngOnInit(): void {  }


  getGPSPosition() {
    this.gpss.getGPSPositionObservable()?.subscribe((res) => { 
      this.userData.userGPSCoords = res;
    });
  }
}