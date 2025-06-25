import React from 'react';
import {
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenuToggle,
    IonButton,
    IonAvatar,
    IonText,
    IonBadge
} from '@ionic/react';
import {
    locationOutline,
    searchOutline,
    imageOutline,
    calculatorOutline,
    cloudOutline,
    cardOutline,
    settingsOutline,
    helpCircleOutline,
    chatboxOutline,
    logOutOutline,
} from 'ionicons/icons';
import { useAuth } from '../components/AuthContext';
import { useIonRouter } from '@ionic/react';

interface MenuItem {
    icon: string;
    label: string;
    screen: string;
    description: string;
    isPremium?: boolean;
}

const menuItems: MenuItem[] = [
    {
        icon: locationOutline,
        label: "Dashboard",
        screen: "dashboard",
        description: "Overview and analytics"
    },
    {
        icon: searchOutline,
        label: "Process Image",
        screen: "process-image",
        description: "Process satellite imagery",
        isPremium: true
    },
    {
        icon: imageOutline,
        label: "View Images",
        screen: "satellite-map",
        description: "View satellite maps"
    },
    {
        icon: cardOutline,
        label: "Subscriptions",
        screen: "subscriptions",
        description: "Manage your plans"
    },
    {
        icon: settingsOutline,
        label: "Settings",
        screen: "settings",
        description: "Configure preferences"
    },
    {
        icon: helpCircleOutline,
        label: "Help",
        screen: "help",
        description: "Get assistance"
    },
    {
        icon: chatboxOutline,
        label: "Feedback",
        screen: "feedback",
        description: "Share your thoughts"
    }
];

const Sidebar: React.FC = () => {
    const { logout } = useAuth();
    const router = useIonRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/welcome', 'root');
    };

    const handleNavigation = (screen: string) => {
        router.push(`/${screen}`);
    };

    return (
        <IonMenu contentId="main-content" type="overlay" className="custom-menu">

            <IonContent className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ">
                {/* User Profile Section */}
                <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 border-b border-black/10">
                    <div className="flex items-center space-x-3">
                        <IonAvatar className="w-12 h-12">
                            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">MK</span>
                            </div>
                        </IonAvatar>
                        <div>
                            <h3 className="text-lg font-semibold text-white bg-clip-text text-transparent">
                                Welcome User
                            </h3>
                        </div>
                    </div>
                </div>


                {/* Menu Items */}
                <IonList className="bg-transparent">
                    {menuItems.map((item, index) => (
                        <IonMenuToggle key={index} autoHide={false}>
                            <IonItem
                                button
                                onClick={() => handleNavigation(item.screen)}
                                className="menu-item bg-transparent border-b border-white/5 hover:bg-white/10 transition-all duration-200"
                            >
                                <div className="flex items-center w-full py-2 ">
                                    <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-xl mr-4">
                                        <IonIcon
                                            icon={item.icon}
                                            className="text-purple-800 text-xl"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <IonLabel>
                                                <h3 className="text-black font-semibold text-base">
                                                    {item.label}
                                                </h3>
                                                <p className="text-slate-400 text-sm mt-1">
                                                    {item.description}
                                                </p>
                                            </IonLabel>

                                        </div>
                                    </div>
                                </div>
                            </IonItem>
                        </IonMenuToggle>
                    ))}
                </IonList>

                {/* Logout Button */}
                <div className="p-4 mt-4">
                    <IonButton
                        expand="block"
                        fill="outline"
                        onClick={handleLogout}
                        className="logout-btn border-red-500 text-red-500 font-bold"
                    >
                        <IonIcon icon={logOutOutline} slot="start" />
                        Logout
                    </IonButton>
                </div>
            </IonContent>
        </IonMenu>
    );
};

export default Sidebar;
