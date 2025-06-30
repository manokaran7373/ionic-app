export interface SatelliteData {
    latitude: number;
    longitude: number;
    image_status: string;
    kml_file_url?: string;
    coverage_area?: string;
    payment_status?: string;
    pending_amount?: number;
    payment_id?: string;
    created_at?: string;
    updated_at?: string;
}

export interface MapOptions extends google.maps.MapOptions {
    mapTypeId: google.maps.MapTypeId | string;
    disableDefaultUI: boolean;
    zoomControl: boolean;
    fullscreenControl: boolean;
    mapTypeControl: boolean;
    rotateControl: boolean;
    scaleControl: boolean;
    gestureHandling: string;
    keyboardShortcuts: boolean;
    draggable: boolean;
}

export interface MarkerOptions extends google.maps.MarkerOptions {
    position: google.maps.LatLngLiteral;
    icon: {
        path: google.maps.SymbolPath | string;
        fillColor: string;
        fillOpacity: number;
        strokeColor: string;
        strokeWeight: number;
        scale: number;
    };
}
