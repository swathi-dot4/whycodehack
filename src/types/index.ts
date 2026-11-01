export type Language = 'en' | 'te' | 'hi' | 'as';

export type UserRole = 'PATIENT' | 'DOCTOR';

export type AIContextType = 
  | 'SYMPTOM_GUIDANCE'
  | 'DOCTOR_COMMUNICATION'
  | 'MEDICINE_SCAN'
  | 'HEALTHCARE_CALL'
  | 'FACILITY_SEARCH'
  | 'FOLLOW_UP';

export type PageView = 
  | 'splash'
  | 'auth'
  | 'role_select'
  | 'dashboard'
  | 'guide'
  | 'doctor'
  | 'doctor_dashboard'
  | 'doctor_patients'
  | 'doctor_patient_detail'
  | 'medicine'
  | 'calls'
  | 'facilities'
  | 'offline'
  | 'worker'
  | 'profile'
  | 'family'
  | 'followups'
  | 'notifications'
  | 'requests'
  | 'consultation'
  | 'queue';

// ─── Smart FairQueue Types ──────────────────────────────────────────────────

export type QueueTokenStatus = 'WAITING' | 'CALLED' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED';
export type QueuePriority = 'NORMAL' | 'EMERGENCY';
export type RegistrationMethod = 'SELF' | 'ASHA_WORKER' | 'RECEPTIONIST';

export interface QueueFacility {
  id: string;
  name: string;
  facility_type: string;
  district: string;
  city: string;
  address?: string;
  contact_number?: string;
}

export interface QueueDepartment {
  id: string;
  facility_id: string;
  name: string;
  code: string;
}

export interface QueueToken {
  id: string;
  token_number: string;
  patient_id: string;
  patient_name: string;
  facility_id: string;
  department_id: string;
  department_name: string;
  sequence_number: number;
  status: QueueTokenStatus;
  priority: QueuePriority;
  priority_reason?: string;
  registered_at: string;
  called_at?: string;
  completed_at?: string;
  queue_position?: number;
  tokens_ahead?: number;
  estimated_wait_minutes?: number;
}

export interface QueueStatus {
  department_id: string;
  department_name: string;
  facility_name: string;
  currently_serving?: string;
  next_tokens: string[];
  total_waiting: number;
  total_completed: number;
}

export interface QueueStats {
  total_registered: number;
  total_waiting: number;
  total_in_consultation: number;
  total_completed: number;
  currently_serving_token?: string;
  avg_wait_minutes?: number;
}

export interface AuditLogEntry {
  id: string;
  staff_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  before_state?: string;
  after_state?: string;
  reason?: string;
  flagged: boolean;
  logged_at: string;
}

export interface PatientRegistrationForm {
  name: string;
  age?: number;
  gender?: string;
  mobile?: string;
  preferred_language: string;
  registered_by: RegistrationMethod;
  registered_by_staff_id?: string;
  facility_id: string;
  department_id: string;
  offline_id?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  age: number;
  gender: string;
  preferredLanguage: Language;
  location: string;
  emergencyContact: string;
  isGuest: boolean;
  role: 'PATIENT';
}

export interface DoctorProfile {
  id: string;
  name: string;
  doctorId: string; // Medical license / ID
  mobile: string;
  email: string;
  specialization: string;
  preferredLanguage: Language;
  facility: string;
  location: string;
  isVerified: boolean;
  role: 'DOCTOR';
}

export interface HealthcareRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientMobile: string;
  description: string;
  language: Language;
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'PENDING' | 'ACCEPTED' | 'IN_CONSULTATION' | 'COMPLETED' | 'REJECTED';
  consultationType: 'Chat' | 'Voice' | 'Video' | 'Healthcare Facility';
  location: string;
  createdAt: string;
  doctorId?: string;
  doctorNotes?: string;
}

export interface AppNotification {
  id: string;
  userId: string; // patientId or doctorId or 'ALL'
  role: UserRole | 'ALL';
  title: string;
  message: string;
  type: 'REQUEST' | 'RESPONSE' | 'CONSULTATION' | 'FOLLOWUP' | 'EMERGENCY' | 'SYSTEM';
  read: boolean;
  timestamp: string;
  actionPage?: PageView;
  requestId?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  type: 'Video' | 'Voice' | 'Chat';
  status: 'SCHEDULED' | 'ACTIVE' | 'ENDED';
  startedAt: string;
  endedAt?: string;
  notes?: string;
  prescriptionSummary?: string;
}

export interface FollowUp {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time?: string;
  status: 'UPCOMING' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  notes: string;
  instructionsEn: string;
  instructionsTe: string;
  reminderSet: boolean;
}

export interface HealthcareActivity {
  id: string;
  type: 'AI_GUIDANCE' | 'DOCTOR_NOTE' | 'MEDICINE_SCAN' | 'CALL_LOG' | 'FACILITY_SEARCH' | 'REQUEST_SUBMITTED' | 'CONSULTATION_JOINED';
  title: string;
  summary: string;
  timestamp: string;
}

export interface StructuredDoctorNote {
  patientName: string;
  age: number;
  gender: string;
  primaryLanguage: string;
  chiefComplaint: string;
  duration: string;
  pattern: string;
  associatedSymptoms: string[];
  spokenSummaryEn: string;
  spokenSummaryTe: string;
  timestamp: string;
}

export interface MedicineDetails {
  id: string;
  tradeName: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string | null;
  composition: string;
  purposeEn: string;
  purposeTe: string;
  whenToTakeVerified: boolean;
  whenToTakeEn?: string;
  whenToTakeTe?: string;
  frequencyEn?: string;
  instructionsEn: string;
  instructionsTe: string;
  warningsEn: string[];
  warningsTe: string[];
  imageUrl: string;
  ageGroupDosage?: {
    group: 'Infants' | 'Children' | 'Teenagers' | 'Adults' | 'Older Adults';
    guidance: string;
    isVerified: boolean;
  }[];
}

export interface HealthcareFacility {
  id: string;
  name: string;
  type: 'PHC' | 'CHC' | 'Govt Hospital' | 'District Hospital' | 'Specialist Center';
  district: string;
  city: string;
  distanceKm: number;
  addressEn: string;
  addressTe: string;
  contactNumber: string;
  servicesEn: string[];
  servicesTe: string[];
  isEmergencyAvailable: boolean;
  languageSupport: string[];
  isOpen24x7: boolean;
  status: 'Open' | 'Busy' | 'On Call';
  matchScore: number;
  matchReasons: string[];
  latitude: number;
  longitude: number;
  operatingHours?: string;
}

export interface OfflineRequest {
  id: string;
  type: 'SYMPTOM' | 'DOCTOR_NOTE' | 'MEDICINE' | 'FACILITY_INQUIRY';
  title: string;
  content: string;
  language: Language;
  createdAt: string;
  syncStatus: 'PENDING' | 'SYNCED';
  patientId: string;
}

export interface WorkerPatientRecord {
  id: string;
  patientName: string;
  age: number;
  village: string;
  primaryLanguage: Language;
  chiefConcern: string;
  status: 'Pending Review' | 'Reviewed' | 'Follow-up Scheduled' | 'Resolved';
  priority: 'High' | 'Medium' | 'Normal';
  timestamp: string;
  summaryEn: string;
  summaryTe: string;
  phone: string;
  doctorAssigned?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'Self' | 'Mother' | 'Father' | 'Spouse' | 'Child' | 'Grandparent';
  age: number;
  gender: string;
  bloodGroup: string;
  chronicConditions: string[];
  lastConsultation?: string;
  pendingReminders: string[];
}

export interface AICommunicatorTranslation {
  originalText: string;
  sourceLang: Language;
  targetLang: Language;
  translatedText: string;
  simplifiedExplanation: string;
  audioPlaying?: boolean;
}
