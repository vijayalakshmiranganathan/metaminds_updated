export type TriageCategory = 'Critical' | 'Urgent' | 'Stable';

export interface Allergy {
  id: string;
  allergen: string;
  severity: 'Severe' | 'Moderate' | 'Mild';
  reaction: string;
  confirmedDate: string;
  notes?: string;
}

export interface VitalsData {
  bpSystolic: number;
  bpDiastolic: number;
  bpStatus: 'Normal Target' | 'Elevated' | 'Stage 1 HTN' | 'Critical';
  pulse: number;
  rhythm: string;
  spO2: number;
  spO2Mode: string;
  glucose: number;
  glucoseState: string;
  temp?: number;
  respRate?: number;
  syncTimeAgo: string;
  history?: {
    time: string;
    bp: string;
    pulse: number;
    spO2: number;
    glucose: number;
  }[];
}

export interface NoteAddendum {
  id: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  content: string;
}

export interface ClinicalNote {
  id: string;
  noteNumber: number;
  type: string;
  authorName: string;
  authorRole: string;
  department: string;
  timestamp: string;
  content: string;
  signedElectronically: boolean;
  addenda: NoteAddendum[];
}

export interface Diagnosis {
  id: string;
  name: string;
  status: 'Managed' | 'Chronic' | 'Monitored' | 'Acute' | 'Resolving';
  statusBadgeColor?: string;
  icd10: string;
  onsetYear: string;
  details?: string;
  icon?: string;
  isPrivate?: boolean; // When true, patient has chosen to hide this diagnosis from family members
  consentNotes?: string;
}

export interface DoctorAuth {
  isVerified: boolean;
  name: string;
  nmcRegNo: string;
  stateMedicalCouncil: string;
  qualification: string;
  hospitalStaffId: string;
  department: string;
  verifiedAt: string;
  digitalSignatureToken: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  timingLabel: string;
  status: 'due' | 'given' | 'scheduled' | 'held';
  administeredTime?: string;
  administeredBy?: string;
  dueTime: string;
  prescribedBy: string;
  category?: string;
  contraindications?: string[];
  purpose?: string;
  timings?: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
  };
  reminderEnabled?: boolean;
}

export interface LabMetric {
  key: string;
  label: string;
  value: number | string;
  unit: string;
  refRange: string;
  status: 'normal' | 'high' | 'low';
}

export interface LabPanel {
  id: string;
  title: string;
  collectedTime: string;
  status: 'Completed' | 'Pending';
  metrics: LabMetric[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  mrn: string;
  room: string;
  department: string;
  bloodType: string;
  photoUrl: string;
  abhaId?: string;
  allergies: Allergy[];
  alerts: string[];
  acuity: TriageCategory;
  admitDate: string;
  attendingDoctor: string;
  vitals: VitalsData;
  recentNote: ClinicalNote;
  pastNotes: ClinicalNote[];
  diagnoses: Diagnosis[];
  medications: Medication[];
  labs: LabPanel[];
}

export interface RxOrder {
  id: string;
  patientId: string;
  patientName: string;
  medName: string;
  dosage: string;
  route: string;
  frequency: string;
  indication: string;
  prescribingDoctor: string;
  orderedAt: string;
  status: 'Pending Verification' | 'Verified' | 'Dispensed' | 'Active MAR';
  urgent: boolean;
  notes?: string;
}

// -------------------------------------------------------------
// Meta Minds Medisync Portal Extensions (from Requirements PDF)
// -------------------------------------------------------------

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  hospital: string;
  location: string;
  fee: number;
  rating: number;
  photoUrl: string;
  availableSlots: string[];
  languages: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  location: string;
  date: string;
  time: string;
  mode: 'In-Person Clinic' | 'Video Consultation';
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  symptoms: string;
  fee: number;
  calendarSynced: boolean;
}

export interface HomeLabTest {
  id: string;
  name: string;
  category: string;
  price: number;
  sampleType: string;
  reportHours: number;
  fastingRequired: boolean;
  description: string;
  popular?: boolean;
}

export interface HealthDocument {
  id: string;
  title: string;
  category: 'Prescription' | 'Blood Test' | 'Radiology Scan' | 'Discharge Summary' | 'Vaccination';
  doctorOrLab: string;
  date: string;
  fileSize: string;
  tags: string[];
  verifiedAbdm: boolean;
  aiSummary: string;
  documentSnippet?: string;
}

export interface InvoiceBill {
  id: string;
  invoiceNo: string;
  date: string;
  service: string;
  provider: string;
  grossAmount: number;
  insuranceCovered: number;
  patientPayable: number;
  status: 'Paid' | 'Pending';
  paymentMethod?: string;
  upiRef?: string;
  insuranceClaimNo?: string;
}

export interface FamilyMember {
  id: string;
  patientId?: string;
  name: string;
  relationship: 'Self' | 'Mother' | 'Father' | 'Spouse' | 'Daughter' | 'Son';
  age: number;
  gender: 'Female' | 'Male';
  bloodGroup: string;
  abhaId: string;
  avatarUrl: string;
  activeConditions: string[];
  allergiesCount: number;
}

export interface UserRegistrationData {
  fullName: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  phone: string;
  email: string;
  bloodGroup: string;
  abhaId: string;
  city: string;
  healthGoal: string;
  allergies: string[];
  customAllergy?: string;
  conditions: string[];
  customCondition?: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  preferredMode?: 'patient' | 'wellness' | 'doctor';
  avatarUrl?: string;
}
