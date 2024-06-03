import { Component, OnInit } from '@angular/core';
import { ISolarPanel } from 'src/app/core/models/UserData';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-solar-panel-control',
  templateUrl: './solar-panel-control.component.html',
  styleUrl: './solar-panel-control.component.css'
})


export class SolarPanelControlComponent implements OnInit {

  constructor(private uds: UserDataService) {}

  solarPanel: ISolarPanel = { }
  solarPanels = new Map<string, ISolarPanel>();

  isModifying: boolean = false;

  isSolarPanelControlModalVisible: boolean = false;
  isNotificationVisible: boolean = false;


  /* Reload (get) available solar panels from local storage when component is initialized --> keep it upToDate */ 
  ngOnInit(): void {
    let solarPanels = this.uds.getUserData().userPanels!;

    /* Map an array to a map with key, value. Unique ID is used as key */
    if (solarPanels) {
      this.solarPanels = new Map(solarPanels.map(s => [s.panelID!, s]));
    } else {
      this.solarPanels = new Map();
    }    
  }


  addNewSolarPanel() {
    this.solarPanel = { panelID: uuidv4() };
    this.switchSolarPanelModal();
  }

  
  deleteSolarPanel(id: string) {
    this.solarPanels.delete(id);
    this.updateUserDataService();
  }


  modifySolarPanel(id: string) {
    this.isModifying = true;
    this.solarPanel = this.solarPanels.get(id)!
    this.switchSolarPanelModal();
  }


  saveSolarPanel() {
    if (this.solarPanel.panelWatts != null && this.solarPanel.panelAzimuth != null && this.solarPanel.panelElevation != null) {
      this.solarPanels.set(this.solarPanel.panelID!, this.solarPanel);
      if (this.isModifying) {
        this.isModifying = false;
      }
      this.switchSolarPanelModal()
    } else {
      this.openNotification();
    }
  }


  switchSolarPanelModal() {
    if (!this.isSolarPanelControlModalVisible) {
      this.closeNotification();
      this.isSolarPanelControlModalVisible = true;
    } else {
      this.isSolarPanelControlModalVisible = false;
      this.isModifying = false;
    }
    this.updateUserDataService();
  }


  /* Handle when datasets in one panel are updated (removed). Update User Data Service. */
  handleObstacleDatasetUpdate(panel: ISolarPanel) {
    this.solarPanels.delete(panel.panelID!)
    this.solarPanels.set(panel.panelID!, panel);

    this.updateUserDataService();
  }

  private updateUserDataService() {
    this.uds.setUserData({ userPanels: Array.from(this.solarPanels.values()) })
  }

  closeNotification() {
    this.isNotificationVisible = false;
  }

  openNotification() {
    this.isNotificationVisible = true;
  }
}