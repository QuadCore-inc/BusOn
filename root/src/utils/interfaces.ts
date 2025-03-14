export interface LocationData {
    latitude: number | null;
    longitude: number | null;
    speed: number | null;
    heading: number | null;
    user_timestamp: number | null;
}

export interface CrowdsourcingData {
    bus_ssid: string,
    rssi: number,
    location: LocationData,
}