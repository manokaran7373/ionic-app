import React from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonMenuButton,
    IonButtons,
    IonIcon
} from '@ionic/react';
import { menuOutline } from 'ionicons/icons';
import Sidebar from '../pages/Sidebar';

interface PrivateLayoutProps {
    title: string;
    children: React.ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ title, children }) => {
    return (
        <>
            <Sidebar />
            <IonPage id="main-content">
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-md">
                                <IonMenuButton autoHide={false}>
                                    <IonIcon icon={menuOutline} className="text-white text-xl" />
                                </IonMenuButton>
                            </div>
                        </IonButtons>

                        <IonTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-bold ">
                            {title}
                        </IonTitle>

                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    {children}
                </IonContent>
            </IonPage>
        </>
    );
};

export default PrivateLayout;
