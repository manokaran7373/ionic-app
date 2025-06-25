import React from 'react';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react';
import {
    imageOutline,
    calculatorOutline,
    cloudOutline,
    locationOutline
} from 'ionicons/icons';
import ProtectedLayout from '../../components/PrivateLayout';
import { useIonRouter } from '@ionic/react';

const Dashboard: React.FC = () => {
    const router = useIonRouter();

    const cards = [
        {
            title: "Satellite Image Request",
            description: "Satellite image of latitude and longitude coordinate",
            icon: imageOutline,
            route: "/dashboard/image-request",
            bg: "bg-green-500/20",
            iconColor: "text-green-400"
        },
        {
            title: "Land Calculator",
            description: "Instantly measure your land dimensions",
            icon: calculatorOutline,
            route: "/land-calculator",
            bg: "bg-green-500/20",
            iconColor: "text-green-400"
        },
        {
            title: "Land Measurement",
            description: "Enter coordinates to search locations",
            icon: locationOutline,
            route: "/land-measurement",
            bg: "bg-green-500/20",
            iconColor: "text-green-400"
        },
        {
            title: "Weather Analysis",
            description: "Check area weathers",
            icon: cloudOutline,
            route: "/weather",
            bg: "bg-green-500/20",
            iconColor: "text-green-400"
        }
    ];

    return (
        <ProtectedLayout title="Dashboard">
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-inter p-4 md:p-8">

                {/* Header Section */}
                <div className="text-center max-w-4xl mx-auto mb-10">
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                        Our Services
                    </h1>
                    <p className="text-gray-300 text-sm md:text-lg">
                        Explore a range of powerful tools including land measurement, satellite image requests, land calculators, and weather analysis—all designed to help you make informed decisions with ease.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
                    {cards.map((card, index) => (
                        <IonCard
                            key={index}
                            onClick={() => router.push(card.route)}
                            className="cursor-pointer p-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl group"
                        >
                            <IonCardContent className="text-center p-6">
                                <div className="mb-6 flex justify-center">
                                    <div className={`p-4 ${card.bg} rounded-full group-hover:bg-green-500/30 transition-colors`}>
                                        <IonIcon icon={card.icon} className={`${card.iconColor} text-3xl group-hover:scale-110 transition-transform`} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                                    {card.title}
                                </h3>
                                <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">
                                    {card.description}
                                </p>
                            </IonCardContent>
                        </IonCard>
                    ))}
                </div>
            </div>
        </ProtectedLayout>

    );
};

export default Dashboard;
