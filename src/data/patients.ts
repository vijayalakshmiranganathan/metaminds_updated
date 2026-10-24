import { Patient, RxOrder } from '../types/clinical';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pt-sunita-deshmukh',
    name: 'Sunita Deshmukh',
    age: 58,
    gender: 'Female',
    mrn: '#MS-84920',
    room: '304B',
    department: 'Cardiology',
    bloodType: 'A+',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9H9tMRdqXwvgM0lgfDKkjmIM_KdEIyTNXBpI4HR8z0hHn5gYWEeAPQZmD_Lz7g7xxyx3N4Bamhp9pMdF8BgBlIjgAdXpgcXTtkmB0lF-3m-th4CIvTs4CpQmVeGlIkqmM2xHAZznA_VJbVPTQVAMi_RaNIsBb-bdJ99yEj6HUPKTKvR04g04hBETCQQMVGFHSYm6tA40CfD8acUUz4i5_eoIUK4tKEJvVyZRq_IB4KJOf2qU1SRm9mw',
    allergies: [
      {
        id: 'all-1',
        allergen: 'PENICILLIN',
        severity: 'Severe',
        reaction: 'Anaphylaxis, severe bronchospasm, facial angioedema (2014)',
        confirmedDate: '2014-08-14',
        notes: 'Absolute contraindication: Penicillins, Amoxicillin, Ampicillin, Piperacillin/Tazobactam. Use extreme caution with 1st gen cephalosporins.'
      }
    ],
    alerts: [
      'SEVERE PENICILLIN ALLERGY',
      'NPO Post-Midnight',
      'Fall Risk'
    ],
    acuity: 'Stable',
    admitDate: 'Oct 21, 2026',
    attendingDoctor: 'Dr. Rajesh Sharma, MD',
    vitals: {
      bpSystolic: 128,
      bpDiastolic: 82,
      bpStatus: 'Normal Target',
      pulse: 76,
      rhythm: 'Sinus Rhythm',
      spO2: 98,
      spO2Mode: 'Room Air',
      glucose: 112,
      glucoseState: 'Post-Prandial',
      temp: 98.4,
      respRate: 16,
      syncTimeAgo: 'Sync 8m ago',
      history: [
        { time: '02:00', bp: '124/80', pulse: 72, spO2: 98, glucose: 108 },
        { time: '04:00', bp: '126/82', pulse: 74, spO2: 98, glucose: 105 },
        { time: '06:00', bp: '130/84', pulse: 78, spO2: 97, glucose: 118 },
        { time: '08:00', bp: '128/82', pulse: 76, spO2: 98, glucose: 112 }
      ]
    },
    recentNote: {
      id: 'note-112',
      noteNumber: 112,
      type: 'SOAP Note',
      authorName: 'Dr. Rajesh Sharma, MD',
      authorRole: 'Attending',
      department: 'Cardiology Inpatient Rounds',
      timestamp: 'Today, 08:30 AM',
      content: '“Patient showing stable hemodynamics. Titrated Amlodipine last visit; continue current regimen. Order routine renal panel prior to discharge.”',
      signedElectronically: true,
      addenda: []
    },
    pastNotes: [
      {
        id: 'note-111',
        noteNumber: 111,
        type: 'Progress Note',
        authorName: 'Dr. Ananya Nair, MD',
        authorRole: 'Fellow',
        department: 'Cardiology',
        timestamp: 'Yesterday, 17:15 PM',
        content: 'Telemetry reviewed. No ectopic beats observed on 12-lead strip. Patient ambulated 80 feet in hallway with physical therapy assistance without desaturation.',
        signedElectronically: true,
        addenda: []
      },
      {
        id: 'note-110',
        noteNumber: 110,
        type: 'Nursing Shift Note',
        authorName: 'Sunita Kulkarni, RN',
        authorRole: 'Primary ICU Nurse',
        department: 'ICU Station 3',
        timestamp: 'Yesterday, 07:00 AM',
        content: 'Patient resting comfortably. Heparin lock patent in right forearm. Blood sugars monitored QAC. Bed alarm engaged due to high fall risk assessment.',
        signedElectronically: true,
        addenda: []
      },
      {
        id: 'note-109',
        noteNumber: 109,
        type: 'Consultation',
        authorName: 'Dr. Vikram Patel, MD',
        authorRole: 'Endocrinologist',
        department: 'Endocrinology Consult',
        timestamp: 'Oct 21, 2026, 14:00 PM',
        content: 'Reviewed glycemic management. Patient on Metformin 500mg BID. Fasting glucose well-controlled between 105-120 mg/dL. HbA1c 6.8%. Continue oral therapy.',
        signedElectronically: true,
        addenda: []
      }
    ],
    diagnoses: [
      {
        id: 'dx-1',
        name: 'Hypertension',
        status: 'Managed',
        icd10: 'I10',
        onsetYear: '2018',
        details: 'Essential hypertension well managed with calcium channel blocker therapy.',
        icon: 'cardiology'
      },
      {
        id: 'dx-2',
        name: 'Type 2 Diabetes Mellitus',
        status: 'Chronic',
        icd10: 'E11.9',
        onsetYear: '2016',
        details: 'Last HbA1c: 6.8% (collected 3 weeks prior). No diabetic retinopathy on recent ophthalmology exam.',
        icon: 'bloodtype'
      },
      {
        id: 'dx-3',
        name: 'Mild Osteoarthritis',
        status: 'Monitored',
        statusBadgeColor: 'Bilateral Knees',
        icd10: 'M17.0',
        onsetYear: '2021',
        details: 'Bilateral knee joint stiffness exacerbated by prolonged bed rest. Physical therapy assigned.',
        icon: 'accessibility_new',
        isPrivate: true,
        consentNotes: 'Patient exercised ABDM privacy consent to hide this condition from family member accounts.'
      }
    ],
    medications: [
      {
        id: 'med-1',
        name: 'Metformin',
        dosage: '500 mg',
        route: 'Oral',
        frequency: 'BID (With meals)',
        timingLabel: 'Due 12:00',
        dueTime: '12:00',
        status: 'due',
        prescribedBy: 'Dr. Vikram Patel, MD',
        category: 'Antidiabetic'
      },
      {
        id: 'med-2',
        name: 'Amlodipine',
        dosage: '5 mg',
        route: 'Oral',
        frequency: 'Daily (Morning)',
        timingLabel: 'Given 08:00',
        dueTime: '08:00',
        status: 'given',
        administeredTime: '08:00 AM',
        administeredBy: 'Nurse S. Kulkarni, RN',
        prescribedBy: 'Dr. Rajesh Sharma, MD',
        category: 'Antihypertensive (CCB)'
      },
      {
        id: 'med-3',
        name: 'Atorvastatin',
        dosage: '20 mg',
        route: 'Oral',
        frequency: 'QHS (Bedtime)',
        timingLabel: 'Due 21:00',
        dueTime: '21:00',
        status: 'scheduled',
        prescribedBy: 'Dr. Rajesh Sharma, MD',
        category: 'HMG-CoA Reductase Inhibitor (Statin)'
      }
    ],
    labs: [
      {
        id: 'lab-renal',
        title: 'Renal & Electrolyte Panel',
        collectedTime: 'Collected 06:15 AM',
        status: 'Completed',
        metrics: [
          { key: 'egfr', label: 'eGFR', value: 78, unit: 'mL/min', refRange: '>60 mL/min', status: 'normal' },
          { key: 'creat', label: 'Creatinine', value: 0.92, unit: 'mg/dL', refRange: '0.6 - 1.2 mg/dL', status: 'normal' },
          { key: 'k', label: 'Potassium', value: 4.2, unit: 'mEq/L', refRange: '3.5 - 5.0 mEq/L', status: 'normal' }
        ]
      },
      {
        id: 'lab-cbc',
        title: 'Complete Blood Count (CBC)',
        collectedTime: 'Collected 06:15 AM',
        status: 'Completed',
        metrics: [
          { key: 'wbc', label: 'WBC', value: 6.8, unit: 'K/uL', refRange: '4.5 - 11.0 K/uL', status: 'normal' },
          { key: 'hgb', label: 'Hemoglobin', value: 13.4, unit: 'g/dL', refRange: '12.0 - 15.5 g/dL', status: 'normal' },
          { key: 'plt', label: 'Platelets', value: 242, unit: 'K/uL', refRange: '150 - 450 K/uL', status: 'normal' }
        ]
      },
      {
        id: 'lab-cardiac',
        title: 'Cardiac Biomarkers',
        collectedTime: 'Collected 04:30 AM',
        status: 'Completed',
        metrics: [
          { key: 'trop', label: 'Troponin I', value: '<0.01', unit: 'ng/mL', refRange: '<0.04 ng/mL', status: 'normal' },
          { key: 'bnp', label: 'BNP', value: 85, unit: 'pg/mL', refRange: '<100 pg/mL', status: 'normal' },
          { key: 'ckmb', label: 'CK-MB', value: 1.8, unit: 'ng/mL', refRange: '<5.0 ng/mL', status: 'normal' }
        ]
      }
    ]
  },
  {
    id: 'pt-arjun-patel',
    name: 'Arjun Patel',
    age: 64,
    gender: 'Male',
    mrn: '#MS-84912',
    room: '302A',
    department: 'Post-Op ICU',
    bloodType: 'A-',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    allergies: [
      {
        id: 'all-2',
        allergen: 'SULFA DRUGS',
        severity: 'Moderate',
        reaction: 'Hives, maculopapular rash',
        confirmedDate: '2019-02-10'
      }
    ],
    alerts: [
      'POST-CABG DAY 2',
      'Strict I&O Monitoring',
      'Telemetry Paced'
    ],
    acuity: 'Urgent',
    admitDate: 'Oct 20, 2026',
    attendingDoctor: 'Dr. Vikram Swaminathan, MD',
    vitals: {
      bpSystolic: 134,
      bpDiastolic: 86,
      bpStatus: 'Elevated',
      pulse: 82,
      rhythm: 'Atrial Paced',
      spO2: 96,
      spO2Mode: '2L Nasal Cannula',
      glucose: 142,
      glucoseState: 'Pre-Prandial',
      temp: 99.1,
      respRate: 18,
      syncTimeAgo: 'Sync 3m ago'
    },
    recentNote: {
      id: 'note-201',
      noteNumber: 201,
      type: 'Post-Op Rounds',
      authorName: 'Dr. Vikram Swaminathan, MD',
      authorRole: 'Cardiothoracic Surgery',
      department: 'CVICU',
      timestamp: 'Today, 07:45 AM',
      content: '“Post-CABG Day 2. Chest tubes removed with minimal drainage. Pacing wires intact. Wean oxygen to room air today as tolerated.”',
      signedElectronically: true,
      addenda: []
    },
    pastNotes: [],
    diagnoses: [
      {
        id: 'dx-brody-1',
        name: 'Coronary Artery Disease',
        status: 'Managed',
        icd10: 'I25.10',
        onsetYear: '2020',
        icon: 'cardiology'
      },
      {
        id: 'dx-brody-2',
        name: 'Status Post CABG x3',
        status: 'Acute',
        icd10: 'Z95.1',
        onsetYear: '2026',
        icon: 'healing'
      }
    ],
    medications: [
      {
        id: 'med-b1',
        name: 'Metoprolol Tartrate',
        dosage: '25 mg',
        route: 'Oral',
        frequency: 'BID',
        timingLabel: 'Due 12:00',
        dueTime: '12:00',
        status: 'due',
        prescribedBy: 'Dr. Vikram Swaminathan, MD'
      },
      {
        id: 'med-b2',
        name: 'Aspirin (Chewable)',
        dosage: '81 mg',
        route: 'Oral',
        frequency: 'Daily (Morning)',
        timingLabel: 'Given 08:00',
        dueTime: '08:00',
        status: 'given',
        administeredTime: '08:00 AM',
        prescribedBy: 'Dr. Vikram Swaminathan, MD'
      }
    ],
    labs: [
      {
        id: 'lab-brody-1',
        title: 'Renal & Electrolyte Panel',
        collectedTime: 'Collected 05:45 AM',
        status: 'Completed',
        metrics: [
          { key: 'egfr', label: 'eGFR', value: 65, unit: 'mL/min', refRange: '>60 mL/min', status: 'normal' },
          { key: 'creat', label: 'Creatinine', value: 1.15, unit: 'mg/dL', refRange: '0.6 - 1.2 mg/dL', status: 'normal' },
          { key: 'k', label: 'Potassium', value: 4.0, unit: 'mEq/L', refRange: '3.5 - 5.0 mEq/L', status: 'normal' }
        ]
      }
    ]
  },
  {
    id: 'pt-kavita-iyer',
    name: 'Kavita Iyer',
    age: 71,
    gender: 'Female',
    mrn: '#MS-84931',
    room: '305A',
    department: 'Cardiology',
    bloodType: 'O+',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
    allergies: [
      {
        id: 'all-3',
        allergen: 'ACE INHIBITORS',
        severity: 'Severe',
        reaction: 'Angioedema of tongue & lips',
        confirmedDate: '2022-11-04'
      }
    ],
    alerts: [
      'SEVERE ANGIOEDEMA WITH ACE-I',
      'Strict Fluid Restriction 1.5L',
      'High Fall Risk'
    ],
    acuity: 'Stable',
    admitDate: 'Oct 19, 2026',
    attendingDoctor: 'Dr. Rajesh Sharma, MD',
    vitals: {
      bpSystolic: 122,
      bpDiastolic: 78,
      bpStatus: 'Normal Target',
      pulse: 70,
      rhythm: 'Controlled Afib',
      spO2: 97,
      spO2Mode: 'Room Air',
      glucose: 104,
      glucoseState: 'Fasting',
      temp: 98.2,
      respRate: 15,
      syncTimeAgo: 'Sync 15m ago'
    },
    recentNote: {
      id: 'note-301',
      noteNumber: 301,
      type: 'Heart Failure Rounds',
      authorName: 'Dr. Rajesh Sharma, MD',
      authorRole: 'Attending',
      department: 'Cardiology',
      timestamp: 'Today, 09:15 AM',
      content: '“Euvolemic clinically today. Net negative 1.2L on IV Furosemide. Transitioning to oral Torsemide 20mg daily for planned tomorrow discharge.”',
      signedElectronically: true,
      addenda: []
    },
    pastNotes: [],
    diagnoses: [
      {
        id: 'dx-clara-1',
        name: 'Congestive Heart Failure (HFpEF)',
        status: 'Managed',
        icd10: 'I50.32',
        onsetYear: '2019',
        icon: 'cardiology'
      },
      {
        id: 'dx-clara-2',
        name: 'Chronic Atrial Fibrillation',
        status: 'Chronic',
        icd10: 'I48.2',
        onsetYear: '2021',
        icon: 'ecg_heart'
      }
    ],
    medications: [
      {
        id: 'med-c1',
        name: 'Torsemide',
        dosage: '20 mg',
        route: 'Oral',
        frequency: 'Daily (Morning)',
        timingLabel: 'Due 12:00',
        dueTime: '12:00',
        status: 'due',
        prescribedBy: 'Dr. Rajesh Sharma, MD'
      },
      {
        id: 'med-c2',
        name: 'Apixaban (Eliquis)',
        dosage: '5 mg',
        route: 'Oral',
        frequency: 'BID',
        timingLabel: 'Given 08:00',
        dueTime: '08:00',
        status: 'given',
        administeredTime: '08:00 AM',
        prescribedBy: 'Dr. Rajesh Sharma, MD'
      }
    ],
    labs: [
      {
        id: 'lab-clara-1',
        title: 'Renal & Electrolyte Panel',
        collectedTime: 'Collected 06:00 AM',
        status: 'Completed',
        metrics: [
          { key: 'egfr', label: 'eGFR', value: 72, unit: 'mL/min', refRange: '>60 mL/min', status: 'normal' },
          { key: 'creat', label: 'Creatinine', value: 0.88, unit: 'mg/dL', refRange: '0.6 - 1.2 mg/dL', status: 'normal' },
          { key: 'k', label: 'Potassium', value: 4.1, unit: 'mEq/L', refRange: '3.5 - 5.0 mEq/L', status: 'normal' }
        ]
      }
    ]
  },
  {
    id: 'pt-ramakant-deshmukh',
    name: 'Ramakant Deshmukh',
    age: 62,
    gender: 'Male',
    mrn: '#MS-84921',
    room: 'Home Care / OPD',
    department: 'Pulmonology & Geriatric Wellness',
    bloodType: 'O+',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
    abhaId: '91-8492-4820-2204@abdm',
    allergies: [
      {
        id: 'all-rd-1',
        allergen: 'DUST & POLLEN',
        severity: 'Mild',
        reaction: 'Allergic rhinitis and mild wheezing',
        confirmedDate: '2020-04-12'
      }
    ],
    alerts: [
      'ASTHMA ACTION PLAN ACTIVE',
      'Daily Peak Flow Monitoring',
      'Cholesterol Management'
    ],
    acuity: 'Stable',
    admitDate: 'Active Ambulatory',
    attendingDoctor: 'Dr. Ananya Sharma, MBBS, MD',
    vitals: {
      bpSystolic: 124,
      bpDiastolic: 80,
      bpStatus: 'Normal Target',
      pulse: 72,
      rhythm: 'Regular Sinus',
      spO2: 97,
      spO2Mode: 'Room Air',
      glucose: 102,
      glucoseState: 'Fasting',
      temp: 98.4,
      respRate: 15,
      syncTimeAgo: 'Sync 25m ago',
      history: [
        { time: '02:00', bp: '122/78', pulse: 70, spO2: 97, glucose: 98 },
        { time: '06:00', bp: '124/80', pulse: 72, spO2: 97, glucose: 102 }
      ]
    },
    recentNote: {
      id: 'note-rd-1',
      noteNumber: 214,
      type: 'SOAP Note',
      authorName: 'Dr. Ananya Sharma, MBBS, MD',
      authorRole: 'Attending Physician',
      department: 'Pulmonology & Wellness',
      timestamp: 'Today, 09:30 AM',
      content: '“Patient evaluated for seasonal asthma follow-up. Chest clear to auscultation bilaterally. Peak Expiratory Flow 450 L/min. Rosuvastatin lipid profile well-controlled. Continue Salbutamol PRN.”',
      signedElectronically: true,
      addenda: []
    },
    pastNotes: [],
    diagnoses: [
      {
        id: 'dx-rd-1',
        name: 'Mild Asthma',
        status: 'Managed',
        icd10: 'J45.20',
        onsetYear: '2019',
        details: 'Mild intermittent bronchial asthma, well controlled on maintenance inhaler.',
        icon: 'air'
      },
      {
        id: 'dx-rd-2',
        name: 'Hyperlipidemia',
        status: 'Managed',
        icd10: 'E78.5',
        onsetYear: '2021',
        details: 'Elevated baseline cholesterol responsive to dietary adjustments and Rosuvastatin 10mg.',
        icon: 'ecg_heart'
      }
    ],
    medications: [
      {
        id: 'med-rd-1',
        name: 'Salbutamol Inhaler',
        dosage: '100 mcg',
        route: 'Inhalation',
        frequency: 'PRN (As needed for wheezing)',
        timingLabel: 'PRN As Needed',
        dueTime: 'PRN',
        status: 'scheduled',
        prescribedBy: 'Dr. Ananya Sharma, MBBS, MD',
        category: 'Bronchodilator'
      },
      {
        id: 'med-rd-2',
        name: 'Rosuvastatin',
        dosage: '10 mg',
        route: 'Oral',
        frequency: 'Daily (Bedtime)',
        timingLabel: 'Due 21:00',
        dueTime: '21:00',
        status: 'due',
        prescribedBy: 'Dr. Rajesh Sharma, MD',
        category: 'Lipid-Lowering Statin'
      },
      {
        id: 'med-rd-3',
        name: 'Montelukast',
        dosage: '10 mg',
        route: 'Oral',
        frequency: 'Daily (Bedtime)',
        timingLabel: 'Due 21:00',
        dueTime: '21:00',
        status: 'scheduled',
        prescribedBy: 'Dr. Ananya Sharma, MBBS, MD',
        category: 'Leukotriene Receptor Antagonist'
      }
    ],
    labs: [
      {
        id: 'lab-rd-1',
        title: 'Lipid & Metabolic Profile',
        collectedTime: 'Collected Yesterday',
        status: 'Completed',
        metrics: [
          { key: 'chol', label: 'Total Cholesterol', value: 184, unit: 'mg/dL', refRange: '<200 mg/dL', status: 'normal' },
          { key: 'ldl', label: 'LDL Cholesterol', value: 96, unit: 'mg/dL', refRange: '<100 mg/dL', status: 'normal' },
          { key: 'hdl', label: 'HDL Cholesterol', value: 48, unit: 'mg/dL', refRange: '>40 mg/dL', status: 'normal' }
        ]
      }
    ]
  },
  {
    id: 'pt-priya-deshmukh',
    name: 'Priya Deshmukh',
    age: 26,
    gender: 'Female',
    mrn: '#MS-84922',
    room: 'Outpatient / Home Care',
    department: 'General Wellness & Neurology',
    bloodType: 'A+',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    abhaId: '91-8492-4820-3309@abdm',
    allergies: [
      {
        id: 'all-pd-1',
        allergen: 'SULFA ANTIBIOTICS',
        severity: 'Moderate',
        reaction: 'Erythematous skin rash, facial warmth (2021)',
        confirmedDate: '2021-09-18'
      }
    ],
    alerts: [
      'SULFA DRUG SENSITIVITY',
      'Preventive Yoga & Fitness Routine',
      'Hydration Goal 2.5L'
    ],
    acuity: 'Stable',
    admitDate: 'Active Ambulatory',
    attendingDoctor: 'Dr. Meera Nambiar, MD, DM',
    vitals: {
      bpSystolic: 114,
      bpDiastolic: 74,
      bpStatus: 'Normal Target',
      pulse: 68,
      rhythm: 'Sinus Rhythm',
      spO2: 99,
      spO2Mode: 'Room Air',
      glucose: 88,
      glucoseState: 'Fasting',
      temp: 98.6,
      respRate: 14,
      syncTimeAgo: 'Sync 12m ago',
      history: [
        { time: '06:00', bp: '112/72', pulse: 66, spO2: 99, glucose: 86 },
        { time: '08:00', bp: '114/74', pulse: 68, spO2: 99, glucose: 88 }
      ]
    },
    recentNote: {
      id: 'note-pd-1',
      noteNumber: 188,
      type: 'Neurology Review',
      authorName: 'Dr. Meera Nambiar, MD, DM',
      authorRole: 'Consultant Neurologist',
      department: 'Neurology Clinic',
      timestamp: 'Today, 11:15 AM',
      content: '“Migraine frequency successfully reduced with lifestyle stress-relief, yoga, and low-dose Propranolol prophylaxis. Visual aura absent in last 60 days. Continue daily hydration and sleep routine.”',
      signedElectronically: true,
      addenda: []
    },
    pastNotes: [],
    diagnoses: [
      {
        id: 'dx-pd-1',
        name: 'Migraine Prophylaxis',
        status: 'Monitored',
        icd10: 'G43.909',
        onsetYear: '2022',
        details: 'Stress-induced migraine episodes responsive to beta-blocker prophylaxis and regular sleep schedule.',
        icon: 'psychology'
      },
      {
        id: 'dx-pd-2',
        name: 'General Wellness & Fitness',
        status: 'Managed',
        icd10: 'Z00.00',
        onsetYear: '2024',
        details: 'Active yoga and Pilates routine, regular biometric tracking through Medisync app.',
        icon: 'fitness_center'
      }
    ],
    medications: [
      {
        id: 'med-pd-1',
        name: 'Propranolol',
        dosage: '20 mg',
        route: 'Oral',
        frequency: 'Daily (Morning)',
        timingLabel: 'Given 08:00',
        dueTime: '08:00',
        status: 'given',
        prescribedBy: 'Dr. Meera Nambiar, MD, DM',
        category: 'Migraine Prophylactic Beta-Blocker'
      },
      {
        id: 'med-pd-2',
        name: 'CoQ10 & Vitamin B2 Complex',
        dosage: '100 mg / 400 mg',
        route: 'Oral',
        frequency: 'Daily (Morning)',
        timingLabel: 'Due 12:00',
        dueTime: '12:00',
        status: 'due',
        prescribedBy: 'Dr. Meera Nambiar, MD, DM',
        category: 'Neuro-Nutritional Supplement'
      }
    ],
    labs: [
      {
        id: 'lab-pd-1',
        title: 'Complete Wellness Screening',
        collectedTime: 'Oct 22, 2026',
        status: 'Completed',
        metrics: [
          { key: 'hgb', label: 'Hemoglobin', value: 13.6, unit: 'g/dL', refRange: '12.0 - 15.5 g/dL', status: 'normal' },
          { key: 'vitd', label: 'Vitamin D3 (25-OH)', value: 38, unit: 'ng/mL', refRange: '30 - 100 ng/mL', status: 'normal' },
          { key: 'ferritin', label: 'Serum Ferritin', value: 44, unit: 'ng/mL', refRange: '15 - 150 ng/mL', status: 'normal' }
        ]
      }
    ]
  }
];

export const INITIAL_RX_ORDERS: RxOrder[] = [
  {
    id: 'rx-101',
    patientId: 'pt-sunita-deshmukh',
    patientName: 'Sunita Deshmukh (304B)',
    medName: 'Metformin',
    dosage: '500 mg',
    route: 'Oral',
    frequency: 'BID (With meals)',
    indication: 'Type 2 Diabetes Glycemic Control',
    prescribingDoctor: 'Dr. Vikram Patel, MD',
    orderedAt: 'Today, 08:00 AM',
    status: 'Active MAR',
    urgent: false
  },
  {
    id: 'rx-102',
    patientId: 'pt-sunita-deshmukh',
    patientName: 'Sunita Deshmukh (304B)',
    medName: 'Amlodipine',
    dosage: '5 mg',
    route: 'Oral',
    frequency: 'Daily (Morning)',
    indication: 'Essential Hypertension',
    prescribingDoctor: 'Dr. Rajesh Sharma, MD',
    orderedAt: 'Today, 07:30 AM',
    status: 'Active MAR',
    urgent: false
  },
  {
    id: 'rx-103',
    patientId: 'pt-sunita-deshmukh',
    patientName: 'Sunita Deshmukh (304B)',
    medName: 'Atorvastatin',
    dosage: '20 mg',
    route: 'Oral',
    frequency: 'QHS (Bedtime)',
    indication: 'Dyslipidemia & Vascular Prophylaxis',
    prescribingDoctor: 'Dr. Rajesh Sharma, MD',
    orderedAt: 'Today, 08:30 AM',
    status: 'Active MAR',
    urgent: false
  },
  {
    id: 'rx-104',
    patientId: 'pt-arjun-patel',
    patientName: 'Arjun Patel (302A)',
    medName: 'Metoprolol Tartrate',
    dosage: '25 mg',
    route: 'Oral',
    frequency: 'BID',
    indication: 'Post-CABG Rate Control',
    prescribingDoctor: 'Dr. Vikram Swaminathan, MD',
    orderedAt: 'Today, 06:45 AM',
    status: 'Active MAR',
    urgent: false
  },
  {
    id: 'rx-105',
    patientId: 'pt-ramakant-deshmukh',
    patientName: 'Ramakant Deshmukh (Father)',
    medName: 'Salbutamol Inhaler',
    dosage: '100 mcg',
    route: 'Inhalation',
    frequency: 'PRN (As needed)',
    indication: 'Bronchial Asthma Bronchodilation',
    prescribingDoctor: 'Dr. Ananya Sharma, MBBS, MD',
    orderedAt: 'Today, 09:30 AM',
    status: 'Active MAR',
    urgent: false
  },
  {
    id: 'rx-106',
    patientId: 'pt-priya-deshmukh',
    patientName: 'Priya Deshmukh (Daughter)',
    medName: 'Propranolol',
    dosage: '20 mg',
    route: 'Oral',
    frequency: 'Daily (Morning)',
    indication: 'Migraine Prophylaxis',
    prescribingDoctor: 'Dr. Meera Nambiar, MD, DM',
    orderedAt: 'Today, 11:15 AM',
    status: 'Active MAR',
    urgent: false
  }
];

export const PENICILLIN_DRUGS = [
  'penicillin',
  'amoxicillin',
  'ampicillin',
  'piperacillin',
  'augmentin',
  'unasyn',
  'zosyn',
  'oxacillin',
  'nafcillin',
  'dicloxacillin'
];
