import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  HealthcareRequest, 
  AppNotification, 
  Consultation, 
  FollowUp, 
  FamilyMember,
  UserRole
} from '../types';

interface HealthcareContextType {
  requests: HealthcareRequest[];
  notifications: AppNotification[];
  consultations: Consultation[];
  followUps: FollowUp[];
  familyMembers: FamilyMember[];
  selectedRequest: HealthcareRequest | null;
  activeConsultation: Consultation | null;
  isEmergencyModalOpen: boolean;

  setSelectedRequest: (request: HealthcareRequest | null) => void;
  submitHealthcareRequest: (requestData: Omit<HealthcareRequest, 'id' | 'createdAt' | 'status'>) => void;
  acceptHealthcareRequest: (requestId: string, doctorId: string, doctorName: string) => void;
  rejectHealthcareRequest: (requestId: string) => void;
  startVideoConsultation: (patientId: string, doctorId: string, patientName?: string, doctorName?: string) => Consultation;
  endVideoConsultation: (consultationId: string, notes?: string, followUpDate?: string) => void;
  scheduleFollowUp: (followUpData: Omit<FollowUp, 'id'>) => void;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  toggleFollowUpReminder: (followUpId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearAllNotifications: (role: UserRole) => void;
  setEmergencyModalOpen: (open: boolean) => void;
  triggerEmergencyAlert: (patientName: string, location: string) => void;
}

const INITIAL_REQUESTS: HealthcareRequest[] = [
  {
    id: 'req-201',
    patientId: 'usr-101',
    patientName: 'Ravi Kumar',
    patientAge: 42,
    patientGender: 'Male',
    patientMobile: '+91 98480 12345',
    description: 'Severe fever with body chills for 3 days. Difficulty walking to PHC center.',
    language: 'te',
    urgency: 'High',
    status: 'PENDING',
    consultationType: 'Video',
    location: 'Ananthapur Rural Village, AP',
    createdAt: '10 mins ago'
  },
  {
    id: 'req-202',
    patientId: 'usr-102',
    patientName: 'Lakshmi Amma',
    patientAge: 65,
    patientGender: 'Female',
    patientMobile: '+91 94411 22334',
    description: 'Blood pressure medicine prescription check. Experiences dizziness in evening.',
    language: 'te',
    urgency: 'Medium',
    status: 'PENDING',
    consultationType: 'Voice',
    location: 'Kalyandurg Mandal, AP',
    createdAt: '45 mins ago'
  },
  {
    id: 'req-203',
    patientId: 'usr-103',
    patientName: 'Suresh Babu',
    patientAge: 38,
    patientGender: 'Male',
    patientMobile: '+91 99887 76655',
    description: 'Child coughing continuously at night with wheezing sounds.',
    language: 'hi',
    urgency: 'Emergency',
    status: 'ACCEPTED',
    consultationType: 'Video',
    location: 'Dharmavaram, AP',
    createdAt: '1 hour ago',
    doctorId: 'doc-501',
    doctorNotes: 'Accepted by Dr. Venkat Rao. Video consultation ready.'
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'usr-101',
    role: 'PATIENT',
    title: 'Consultation Request Sent',
    message: 'Your healthcare guidance request has been submitted to nearby doctors.',
    type: 'REQUEST',
    read: false,
    timestamp: '10 mins ago',
    actionPage: 'requests'
  },
  {
    id: 'notif-2',
    userId: 'doc-501',
    role: 'DOCTOR',
    title: 'New High Priority Patient Request',
    message: 'Ravi Kumar (42M, Telugu) requested urgent video guidance for fever.',
    type: 'REQUEST',
    read: false,
    timestamp: '10 mins ago',
    actionPage: 'doctor_dashboard'
  },
  {
    id: 'notif-3',
    userId: 'usr-101',
    role: 'PATIENT',
    title: 'Follow-up Reminder',
    message: 'Scheduled BP check-up with Dr. Venkat Rao tomorrow at 10:00 AM.',
    type: 'FOLLOWUP',
    read: true,
    timestamp: '1 day ago',
    actionPage: 'followups'
  }
];

const INITIAL_FOLLOWUPS: FollowUp[] = [
  {
    id: 'fup-301',
    patientId: 'usr-101',
    patientName: 'Ravi Kumar',
    doctorId: 'doc-501',
    doctorName: 'Dr. Venkat Rao, MD',
    date: '2026-09-08',
    time: '10:00 AM',
    status: 'UPCOMING',
    notes: 'Review fever status and lab blood test report if symptoms persist.',
    instructionsEn: 'Drink warm ORS liquids, monitor temperature twice daily.',
    instructionsTe: 'వేడి ORS ద్రవాలు తాగండి, రోజుకు రెండుసార్లు శరీర ఉష్ణోగ్రతను పరీక్షించండి.',
    reminderSet: true
  },
  {
    id: 'fup-302',
    patientId: 'usr-101',
    patientName: 'Ravi Kumar',
    doctorId: 'doc-501',
    doctorName: 'Dr. Venkat Rao, MD',
    date: '2026-09-01',
    time: '04:30 PM',
    status: 'COMPLETED',
    notes: 'Initial consultation done. Antibiotic prescribed by PHC medical officer.',
    instructionsEn: 'Complete 5-day course.',
    instructionsTe: '5 రోజుల మందుల కోర్సును పూర్తి చేయండి.',
    reminderSet: false
  }
];

const INITIAL_FAMILY: FamilyMember[] = [
  {
    id: 'fam-1',
    name: 'Lakshmi Devi',
    relation: 'Mother',
    age: 68,
    gender: 'Female',
    bloodGroup: 'O+',
    chronicConditions: ['Hypertension', 'Diabetes Type 2'],
    lastConsultation: '15 Aug 2026',
    pendingReminders: ['Morning BP Medicine (Amlodipine 5mg)', 'Sugar check on Sunday']
  },
  {
    id: 'fam-2',
    name: 'Anitha Kumar',
    relation: 'Spouse',
    age: 39,
    gender: 'Female',
    bloodGroup: 'B+',
    chronicConditions: ['Migraine'],
    lastConsultation: '02 Jun 2026',
    pendingReminders: ['Thyroid checkup due next month']
  }
];

const HealthcareContext = createContext<HealthcareContextType | undefined>(undefined);

export const HealthcareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<HealthcareRequest[]>(() => {
    try {
      const saved = localStorage.getItem('CareBridge AI_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REQUESTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('CareBridge AI_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
    try {
      const saved = localStorage.getItem('CareBridge AI_followups');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FOLLOWUPS;
  });
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    try {
      const saved = localStorage.getItem('CareBridge AI_family');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FAMILY;
  });

  const [selectedRequest, setSelectedRequest] = useState<HealthcareRequest | null>(null);
  const [isEmergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('CareBridge AI_requests', JSON.stringify(requests));
      localStorage.setItem('CareBridge AI_notifications', JSON.stringify(notifications));
      localStorage.setItem('CareBridge AI_followups', JSON.stringify(followUps));
      localStorage.setItem('CareBridge AI_family', JSON.stringify(familyMembers));
    } catch (e) {
      console.error(e);
    }
  }, [requests, notifications, followUps, familyMembers]);

  const submitHealthcareRequest = (requestData: Omit<HealthcareRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: HealthcareRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      status: 'PENDING',
      createdAt: 'Just now'
    };

    setRequests(prev => [newReq, ...prev]);

    // Create notifications for patient and doctors
    const patientNotif: AppNotification = {
      id: `notif-${Date.now()}-1`,
      userId: newReq.patientId,
      role: 'PATIENT',
      title: 'Healthcare Request Submitted',
      message: `Your request regarding "${newReq.description.slice(0, 40)}..." was sent.`,
      type: 'REQUEST',
      read: false,
      timestamp: 'Just now',
      actionPage: 'requests',
      requestId: newReq.id
    };

    const doctorNotif: AppNotification = {
      id: `notif-${Date.now()}-2`,
      userId: 'doc-501',
      role: 'DOCTOR',
      title: `New ${newReq.urgency} Request: ${newReq.patientName}`,
      message: `${newReq.patientName} (${newReq.patientAge}${newReq.patientGender[0]}) requested ${newReq.consultationType} consultation.`,
      type: 'REQUEST',
      read: false,
      timestamp: 'Just now',
      actionPage: 'doctor_dashboard',
      requestId: newReq.id
    };

    setNotifications(prev => [patientNotif, doctorNotif, ...prev]);
  };

  const acceptHealthcareRequest = (requestId: string, doctorId: string, doctorName: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'ACCEPTED',
          doctorId,
          doctorNotes: `Accepted by ${doctorName}. Ready for Video/Voice consultation.`
        };
      }
      return req;
    }));

    const targetReq = requests.find(r => r.id === requestId);
    if (targetReq) {
      const patientNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        userId: targetReq.patientId,
        role: 'PATIENT',
        title: 'Consultation Request Accepted!',
        message: `${doctorName} accepted your request. Click here to launch Video Consultation.`,
        type: 'RESPONSE',
        read: false,
        timestamp: 'Just now',
        actionPage: 'consultation',
        requestId: targetReq.id
      };
      setNotifications(prev => [patientNotif, ...prev]);
    }
  };

  const rejectHealthcareRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'REJECTED' };
      }
      return req;
    }));
  };

  const startVideoConsultation = (patientId: string, doctorId: string, patientName = 'Ravi Kumar', doctorName = 'Dr. Venkat Rao, MD') => {
    const newConsultation: Consultation = {
      id: `cons-${Date.now()}`,
      patientId,
      patientName,
      doctorId,
      doctorName,
      type: 'Video',
      status: 'ACTIVE',
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConsultations(prev => [newConsultation, ...prev]);
    setActiveConsultation(newConsultation);
    return newConsultation;
  };

  const endVideoConsultation = (consultationId: string, notes?: string, followUpDate?: string) => {
    setConsultations(prev => prev.map(c => {
      if (c.id === consultationId) {
        return {
          ...c,
          status: 'ENDED',
          endedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          notes
        };
      }
      return c;
    }));

    if (activeConsultation?.id === consultationId) {
      setActiveConsultation(null);
    }

    if (followUpDate) {
      scheduleFollowUp({
        patientId: activeConsultation?.patientId || 'usr-101',
        patientName: activeConsultation?.patientName || 'Ravi Kumar',
        doctorId: activeConsultation?.doctorId || 'doc-501',
        doctorName: activeConsultation?.doctorName || 'Dr. Venkat Rao, MD',
        date: followUpDate,
        time: '10:00 AM',
        status: 'UPCOMING',
        notes: notes || 'Post video consultation review.',
        instructionsEn: 'Follow advice provided during video call.',
        instructionsTe: 'వీడియో కాల్ సందర్భంగా అందించిన సలહాలను పాటించండి.',
        reminderSet: true
      });
    }
  };

  const scheduleFollowUp = (followUpData: Omit<FollowUp, 'id'>) => {
    const newFollowUp: FollowUp = {
      ...followUpData,
      id: `fup-${Date.now()}`
    };

    setFollowUps(prev => [newFollowUp, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: newFollowUp.patientId,
      role: 'PATIENT',
      title: 'Follow-up Consultation Scheduled',
      message: `Follow-up set for ${newFollowUp.date} with ${newFollowUp.doctorName}.`,
      type: 'FOLLOWUP',
      read: false,
      timestamp: 'Just now',
      actionPage: 'followups'
    };

    setNotifications(prev => [notif, ...prev]);
  };

  const addFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    const newMem: FamilyMember = {
      ...member,
      id: `fam-${Date.now()}`
    };
    setFamilyMembers(prev => [...prev, newMem]);
  };

  const toggleFollowUpReminder = (followUpId: string) => {
    setFollowUps(prev => prev.map(f => {
      if (f.id === followUpId) {
        return { ...f, reminderSet: !f.reminderSet };
      }
      return f;
    }));
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === notificationId) return { ...n, read: true };
      return n;
    }));
  };

  const clearAllNotifications = (role: UserRole) => {
    setNotifications(prev => prev.filter(n => n.role !== role && n.role !== 'ALL'));
  };

  const triggerEmergencyAlert = (patientName: string, location: string) => {
    const alertNotifDoc: AppNotification = {
      id: `notif-emerg-${Date.now()}`,
      userId: 'doc-501',
      role: 'DOCTOR',
      title: '🚨 EMERGENCY ALERT DISPATCHED',
      message: `Emergency SOS triggered by ${patientName} at ${location}. 108 Emergency notified.`,
      type: 'EMERGENCY',
      read: false,
      timestamp: 'Just now',
      actionPage: 'doctor_dashboard'
    };

    const alertNotifPatient: AppNotification = {
      id: `notif-emerg-pat-${Date.now()}`,
      userId: 'usr-101',
      role: 'PATIENT',
      title: '🚨 Emergency Help Signal Sent',
      message: '108 Emergency & nearby ASHA worker have been alerted with your location.',
      type: 'EMERGENCY',
      read: false,
      timestamp: 'Just now',
      actionPage: 'dashboard'
    };

    setNotifications(prev => [alertNotifDoc, alertNotifPatient, ...prev]);
  };

  return (
    <HealthcareContext.Provider
      value={{
        requests,
        notifications,
        consultations,
        followUps,
        familyMembers,
        selectedRequest,
        activeConsultation,
        isEmergencyModalOpen,
        setSelectedRequest,
        submitHealthcareRequest,
        acceptHealthcareRequest,
        rejectHealthcareRequest,
        startVideoConsultation,
        endVideoConsultation,
        scheduleFollowUp,
        addFamilyMember,
        toggleFollowUpReminder,
        markNotificationAsRead,
        clearAllNotifications,
        setEmergencyModalOpen,
        triggerEmergencyAlert
      }}
    >
      {children}
    </HealthcareContext.Provider>
  );
};

export const useHealthcare = () => {
  const context = useContext(HealthcareContext);
  if (!context) {
    throw new Error('useHealthcare must be used within a HealthcareProvider');
  }
  return context;
};
