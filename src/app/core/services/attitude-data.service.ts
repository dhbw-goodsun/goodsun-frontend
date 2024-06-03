import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

/**
 * Provide AttidueDataService which provides attitude and compass data.
 */
export class AttitudeDataService {

  constructor() { }

  private isHandlersInitialized: boolean = false;
  private attitudeData: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private compassHeading: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private isIOS = (navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) 
    || navigator.userAgent.match(/AppleWebKit/);


  /**
   * Get smartphone attitude data readouts.
   * 
   * @returns attitude data as Observable
   */
  getAttitudeDataObservable() {
    if (!this.isHandlersInitialized) {
      this.initEventHandlers();
    }
    return this.attitudeData.asObservable();
  }

   
  /**
   * Get smartphone compass heading data readouts.
   * 
   * @returns compass heading as Observable
   */
  getCompassHeadingObservable() {
    if (!this.isHandlersInitialized) {
      this.initEventHandlers();
    }
    return this.compassHeading.asObservable();
  }


  /**
   * Start (add) the handlers to the DeviceOrientationEvent. Non-IOS device currently untested.
   */
  private initEventHandlers() {
    if (this.isIOS) {                   // IOS Devices
      (DeviceOrientationEvent as any).requestPermission()         
      .then((res: string) => {
        if (res === 'granted') {
          window.addEventListener('deviceorientation', (event) => {
            this.handleCompass(event);
            this.handleAttitude(event);
          });
        } else {
          alert("Sensors can not be used without granting permission.")
        } 
      })
      .catch(() => alert("Unknown error while connecting to the device."));
    } else {                            // Non-IOS Devices
        window.addEventListener('deviceorientationabsolute', (event) => {
          this.handleCompass(event);
          this.handleAttitude(event);
      });
    }
  }

  
  /**
   * Handle update of the attitude observable when the event is triggered.
   * 
   * @param event DeviceOrientationEvent
   */
  private handleAttitude(event: any) {
    let attitude = Math.round(event.beta);
    this.attitudeData.next(attitude);
  }


  /**
   * Handle update of the compass observable when the event is triggered.
   * 
   * @param event DeviceOrientationEvent
   */
  private handleCompass(event: any) {
    let compass = Math.round(event.webkitCompassHeading || Math.abs(event.alpha - 360));
    this.compassHeading.next(compass);
  }
}