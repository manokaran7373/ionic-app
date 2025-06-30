import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
    IonSpinner,
    IonIcon,
} from '@ionic/react';
import { GoogleMap, useJsApiLoader, Marker, KmlLayer } from '@react-google-maps/api';
import {
    telescope,
    downloadOutline,
    informationCircleOutline,
    shieldCheckmarkOutline,
    refreshOutline,
} from 'ionicons/icons';
import { useAuth } from '../../components/AuthContext';
import AlertMessage from '../../components/AlertMessage';
import { GOOGLE_MAP_API_KEY, API_ENDPOINTS } from '../../components/config/constants';
import ProtectedLayout from '../../components/PrivateLayout';
import { SatelliteData } from '../../services/types/google_map';

const SatelliteMapView: React.FC = () => {
    const history = useHistory();
    const { axiosInstance } = useAuth();
    const mapRef = useRef<google.maps.Map | null>(null);

    const [kmlUrl, setKmlUrl] = useState<string | null>(null);
    const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAP_API_KEY,
        libraries: ['geometry']
    });

    const fetchSatelliteData = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/${API_ENDPOINTS.GET_SAT_IMAGES}`);

            if (response.data.status === 'success') {
                setSatelliteData(response.data.data);
                if (response.data.data.image_status === 'ready' && response.data.data.kml_file_url) {
                    setKmlUrl(response.data.data.kml_file_url);
                }
            } else {
                setError(response.data.message || 'Failed to fetch satellite data');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Network error occurred');
            console.error('Error fetching satellite data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSatelliteData();
        const interval = setInterval(fetchSatelliteData, 30000);
        return () => clearInterval(interval);
    }, []);

    const saveAsJPG = async () => {
        if (!satelliteData) return;

        try {
            setDownloading(true);
            const { latitude, longitude } = satelliteData;

            const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=19&size=1920x1080&maptype=satellite&key=${GOOGLE_MAP_API_KEY}`;

            const response = await fetch(imageUrl);
            const blob = await response.blob();

            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

            link.href = blobUrl;
            link.download = `satellite-${latitude.toFixed(6)}-${longitude.toFixed(6)}-${timestamp}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);

            setSuccessMessage('Satellite image saved successfully!');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Error saving image:', error);
            setError('Failed to save image. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    const mapContainerStyle = {
        width: '100%',
        height: window.innerWidth <= 768 ? '300px' : '600px',
        borderRadius: '12px'
    };

    const mapOptions: google.maps.MapOptions = {
        mapTypeId: 'satellite',
        disableDefaultUI: true,
        zoomControl: false,
        fullscreenControl: true,
        mapTypeControl: false,
        rotateControl: false,
        scaleControl: false,
        gestureHandling: 'none',
        keyboardShortcuts: false,
        draggable: false,
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-96">
                    <IonSpinner name="crescent" />
                </div>
            );
        }

        if (error && !satelliteData) {
            return (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-red-500/20 p-8 text-center">
                    <IonIcon icon={telescope} className="text-6xl text-red-400 mb-4" />
                    <p className="text-gray-300 mb-6">{error}</p>
                    <button
                        onClick={() => history.push('/dashboard')}
                        className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl"
                    >
                        Back to Dashboard
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                        Satellite Imagery
                    </h1>
                    <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                        Secure satellite imagery for your selected coordinates
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-2">
                            <IonIcon icon={telescope} className="text-blue-400 text-xl" />
                            <h2 className="text-lg font-semibold text-white">Map View</h2>
                        </div>
                        <button
                            onClick={saveAsJPG}
                            disabled={downloading}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl text-white font-semibold disabled:opacity-50"
                        >
                            <IonIcon icon={downloading ? refreshOutline : downloadOutline} />
                            {downloading ? 'Saving...' : 'Save as JPG'}
                        </button>
                    </div>

                    {isLoaded && satelliteData && (
                        <div className="rounded-xl overflow-hidden">
                            <GoogleMap
                                ref={(map) => {
                                    if (map) {
                                        mapRef.current = map.state.map;
                                    }
                                }}
                                mapContainerStyle={mapContainerStyle}
                                center={{
                                    lat: satelliteData.latitude,
                                    lng: satelliteData.longitude
                                }}
                                zoom={19}
                                options={mapOptions}
                                onLoad={(map) => {
                                    mapRef.current = map;
                                    map.setTilt(0);
                                }}
                            >
                                {kmlUrl && (
                                    <KmlLayer
                                        url={kmlUrl}
                                        options={{
                                            preserveViewport: false,
                                            suppressInfoWindows: true
                                        }}
                                    />
                                )}
                                <Marker
                                    position={{
                                        lat: satelliteData.latitude,
                                        lng: satelliteData.longitude
                                    }}
                                    icon={{
                                        path: google.maps.SymbolPath.CIRCLE,
                                        fillColor: '#34D399',
                                        fillOpacity: 1,
                                        strokeColor: '#ffffff',
                                        strokeWeight: 2,
                                        scale: 8
                                    }}
                                />
                            </GoogleMap>
                        </div>
                    )}

                    <div className="mt-6 bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <IonIcon icon={informationCircleOutline} className="text-blue-400" />
                            <h3 className="text-white font-semibold">Map Features</h3>
                        </div>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li>• Green marker shows exact coordinates</li>
                            <li>• Maximum available satellite detail</li>
                            <li>• Download high-quality image</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-yellow-500/20 p-6">
                    <div className="flex items-start gap-4">
                        <IonIcon icon={shieldCheckmarkOutline} className="text-yellow-400 text-2xl" />
                        <div>
                            <h3 className="text-yellow-400 font-semibold mb-3">Security Notice</h3>
                            <div className="text-gray-300 space-y-2 text-sm">
                                <p><strong>Confidential:</strong> For your use only</p>
                                <p><strong>Usage:</strong> Personal/professional use within legal limits</p>
                                <p><strong>Security:</strong> Store securely, no public sharing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <ProtectedLayout title="View Images">
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="min-h-screen flex items-center">
                    <div className="w-full max-w-6xl mx-auto p-4">
                        {renderContent()}
                    </div>
                </div>

                <AlertMessage
                    isOpen={showSuccess}
                    message={successMessage}
                    onDidDismiss={() => setShowSuccess(false)}
                />
            </div>
        </ProtectedLayout>
    );
};

export default SatelliteMapView;
