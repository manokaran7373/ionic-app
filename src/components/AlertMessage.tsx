import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface AlertMessageProps {
    isOpen: boolean;
    message: string;
    onDidDismiss: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ isOpen, message, onDidDismiss }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-3">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"></div>
            <div className="bg-white rounded-xl p-4 shadow-2xl max-w-[280px] w-full relative z-10 transform transition-all animate-slide-up">
                <div className="flex flex-col items-center text-center">
                    <FaCheckCircle className="text-green-500 text-3xl mb-2" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Success!
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        {message}
                    </p>
                    <button
                        onClick={onDidDismiss}
                        className="bg-green-500 text-white px-6 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors duration-200 shadow-md"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertMessage;
