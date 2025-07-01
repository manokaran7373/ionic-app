import React, { useState } from 'react';
import { useIonRouter } from '@ionic/react';
import {
    chevronForwardOutline,
    starOutline,
    star,
    sendOutline,
    chatbubbleOutline
} from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { useAuth } from '../../components/AuthContext';
import AlertMessage from '../../components/AlertMessage';
import ProtectedLayout from '../../components/PrivateLayout';
import { API_ENDPOINTS } from '../../components/config/constants';

const FeedbackScreen: React.FC = () => {
    const router = useIonRouter();
    const { axiosInstance } = useAuth();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState({ show: false, message: '' });
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axiosInstance.post(`/${API_ENDPOINTS.USER_FEEDBACK}`, {
                rating,
                comment: comment.trim()
            });

            if (response.data.status === 'success') {
                setSuccess({ show: true, message: 'Your feedback has been submitted successfully!' });
                setTimeout(() => {
                    setSuccess({ show: false, message: '' });
                    router.push('/dashboard', 'root');
                }, 2000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again later');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedLayout title="Feedback">
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-inter py-6 px-4">
                <div className="w-full max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                            Your Feedback
                        </h1>
                        <p className="text-gray-300 text-sm md:text-lg">Share your experience with our app</p>
                    </div>

                    {/* Glassy Feedback Box */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 space-y-6">
                        {/* Rating */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <IonIcon icon={chevronForwardOutline} className="text-blue-400 " />
                                <h2 className="text-lg font-semibold text-white">Rate Us</h2>
                            </div>
                            <div className="flex justify-center gap-2 mb-2">
                                {[1, 2, 3, 4, 5].map((starVal) => (
                                    <button
                                        key={starVal}
                                        onClick={() => {
                                            setRating(starVal);
                                            setError('');
                                        }}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <IonIcon
                                            icon={rating >= starVal ? star : starOutline}
                                            className={`text-3xl ${rating >= starVal ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-gray-300 text-sm text-center">
                                {rating > 0 ? `${rating}/5 stars` : 'Select your rating'}
                            </p>
                        </div>

                        {/* Comment Box */}
                        <div >
                            <div className="flex items-center gap-2 mb-3">
                                <IonIcon icon={chatbubbleOutline} className="text-green-400" />
                                <h2 className="text-lg font-semibold text-white">Your Comments</h2>
                            </div>
                            <textarea
                                rows={4}
                                value={comment}
                                onChange={(e) => {
                                    setComment(e.target.value);
                                    setError('');
                                }}
                                placeholder="Write your feedback here..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3
                            bg-gradient-to-r from-blue-500 to-purple-600
                           
                            text-white rounded-lg transition-all duration-300 font-semibold text-sm
                            ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <IonIcon icon={sendOutline} />
                            {loading ? 'Submitting...' : 'Submit Feedback'}
                        </button>


                        {error && <p className="text-red-500 text-xs text-center mt-2">{error}</p>}
                    </div>
                </div>

                {/* Success Message */}
                <AlertMessage
                    isOpen={success.show}
                    message={success.message}
                    onDidDismiss={() => setSuccess({ show: false, message: '' })}
                />
            </div>
        </ProtectedLayout>
    );
};

export default FeedbackScreen;
