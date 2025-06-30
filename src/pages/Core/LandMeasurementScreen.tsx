import React, { useState, useRef } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonInput,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardContent,
} from '@ionic/react';
import { GoogleMap, LoadScript, DrawingManager } from '@react-google-maps/api';
import { GOOGLE_MAP_API_KEY } from '../../components/config/constants';
import { locationOutline, searchOutline } from 'ionicons/icons';
type UnitType = 'sqm' | 'sqkm' | 'hectare' | 'acre';

interface UnitData {
    label: string;
    conversion: number;
}


const mapContainerStyle = {
    height: '60vh',
    width: '100%',
    borderRadius: '10px',
};

const units: Record<UnitType, UnitData> = {
    sqm: { label: 'Square Meters', conversion: 1 },
    sqkm: { label: 'Square Kilometers', conversion: 0.000001 },
    hectare: { label: 'Hectares', conversion: 0.0001 },
    acre: { label: 'Acres', conversion: 0.000247105 }
};

const LandMeasurementScreen: React.FC = () => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 });
    const mapRef = useRef<google.maps.Map | null>(null);
    const [coordinates, setCoordinates] = useState({
        latitude: '',
        longitude: ''
    });

    const mapOptions: google.maps.MapOptions = {
        zoom: 18,
        center: center,
        mapTypeId: 'satellite',
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: false,
    };


    const handleSearch = () => {
        const lat = parseFloat(coordinates.latitude);
        const lng = parseFloat(coordinates.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
            setCenter({ lat, lng });
            mapRef.current?.panTo({ lat, lng });
            mapRef.current?.setZoom(18);
        }
    };

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setCoordinates({
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString()
                });
                setCenter(userLocation);
                mapRef.current?.panTo(userLocation);
                mapRef.current?.setZoom(18);
            }
        );
    };

    const onMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="ion-padding-horizontal">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/dashboard" />
                    </IonButtons>
                    <IonTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-bold">
                        Land Measurement
                    </IonTitle>
                </IonToolbar>
            </IonHeader>


            <IonContent fullscreen>
                <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
                    {/* Header */}
                    <div className="text-center max-w-4xl mx-auto mb-8">
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">Land Measurement    </h1>
                        <p className="text-gray-300 text-lg">Easily convert between different land measurement units for accurate planning and analysis.</p>
                    </div>

                    <div className="max-w-6xl mx-auto mb-8">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center gap-2 mb-6">
                                <IonIcon icon={locationOutline} className="text-blue-400 text-xl" />
                                <h2 className="text-xl font-semibold text-white">Location Coordinates</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-300 mb-2">Latitude</label>
                                    <input
                                        type="number"
                                        value={coordinates.latitude}
                                        onChange={(e) => setCoordinates({ ...coordinates, latitude: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="Enter latitude"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">Longitude</label>
                                    <input
                                        type="number"
                                        value={coordinates.longitude}
                                        onChange={(e) => setCoordinates({ ...coordinates, longitude: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="Enter longitude"
                                    />
                                </div>

                            </div>
                            {/* Button Section */}
                            <div className="flex flex-col md:flex-row gap-4 mt-6">
                                {/* <button
                                    onClick={handleSearch}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                                >
                                    <IonIcon icon={searchOutline} className="text-xl" />
                                    <span className="font-semibold">Search Location</span>
                                </button> */}

                                <button
                                    onClick={getCurrentLocation}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                                >
                                    <IonIcon icon={locationOutline} className="text-xl" />
                                    <span className="font-semibold">Current Location</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Map Section */}
                    <IonCard className="mt-4 bg-white/10 backdrop-blur">
                        <IonCardContent>
                            <LoadScript googleMapsApiKey={GOOGLE_MAP_API_KEY} libraries={['drawing']}>
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    options={mapOptions}
                                    center={center}
                                    onLoad={onMapLoad}
                                >
                                    {/* Map content will go here */}
                                </GoogleMap>
                            </LoadScript>
                        </IonCardContent>
                    </IonCard>

                </div>
            </IonContent>


        </IonPage>
    );
};

export default LandMeasurementScreen;
