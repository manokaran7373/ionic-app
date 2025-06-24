import React from 'react';
import {
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
} from '@ionic/react';
import {
    statsChartOutline,
    trendingUpOutline,
    imageOutline,
    calculatorOutline,
} from 'ionicons/icons';
import ProtectedLayout from '../../components/PrivateLayout';

const Dashboard: React.FC = () => {
    const stats = [
        {
            title: "Images Processed",
            value: "24",
            icon: imageOutline,
        },
        {
            title: "Land Calculated",
            value: "12.5 acres",
            icon: calculatorOutline,
        },
        {
            title: "Weather Reports",
            value: "8",
            icon: statsChartOutline,
        },
        {
            title: "Success Rate",
            value: "98.5%",
            icon: trendingUpOutline,
        }
    ];

    return (
        <ProtectedLayout title="Process Image">
            <div className="p-4">
                <h1 className="text-2xl font-bold text-white mb-4">
                    Welcome back! 👋
                </h1>
                
                <IonGrid>
                    <IonRow>
                        {stats.map((stat, index) => (
                            <IonCol size="6" sizeMd="3" key={index}>
                                <IonCard className="bg-white/10">
                                    <IonCardContent>
                                        <IonIcon 
                                            icon={stat.icon} 
                                            className="text-white text-2xl mb-2"
                                        />
                                        <h3 className="text-xl font-bold text-white">
                                            {stat.value}
                                        </h3>
                                        <p className="text-gray-300">
                                            {stat.title}
                                        </p>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>
            </div>
        </ProtectedLayout>
    );
};

export default Dashboard;
