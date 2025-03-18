export interface LocationData {
    latitude: number | 0;
    longitude: number | 0;
    speed: number | 0;
    heading: number | 0;
    user_timestamp: number | 0;
}

export interface CrowdsourcingData {
    bus_ssid: string,
    rssi: number,
    location: LocationData,
}

export interface Bus {
    _id: string,
    _ssid: string,
    name: string,
    isBusActive: boolean,
    location: LocationData,
}

export interface BusLine {
    lineBuses: [],
    isLineActive: boolean,
}