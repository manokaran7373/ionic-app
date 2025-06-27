import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonContent,
    IonIcon,
    IonButton,
    IonInput,
    IonLabel,
    IonItem,
    IonList,
    IonSegment,
    IonSegmentButton,
    useIonRouter
} from '@ionic/react';
import {
    personOutline,
    mailOutline,
    lockClosedOutline,
    eyeOutline,
    eyeOffOutline,
    saveOutline,
    createOutline,
    closeOutline,
    shieldOutline,
    callOutline
} from 'ionicons/icons';
import { useAuth } from '../../components/AuthContext';
import AlertMessage from '../../components/AlertMessage';
import { API_ENDPOINTS } from '../../components/config/constants';
import ProtectedLayout from '../../components/PrivateLayout';

const Settings: React.FC = () => {
    const router = useIonRouter();
    const { axiosInstance } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '' });
    const [errors, setErrors] = useState<any>({});

    const [userProfile, setUserProfile] = useState({
        fname: '',
        lname: '',
        email: '',
        phone: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axiosInstance.get(`/${API_ENDPOINTS.GET_USER}`);
            const userData = response.data.data.user;
            setUserProfile({
                fname: userData.first_name || '',
                lname: userData.last_name || '',
                email: userData.email,
                phone: userData.phone || ''
            });
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    const handleProfileUpdate = async () => {
        try {
            await axiosInstance.put(`/${API_ENDPOINTS.UPDATE_PROFILE}`, {
                fname: userProfile.fname,
                lname: userProfile.lname,
                phone: userProfile.phone
            });
            setIsEditing(false);
            fetchUserProfile();
            setAlert({
                show: true,
                message: 'Profile updated successfully!'
            });

            setTimeout(() => {
                router.push('/settings', 'root', 'replace');
            }, 2000);

        } catch (error: any) {
            setErrors({ profile: error.response?.data?.message || 'Failed to update profile' });
        }
    };

    const handlePasswordChange = async () => {
        try {
            await axiosInstance.post(`/${API_ENDPOINTS.CHANGE_PASSWORD}`, {
                current_password: passwordData.currentPassword,
                new_password: passwordData.newPassword,
                confirm_password: passwordData.confirmPassword
            });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setAlert({
                show: true,
                message: 'Password changed successfully!'
            });
        } catch (error: any) {
            setErrors({ password: error.response?.data?.message || 'Failed to change password' });
        }
    };

    return (
        <ProtectedLayout title="Settings">

            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-inter p-4 md:p-8">
                <div className="max-w-6xl mx-auto p-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                            My Account
                        </h1>
                        <p className="text-gray-300 text-sm md:text-lg">
                            Manage and update your personal information
                        </p>
                    </div>

                    {/* Segment Control */}
                    <IonSegment value={activeTab} onIonChange={e => setActiveTab(String(e.detail.value!))}>
                        <IonSegmentButton value="profile">
                            <IonIcon icon={personOutline} />
                            <IonLabel >Profile</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="security">
                            <IonIcon icon={shieldOutline} />
                            <IonLabel>Security</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    {/* Content Area */}
                    <div className="mt-6">
                        {activeTab === 'profile' && (
                            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                                    <IonButton
                                        fill="clear"
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        <IonIcon slot="start" icon={isEditing ? closeOutline : createOutline} />
                                        {isEditing ? 'Cancel' : 'Edit'}
                                    </IonButton>
                                </div>

                                <IonList className="bg-transparent">
                                    <IonItem className="bg-transparent">
                                        <IonIcon icon={personOutline} slot="start" />
                                        <IonInput
                                            label="First Name"
                                            labelPlacement="floating"
                                            value={userProfile.fname}
                                            onIonChange={e => setUserProfile({ ...userProfile, fname: e.detail.value! })}
                                            disabled={!isEditing}
                                        />
                                    </IonItem>
                                    <IonItem className="bg-transparent">
                                        <IonIcon icon={personOutline} slot="start" />
                                        <IonInput
                                            label="Last Name"
                                            labelPlacement="floating"
                                            value={userProfile.lname}
                                            onIonChange={e => setUserProfile({ ...userProfile, lname: e.detail.value! })}
                                            disabled={!isEditing}
                                        />
                                    </IonItem>

                                    <IonItem className="bg-transparent">
                                        <IonIcon icon={mailOutline} slot="start" />
                                        <IonInput
                                            label="Email"
                                            labelPlacement="floating"
                                            value={userProfile.email}
                                            disabled={true}
                                            type="email"
                                        />
                                    </IonItem>

                                    <IonItem className="bg-transparent">
                                        <IonIcon icon={callOutline} slot="start" />
                                        <IonInput
                                            label="Phone"
                                            labelPlacement="floating"
                                            value={userProfile.phone}
                                            onIonChange={e => setUserProfile({ ...userProfile, phone: e.detail.value! })}
                                            disabled={!isEditing}
                                            type="tel"
                                        />
                                    </IonItem>


                                    {/* Add similar IonItem components for other profile fields */}
                                </IonList>

                                {isEditing && (
                                    <IonButton  expand="block" onClick={handleProfileUpdate}>
                                        <IonIcon className='' slot="start" icon={saveOutline} />
                                        Save Changes
                                    </IonButton>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
                                <IonList className="bg-transparent">
                                    <IonItem className="bg-transparent">
                                        <IonIcon icon={lockClosedOutline} slot="start" />
                                        <IonInput
                                            label="Current Password"
                                            labelPlacement="floating"
                                            type={showPassword ? "text" : "password"}
                                            value={passwordData.currentPassword}
                                            onIonChange={e => setPasswordData({ ...passwordData, currentPassword: e.detail.value! })}
                                        />
                                        <IonIcon
                                            slot="end"
                                            icon={showPassword ? eyeOffOutline : eyeOutline}
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="cursor-pointer"
                                        />
                                    </IonItem>

                                    <IonItem className="bg-transparent">
                                        <IonIcon icon={lockClosedOutline} slot="start" />
                                        <IonInput
                                            label="New Password"
                                            labelPlacement="floating"
                                            type={showNewPassword ? "text" : "password"}
                                            value={passwordData.newPassword}
                                            onIonChange={e => setPasswordData({ ...passwordData, newPassword: e.detail.value! })}
                                        />
                                        <IonIcon
                                            slot="end"
                                            icon={showNewPassword ? eyeOffOutline : eyeOutline}
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="cursor-pointer"
                                        />
                                    </IonItem>

                                    <IonItem className="bg-transparent">
                                        <IonIcon icon={lockClosedOutline} slot="start" />
                                        <IonInput
                                            label="Confirm New Password"
                                            labelPlacement="floating"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwordData.confirmPassword}
                                            onIonChange={e => setPasswordData({ ...passwordData, confirmPassword: e.detail.value! })}
                                        />
                                        <IonIcon
                                            slot="end"
                                            icon={showConfirmPassword ? eyeOffOutline : eyeOutline}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="cursor-pointer"
                                        />
                                    </IonItem>

                                    <div className="mt-6">
                                        <IonButton expand="block" onClick={handlePasswordChange}>
                                            <IonIcon slot="start" icon={saveOutline} />
                                            Update Password
                                        </IonButton>
                                        {errors.password && (
                                            <div className="text-red-500 text-sm md:text-base text-center mt-1">{errors.password}</div>
                                        )}
                                    </div>
                                </IonList>


                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AlertMessage
                isOpen={alert.show}
                message={alert.message}
                onDidDismiss={() => setAlert({ ...alert, show: false })}
            />


        </ProtectedLayout>
    );
};

export default Settings;
