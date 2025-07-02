import React, { useEffect, useRef, useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Lottie from 'lottie-web';
import { Preferences } from '@capacitor/preferences';

const RestartLoaderScreen: React.FC = () => {
  const lottieContainer = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const history = useHistory();

  useEffect(() => {
    let animation: any = null;

    if (lottieContainer.current) {
      animation = Lottie.loadAnimation({
        container: lottieContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/assets/Globe.json'
      });
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; // 100% in 5 seconds
      });
    }, 100);

    return () => {
      if (animation) {
        animation.destroy();
      }
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(async () => {
        // Mark that restart screen has been shown
        await Preferences.set({ key: 'hasShownRestartScreen', value: 'true' });
        history.replace('/dashboard');
      }, 500);
    }
  }, [progress, history]);

  return (
    <IonPage>
      <IonContent fullscreen className="ion-no-border">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
          <div className="w-64 h-64 mb-8" ref={lottieContainer} />

          <div className="relative w-40 h-2 mb-8 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute -top-1 h-4 w-4 bg-white rounded-full shadow-lg transition-all duration-100"
              style={{ left: `calc(${progress}% - 0.5rem)` }}
            />
          </div>

          <div className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white to-green-400">
            {progress}%
          </div>

          <p className="text-xl text-gray-400">
            Geo-Fencing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white">v1.0</span>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RestartLoaderScreen;
