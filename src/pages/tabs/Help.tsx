import React, { useState } from 'react';
import {
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    IonIcon,
} from '@ionic/react';
import {
    MdStraighten,
    MdWbSunny,
    MdGrass,
    MdCalculate,
} from 'react-icons/md';
import {
    mailOutline,
    callOutline,
    chevronDownOutline,
    chevronUpOutline,
} from 'ionicons/icons';
import ProtectedLayout from '../../components/PrivateLayout';
import helpSectionsData from '../../data/helpSections.json';

// Icon mapping for the sections
const iconMapping: { [key: string]: any } = {
    MdStraighten,
    MdWbSunny,
    MdGrass,
    MdCalculate,
};

// Map the JSON data with icons
const helpSections = helpSectionsData.map(section => ({
    ...section,
    icon: iconMapping[section.icon]
}));

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
                            <button
                                onClick={() => {
                                    const email = 'riverpearlsolutions@gmail.com';
                                    const subject = 'Support Request';
                                    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
                                    window.open(mailtoUrl, '_system');
                                }}
                                className="flex items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 w-full text-left"
                            >
                                <IonIcon icon={mailOutline} />
                                <div>
                                    <div className="text-sm font-medium text-white">Email Support</div>
                                    <div className="text-xs text-gray-300  ">riverpearlsolutions@gmail.com</div>
                                </div>
                            </button>
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
