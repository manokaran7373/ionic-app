import React, { useState } from 'react';
import {
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
} from '@ionic/react';
import {
    MdStraighten,
    MdWbSunny,
    MdGrass,
    MdCalculate,
    MdContactSupport,
    MdEmail,
    MdPhone
} from 'react-icons/md';
import {
    mailOutline,
    callOutline,
    chevronDownOutline,
    chevronUpOutline,
} from 'ionicons/icons';
import ProtectedLayout from '../../components/PrivateLayout';

const helpSections = [
    {
        title: "Land Measurement",
        icon: MdStraighten,
        items: [
            {
                title: "How to measure land area",
                content: `1. Open the app and navigate to Land Measurement\n2. Allow GPS access\n3. Walk around your plot boundaries\n4. Mark each corner point\n5. Complete the boundary to see the total area`
            },
            {
                title: "Understanding acre calculations",
                content: `1 Acre = 43,560 square feet\n1 Acre = 4,047 square meters\n1 Acre = 100 cents\nUse our built-in converter for accurate conversions`
            },
            {
                title: "GPS boundary mapping guide",
                content: `Ensure clear sky view for better GPS accuracy\nMaintain steady walking pace\nMark corners clearly\nDouble-check your starting and ending points`
            },
            {
                title: "Area conversion tools usage",
                content: `Select your input unit\nEnter the value\nChoose desired output unit\nGet instant conversion results`
            }
        ]
    },
    {
        title: "Weather Reports",
        icon: MdWbSunny,
        items: [
            {
                title: "Reading weather forecasts",
                content: `Temperature readings in °C and °F\nPrecipitation probability\nWind speed and direction\nHumidity levels and atmospheric pressure`
            },
            {
                title: "Understanding weather impacts",
                content: `Learn how weather affects crops\nBest practices for different conditions\nProtective measures during extreme weather\nCrop-specific weather guidelines`
            },
            {
                title: "Seasonal predictions",
                content: `Long-term weather patterns\nSeasonal rainfall predictions\nTemperature trends\nCrop planning recommendations`
            },
            {
                title: "Weather alerts system",
                content: `Set up custom weather alerts\nReceive timely notifications\nConfigure alert thresholds\nManage alert preferences`
            }
        ]
    },
    {
        title: "Agricultural Monitoring",
        icon: MdGrass,
        items: [
            {
                title: "Crop monitoring basics",
                content: `1. Regular visual inspections\n2. Document growth stages with photos\n3. Monitor leaf color and health\n4. Track plant height and density\n5. Record watering and fertilization schedules`
            },
            {
                title: "Soil health tracking",
                content: `pH Level: Maintain between 6.0-7.0\nNitrogen Content: Check monthly\nMoisture Level: Monitor weekly\nOrganic Matter: Track seasonally\nSoil Temperature: Record daily`
            },
            {
                title: "Growth stage monitoring",
                content: `Seedling Stage: Days 1-15\nVegetative Stage: Days 16-30\nFlowering Stage: Days 31-45\nFruiting Stage: Days 46-60\nHarvesting Stage: Days 61-75`
            },
            {
                title: "Field inspection tips",
                content: `Walk in zigzag pattern for thorough inspection\nCheck for pest infestations\nDocument unusual plant symptoms\nUse our built-in pest identification tool\nCreate detailed inspection reports`
            }
        ]
    },
    {
        title: "Land Calculator",
        icon: MdCalculate,
        items: [
            {
                title: "Area calculation guide",
                content: `Square Plot: length × width\nRectangular Plot: length × width\nTriangular Plot: ½ × base × height\nIrregular Plot: Use GPS mapping\nCircular Plot: π × radius²`
            },
            {
                title: "Plot dimension tools",
                content: `1. Select plot shape\n2. Enter measurements\n3. Choose unit (feet/meters)\n4. Get instant calculations\n5. Save results for future reference`
            },
            {
                title: "Cost estimation features",
                content: `Land value calculator\nDevelopment cost estimator\nProperty tax calculator\nROI prediction tool\nMaintenance cost projector`
            },
            {
                title: "Measurement unit conversion",
                content: `1 Hectare = 2.47 Acres\n1 Acre = 43,560 sq ft\n1 Square Meter = 10.764 sq ft\n1 Cent = 435.6 sq ft`
            }
        ]
    }
];

const HelpScreen: React.FC = () => {
    const [expanded, setExpanded] = useState<string | null>(null);

    const toggleAccordion = (key: string) => {
        setExpanded(expanded === key ? null : key);
    };

    return (
        <ProtectedLayout title="Help">
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-inter w-full py-8 px-4">
                <div className="w-full max-w-4xl mx-auto space-y-6">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">Help Center</h1>
                        <p className="text-gray-300 text-sm md:text-base">Find answers and support</p>
                    </div>

                    {/* Help Section Accordion */}
                    {helpSections.map((section, index) => (
                        <div
                            key={index}
                            className="bg-white/10 rounded-xl backdrop-blur-xl border border-white/10 overflow-hidden"
                        >
                            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold">{section.title}</div>
                            <IonAccordionGroup value={expanded}>
                                {section.items.map((item, i) => {
                                    const id = `${index}-${i}`;
                                    const isOpen = expanded === id;
                                    return (
                                        <IonAccordion
                                            key={id}
                                            value={id}
                                            onClick={() => toggleAccordion(id)}
                                            className="bg-white/5 border-t border-white/10"
                                            toggleIcon=""
                                        >
                                            <IonItem
                                                lines="none"
                                                slot="header"
                                            >
                                                <IonLabel className="text-blue-300 font-medium">{item.title}</IonLabel>
                                                <IonIcon
                                                    slot="end"
                                                    icon={isOpen ? chevronUpOutline : chevronDownOutline}
                                                    className="text-blue"
                                                />
                                            </IonItem>
                                            <div className="p-4 whitespace-pre-wrap text-sm text-slate-200" slot="content">
                                                {item.content}
                                            </div>
                                        </IonAccordion>
                                    );
                                })}
                            </IonAccordionGroup>
                        </div>
                    ))}

                    {/* Support Section */}
                    <div className="bg-white/10 rounded-xl backdrop-blur-xl border border-white/10 p-6 text-white space-y-4">
                        <h2 className="text-xl font-semibold">Need more help?</h2>
                        <p className="text-gray-300 text-sm">Our support team is here for you:</p>
                        <div className="space-y-3">
                            <a
                                href="mailto:riverpearlsolutions@gmail.com"
                                className="flex items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10"
                            >
                                <IonIcon icon={mailOutline} />
                                <div>
                                    <div className="text-sm font-medium text-white">Email Support</div>
                                    <div className="text-xs text-gray-300  ">riverpearlsolutions@gmail.com</div>
                                </div>
                            </a>
                            <a
                                href="tel:+917373232074"
                                className="flex items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10"
                            >
                                <IonIcon icon={callOutline} />
                                <div>
                                    <div className="text-sm font-medium text-white">Call Support</div>
                                    <div className="text-xs text-gray-300">+91 7373232074</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
};

export default HelpScreen;
