import React, { useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonSelect,
    IonSelectOption,
} from '@ionic/react';
import { MdCalculate, MdSwapHoriz, MdHistory } from 'react-icons/md';

type UnitKey = 'sqft' | 'acre' | 'hectare' | 'sqm' | 'bigha' | 'cent' | 'gunta';

const LandCalculatorScreen: React.FC = () => {


    const [value, setValue] = useState('');
    const [fromUnit, setFromUnit] = useState<UnitKey>('sqft');
    const [toUnit, setToUnit] = useState<UnitKey>('acre');
    const [history, setHistory] = useState<any[]>([]);

    const conversionRates: Record<UnitKey, Record<UnitKey, number>> = {
        sqft: { sqft: 1, acre: 1 / 43560, hectare: 0.0000929, sqm: 0.092903, bigha: 1 / 27000, cent: 1 / 435.6, gunta: 1 / 1089 },
        acre: { sqft: 43560, acre: 1, hectare: 0.404686, sqm: 4046.86, bigha: 1.613, cent: 100, gunta: 40 },
        hectare: { sqft: 107639, acre: 2.47105, hectare: 1, sqm: 10000, bigha: 3.954, cent: 247.105, gunta: 98.842 },
        sqm: { sqft: 10.7639, acre: 0.000247105, hectare: 0.0001, sqm: 1, bigha: 0.0003954, cent: 0.0247105, gunta: 0.009884 },
        bigha: { sqft: 27000, acre: 0.619835, hectare: 0.25293, sqm: 2529.3, bigha: 1, cent: 61.9835, gunta: 24.7934 },
        cent: { sqft: 435.6, acre: 0.01, hectare: 0.00404686, sqm: 40.4686, bigha: 0.01613, cent: 1, gunta: 0.4 },
        gunta: { sqft: 1089, acre: 0.025, hectare: 0.0101171, sqm: 101.171, bigha: 0.04033, cent: 2.5, gunta: 1 }
    };

    const unitLabels = {
        sqft: 'Sq Ft',
        acre: 'Acre',
        hectare: 'Hectare',
        sqm: 'Sq M',
        bigha: 'Bigha',
        cent: 'Cent',
        gunta: 'Gunta'
    };

    const calculate = () => {
        if (!value || isNaN(Number(value))) return 0;
        const numValue = parseFloat(value);
        return Number((numValue * conversionRates[fromUnit][toUnit]).toFixed(6));
    };

    const handleCalculate = () => {
        const result = calculate();
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        setHistory(prev => [{
            id: Date.now(),
            from: `${numValue} ${unitLabels[fromUnit]}`,
            to: `${result} ${unitLabels[toUnit]}`,
            timestamp: new Date().toLocaleString()
        }, ...prev.slice(0, 9)]);
    };

    const handleInputChange = (e: any) => {
        const val = e.target.value;
        if (val === '' || /^\d*\.?\d*$/.test(val)) setValue(val);
    };

    const swapUnits = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="ion-padding-horizontal">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/dashboard" />
                    </IonButtons>
                    <IonTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-bold">
                        Land Calculator
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
                    {/* Header */}
                    <div className="text-center max-w-4xl mx-auto mb-8">
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">Land Unit Converter</h1>
                        <p className="text-gray-300 text-lg">Convert between land measurement units easily</p>
                    </div>

                    {/* Calculator Section */}
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 mb-6">
                        <label className="block mb-2 text-gray-300">Enter Value</label>
                        <input
                            type="text"
                            value={value}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-white/20 mb-4"
                            placeholder="Enter area"
                        />

                        <div className="flex items-center gap-4 mb-4">
                            <IonSelect
                                value={fromUnit}
                                onIonChange={(e) => setFromUnit(e.detail.value)}
                                interface="action-sheet" 
                                className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-white/20"
                            >
                                {Object.entries(unitLabels).map(([key, label]) => (
                                    <IonSelectOption key={key} value={key}>
                                        {label}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>

                            <button
                                onClick={swapUnits}
                                className="bg-blue-500/30 p-2 rounded-full hover:bg-blue-500/50"
                            >
                                <MdSwapHoriz size={20} />
                            </button>

                            <IonSelect
                                value={toUnit}
                                onIonChange={(e) => setToUnit(e.detail.value)}
                                interface="action-sheet" // Uses native bottom sheet on mobile
                                className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-white/20"
                            >
                                {Object.entries(unitLabels).map(([key, label]) => (
                                    <IonSelectOption key={key} value={key}>
                                        {label}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </div>

                        <button
                            onClick={handleCalculate}
                            className="w-full bg-gradient-to-r from-blue-500 to-green-500 py-3 rounded-xl font-bold text-white mb-4"
                        >
                            <MdCalculate className="inline-block mr-2" /> Convert
                        </button>

                        <div className="text-center bg-blue-500/10 p-4 rounded-xl">
                            <p className="text-lg font-semibold text-white">
                                {value && !isNaN(parseFloat(value)) ? `${calculate()} ${unitLabels[toUnit]}` : '0'}
                            </p>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                                <MdHistory size={20} />
                                Conversion History
                            </h2>
                            {history.length > 0 && (
                                <button
                                    onClick={() => setHistory([])}
                                    className="text-red-400 text-sm"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {history.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center">No history yet</p>
                        ) : (
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {history.map(item => (
                                    <div key={item.id} className="bg-gray-800/50 p-3 rounded-lg">
                                        <p className="text-white text-sm">{item.from} → <span className="text-green-400">{item.to}</span></p>
                                        <p className="text-xs text-gray-400">{item.timestamp}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default LandCalculatorScreen;
