import { Injectable } from '@angular/core';
import { IUserData } from '../models/UserData';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

/**
 * Provide UserDataService.
 */
export class UserDataService {

  private userData: BehaviorSubject<IUserData>;

  constructor() {
    this.userData = new BehaviorSubject<IUserData>(JSON.parse(localStorage.getItem('userData')  || '{}'));
  }


  /**
   * Get user data from local storage.
   * 
   * @returns user data.
   */
  getUserData(): IUserData {
    return JSON.parse(localStorage.getItem('userData') || '{}');
  }


  /**
   * Get user data from local storage as Observable.
   * 
   * @returns user data as Observable.
   */
  getUserDataObservable() {
    return this.userData.asObservable();
  }
  

  /**
   * Set (or update existing) user data saved in local storage. Combine new with old.
   * 
   * @param data user data which is to be set.
   */
  setUserData(data: IUserData) {
    /* Combine "OLD" (existing in Storage) with the "NEW" (modified) */
    let userData = {...this.getUserData(), ...data};
    
    localStorage.setItem('userData', JSON.stringify(userData));
    this.userData.next(this.getUserData()!);
  }
}
