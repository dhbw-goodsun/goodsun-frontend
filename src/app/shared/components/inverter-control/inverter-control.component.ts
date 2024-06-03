import { Component, OnInit } from '@angular/core';
import { IInverter } from 'src/app/core/models/UserData';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-inverter-control',
  templateUrl: './inverter-control.component.html',
  styleUrl: './inverter-control.component.css'
})


export class InverterControlComponent implements OnInit {

  constructor(private uds: UserDataService) {}

  inverter: IInverter = { }
  inverters = new Map<string, IInverter>();

  isModifying: boolean = false;

  isInverterControlModalVisible: boolean = false;
  isNotificationVisible: boolean = false;


  ngOnInit(): void {
    let inverters = this.uds.getUserData().userInverters!;

    if (inverters) {
      this.inverters = new Map(inverters.map(i => [i.inverterID!, i]));
    } else {
      this.inverters = new Map();
    }    
  }


  addNewInverter() {
    this.inverter = { inverterID: uuidv4() }
    this.switchInverterModal();
  }

  deleteInverter(id: string) {
    this.inverters.delete(id);
    this.updateUserDataService();
  }


  modifyInverter(id: string) {
    this.inverter = this.inverters.get(id)!
    this.isModifying = true;
    this.switchInverterModal();
  }


  saveInverter() {
    if (this.inverter.inverterWatts !== 0 && this.inverter.inverterWatts != null) {
      this.inverters.set(this.inverter.inverterID!, this.inverter);
      if(this.isModifying) {
        this.isModifying = false;
      }
      this.switchInverterModal()
    } else {
      this.openNotification();
    }
  }

  switchInverterModal() {
    if (!this.isInverterControlModalVisible) {
      this.closeNotification();
      this.isInverterControlModalVisible = true;
    } else {
      this.isInverterControlModalVisible = false;
      this.isModifying = false;
    }
   this.updateUserDataService();
  }

  private updateUserDataService() {
    this.uds.setUserData({ userInverters: Array.from(this.inverters.values()) })
  }

  closeNotification() {
    this.isNotificationVisible = false;
  }

  openNotification() {
    this.isNotificationVisible = true;
  }
}
