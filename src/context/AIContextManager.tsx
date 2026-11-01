import React, { createContext, useContext, useState } from 'react';
import { AIContextType } from '../types';

interface AIContextManagerType {
  activeContext: AIContextType;
  setAIContext: (context: AIContextType) => void;
  getContextLabel: (context: AIContextType, lang: string) => string;
}

const AIContextManagerContext = createContext<AIContextManagerType | undefined>(undefined);

export const AIContextManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeContext, setActiveContext] = useState<AIContextType>('DOCTOR_COMMUNICATION');

  const setAIContext = (context: AIContextType) => {
    setActiveContext(context);
  };

  const getContextLabel = (context: AIContextType, lang: string): string => {
    const isTe = lang === 'te';
    const isHi = lang === 'hi';

    switch (context) {
      case 'SYMPTOM_GUIDANCE':
        return isTe ? 'అనారోగ్య లక్షణాల అవగాహన' : isHi ? 'लक्षण मार्गदर्शन' : 'Symptom Guidance';
      case 'DOCTOR_COMMUNICATION':
        return isTe ? 'డాక్టర్ సంప్రదింపుల వివరణ' : isHi ? 'डॉक्टर परामर्श तैयारी' : 'Doctor Communication';
      case 'MEDICINE_SCAN':
        return isTe ? 'మందుల వివరాలు & స్కాన్' : isHi ? 'दवा की जानकारी' : 'Medicine Information';
      case 'HEALTHCARE_CALL':
        return isTe ? 'ఆరోగ్య కార్యకర్త సంభాషణ' : isHi ? 'स्वास्थ्य कार्यकर्ता कॉल' : 'Healthcare Call';
      case 'FACILITY_SEARCH':
        return isTe ? 'ఆసుపత్రుల అన్వేషణ' : isHi ? 'अस्पताल खोज' : 'Facility Search';
      case 'FOLLOW_UP':
        return isTe ? 'ఆరోగ్య పురోగతి (Follow-up)' : isHi ? 'स्वास्थ्य फॉलो-अप' : 'Health Follow-up';
      default:
        return 'General Assistance';
    }
  };

  return (
    <AIContextManagerContext.Provider value={{ activeContext, setAIContext, getContextLabel }}>
      {children}
    </AIContextManagerContext.Provider>
  );
};

export const useAIContext = () => {
  const context = useContext(AIContextManagerContext);
  if (!context) {
    throw new Error('useAIContext must be used within an AIContextManagerProvider');
  }
  return context;
};
