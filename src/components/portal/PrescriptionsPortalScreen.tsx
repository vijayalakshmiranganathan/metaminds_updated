import React, { useState } from 'react';
import { Medication, Patient } from '../../types/clinical';
import { LanguageCode, getTranslation } from '../../utils/i18n';

interface PrescriptionsPortalScreenProps {
  patient: Patient;
  language: LanguageCode;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

interface MedicineDetails {
  name: string;
  purpose: string;
  mechanism: string;
  instructions: string;
  commonSideEffects: string[];
  safetyWarnings: string;
}

const MEDICINE_EXPLANATIONS: Record<string, MedicineDetails> = {
  Metformin: {
    name: 'Metformin Hydrochloride (500 mg)',
    purpose: 'Lowers blood glucose (sugar) levels and improves cellular insulin sensitivity in Type 2 Diabetes.',
    mechanism: 'Reduces glucose production by the liver and increases peripheral glucose uptake in muscular tissues.',
    instructions: 'Take orally twice daily (BID) directly with meals to prevent stomach upset or nausea.',
    commonSideEffects: ['Mild stomach upset', 'Metallic taste', 'Nausea (minimized when taken with food)'],
    safetyWarnings: 'Do not skip meals while taking. Contact doctor if persistent vomiting or dehydration occurs.',
  },
  Amlodipine: {
    name: 'Amlodipine Besylate (5 mg)',
    purpose: 'Controls high blood pressure (hypertension) and prevents cardiovascular events or stroke.',
    mechanism: 'Calcium channel blocker that relaxes and widens arterial blood vessel walls, facilitating smoother blood flow.',
    instructions: 'Take once daily in the morning with or without food at the same time each day.',
    commonSideEffects: ['Mild ankle/foot swelling (edema)', 'Flushing', 'Headache during initial days'],
    safetyWarnings: 'Do not stop abruptly without consulting your cardiologist. Monitor morning blood pressure.',
  },
  Atorvastatin: {
    name: 'Atorvastatin Calcium (20 mg)',
    purpose: 'Reduces LDL (bad cholesterol) and triglycerides while raising HDL (good cholesterol), protecting arterial walls.',
    mechanism: 'Inhibits HMG-CoA reductase, the liver enzyme responsible for cholesterol synthesis.',
    instructions: 'Take once daily at bedtime (QHS) with water.',
    commonSideEffects: ['Mild muscle aches', 'Joint stiffness', 'Mild digestive discomfort'],
    safetyWarnings: 'Avoid excessive grapefruit juice consumption. Report unexplained muscle soreness promptly.',
  },
  'Salbutamol Inhaler': {
    name: 'Salbutamol / Albuterol Inhaler (100 mcg)',
    purpose: 'Rapidly relieves bronchial spasms, wheezing, and acute shortness of breath in bronchial asthma.',
    mechanism: 'Selective beta-2 adrenergic receptor agonist that dilates bronchial smooth muscles within minutes.',
    instructions: 'Inhale 1-2 puffs as needed (PRN) using spacer. Rinse mouth with water after inhalation.',
    commonSideEffects: ['Mild hand tremor', 'Temporary palpitation or rapid heart rate', 'Nervousness'],
    safetyWarnings: 'If breathlessness does not improve after 4 puffs, seek emergency medical care immediately.',
  },
  Rosuvastatin: {
    name: 'Rosuvastatin Calcium (10 mg)',
    purpose: 'Potent statin therapy for hyperlipidemia, reducing LDL and arterial plaque buildup.',
    mechanism: 'Competitive inhibitor of HMG-CoA reductase, upregulating hepatic LDL receptors.',
    instructions: 'Take once daily at bedtime with water.',
    commonSideEffects: ['Mild myalgia', 'Headache', 'Abdominal discomfort'],
    safetyWarnings: 'Report unusual muscle pain or dark-colored urine to your attending doctor.',
  },
  Montelukast: {
    name: 'Montelukast Sodium (10 mg)',
    purpose: 'Controls allergic asthma symptoms and prevents seasonal airway inflammation and rhinitis.',
    mechanism: 'Leukotriene D4 receptor antagonist preventing airway edema and smooth muscle contraction.',
    instructions: 'Take once daily in the evening, with or without food.',
    commonSideEffects: ['Vivid dreams or mild headache', 'Upper respiratory tract infection'],
    safetyWarnings: 'Continue taking regularly even when symptom-free. Not intended for acute rescue during attacks.',
  },
  Propranolol: {
    name: 'Propranolol Hydrochloride (20 mg)',
    purpose: 'Prophylaxis against chronic migraine attacks and vascular headache frequency reduction.',
    mechanism: 'Non-selective beta-adrenergic blocker regulating cranial vascular tone and cortical spreading depression.',
    instructions: 'Take once daily in the morning with food. Do not skip doses.',
    commonSideEffects: ['Mild fatigue initially', 'Cold extremities', 'Slow pulse rate'],
    safetyWarnings: 'Do not stop abruptly. Contraindicated in severe asthma.',
  },
  'CoQ10 & Vitamin B2 Complex': {
    name: 'Coenzyme Q10 & Riboflavin B2 Complex',
    purpose: 'Mitochondrial neuro-protection reducing oxidative stress and migraine recurrence.',
    mechanism: 'Enhances cellular ATP generation in neuronal mitochondria.',
    instructions: 'Take once daily with breakfast or lunch.',
    commonSideEffects: ['Bright yellow urine (harmless Riboflavin excretion)', 'Mild stomach fullness'],
    safetyWarnings: 'Store in cool dry place away from direct sunlight.',
  },
};

export const PrescriptionsPortalScreen: React.FC<PrescriptionsPortalScreenProps> = ({
  patient,
  language,
  onShowToast,
}) => {
  const [selectedMedDetail, setSelectedMedDetail] = useState<MedicineDetails | null>(null);
  const [remindersEnabled, setRemindersEnabled] = useState<Record<string, boolean>>({
    'med-1': true,
    'med-2': true,
    'med-3': true,
  });
  const [takenToday, setTakenToday] = useState<Record<string, boolean>>({
    'med-2': true, // Amlodipine 08:00 given
  });

  const t = (k: string) => getTranslation(language, k);

  const toggleReminder = (medId: string, medName: string) => {
    const newState = !remindersEnabled[medId];
    setRemindersEnabled((prev) => ({ ...prev, [medId]: newState }));
    onShowToast(
      newState
        ? `Daily alarm reminder scheduled for ${medName}`
        : `Reminder muted for ${medName}`
    );
  };

  const handleMarkTaken = (medId: string, medName: string) => {
    setTakenToday((prev) => ({ ...prev, [medId]: true }));
    onShowToast(`Marked ${medName} as taken for today! Recorded in lifelong health log.`);
  };

  return (
    <div className="flex flex-col w-full pb-8 px-3 pt-3 space-y-3 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#004357]">{t('prescriptions')}</h1>
          <p className="text-xs text-[#40484c]">
            Active E-Prescriptions & Medicine Guide • {patient.name}
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-[#e5eeff] text-[#004357] font-bold text-xs flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px] text-[#006141]">verified</span>
          {patient.attendingDoctor || 'Dr. Rajesh Sharma, MD'}
        </span>
      </div>

      {/* Symptoms & Visit Diagnosis Card (as specified in Slide 8) */}
      <div className="p-3.5 rounded-xl bg-white border border-[#e5eeff] shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-[#004357] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006398] text-[18px]">clinical_notes</span>
            Recorded Symptoms & Diagnoses • {patient.name}
          </span>
          <span className="text-[10px] text-[#70787d]">Visit Date: Today</span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#eff4ff] space-y-1">
          <div className="text-[11px] text-[#0b1c30]">
            <strong>Clinical Note Summary:</strong> {patient.recentNote?.content || 'Regular outpatient consultation and follow-up.'}
          </div>
          <div className="text-[10px] text-[#00472f] font-semibold flex items-center gap-1 pt-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Confirmed Diagnosis: {patient.diagnoses.map((d) => d.name).join(', ') || 'Routine Preventive Care'}
          </div>
        </div>

        {/* Allergy Alert on Prescription Sheet */}
        {patient.allergies.length > 0 && (
          <div className="p-2 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-[10px] font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">warning</span>
            <span>PRESCRIPTION CONTRAINDICATION ALERT: {patient.allergies.map((a) => `${a.allergen} (${a.reaction})`).join('; ')}</span>
          </div>
        )}
      </div>

      {/* Prescribed Medicines with Intake Timings & Purpose Links */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="font-bold text-sm text-[#0b1c30]">Daily Medicine Regimen ({patient.medications.length})</h2>
          <span className="text-[10px] text-[#006398] font-semibold">Tap for Purpose & Side Effects</span>
        </div>

        {patient.medications.map((med) => {
          const detail = MEDICINE_EXPLANATIONS[med.name] || {
            name: `${med.name} ${med.dosage}`,
            purpose: 'Prescribed for cardiac or metabolic maintenance.',
            mechanism: 'Follow prescribing physician directions.',
            instructions: `${med.route} • ${med.frequency}`,
            commonSideEffects: ['Consult pharmacist if unexpected symptoms occur'],
            safetyWarnings: 'Keep out of reach of children. Store in a dry place.',
          };

          const isTaken = takenToday[med.id];
          const hasReminder = remindersEnabled[med.id];

          return (
            <div
              key={med.id}
              className="p-3.5 rounded-xl bg-white border border-[#e5eeff] shadow-xs flex flex-col gap-2.5 hover:border-[#93ccff] transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#cce5ff] text-[#001d31] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[20px]">pill</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-sm text-[#0b1c30]">{med.name}</strong>
                      <span className="font-bold text-xs text-[#006398]">{med.dosage}</span>
                    </div>
                    <div className="text-[11px] text-[#40484c] mt-0.5">
                      {med.route} • {med.frequency}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMedDetail(detail)}
                  className="px-2.5 py-1 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006398] font-bold text-[10px] flex items-center gap-0.5 transition-colors"
                >
                  <span>Why take this?</span>
                  <span className="material-symbols-outlined text-[13px]">info</span>
                </button>
              </div>

              {/* Intake Timings Breakdown (Morning, Afternoon, Night) */}
              <div className="p-2 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] grid grid-cols-3 gap-1.5 text-center text-[10px]">
                <div
                  className={`p-1 rounded-md font-semibold ${
                    med.name === 'Amlodipine' || med.name === 'Metformin'
                      ? 'bg-[#e5eeff] text-[#004357]'
                      : 'text-[#70787d]'
                  }`}
                >
                  <span className="block text-[8px] uppercase">Morning</span>
                  <span>{med.name === 'Amlodipine' || med.name === 'Metformin' ? '1 Tab (08:00)' : '—'}</span>
                </div>
                <div
                  className={`p-1 rounded-md font-semibold ${
                    med.name === 'Metformin'
                      ? 'bg-[#e5eeff] text-[#004357]'
                      : 'text-[#70787d]'
                  }`}
                >
                  <span className="block text-[8px] uppercase">Afternoon</span>
                  <span>{med.name === 'Metformin' ? '1 Tab (12:00)' : '—'}</span>
                </div>
                <div
                  className={`p-1 rounded-md font-semibold ${
                    med.name === 'Atorvastatin'
                      ? 'bg-[#e5eeff] text-[#004357]'
                      : 'text-[#70787d]'
                  }`}
                >
                  <span className="block text-[8px] uppercase">Night / Bed</span>
                  <span>{med.name === 'Atorvastatin' ? '1 Tab (21:00)' : '—'}</span>
                </div>
              </div>

              {/* Purpose Excerpt & Reminders */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#40484c] truncate max-w-[200px]">
                  <strong>Purpose:</strong> {detail.purpose}
                </span>

                <div className="flex items-center gap-2">
                  {/* Daily Alarm Reminder Toggle */}
                  <button
                    onClick={() => toggleReminder(med.id, med.name)}
                    className={`p-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                      hasReminder
                        ? 'bg-[#eff4ff] text-[#006398]'
                        : 'text-[#70787d] hover:bg-[#eff4ff]'
                    }`}
                    title="Toggle daily smartphone alarm alert"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {hasReminder ? 'alarm_on' : 'alarm_off'}
                    </span>
                    <span>{hasReminder ? 'Alert On' : 'Muted'}</span>
                  </button>

                  {/* Mark as Taken */}
                  <button
                    onClick={() => handleMarkTaken(med.id, med.name)}
                    disabled={isTaken}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      isTaken
                        ? 'bg-[#6ffbbe] text-[#002113] cursor-default'
                        : 'bg-[#004357] hover:bg-[#0d5c75] text-white active:scale-98'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {isTaken ? 'done_all' : 'check'}
                    </span>
                    <span>{isTaken ? 'Taken' : 'Take Dose'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MEDICINE PURPOSE & DETAILS MODAL */}
      {selectedMedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col overflow-hidden">
            <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-[#004357]">{selectedMedDetail.name}</h2>
                <span className="text-[10px] text-[#006398] font-bold uppercase tracking-wider">Patient Drug Education Guide</span>
              </div>
              <button
                onClick={() => setSelectedMedDetail(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#70787d] hover:bg-[#dce9ff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs overflow-y-auto max-h-[75vh]">
              <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
                <strong className="text-xs text-[#004357] block mb-1">What is this medicine for?</strong>
                <p className="text-[#0b1c30] leading-relaxed">{selectedMedDetail.purpose}</p>
              </div>

              <div>
                <strong className="text-xs text-[#0b1c30] block mb-0.5">How it works inside your body:</strong>
                <p className="text-[#40484c] leading-relaxed">{selectedMedDetail.mechanism}</p>
              </div>

              <div>
                <strong className="text-xs text-[#0b1c30] block mb-0.5">Food & Dietary Instructions:</strong>
                <p className="text-[#40484c] leading-relaxed">{selectedMedDetail.instructions}</p>
              </div>

              <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff]">
                <strong className="text-xs text-[#0b1c30] block mb-1">Potential Mild Side Effects:</strong>
                <ul className="list-disc pl-4 text-[11px] text-[#40484c] space-y-0.5">
                  {selectedMedDetail.commonSideEffects.map((se, i) => (
                    <li key={i}>{se}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-xl bg-[#ffdad6]/60 border border-[#ba1a1a]/20 text-[#93000a] text-[11px]">
                <strong>Important Warning:</strong> {selectedMedDetail.safetyWarnings}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedMedDetail(null)}
                  className="px-5 py-2 rounded-xl bg-[#004357] text-white font-bold text-xs"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
