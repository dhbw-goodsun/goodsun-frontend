import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IGPSCoordinates } from '../models/UserData';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root'
})

/**
 * Provide GpsPositionService.
 */
export class GpsPositionService {

  constructor(private uds: UserDataService) { }

  private gpsCoords: BehaviorSubject<IGPSCoordinates> = new BehaviorSubject<IGPSCoordinates>({ latitude: 0, longitude: 0 });


  /**
   * Get the smartphone GPS position.
   * 
   * @returns GPS position as Observable
   */
  getGPSPositionObservable() {
    this.getGPSLocation();
    return this.gpsCoords.asObservable();
  }


  /**
   * Get current GPS position from smartphone and update observable.
   */
  private getGPSLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {

        let coords: IGPSCoordinates = { latitude: 0, longitude: 0 };
        coords.latitude = Math.round(pos.coords.latitude * 100) / 100
        coords.longitude = Math.round(pos.coords.longitude * 100) / 100

        /* Set (or update) user gps coordinates in local storage with the hel of the UserDataService */
        this.uds.setUserData({userGPSCoords: coords});
        this.gpsCoords.next(coords);
      });
    } else {
      alert("Ohne die Zustimmung zur Nutzung der GPS-Position kann keine Berechnung erfolgen.")
    }
  }
}