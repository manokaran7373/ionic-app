import React from 'react';
import { IonToast } from '@ionic/react';

interface AlertMessageProps {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error';
  onDidDismiss: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ isOpen, message, type, onDidDismiss }) => {
  return (
    <IonToast
      isOpen={isOpen}
      message={message}
      duration={3000}
      position="top"
      color={type === 'success' ? 'success' : 'danger'}
      onDidDismiss={onDidDismiss}
    />
  );
};

export default AlertMessage;
