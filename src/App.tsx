import React, { useState } from 'react';
import { PageView, MedicineDetails } from './types';
import { LanguageProvider } from './context/LanguageContext';
import { AIContextManagerProvider } from './context/AIContextManager';
import { OfflineProvider } from './context/OfflineContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HealthcareProvider, useHealthcare } from './context/HealthcareContext';
import { FairQueueProvider } from './context/FairQueueContext';

import { SplashScreen } from './components/splash/SplashScreen';
import { Navbar } from './components/layout/Navbar';
import { StatusBar } from './components/layout/StatusBar';
import { SafetyBanner } from './components/layout/SafetyBanner';
import { Footer } from './components/layout/Footer';

import { AuthScreen } from './components/auth/AuthScreen';
import { ProfileScreen } from './components/auth/ProfileScreen';
import { PatientDashboard } from './components/dashboard/PatientDashboard';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { AIGuide } from './components/guide/AIGuide';
import { DoctorAssistant } from './components/doctor/DoctorAssistant';
import { MedicineScanner } from './components/medicine/MedicineScanner';
import { HealthcareCalls } from './components/calls/HealthcareCalls';
import { FacilityFinder } from './components/facilities/FacilityFinder';
import { OfflineManager } from './components/offline/OfflineManager';
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { FairQueueHome } from './components/queue/FairQueueHome';

import { VideoConsultation } from './components/consultation/VideoConsultation';
import { FamilyProfile } from './components/family/FamilyProfile';
import { FollowUpList } from './components/followup/FollowUpList';
import { PatientRequestsModal } from './components/requests/PatientRequestsModal';
import { EmergencyHelpModal } from './components/emergency/EmergencyHelpModal';

const AppContent: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  
  // Page view state: start at 'splash'
  const [currentPage, setCurrentPage] = useState<PageView>('splash');
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  const [doctorPrepText, setDoctorPrepText] = useState<string>('');
  const [activeCallData, setActiveCallData] = useState<{ contactName: string; role: string; phone: string } | null>(null);

  const handleSplashFinish = () => {
    // After 3-second splash screen, navigate to auth / role select
    setCurrentPage('auth');
  };

  const handleInitiateCall = (contactName: string, role: string, phone: string) => {
    setActiveCallData({ contactName, role, phone });
    setCurrentPage('calls');
  };

  const handleAskWorkerAboutMedicine = (medName: string, medDetails: MedicineDetails) => {
    setCurrentPage('worker');
  };

  // STEP 1: SPLASH SCREEN (First Screen for 3 seconds)
  if (currentPage === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // STEP 2: ROLE SELECTION & AUTHENTICATION SCREEN (Before Login)
  if (currentPage === 'auth' || !isAuthenticated) {
    return (
      <AuthScreen 
        onAuthSuccess={() => {
          if (role === 'DOCTOR') {
            setCurrentPage('doctor_dashboard');
          } else {
            setCurrentPage('dashboard');
          }
        }} 
      />
    );
  }

  // STEP 3: MAIN APPLICATION ECOSYSTEM (After Authentication)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top Navbar Header */}
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
      />

      {/* Secondary Live Status Header Bar */}
      <StatusBar />

      {/* Safety Notice Banner */}
      <SafetyBanner />

      {/* Emergency Help Modal */}
      <EmergencyHelpModal />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-3">
        
        {/* DOCTOR DASHBOARD */}
        {role === 'DOCTOR' && (currentPage === 'doctor_dashboard' || currentPage === 'dashboard') && (
          <DoctorDashboard setCurrentPage={setCurrentPage} />
        )}

        {/* PATIENT DASHBOARD */}
        {role === 'PATIENT' && currentPage === 'dashboard' && (
          <PatientDashboard 
            setCurrentPage={setCurrentPage} 
            onSelectPrompt={(text) => setInitialPrompt(text)} 
          />
        )}

        {/* AI Healthcare Guide */}
        {currentPage === 'guide' && (
          <AIGuide 
            initialPrompt={initialPrompt} 
            setCurrentPage={setCurrentPage} 
            setDoctorPrepText={setDoctorPrepText} 
          />
        )}

        {/* Doctor Communication prep */}
        {currentPage === 'doctor' && (
          <DoctorAssistant 
            initialPrepText={doctorPrepText} 
            setCurrentPage={setCurrentPage} 
            onInitiateCall={handleInitiateCall} 
          />
        )}

        {/* Medicine Scanner */}
        {currentPage === 'medicine' && (
          <MedicineScanner 
            setCurrentPage={setCurrentPage} 
            onAskWorkerAboutMedicine={handleAskWorkerAboutMedicine} 
          />
        )}

        {/* Healthcare Calls Kiosk */}
        {currentPage === 'calls' && (
          <HealthcareCalls 
            activeCallData={activeCallData} 
            setActiveCallData={setActiveCallData} 
            setCurrentPage={setCurrentPage}
          />
        )}

        {/* Healthcare Facility Finder */}
        {currentPage === 'facilities' && (
          <FacilityFinder 
            setCurrentPage={setCurrentPage} 
            onInitiateCall={handleInitiateCall} 
          />
        )}

        {/* Offline Manager */}
        {currentPage === 'offline' && (
          <OfflineManager 
            setCurrentPage={setCurrentPage} 
          />
        )}

        {/* Worker Portal */}
        {currentPage === 'worker' && (
          <WorkerDashboard 
            setCurrentPage={setCurrentPage} 
            onInitiateCall={handleInitiateCall} 
          />
        )}

        {/* Profile Screen */}
        {currentPage === 'profile' && (
          <ProfileScreen 
            setCurrentPage={setCurrentPage} 
          />
        )}

        {/* Video Consultation Room */}
        {currentPage === 'consultation' && (
          <VideoConsultation 
            setCurrentPage={setCurrentPage} 
          />
        )}

        {/* Family Health Profile */}
        {currentPage === 'family' && (
          <FamilyProfile 
            setCurrentPage={setCurrentPage} 
          />
        )}

        {/* Follow-ups List */}
        {currentPage === 'followups' && (
          <FollowUpList 
            setCurrentPage={setCurrentPage} 
          />
        )}

        {/* Patient Requests Modal */}
        {currentPage === 'requests' && (
          <PatientRequestsModal 
            setCurrentPage={setCurrentPage} 
          />
        )}

        {/* Smart FairQueue */}
        {currentPage === 'queue' && (
          <FairQueueHome 
            setCurrentPage={setCurrentPage} 
          />
        )}

      </main>

      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} />

    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AIContextManagerProvider>
        <OfflineProvider>
          <AuthProvider>
            <HealthcareProvider>
              <FairQueueProvider>
                <AppContent />
              </FairQueueProvider>
            </HealthcareProvider>
          </AuthProvider>
        </OfflineProvider>
      </AIContextManagerProvider>
    </LanguageProvider>
  );
}

export default App;
