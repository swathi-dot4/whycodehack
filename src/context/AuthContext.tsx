import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, DoctorProfile, UserRole, Language } from '../types';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  patientUser: UserProfile | null;
  doctorUser: DoctorProfile | null;
  activeUser: UserProfile | DoctorProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  
  // Patient Auth
  loginPatientWithOtp: (mobile: string, otp: string) => boolean;
  registerPatient: (userData: Omit<UserProfile, 'id' | 'isGuest' | 'role'>) => void;
  continueAsGuest: () => void;
  
  // Doctor Auth
  loginDoctor: (doctorIdOrMobile: string, passOrOtp: string) => boolean;
  registerDoctor: (doctorData: Omit<DoctorProfile, 'id' | 'isVerified' | 'role'>) => void;
  
  updatePatientProfile: (updatedData: Partial<UserProfile>) => void;
  updateDoctorProfile: (updatedData: Partial<DoctorProfile>) => void;
  logout: () => void;
}

const STORAGE_PATIENT_KEY = 'CareBridge AI_patient_user';
const STORAGE_DOCTOR_KEY = 'CareBridge AI_doctor_user';
const STORAGE_ROLE_KEY = 'CareBridge AI_active_role';

const DEFAULT_PATIENT: UserProfile = {
  id: 'usr-101',
  name: 'Ravi Kumar',
  mobile: '+91 98480 12345',
  age: 42,
  gender: 'Male',
  preferredLanguage: 'te',
  location: 'Ananthapur Rural Village, AP',
  emergencyContact: '+91 99887 11223 (ASHA Lakshmi)',
  isGuest: false,
  role: 'PATIENT'
};

const DEFAULT_DOCTOR: DoctorProfile = {
  id: 'doc-501',
  name: 'Dr. Venkat Rao, MD',
  doctorId: 'APMC/2018/8892',
  mobile: '+91 94400 55667',
  email: 'dr.venkat@CareBridge AI.org',
  specialization: 'General Medicine & Rural Health',
  preferredLanguage: 'en',
  facility: 'Ananthapur Area Govt Hospital & CHC',
  location: 'Ananthapur Urban, AP',
  isVerified: true,
  role: 'DOCTOR'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      const savedRole = localStorage.getItem(STORAGE_ROLE_KEY);
      if (savedRole === 'DOCTOR' || savedRole === 'PATIENT') return savedRole;
    } catch (e) {
      console.error(e);
    }
    return 'PATIENT';
  });

  const [patientUser, setPatientUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PATIENT_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PATIENT;
  });

  const [doctorUser, setDoctorUser] = useState<DoctorProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DOCTOR_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_DOCTOR;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ROLE_KEY, role);
      if (patientUser) localStorage.setItem(STORAGE_PATIENT_KEY, JSON.stringify(patientUser));
      else localStorage.removeItem(STORAGE_PATIENT_KEY);

      if (doctorUser) localStorage.setItem(STORAGE_DOCTOR_KEY, JSON.stringify(doctorUser));
      else localStorage.removeItem(STORAGE_DOCTOR_KEY);
    } catch (e) {
      console.error(e);
    }
  }, [role, patientUser, doctorUser]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const loginPatientWithOtp = (mobile: string, otp: string): boolean => {
    if (otp.length === 6) {
      const loggedUser: UserProfile = {
        ...DEFAULT_PATIENT,
        mobile: mobile.startsWith('+91') ? mobile : `+91 ${mobile}`,
        isGuest: false
      };
      setPatientUser(loggedUser);
      setRoleState('PATIENT');
      return true;
    }
    return false;
  };

  const registerPatient = (userData: Omit<UserProfile, 'id' | 'isGuest' | 'role'>) => {
    const newUser: UserProfile = {
      ...userData,
      id: `usr-${Date.now()}`,
      isGuest: false,
      role: 'PATIENT'
    };
    setPatientUser(newUser);
    setRoleState('PATIENT');
  };

  const continueAsGuest = () => {
    const guestUser: UserProfile = {
      id: 'guest-session',
      name: 'Guest Citizen',
      mobile: 'Not registered',
      age: 0,
      gender: 'Unspecified',
      preferredLanguage: 'te',
      location: 'Rural Region',
      emergencyContact: 'Dial 108 Emergency',
      isGuest: true,
      role: 'PATIENT'
    };
    setPatientUser(guestUser);
    setRoleState('PATIENT');
  };

  const loginDoctor = (doctorIdOrMobile: string, passOrOtp: string): boolean => {
    if (passOrOtp.length >= 4) {
      const doc: DoctorProfile = {
        ...DEFAULT_DOCTOR,
        doctorId: doctorIdOrMobile.includes('/') ? doctorIdOrMobile : DEFAULT_DOCTOR.doctorId
      };
      setDoctorUser(doc);
      setRoleState('DOCTOR');
      return true;
    }
    return false;
  };

  const registerDoctor = (doctorData: Omit<DoctorProfile, 'id' | 'isVerified' | 'role'>) => {
    const newDoc: DoctorProfile = {
      ...doctorData,
      id: `doc-${Date.now()}`,
      isVerified: true, // Demo verification
      role: 'DOCTOR'
    };
    setDoctorUser(newDoc);
    setRoleState('DOCTOR');
  };

  const updatePatientProfile = (updatedData: Partial<UserProfile>) => {
    if (patientUser) {
      setPatientUser({ ...patientUser, ...updatedData });
    }
  };

  const updateDoctorProfile = (updatedData: Partial<DoctorProfile>) => {
    if (doctorUser) {
      setDoctorUser({ ...doctorUser, ...updatedData });
    }
  };

  const logout = () => {
    if (role === 'PATIENT') {
      setPatientUser(null);
    } else {
      setDoctorUser(null);
    }
  };

  const activeUser = role === 'PATIENT' ? patientUser : doctorUser;
  const isAuthenticated = role === 'PATIENT' ? !!patientUser : !!doctorUser;
  const isGuest = role === 'PATIENT' && !!patientUser?.isGuest;

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        patientUser,
        doctorUser,
        activeUser,
        isAuthenticated,
        isGuest,
        loginPatientWithOtp,
        registerPatient,
        continueAsGuest,
        loginDoctor,
        registerDoctor,
        updatePatientProfile,
        updateDoctorProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
