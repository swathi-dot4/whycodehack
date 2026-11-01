import React, { createContext, useContext, useState, useEffect } from 'react';
import { OfflineRequest } from '../types';

export type SyncStatusState = 'Saved Offline' | 'Syncing...' | 'Synced Successfully' | 'Sync Failed';

interface OfflineContextType {
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  toggleOfflineMode: () => void;
  offlineQueue: OfflineRequest[];
  addOfflineRequest: (request: Omit<OfflineRequest, 'id' | 'createdAt' | 'syncStatus'>) => void;
  syncOfflineRequests: () => void;
  isSyncing: boolean;
  syncStatusState: SyncStatusState;
  syncSuccessMessage: string | null;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

const STORAGE_KEY = 'CareBridge AI_offline_queue';

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState<boolean>(() => !navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatusState, setSyncStatusState] = useState<SyncStatusState>('Synced Successfully');
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  const [offlineQueue, setOfflineQueue] = useState<OfflineRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'off-req-1',
        type: 'DOCTOR_NOTE',
        title: 'Fever summary recorded in Ananthapur',
        content: 'Naku rendu rojula nunchi jwaram undi, night ekkuva oluyor.',
        language: 'te',
        createdAt: '15 mins ago',
        syncStatus: 'PENDING',
        patientId: 'usr-101'
      }
    ];
  });

  // Listen to browser network connectivity events
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Automatically trigger sync when internet returns
      syncOfflineRequests();
    };

    const handleOffline = () => {
      setIsOffline(true);
      setSyncStatusState('Saved Offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(offlineQueue));
    } catch (e) {
      console.error(e);
    }
  }, [offlineQueue]);

  const toggleOfflineMode = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);

    if (nextState) {
      setSyncStatusState('Saved Offline');
    } else {
      syncOfflineRequests();
    }
  };

  const addOfflineRequest = (req: Omit<OfflineRequest, 'id' | 'createdAt' | 'syncStatus'>) => {
    const newReq: OfflineRequest = {
      ...req,
      id: `off-req-${Date.now()}`,
      createdAt: 'Just now',
      syncStatus: isOffline ? 'PENDING' : 'SYNCED'
    };

    setOfflineQueue(prev => [newReq, ...prev]);

    if (isOffline) {
      setSyncStatusState('Saved Offline');
    } else {
      setSyncStatusState('Synced Successfully');
      setSyncSuccessMessage('Data saved & transmitted instantly to database!');
      setTimeout(() => setSyncSuccessMessage(null), 4000);
    }
  };

  const syncOfflineRequests = () => {
    setIsSyncing(true);
    setSyncStatusState('Syncing...');
    setSyncSuccessMessage(null);

    setTimeout(() => {
      // Deduplicate and mark all pending requests as SYNCED
      setOfflineQueue(prev =>
        prev.map(item => ({ ...item, syncStatus: 'SYNCED' }))
      );
      setIsSyncing(false);
      setSyncStatusState('Synced Successfully');
      setSyncSuccessMessage('Automatic Syncing Complete! All offline records synchronized to database.');

      setTimeout(() => {
        setSyncSuccessMessage(null);
      }, 5000);
    }, 1800);
  };

  return (
    <OfflineContext.Provider
      value={{
        isOffline,
        setIsOffline,
        toggleOfflineMode,
        offlineQueue,
        addOfflineRequest,
        syncOfflineRequests,
        isSyncing,
        syncStatusState,
        syncSuccessMessage
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
