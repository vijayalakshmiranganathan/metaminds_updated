import React, { useState } from 'react';
import { Medication, Patient } from '../../types/clinical';
import {
  LanguageCode,
  getTranslation,
  getLocalizedMedicineExplanation,
  LocalizedMedicineDetails,
} from '../../utils/i18n';

interface PrescriptionsPortalScreenProps {
  patient: Patient;
  language: LanguageCode;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

export const PrescriptionsPortalScreen: React.FC<PrescriptionsPortalScreenProps> = ({
  patient,
  language,
  onShowToast,
}) => {
  const [selectedMedDetail, setSelectedMedDetail] = useState<LocalizedMedicineDetails | null>(null);
  const [remindersEnabled, setRemindersEnabled] = useState<Record<string, boolean>>({
    'med-1': true,
    'med-2': true,
    'med-3': true,
  });
  const [takenToday, setTakenToday] = useState<Record<string, boolean>>({
    'med-2': true, // Amlodipine initial state
  });

  const t = (k: string) => getTranslation(language, k);

  const toggleReminder = (medId: string, medName: string) => {
    const newState = !remindersEnabled[medId];
    setRemindersEnabled((prev) => ({ ...prev, [medId]: newState }));
    onShowToast(
      newState
        ? `${t('alert_on')}: ${medName}`
        : `${t('muted')}: ${medName}`,
      'info'
    );
  };

  /**
   * Bidirectional dose toggle:
   * Clicking "Take Dose" changes to "Taken"
   * Clicking "Taken" changes back to "Take Dose"
   */
  const handleToggleTaken = (medId: string, medName: string) => {
    const isCurrentlyTaken = !!takenToday[medId];
    const newStatus = !isCurrentlyTaken;

    setTakenToday((prev) => ({ ...prev, [medId]: newStatus }));

    if (newStatus) {
      onShowToast(
        language === 'hi'
          ? `${medName} को 'लिया गया' चिह्नित किया गया! स्वास्थ्य लॉग में दर्ज।`
          : language === 'mr'
          ? `${medName} औषध घेतले म्हणून नोंदवले! आरोग्य लॉगमध्ये समाविष्ट.`
          : `Marked ${medName} as taken! Recorded in lifelong health log.`,
        'success'
      );
    } else {
      onShowToast(
        language === 'hi'
          ? `${medName} की स्थिति वापस 'खुराक लें' में बदल दी गई।`
          : language === 'mr'
          ? `${medName} औषधाची स्थिती पुन्हा 'मात्रा घ्या' वर सेट केली.`
          : `Reverted ${medName} status back to 'Take Dose' (due).`,
        'info'
      );
    }
  };

  return (
    <div className="flex flex-col w-full pb-8 px-3 pt-3 space-y-3 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#004357]">{t('prescriptions')}</h1>
          <p className="text-xs text-[#40484c]">
            {t('active_rx_guide')} • {patient.name}
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-[#e5eeff] text-[#004357] font-bold text-xs flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px] text-[#006141]">verified</span>
          {patient.attendingDoctor || 'Dr. Rajesh Sharma, MD'}
        </span>
      </div>

      {/* Symptoms & Visit Diagnosis Card */}
      <div className="p-3.5 rounded-xl bg-white border border-[#e5eeff] shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-[#004357] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006398] text-[18px]">clinical_notes</span>
            {t('recorded_symptoms')} • {patient.name}
          </span>
          <span className="text-[10px] text-[#70787d]">
            {t('visit_date')}: {t('today')}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#eff4ff] space-y-1">
          <div className="text-[11px] text-[#0b1c30]">
            <strong>{t('clinical_note_summary')}:</strong>{' '}
            {patient.recentNote?.content || 'Regular outpatient consultation and follow-up.'}
          </div>
          <div className="text-[10px] text-[#00472f] font-semibold flex items-center gap-1 pt-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            {t('confirmed_diagnosis')}: {patient.diagnoses.map((d) => d.name).join(', ') || 'Routine Preventive Care'}
          </div>
        </div>

        {/* Allergy Alert on Prescription Sheet */}
        {patient.allergies.length > 0 && (
          <div className="p-2 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-[10px] font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">warning</span>
            <span>
              {t('rx_contraindication_alert')}:{' '}
              {patient.allergies.map((a) => `${a.allergen} (${a.reaction})`).join('; ')}
            </span>
          </div>
        )}
      </div>

      {/* Prescribed Medicines with Intake Timings & Purpose Links */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="font-bold text-sm text-[#0b1c30]">
            {t('daily_regimen')} ({patient.medications.length})
          </h2>
          <span className="text-[10px] text-[#006398] font-semibold">
            {t('tap_for_purpose')}
          </span>
        </div>

        {patient.medications.map((med) => {
          const detail = getLocalizedMedicineExplanation(language, med.name, med.dosage);
          const isTaken = !!takenToday[med.id];
          const hasReminder = !!remindersEnabled[med.id];

          return (
            <div
              key={med.id}
              className={`p-3.5 rounded-xl bg-white border transition-all flex flex-col gap-2.5 shadow-xs ${
                isTaken ? 'border-[#86efac]/80 bg-[#f9fefb]' : 'border-[#e5eeff] hover:border-[#93ccff]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${
                      isTaken ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#cce5ff] text-[#001d31]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isTaken ? 'check_circle' : 'pill'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-sm text-[#0b1c30]">{med.name}</strong>
                      <span className="font-bold text-xs text-[#006398]">{med.dosage}</span>
                      {isTaken && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#dcfce7] text-[#166534] text-[9px] font-bold">
                          ✓ {t('taken')}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#40484c] mt-0.5">
                      {med.route} • {med.frequency}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMedDetail(detail)}
                  className="px-2.5 py-1 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006398] font-bold text-[10px] flex items-center gap-0.5 transition-colors cursor-pointer"
                >
                  <span>{t('why_take_this')}</span>
                  <span className="material-symbols-outlined text-[13px]">info</span>
                </button>
              </div>

              {/* Intake Timings Breakdown (Morning, Afternoon, Night) */}
              <div className="p-2 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] grid grid-cols-3 gap-1.5 text-center text-[10px]">
                <div
                  className={`p-1 rounded-md font-semibold ${
                    med.name.includes('Amlodipine') || med.name.includes('Metformin')
                      ? 'bg-[#e5eeff] text-[#004357]'
                      : 'text-[#70787d]'
                  }`}
                >
                  <span className="block text-[8px] uppercase">{t('morning')}</span>
                  <span>
                    {med.name.includes('Amlodipine') || med.name.includes('Metformin')
                      ? '1 Tab (08:00)'
                      : '—'}
                  </span>
                </div>
                <div
                  className={`p-1 rounded-md font-semibold ${
                    med.name.includes('Metformin')
                      ? 'bg-[#e5eeff] text-[#004357]'
                      : 'text-[#70787d]'
                  }`}
                >
                  <span className="block text-[8px] uppercase">{t('afternoon')}</span>
                  <span>{med.name.includes('Metformin') ? '1 Tab (12:00)' : '—'}</span>
                </div>
                <div
                  className={`p-1 rounded-md font-semibold ${
                    med.name.includes('Atorvastatin')
                      ? 'bg-[#e5eeff] text-[#004357]'
                      : 'text-[#70787d]'
                  }`}
                >
                  <span className="block text-[8px] uppercase">{t('night')}</span>
                  <span>{med.name.includes('Atorvastatin') ? '1 Tab (21:00)' : '—'}</span>
                </div>
              </div>

              {/* Purpose Excerpt & Reminders */}
              <div className="flex items-center justify-between text-[11px] flex-wrap gap-2">
                <span className="text-[#40484c] truncate max-w-[180px] sm:max-w-[240px]">
                  <strong>{t('purpose')}:</strong> {detail.purpose}
                </span>

                <div className="flex items-center gap-2">
                  {/* Daily Alarm Reminder Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleReminder(med.id, med.name)}
                    className={`p-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      hasReminder
                        ? 'bg-[#eff4ff] text-[#006398]'
                        : 'text-[#70787d] hover:bg-[#eff4ff]'
                    }`}
                    title="Toggle daily alarm reminder"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {hasReminder ? 'alarm_on' : 'alarm_off'}
                    </span>
                    <span>{hasReminder ? t('alert_on') : t('muted')}</span>
                  </button>

                  {/* Bidirectional Take Dose / Taken Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleTaken(med.id, med.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs ${
                      isTaken
                        ? 'bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#166534] border border-[#86efac]'
                        : 'bg-[#004357] hover:bg-[#0d5c75] text-white'
                    }`}
                    title={
                      isTaken
                        ? 'Dose is marked taken. Click again to revert to Take Dose'
                        : 'Click to mark dose as taken'
                    }
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isTaken ? 'task_alt' : 'check'}
                    </span>
                    <span>{isTaken ? t('taken') : t('take_dose')}</span>
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
                <span className="text-[10px] text-[#006398] font-bold uppercase tracking-wider">
                  {t('patient_drug_guide')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMedDetail(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#70787d] hover:bg-[#dce9ff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs overflow-y-auto max-h-[75vh]">
              <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
                <strong className="text-xs text-[#004357] block mb-1">
                  {t('what_is_med_for')}
                </strong>
                <p className="text-[#0b1c30] leading-relaxed">{selectedMedDetail.purpose}</p>
              </div>

              <div>
                <strong className="text-xs text-[#0b1c30] block mb-0.5">
                  {t('how_it_works')}
                </strong>
                <p className="text-[#40484c] leading-relaxed">{selectedMedDetail.mechanism}</p>
              </div>

              <div>
                <strong className="text-xs text-[#0b1c30] block mb-0.5">
                  {t('food_instructions')}
                </strong>
                <p className="text-[#40484c] leading-relaxed">{selectedMedDetail.instructions}</p>
              </div>

              <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff]">
                <strong className="text-xs text-[#0b1c30] block mb-1">
                  {t('potential_side_effects')}
                </strong>
                <ul className="list-disc pl-4 text-[11px] text-[#40484c] space-y-0.5">
                  {selectedMedDetail.commonSideEffects.map((se, i) => (
                    <li key={i}>{se}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-xl bg-[#ffdad6]/60 border border-[#ba1a1a]/20 text-[#93000a] text-[11px]">
                <strong>{t('important_warning')}</strong> {selectedMedDetail.safetyWarnings}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedMedDetail(null)}
                  className="px-5 py-2 rounded-xl bg-[#004357] text-white font-bold text-xs cursor-pointer hover:bg-[#0d5c75]"
                >
                  {t('understood')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
