/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { INITIAL_PATIENTS, INITIAL_RX_ORDERS } from './data/patients';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_HEALTH_DOCUMENTS,
  INITIAL_INVOICES,
} from './data/portalData';
import {
  Appointment,
  ClinicalNote,
  Diagnosis,
  DoctorAuth,
  FamilyMember,
  HealthDocument,
  HomeLabTest,
  InvoiceBill,
  Medication,
  Patient,
  RxOrder,
  UserRegistrationData,
  VitalsData,
} from './types/clinical';
import { LanguageCode } from './utils/i18n';

// Core Components
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';

// Onboarding Registration Screen
import { UserRegistrationScreen } from './components/onboarding/UserRegistrationScreen';

// Screens
import { ChartScreen } from './components/ChartScreen';
import { PatientsScreen } from './components/PatientsScreen';
import { RxScreen } from './components/RxScreen';
import { PharmacyScreen } from './components/PharmacyScreen';

// Portal Screens (From Meta Minds PDF)
import { AppointmentsScreen } from './components/portal/AppointmentsScreen';
import { PrescriptionsPortalScreen } from './components/portal/PrescriptionsPortalScreen';
import { DocumentsVaultScreen } from './components/portal/DocumentsVaultScreen';
import { BillingPaymentsScreen } from './components/portal/BillingPaymentsScreen';
import { WellnessHubScreen } from './components/portal/WellnessHubScreen';

// Dialog Modals
import { NewRxModal } from './components/modals/NewRxModal';
import { UpdateVitalsModal } from './components/modals/UpdateVitalsModal';
import { AdministerMedModal } from './components/modals/AdministerMedModal';
import { AddAddendumModal } from './components/modals/AddAddendumModal';
import { AllNotesModal } from './components/modals/AllNotesModal';
import { EmergencyCodeModal } from './components/modals/EmergencyCodeModal';
import { AllergyDetailsModal } from './components/modals/AllergyDetailsModal';
import { AddDiagnosisModal } from './components/modals/AddDiagnosisModal';
import { FamilyDashboardModal } from './components/portal/FamilyDashboardModal';
import { EmergencySosModal } from './components/portal/EmergencySosModal';
import { DoctorLoginModal, PRESET_DOCTORS } from './components/auth/DoctorLoginModal';
import { DiagnosisPrivacyModal } from './components/portal/DiagnosisPrivacyModal';

export default function App() {
  const [appRole, setAppRole] = useState<'doctor' | 'patient' | 'wellness'>('patient');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [activeScreen, setActiveScreen] = useState<string>('chart');

  // Doctor verified authentication state
  const [doctorAuth, setDoctorAuth] = useState<DoctorAuth>(PRESET_DOCTORS[0]);
  const [isDoctorLoginOpen, setIsDoctorLoginOpen] = useState(false);
  const [isDiagnosisPrivacyOpen, setIsDiagnosisPrivacyOpen] = useState(false);

  // Patients & Family state
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pt-registered-user');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    try {
      const stored = localStorage.getItem('medisync_family_members');
      if (stored) {
        const parsed: FamilyMember[] = JSON.parse(stored);
        return parsed.filter((m) => !m.name.toLowerCase().includes('deshmukh'));
      }
    } catch {}
    return [];
  });
  const [activeFamilyMember, setActiveFamilyMember] = useState<FamilyMember>({
    id: 'fam-user-self',
    patientId: 'pt-registered-user',
    name: 'My Health Profile',
    relationship: 'Self',
    age: 30,
    gender: 'Male',
    bloodGroup: 'O+',
    abhaId: '91-0000-0000-0000@abdm',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
    activeConditions: ['Routine Wellness'],
    allergiesCount: 0,
  });

  // Appointments, documents, invoices
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [documents, setDocuments] = useState<HealthDocument[]>(INITIAL_HEALTH_DOCUMENTS);
  const [invoices, setInvoices] = useState<InvoiceBill[]>(INITIAL_INVOICES);
  const [orders, setOrders] = useState<RxOrder[]>(INITIAL_RX_ORDERS);

  const [selectedUnit, setSelectedUnit] = useState<string>('ST. JUDE ICU');
  const [viewMode, setViewMode] = useState<'mobile' | 'expanded'>('mobile');

  // Micro Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'alert' | 'info'>('success');

  // Starting Onboarding / User Details Entry Page state
  const [showRegistration, setShowRegistration] = useState<boolean>(true);
  const [savedUserData, setSavedUserData] = useState<UserRegistrationData | null>(() => {
    try {
      const stored = localStorage.getItem('medisync_registered_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Modal triggers
  const [isNewRxOpen, setIsNewRxOpen] = useState(false);
  const [isUpdateVitalsOpen, setIsUpdateVitalsOpen] = useState(false);
  const [isAdministerOpen, setIsAdministerOpen] = useState(false);
  const [selectedMedForAdminister, setSelectedMedForAdminister] = useState<Medication | null>(null);
  const [isAddAddendumOpen, setIsAddAddendumOpen] = useState(false);
  const [selectedNoteForAddendum, setSelectedNoteForAddendum] = useState<ClinicalNote | null>(null);
  const [isAllNotesOpen, setIsAllNotesOpen] = useState(false);
  const [isEmergencyCodeOpen, setIsEmergencyCodeOpen] = useState(false);
  const [isAllergyDetailsOpen, setIsAllergyDetailsOpen] = useState(false);
  const [isAddDiagnosisOpen, setIsAddDiagnosisOpen] = useState(false);
  const [isFamilyDashboardOpen, setIsFamilyDashboardOpen] = useState(false);
  const [isEmergencySosOpen, setIsEmergencySosOpen] = useState(false);

  const showToast = (msg: string, type: 'success' | 'alert' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Handler: User submits their details on the opening onboarding registration page
  const handleCompleteRegistration = (data: UserRegistrationData) => {
    setSavedUserData(data);
    try {
      localStorage.setItem('medisync_registered_user', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }

    const userId = 'pt-registered-user';
    const isHyp = data.conditions.some((c) => c.toLowerCase().includes('hypertension'));
    const isDia = data.conditions.some((c) => c.toLowerCase().includes('diabetes'));
    const isAsthma = data.conditions.some((c) => c.toLowerCase().includes('asthma'));
    const hasRealAllergies = data.allergies.filter((a) => !a.includes('NKDA'));

    const newPatient: Patient = {
      id: userId,
      name: data.fullName,
      age: data.age,
      gender: data.gender,
      mrn: `#MS-${Math.floor(10000 + Math.random() * 90000)}`,
      room: data.preferredMode === 'doctor' ? 'Bed 04 (ICU)' : 'Outpatient / Home Care',
      department: data.preferredMode === 'doctor' ? 'Cardiology ICU' : 'General Medicine & Family Health',
      bloodType: data.bloodGroup,
      photoUrl:
        data.gender === 'Female'
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
      abhaId: data.abhaId,
      allergies: hasRealAllergies.map((allergy, i) => ({
        id: `all-user-${i}`,
        allergen: allergy.toUpperCase(),
        severity: (allergy.toLowerCase().includes('penicillin') ? 'Severe' : 'Moderate') as 'Severe' | 'Moderate' | 'Mild',
        reaction: `Documented hypersensitivity and allergic reaction to ${allergy}`,
        confirmedDate: '2025-06-12',
        notes: `Flagged in National ABHA Health Registry for ${data.fullName}.`,
      })),
      alerts:
        hasRealAllergies.length > 0
          ? [
              `DOCUMENTED ${hasRealAllergies[0].toUpperCase()} SENSITIVITY`,
              'ABDM Verified Patient',
              `Emergency: ${data.emergencyContactName} (${data.emergencyContactPhone})`,
            ]
          : [
              'NO KNOWN DRUG ALLERGIES (NKDA)',
              'ABDM Verified Patient',
              `Emergency: ${data.emergencyContactName} (${data.emergencyContactPhone})`,
            ],
      acuity: 'Stable',
      admitDate: 'Active Record',
      attendingDoctor: 'Dr. Ananya Sharma, MBBS, MD',
      vitals: {
        bpSystolic: isHyp ? 132 : 120,
        bpDiastolic: isHyp ? 84 : 80,
        bpStatus: isHyp ? 'Stage 1 HTN' : 'Normal Target',
        pulse: 74,
        rhythm: 'Sinus Rhythm',
        spO2: 99,
        spO2Mode: 'Room Air',
        glucose: isDia ? 128 : 96,
        glucoseState: isDia ? 'Post-Prandial' : 'Fasting',
        temp: 98.6,
        respRate: 16,
        syncTimeAgo: 'Sync just now',
        history: [
          { time: '06:00', bp: isHyp ? '134/86' : '118/78', pulse: 72, spO2: 99, glucose: isDia ? 122 : 94 },
          { time: '08:00', bp: isHyp ? '132/84' : '120/80', pulse: 74, spO2: 99, glucose: isDia ? 128 : 96 },
        ],
      },
      recentNote: {
        id: `note-user-${Date.now()}`,
        noteNumber: 101,
        type: 'Initial Health Consultation',
        authorName: 'Dr. Ananya Sharma, MBBS, MD',
        authorRole: 'Attending Physician',
        department: 'General Medicine & Family Health',
        timestamp: 'Today, Just Now',
        content: `“Digital health record established for ${data.fullName} (Age: ${data.age}, Blood: ${data.bloodGroup}). ABHA Health ID ${data.abhaId} verified. Primary health focus: ${data.conditions.join(', ')}. Emergency contact: ${data.emergencyContactName} (${data.emergencyContactPhone}).”`,
        signedElectronically: true,
        addenda: [],
      },
      pastNotes: [],
      diagnoses:
        data.conditions.filter((c) => !c.toLowerCase().includes('healthy')).length > 0
          ? data.conditions
              .filter((c) => !c.toLowerCase().includes('healthy'))
              .map((cond, i) => ({
                id: `dx-user-${i}`,
                name: cond,
                status: 'Managed' as const,
                icd10: cond.includes('Hypertension')
                  ? 'I10'
                  : cond.includes('Diabetes')
                  ? 'E11.9'
                  : cond.includes('Asthma')
                  ? 'J45'
                  : 'Z00.00',
                onsetYear: '2024',
                icon: 'health_and_safety',
                isPrivate: false,
              }))
          : [
              {
                id: 'dx-user-0',
                name: 'Routine Health Maintenance & Preventive Screening',
                status: 'Managed' as const,
                icd10: 'Z00.00',
                onsetYear: '2026',
                icon: 'health_and_safety',
                isPrivate: false,
              },
            ],
      medications: [
        ...(isHyp
          ? [
              {
                id: `med-user-1`,
                name: 'Amlodipine Besylate',
                dosage: '5mg',
                route: 'Oral',
                frequency: 'Once Daily (Morning)',
                timingLabel: '08:00 AM Daily',
                status: 'due' as const,
                dueTime: '08:00 AM',
                prescribedBy: 'Dr. Ananya Sharma, MBBS, MD',
                purpose: 'Blood pressure control & cardiovascular protection',
                timings: { morning: true, afternoon: false, night: false },
                reminderEnabled: true,
              },
            ]
          : []),
        ...(isDia
          ? [
              {
                id: `med-user-2`,
                name: 'Metformin Hydrochloride',
                dosage: '500mg',
                route: 'Oral',
                frequency: 'Twice Daily (Post-Meal)',
                timingLabel: 'Morning & Night with food',
                status: 'due' as const,
                dueTime: '08:30 AM',
                prescribedBy: 'Dr. Ananya Sharma, MBBS, MD',
                purpose: 'Glycemic control and insulin sensitivity',
                timings: { morning: true, afternoon: false, night: true },
                reminderEnabled: true,
              },
            ]
          : []),
        ...(isAsthma
          ? [
              {
                id: `med-user-3`,
                name: 'Salbutamol Inhaler (Ventolin)',
                dosage: '100mcg',
                route: 'Inhalation',
                frequency: 'PRN (As Needed for wheezing)',
                timingLabel: 'As Needed',
                status: 'scheduled' as const,
                dueTime: 'PRN',
                prescribedBy: 'Dr. Ananya Sharma, MBBS, MD',
                purpose: 'Bronchodilator for airway relaxation',
                timings: { morning: false, afternoon: false, night: false },
                reminderEnabled: false,
              },
            ]
          : []),
        {
          id: `med-user-wellness`,
          name: 'Vitamin D3 & Calcium Citrate',
          dosage: '60,000 IU / 500mg',
          route: 'Oral',
          frequency: 'Weekly / Routine',
          timingLabel: 'With Breakfast',
          status: 'scheduled' as const,
          dueTime: '09:00 AM',
          prescribedBy: 'Dr. Ananya Sharma, MBBS, MD',
          purpose: 'Bone density, immune support & general vitality',
          timings: { morning: true, afternoon: false, night: false },
          reminderEnabled: true,
        },
      ],
      labs: [
        {
          id: `lab-user-1`,
          title: 'Baseline Wellness Diagnostic Panel',
          collectedTime: 'Collected Today',
          status: 'Completed',
          metrics: [
            {
              key: 'hgb',
              label: 'Hemoglobin',
              value: data.gender === 'Female' ? 13.2 : 14.8,
              unit: 'g/dL',
              refRange: '12.0 - 16.0 g/dL',
              status: 'normal',
            },
            {
              key: 'glucose',
              label: 'Fasting Blood Glucose',
              value: isDia ? 124 : 92,
              unit: 'mg/dL',
              refRange: '70 - 100 mg/dL',
              status: isDia ? 'high' : 'normal',
            },
            {
              key: 'chol',
              label: 'Total Cholesterol',
              value: 178,
              unit: 'mg/dL',
              refRange: '< 200 mg/dL',
              status: 'normal',
            },
            {
              key: 'egfr',
              label: 'eGFR (Renal Function)',
              value: 95,
              unit: 'mL/min',
              refRange: '> 60 mL/min',
              status: 'normal',
            },
          ],
        },
      ],
    };

    const userFamilyMember: FamilyMember = {
      id: 'fam-user-self',
      patientId: userId,
      name: data.fullName,
      relationship: 'Self',
      age: data.age,
      gender: data.gender === 'Female' ? 'Female' : 'Male',
      bloodGroup: data.bloodGroup,
      abhaId: data.abhaId,
      avatarUrl: newPatient.photoUrl,
      activeConditions: data.conditions,
      allergiesCount: hasRealAllergies.length,
    };

    setPatients((prev) => [
      newPatient,
      ...prev.filter((p) => p.id !== userId && !p.id.toLowerCase().includes('deshmukh')),
    ]);
    setFamilyMembers([userFamilyMember]);
    try {
      localStorage.setItem('medisync_family_members', JSON.stringify([userFamilyMember]));
    } catch {}
    setSelectedPatientId(userId);
    setActiveFamilyMember(userFamilyMember);

    // Also update health documents for the registered user
    const welcomeDoc: HealthDocument = {
      id: `doc-welcome-${Date.now()}`,
      title: 'ABHA Digital Health Card & Baseline Intake',
      category: 'Discharge Summary',
      doctorOrLab: 'Medisync Health Ecosystem • ABDM',
      date: 'Today',
      fileSize: '512 KB PDF',
      tags: ['ABDM Verified', 'Health ID', 'Intake Record'],
      verifiedAbdm: true,
      aiSummary: `Digital health ID established for ${data.fullName}. ABHA ${data.abhaId} activated. Emergency contact registered: ${data.emergencyContactName}.`,
      documentSnippet: `Patient: ${data.fullName}, Age: ${data.age}, Blood: ${data.bloodGroup}, ABHA: ${data.abhaId}, Emergency: ${data.emergencyContactPhone}`,
    };
    setDocuments((prev) => [welcomeDoc, ...prev]);

    // Directly activate patient portal & create health ID
    setAppRole('patient');
    setActiveScreen('chart');
    setShowRegistration(false);

    showToast(`Health ID ${data.abhaId} created successfully for ${data.fullName}!`);
  };

  const currentPatient =
    patients.find((p) => p.id === selectedPatientId) ||
    (appRole === 'patient' && activeFamilyMember.patientId
      ? patients.find((p) => p.id === activeFamilyMember.patientId)
      : null) ||
    patients[0];

  // Role toggle: Doctor vs Patient vs Wellness
  const handleToggleRole = (newRole: 'doctor' | 'patient' | 'wellness') => {
    setAppRole(newRole);
    if (newRole === 'wellness') {
      setActiveScreen('wellness');
      showToast('Switched to Wellness & Prevention Hub (Healthy Living)');
    } else if (newRole === 'doctor') {
      setActiveScreen('chart');
      // If currently on a family sub-member, switch back to primary registered patient
      if (selectedPatientId.startsWith('pt-fam')) {
        setSelectedPatientId(patients[0]?.id || 'pt-registered-user');
      }
      showToast('Switched to Clinician EHR (Inpatient ICU Telemetry & MAR)');
    } else {
      setActiveScreen('chart');
      // Switch back to active family member's patient profile
      const targetId = activeFamilyMember.patientId || `pt-${activeFamilyMember.id}`;
      const found = patients.find(
        (p) => p.id === targetId || p.name.toLowerCase() === activeFamilyMember.name.toLowerCase()
      );
      if (found) {
        setSelectedPatientId(found.id);
      }
      showToast(`Switched to Patient & Family Portal (${activeFamilyMember.name})`);
    }
  };

  // Handler: Change active patient (Doctor Mode)
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatientId(patient.id);
    setActiveScreen('chart');
    showToast(`Loaded ${patient.name}'s chart (Room ${patient.room})`);
  };

  // Handler: Change active family member (Patient Mode)
  const handleSelectFamilyMember = (member: FamilyMember) => {
    setActiveFamilyMember(member);

    // Look for matching patient record
    const targetPatientId = member.patientId || `pt-${member.id}`;
    const foundPatient = patients.find(
      (p) =>
        p.id === targetPatientId ||
        p.id === member.id ||
        p.name.toLowerCase() === member.name.toLowerCase()
    );

    if (foundPatient) {
      setSelectedPatientId(foundPatient.id);
    } else {
      // Create new patient record for custom added family member
      const newPatient: Patient = {
        id: targetPatientId,
        name: member.name,
        age: member.age,
        gender: member.gender,
        mrn: `#MS-${Math.floor(10000 + Math.random() * 90000)}`,
        room: 'Outpatient / Home Care',
        department: 'General Medicine & Family Health',
        bloodType: member.bloodGroup,
        photoUrl: member.avatarUrl,
        abhaId: member.abhaId,
        allergies: [],
        alerts: member.allergiesCount > 0 ? ['DOCUMENTED SENSITIVITY'] : ['NO KNOWN CONTRAINDICATIONS'],
        acuity: 'Stable',
        admitDate: 'Active Ambulatory',
        attendingDoctor: 'Dr. Ananya Sharma, MBBS, MD',
        vitals: {
          bpSystolic: 120,
          bpDiastolic: 80,
          bpStatus: 'Normal Target',
          pulse: 74,
          rhythm: 'Sinus Rhythm',
          spO2: 98,
          spO2Mode: 'Room Air',
          glucose: 100,
          glucoseState: 'Fasting',
          temp: 98.6,
          respRate: 16,
          syncTimeAgo: 'Sync 5m ago',
          history: [
            { time: '06:00', bp: '118/78', pulse: 72, spO2: 98, glucose: 98 },
            { time: '08:00', bp: '120/80', pulse: 74, spO2: 98, glucose: 100 },
          ],
        },
        recentNote: {
          id: `note-${Date.now()}`,
          noteNumber: 101,
          type: 'Wellness Consultation',
          authorName: 'Dr. Ananya Sharma, MBBS, MD',
          authorRole: 'General Physician',
          department: 'Outpatient Clinic',
          timestamp: 'Today, 09:30 AM',
          content: `Family health record active for ${member.name}. Routine preventive screening scheduled.`,
          signedElectronically: true,
          addenda: [],
        },
        pastNotes: [],
        diagnoses: member.activeConditions.map((cond, i) => ({
          id: `dx-${member.id}-${i}`,
          name: cond,
          status: 'Managed',
          icd10: 'Z00.00',
          onsetYear: '2023',
          icon: 'health_and_safety',
        })),
        medications: [],
        labs: [
          {
            id: `lab-${member.id}`,
            title: 'Routine Health Screening',
            collectedTime: 'Collected Today',
            status: 'Completed',
            metrics: [
              { key: 'hgb', label: 'Hemoglobin', value: 13.8, unit: 'g/dL', refRange: '12.0 - 15.5 g/dL', status: 'normal' },
              { key: 'glucose', label: 'Fasting Glucose', value: 98, unit: 'mg/dL', refRange: '70 - 100 mg/dL', status: 'normal' },
            ],
          },
        ],
      };
      setPatients((prev) => [...prev, newPatient]);
      setSelectedPatientId(targetPatientId);
    }

    showToast(`Switched health dashboard to ${member.name} (${member.relationship})`);
  };

  const handleAddFamilyMember = (newMember: FamilyMember) => {
    setFamilyMembers((prev) => {
      const updated = [
        ...prev.filter((m) => !m.name.toLowerCase().includes('deshmukh')),
        newMember,
      ];
      try {
        localStorage.setItem('medisync_family_members', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleRemoveFamilyMember = (memberId: string) => {
    setFamilyMembers((prev) => {
      const updated = prev.filter((m) => m.id !== memberId);
      try {
        localStorage.setItem('medisync_family_members', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('Family member unlinked from account', 'info');
  };

  // Handler: Submit new Rx order
  const handleNewRxSubmit = (newOrderData: {
    medName: string;
    dosage: string;
    route: string;
    frequency: string;
    indication: string;
    urgent: boolean;
  }) => {
    const newOrderId = `rx-${Date.now()}`;
    const newRx: RxOrder = {
      id: newOrderId,
      patientId: currentPatient.id,
      patientName: `${currentPatient.name} (${currentPatient.room})`,
      medName: newOrderData.medName,
      dosage: newOrderData.dosage,
      route: newOrderData.route,
      frequency: newOrderData.frequency,
      indication: newOrderData.indication,
      prescribingDoctor: doctorAuth?.name || 'Dr. Rajesh Sharma, MD',
      orderedAt: 'Just now',
      status: 'Active MAR',
      urgent: newOrderData.urgent,
    };

    setOrders((prev) => [newRx, ...prev]);

    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: newOrderData.medName,
      dosage: newOrderData.dosage,
      route: newOrderData.route,
      frequency: newOrderData.frequency,
      timingLabel: 'Due Next Schedule',
      dueTime: 'Next Window',
      status: 'due',
      prescribedBy: doctorAuth?.name || 'Dr. Rajesh Sharma, MD',
    };

    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? { ...p, medications: [...p.medications, newMed] }
          : p
      )
    );

    showToast(`Order signed: ${newOrderData.medName} ${newOrderData.dosage}`);
  };

  // Handler: Update vitals
  const handleUpdateVitals = (newVitals: Partial<VitalsData>) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? {
              ...p,
              vitals: {
                ...p.vitals,
                ...newVitals,
                syncTimeAgo: 'Sync just now',
              },
            }
          : p
      )
    );
    showToast('Bedside vitals logged and telemetry broadcast synced');
  };

  // Handler: Administer Medication
  const handleOpenAdminister = (med: Medication) => {
    setSelectedMedForAdminister(med);
    setIsAdministerOpen(true);
  };

  const handleConfirmAdminister = (medId: string, timeString: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== currentPatient.id) return p;
        return {
          ...p,
          medications: p.medications.map((m) =>
            m.id === medId
              ? {
                  ...m,
                  status: 'given',
                  administeredTime: `${timeString}`,
                  timingLabel: `Given ${timeString}`,
                  administeredBy: 'S. Kulkarni, RN',
                }
              : m
          ),
        };
      })
    );
    showToast('Medication verified and recorded in electronic MAR');
  };

  // Handler: Add Note Addendum
  const handleOpenAddAddendum = (note: ClinicalNote) => {
    setSelectedNoteForAddendum(note);
    setIsAddAddendumOpen(true);
  };

  const handleSaveAddendum = (
    noteId: string,
    addendumText: string,
    author: string,
    role: string
  ) => {
    const newAddendum = {
      id: `ad-${Date.now()}`,
      authorName: author,
      authorRole: role,
      timestamp: 'Today, Just now',
      content: addendumText,
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== currentPatient.id) return p;
        if (p.recentNote.id === noteId) {
          return {
            ...p,
            recentNote: {
              ...p.recentNote,
              addenda: [...(p.recentNote.addenda || []), newAddendum],
            },
          };
        }
        return {
          ...p,
          pastNotes: p.pastNotes.map((n) =>
            n.id === noteId
              ? { ...n, addenda: [...(n.addenda || []), newAddendum] }
              : n
          ),
        };
      })
    );
    showToast('Addendum signed & appended to SOAP record');
  };

  // Handler: Add Diagnosis
  const handleAddDiagnosis = (dx: Omit<Diagnosis, 'id'>) => {
    const newDx: Diagnosis = {
      ...dx,
      id: `dx-${Date.now()}`,
    };
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? { ...p, diagnoses: [...p.diagnoses, newDx] }
          : p
      )
    );
    showToast(`Added ICD-10 diagnosis: ${dx.name}`);
  };

  // Handler: Toggle patient diagnosis privacy / visibility
  const handleToggleDiagnosisPrivacy = (dxId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== currentPatient.id) return p;
        return {
          ...p,
          diagnoses: p.diagnoses.map((dx) =>
            dx.id === dxId ? { ...dx, isPrivate: !dx.isPrivate } : dx
          ),
        };
      })
    );
  };

  // Handler: Add Allergy
  const handleAddAllergy = (
    allergen: string,
    severity: 'Severe' | 'Moderate' | 'Mild',
    reaction: string
  ) => {
    const newAllergy = {
      id: `all-${Date.now()}`,
      allergen,
      severity,
      reaction,
      confirmedDate: new Date().toISOString().split('T')[0],
    };
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? {
              ...p,
              allergies: [...p.allergies, newAllergy],
              alerts: [...p.alerts, `${severity.toUpperCase()} ${allergen} ALLERGY`],
            }
          : p
      )
    );
    showToast(`Allergy alert recorded for ${allergen}`);
  };

  // Handler: Discontinue Rx order
  const handleDiscontinueOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'Dispensed' } : o
      )
    );
  };

  // Handler: Book Appointment
  const handleBookAppointment = (aptData: Omit<Appointment, 'id' | 'calendarSynced'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      calendarSynced: true,
    };
    setAppointments((prev) => [newApt, ...prev]);
  };

  // Handler: Cancel Appointment
  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  // Handler: Book Home Lab Test
  const handleBookHomeLab = (test: HomeLabTest, date: string, slot: string) => {
    const labInv: InvoiceBill = {
      id: `inv-${Date.now()}`,
      invoiceNo: `INV-LAB-${Math.floor(10000 + Math.random() * 90000)}`,
      date: `${date} (${slot.split(' ')[0]})`,
      service: `Home Lab Sample Collection: ${test.name}`,
      provider: 'St. Jude Diagnostics & NABL Labs',
      grossAmount: test.price,
      insuranceCovered: 0,
      patientPayable: test.price,
      status: 'Pending',
    };
    setInvoices((prev) => [labInv, ...prev]);
  };

  // Handler: Upload Document
  const handleUploadDocument = (docData: Omit<HealthDocument, 'id'>) => {
    const newDoc: HealthDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  // Pay Invoice Handler
  const handlePayInvoice = (invoiceId: string, method: string, utr: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'Paid',
              paymentMethod: method,
              upiRef: utr,
            }
          : inv
      )
    );
  };

  // If user has just opened the website/app or requested to enter/edit details,
  // display the User Registration & Details Onboarding screen
  if (showRegistration) {
    return (
      <UserRegistrationScreen
        initialData={savedUserData || undefined}
        onComplete={handleCompleteRegistration}
        language={language}
        onSelectLanguage={setLanguage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#eff4ff]/60 flex flex-col items-center">
      {/* Top Device Framing Switcher */}
      <div className="w-full bg-[#001f2a] text-[#bde9ff] text-[11px] py-1.5 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-wide">MEDISYNC HEALTHCARE ECOSYSTEM</span>
          <span className="hidden sm:inline-block text-[#93ccff]">| By Meta Minds (Good Health & Well Being)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#93d3ef] text-[10px] hidden sm:inline">Viewport:</span>
          <button
            onClick={() => setViewMode('mobile')}
            className={`px-2.5 py-0.5 rounded-md font-semibold transition-colors ${
              viewMode === 'mobile'
                ? 'bg-[#006398] text-white'
                : 'text-[#93d3ef] hover:bg-[#004357]'
            }`}
          >
            📱 Mobile Frame
          </button>
          <button
            onClick={() => setViewMode('expanded')}
            className={`px-2.5 py-0.5 rounded-md font-semibold transition-colors ${
              viewMode === 'expanded'
                ? 'bg-[#006398] text-white'
                : 'text-[#93d3ef] hover:bg-[#004357]'
            }`}
          >
            🖥️ Expanded View
          </button>
        </div>
      </div>

      {/* Main App Container */}
      <div
        className={`w-full flex-1 flex flex-col relative transition-all duration-200 ${
          viewMode === 'mobile'
            ? 'max-w-[440px] my-0 sm:my-3 sm:shadow-2xl sm:rounded-3xl border sm:border-[#dce9ff] bg-[#f8f9ff] overflow-hidden'
            : 'max-w-4xl bg-[#f8f9ff]'
        }`}
      >
        {/* Top Header */}
        <Header
          appRole={appRole}
          onToggleAppRole={handleToggleRole}
          activeScreen={activeScreen}
          language={language}
          onSelectLanguage={setLanguage}
          onEmergencyClick={() => {
            if (appRole === 'doctor') {
              setIsEmergencyCodeOpen(true);
            } else {
              setIsEmergencySosOpen(true);
            }
          }}
          onOpenFamilyDashboard={() => setIsFamilyDashboardOpen(true)}
          selectedUnit={selectedUnit}
          onSelectUnit={(u) => {
            setSelectedUnit(u);
            showToast(`Switched ward to ${u}`);
          }}
          activeFamilyMember={activeFamilyMember}
          activeMemberName={activeFamilyMember.name}
          doctorAuth={doctorAuth}
          onOpenDoctorLogin={() => setIsDoctorLoginOpen(true)}
          onOpenDiagnosisPrivacy={() => setIsDiagnosisPrivacyOpen(true)}
          onOpenRegistration={() => setShowRegistration(true)}
        />

        {/* Scrollable Main Screen Content */}
        <main className="flex-1 w-full pt-16 pb-20 bg-[#f8f9ff] min-h-[calc(100vh-4rem)]">
          {/* 1. Chart / Vitals Screen (Both doctor & patient) */}
          {activeScreen === 'chart' && (
            <ChartScreen
              patient={currentPatient}
              appRole={appRole}
              doctorAuth={doctorAuth}
              onOpenDoctorLogin={() => setIsDoctorLoginOpen(true)}
              onToggleDiagnosisPrivacy={handleToggleDiagnosisPrivacy}
              onOpenPrivacyModal={() => setIsDiagnosisPrivacyOpen(true)}
              onOpenNewRx={() => {
                if (appRole === 'doctor' && !doctorAuth.isVerified) {
                  showToast('⚠️ Prescribing locked: Please login with verified NMC credentials', 'alert');
                  setIsDoctorLoginOpen(true);
                  return;
                }
                setIsNewRxOpen(true);
              }}
              onOpenUpdateVitals={() => setIsUpdateVitalsOpen(true)}
              onOpenAdminister={handleOpenAdminister}
              onOpenAddAddendum={(note) => {
                if (appRole === 'doctor' && !doctorAuth.isVerified) {
                  showToast('⚠️ Electronic signing locked: Please verify NMC doctor login', 'alert');
                  setIsDoctorLoginOpen(true);
                  return;
                }
                handleOpenAddAddendum(note);
              }}
              onOpenAllNotes={() => setIsAllNotesOpen(true)}
              onOpenAllergyDetails={() => setIsAllergyDetailsOpen(true)}
              onOpenAddDiagnosis={() => {
                if (appRole === 'doctor' && !doctorAuth.isVerified) {
                  showToast('⚠️ ICD-10 coding locked: Please verify doctor credentials', 'alert');
                  setIsDoctorLoginOpen(true);
                  return;
                }
                setIsAddDiagnosisOpen(true);
              }}
              onOpenWellness={() => {
                setAppRole('wellness');
                setActiveScreen('wellness');
                showToast('Switched to Wellness & Prevention Hub');
              }}
              onShowToast={showToast}
            />
          )}

          {/* Doctor Mode Screens */}
          {appRole === 'doctor' && activeScreen === 'patients' && (
            <PatientsScreen
              patients={patients}
              selectedPatientId={selectedPatientId}
              onSelectPatient={handleSelectPatient}
            />
          )}

          {appRole === 'doctor' && activeScreen === 'rx' && (
            <RxScreen
              patient={currentPatient}
              orders={orders}
              onOpenNewRx={() => setIsNewRxOpen(true)}
              onDiscontinueOrder={handleDiscontinueOrder}
              onShowToast={showToast}
            />
          )}

          {appRole === 'doctor' && activeScreen === 'pharmacy' && (
            <PharmacyScreen
              patient={currentPatient}
              orders={orders}
              onShowToast={showToast}
            />
          )}

          {/* Wellness & Preventive Hub Screen (For Healthy People) */}
          {(appRole === 'wellness' || activeScreen === 'wellness') && (
            <WellnessHubScreen
              language={language}
              onBookCheckup={() => {
                setActiveScreen('appointments');
                showToast('Select your 6-month checkup package or specialist appointment');
              }}
              onShowToast={showToast}
            />
          )}

          {/* Patient Mode & Wellness Cross-Accessible Screens */}
          {(appRole === 'patient' || appRole === 'wellness') && activeScreen === 'appointments' && (
            <AppointmentsScreen
              appointments={appointments}
              language={language}
              onBookAppointment={handleBookAppointment}
              onCancelAppointment={handleCancelAppointment}
              onBookHomeLab={handleBookHomeLab}
              onShowToast={showToast}
            />
          )}

          {appRole === 'patient' && activeScreen === 'prescriptions' && (
            <PrescriptionsPortalScreen
              patient={currentPatient}
              language={language}
              onShowToast={showToast}
            />
          )}

          {(appRole === 'patient' || appRole === 'wellness') && activeScreen === 'records_vault' && (
            <DocumentsVaultScreen
              patient={currentPatient}
              documents={documents}
              language={language}
              onUploadDocument={handleUploadDocument}
              onShowToast={showToast}
            />
          )}

          {(appRole === 'patient' || appRole === 'wellness') && activeScreen === 'payments_billing' && (
            <BillingPaymentsScreen
              patient={currentPatient}
              invoices={invoices}
              language={language}
              onPayInvoice={handlePayInvoice}
              onShowToast={showToast}
            />
          )}
        </main>

        {/* Fixed Bottom Navigation Bar */}
        <BottomNav
          appRole={appRole}
          activeScreen={activeScreen}
          onNavigate={(s) => setActiveScreen(s)}
          language={language}
          pendingRxCount={orders.filter((o) => o.urgent).length}
        />

        {/* Micro Toast Feedback */}
        <Toast message={toastMessage} type={toastType} />
      </div>

      {/* Doctor Modals */}
      <NewRxModal
        patient={currentPatient}
        isOpen={isNewRxOpen}
        onClose={() => setIsNewRxOpen(false)}
        onSubmitOrder={handleNewRxSubmit}
      />

      <UpdateVitalsModal
        patient={currentPatient}
        isOpen={isUpdateVitalsOpen}
        onClose={() => setIsUpdateVitalsOpen(false)}
        onUpdateVitals={handleUpdateVitals}
      />

      <AdministerMedModal
        patient={currentPatient}
        medication={selectedMedForAdminister}
        isOpen={isAdministerOpen}
        onClose={() => {
          setIsAdministerOpen(false);
          setSelectedMedForAdminister(null);
        }}
        onConfirmAdminister={handleConfirmAdminister}
      />

      {selectedNoteForAddendum && (
        <AddAddendumModal
          patient={currentPatient}
          note={selectedNoteForAddendum}
          isOpen={isAddAddendumOpen}
          onClose={() => {
            setIsAddAddendumOpen(false);
            setSelectedNoteForAddendum(null);
          }}
          onSaveAddendum={handleSaveAddendum}
        />
      )}

      <AllNotesModal
        patient={currentPatient}
        isOpen={isAllNotesOpen}
        onClose={() => setIsAllNotesOpen(false)}
        onOpenAddAddendum={(note) => {
          setSelectedNoteForAddendum(note);
          setIsAddAddendumOpen(true);
        }}
      />

      <EmergencyCodeModal
        patient={currentPatient}
        isOpen={isEmergencyCodeOpen}
        onClose={() => setIsEmergencyCodeOpen(false)}
        onLogEvent={(msg) => showToast(msg, 'alert')}
      />

      <AllergyDetailsModal
        patient={currentPatient}
        isOpen={isAllergyDetailsOpen}
        onClose={() => setIsAllergyDetailsOpen(false)}
        onAddAllergy={handleAddAllergy}
      />

      <AddDiagnosisModal
        patient={currentPatient}
        isOpen={isAddDiagnosisOpen}
        onClose={() => setIsAddDiagnosisOpen(false)}
        onAddDiagnosis={handleAddDiagnosis}
      />

      {/* Patient Portal Modals */}
      <FamilyDashboardModal
        isOpen={isFamilyDashboardOpen}
        members={familyMembers}
        activeMemberId={activeFamilyMember.id}
        onSelectMember={handleSelectFamilyMember}
        onAddMember={handleAddFamilyMember}
        onRemoveMember={handleRemoveFamilyMember}
        onClose={() => setIsFamilyDashboardOpen(false)}
        onShowToast={showToast}
        onOpenRegistration={() => {
          setIsFamilyDashboardOpen(false);
          setShowRegistration(true);
        }}
      />

      <EmergencySosModal
        patient={currentPatient}
        isOpen={isEmergencySosOpen}
        onClose={() => setIsEmergencySosOpen(false)}
        onShowToast={showToast}
      />

      {/* Verified Doctor Login & Council Verification Modal */}
      <DoctorLoginModal
        isOpen={isDoctorLoginOpen}
        onClose={() => setIsDoctorLoginOpen(false)}
        currentAuth={doctorAuth}
        onLoginSuccess={(newAuth) => setDoctorAuth(newAuth)}
        onLogout={() => {
          setDoctorAuth({
            isVerified: false,
            name: 'Unverified Guest Clinician',
            nmcRegNo: 'UNVERIFIED',
            stateMedicalCouncil: 'None',
            qualification: 'Pending Verification',
            hospitalStaffId: 'GUEST-0000',
            department: 'Clinical Observation',
            verifiedAt: 'Unverified',
            digitalSignatureToken: '',
          });
          showToast('Logged out of verified doctor session. Prescribing & notes locked.', 'info');
        }}
        onShowToast={showToast}
      />

      {/* Patient Data Sovereignty / Diagnosis Privacy Modal */}
      <DiagnosisPrivacyModal
        isOpen={isDiagnosisPrivacyOpen}
        onClose={() => setIsDiagnosisPrivacyOpen(false)}
        patient={currentPatient}
        onToggleDiagnosisPrivacy={handleToggleDiagnosisPrivacy}
        onShowToast={showToast}
      />
    </div>
  );
}
