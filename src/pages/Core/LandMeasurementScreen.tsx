import React, { useState, useRef, useCallback } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonButton,
    IonSelect,
    IonSelectOption,
} from '@ionic/react';
import { GoogleMap, LoadScript, Marker, DrawingManager } from '@react-google-maps/api';
import { GOOGLE_MAP_API_KEY } from '../../components/config/constants';
import { locationOutline, searchOutline, calculatorOutline, trashOutline, shapesOutline } from 'ionicons/icons';
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
    const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 });
    const mapRef = useRef<google.maps.Map | null>(null);
    const [coordinates, setCoordinates] = useState({
        latitude: '',
        longitude: ''
    });
    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);
    const [selectedPolygon, setSelectedPolygon] = useState<google.maps.Polygon | null>(null);
    const [area, setArea] = useState<number>(0);
    const [selectedUnit, setSelectedUnit] = useState<UnitType>('sqm');
    const [drawingMode, setDrawingMode] = useState(false);

    const mapOptions: google.maps.MapOptions = {
        zoom: 18,
        center: center,
        mapTypeId: 'satellite',
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: false,
        scaleControl: true,
        rotateControl: true,
    };

    const calculatePolygonArea = (polygon: google.maps.Polygon): number => {
        const path = polygon.getPath();
        const area = google.maps.geometry.spherical.computeArea(path);
        return area; // Returns area in square meters
    };

    const formatArea = (areaInSqM: number, unit: UnitType): string => {
        const convertedArea = areaInSqM * units[unit].conversion;
        return `${convertedArea.toLocaleString('en-IN', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        })} ${units[unit].label}`;
    };

    const onPolygonComplete = useCallback((polygon: google.maps.Polygon) => {
        const calculatedArea = calculatePolygonArea(polygon);
        setArea(calculatedArea);
        setPolygons(prev => [...prev, polygon]);
        setSelectedPolygon(polygon);
        setDrawingMode(false);

        // Add click listener to polygon for selection
        polygon.addListener('click', () => {
            setSelectedPolygon(polygon);
            setArea(calculatePolygonArea(polygon));
        });
    }, []);

    const clearAllPolygons = () => {
        polygons.forEach(polygon => polygon.setMap(null));
        setPolygons([]);
        setSelectedPolygon(null);
        setArea(0);
        setDrawingMode(false);
    };

    const deleteSelectedPolygon = () => {
        if (selectedPolygon) {
            selectedPolygon.setMap(null);
            setPolygons(prev => prev.filter(p => p !== selectedPolygon));
            setSelectedPolygon(null);
            setArea(0);
        }
    };


    const handleSearch = () => {
        const lat = parseFloat(coordinates.latitude);
        const lng = parseFloat(coordinates.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
            const newPosition = { lat, lng };
            setCenter(newPosition);
            setMarkerPosition(newPosition);
            mapRef.current?.panTo(newPosition);
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
                setMarkerPosition(userLocation);
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
                                <button
                                    onClick={handleSearch}
                                    disabled={!coordinates.latitude || !coordinates.longitude}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <IonIcon icon={searchOutline} className="text-xl" />
                                    <span className="font-semibold">Search Location</span>
                                </button>

                                <button
                                    onClick={getCurrentLocation}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                                >
                                    <IonIcon icon={locationOutline} className="text-xl" />
                                    <span className="font-semibold">Current Location</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Drawing Controls */}
                    <div className="max-w-6xl mx-auto mb-8">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center gap-2 mb-6">
                                <IonIcon icon={shapesOutline} className="text-purple-400 text-xl" />
                                <h2 className="text-xl font-semibold text-white">Area Measurement Tools</h2>
                            </div>
                            
                            <div className="flex flex-wrap gap-4">
                                <IonButton
                                    fill="solid"
                                    color="success"
                                    onClick={() => setDrawingMode(true)}
                                    disabled={drawingMode}
                                >
                                    <IonIcon slot="start" icon={shapesOutline} />
                                    Start Drawing
                                </IonButton>
                                
                                {selectedPolygon && (
                                    <IonButton
                                        fill="solid"
                                        color="warning"
                                        onClick={deleteSelectedPolygon}
                                    >
                                        <IonIcon slot="start" icon={trashOutline} />
                                        Delete Selected
                                    </IonButton>
                                )}
                                
                                {polygons.length > 0 && (
                                    <IonButton
                                        fill="solid"
                                        color="danger"
                                        onClick={clearAllPolygons}
                                    >
                                        <IonIcon slot="start" icon={trashOutline} />
                                        Clear All
                                    </IonButton>
                                )}
                            </div>

                            <div className="mt-4 p-4 bg-blue-500/10 rounded-xl">
                                <h4 className="text-white font-semibold mb-2">How to measure area:</h4>
                                <div className="text-gray-300 text-sm space-y-1">
                                    <p>• Click "Start Drawing" to enable polygon tool</p>
                                    <p>• Click on the map to create points around your land</p>
                                    <p>• Double-click or close the shape to finish</p>
                                    <p>• The area will be calculated automatically</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Map Section */}
                    <IonCard className="mt-4 bg-white/10 backdrop-blur">
                        <IonCardContent>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-white mb-2">Satellite Map View</h3>
                                <p className="text-gray-300 text-sm">
                                    {markerPosition 
                                        ? `Showing location: ${markerPosition.lat.toFixed(6)}, ${markerPosition.lng.toFixed(6)}`
                                        : 'Enter coordinates above and click "Search Location" to view satellite imagery'
                                    }
                                </p>
                            </div>
                            <LoadScript googleMapsApiKey={GOOGLE_MAP_API_KEY} libraries={['drawing', 'geometry']}>
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    options={mapOptions}
                                    center={center}
                                    onLoad={onMapLoad}
                                >
                                    {markerPosition && (
                                        <Marker
                                            position={markerPosition}
                                            options={{
                                                icon: {
                                                    path: google.maps.SymbolPath.CIRCLE,
                                                    fillColor: '#00FF00',
                                                    fillOpacity: 1,
                                                    strokeColor: '#008000',
                                                    strokeWeight: 2,
                                                    scale: 8,
                                                },
                                                title: `Location: ${markerPosition.lat.toFixed(6)}, ${markerPosition.lng.toFixed(6)}`,
                                                animation: google.maps.Animation.DROP,
                                            }}
                                        />
                                    )}
                                    
                                    {drawingMode && (
                                        <DrawingManager
                                            onPolygonComplete={onPolygonComplete}
                                            options={{
                                                drawingControl: true,
                                                drawingControlOptions: {
                                                    position: google.maps.ControlPosition.TOP_CENTER,
                                                    drawingModes: [google.maps.drawing.OverlayType.POLYGON],
                                                },
                                                polygonOptions: {
                                                    fillColor: '#2196F3',
                                                    fillOpacity: 0.3,
                                                    strokeColor: '#2196F3',
                                                    strokeOpacity: 1,
                                                    strokeWeight: 2,
                                                    editable: true,
                                                    draggable: false,
                                                },
                                            }}
                                        />
                                    )}
                                </GoogleMap>
                            </LoadScript>
                        </IonCardContent>
                    </IonCard>

                    {/* Area Results */}
                    {area > 0 && (
                        <div className="max-w-6xl mx-auto mt-8">
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <div className="flex items-center gap-2 mb-4">
                                    <IonIcon icon={calculatorOutline} className="text-green-400 text-xl" />
                                    <h2 className="text-xl font-semibold text-white">Area Calculation Results</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Unit Selection */}
                                    <div>
                                        <label className="block text-gray-300 mb-2">Display Unit</label>
                                        <IonSelect
                                            value={selectedUnit}
                                            onIonChange={(e: any) => setSelectedUnit(e.detail.value)}
                                            className="bg-white/5 border border-white/10 rounded-xl text-white"
                                            placeholder="Select Unit"
                                        >
                                            {Object.entries(units).map(([key, unit]) => (
                                                <IonSelectOption key={key} value={key}>
                                                    {unit.label}
                                                </IonSelectOption>
                                            ))}
                                        </IonSelect>
                                    </div>

                                    {/* Area Display */}
                                    <div>
                                        <label className="block text-gray-300 mb-2">Calculated Area</label>
                                        <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-3">
                                            <div className="text-2xl font-bold text-green-400">
                                                {formatArea(area, selectedUnit)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* All Units Display */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Area in All Units:</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {Object.entries(units).map(([key, unit]) => (
                                            <div key={key} className="bg-white/5 rounded-lg p-3 text-center">
                                                <div className="text-sm text-gray-300">{unit.label}</div>
                                                <div className="text-lg font-semibold text-white">
                                                    {formatArea(area, key as UnitType)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </IonContent>


        </IonPage>
    );
};

export default LandMeasurementScreen;
