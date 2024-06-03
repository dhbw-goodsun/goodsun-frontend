/**
 * Interfaces (DataTypes) for the entire application.
 */


export interface IUserData {
    userGPSCoords?: IGPSCoordinates;
    userPanels?: ISolarPanel[];
    userInverters?: IInverter[];
}

export interface IGPSCoordinates {
    latitude: number;
    longitude: number;
}

export interface ISolarPanel {
    panelID?: string;
    panelDescription?: string;
    panelWatts?: number;
    panelAzimuth?: number;
    panelElevation?: number;
    panelObstacleDatasets?: IPanelObstacleData[];
}

export interface IInverter {
    inverterID?: string;
    inverterWatts?: number;
    inverterName?: string;
    inverterDescription?: string;
}

export interface IPanelObstacleData {
    dataSetID?: number;
    dataPoints?: IDataPoint[];
}

export interface IDataPoint {
    azimuth: number;
    elevation: number;
}

export interface IResults {
    calculatedOutput: number;
    calculatedOutputNoShadow: number;
}
