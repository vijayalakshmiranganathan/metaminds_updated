import React, { useState, useRef, useEffect } from 'react';
import { ClinicalNote, DoctorAuth, Medication, Patient } from '../types/clinical';
import { LanguageCode, getTranslation } from '../utils/i18n';

interface ChartScreenProps {
  patient: Patient;
  appRole?: 'doctor' | 'patient' | 'wellness';
  language?: LanguageCode;
  doctorAuth?: DoctorAuth;
  onOpenDoctorLogin?: () => void;
  onToggleDiagnosisPrivacy?: (dxId: string) => void;
  onOpenPrivacyModal?: () => void;
  onOpenNewRx: () => void;
  onOpenUpdateVitals: () => void;
  onOpenAdminister: (med: Medication) => void;
  onOpenAddAddendum: (note: ClinicalNote) => void;
  onOpenAllNotes: () => void;
  onOpenAllergyDetails: () => void;
  onOpenAddDiagnosis: () => void;
  onOpenWellness?: () => void;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

export const ChartScreen: React.FC<ChartScreenProps> = ({
  patient,
  appRole = 'patient',
  language = 'en',
  doctorAuth,
  onOpenDoctorLogin,
  onToggleDiagnosisPrivacy,
  onOpenPrivacyModal,
  onOpenNewRx,
  onOpenUpdateVitals,
  onOpenAdminister,
  onOpenAddAddendum,
  onOpenAllNotes,
  onOpenAllergyDetails,
  onOpenAddDiagnosis,
  onOpenWellness,
  onShowToast,
}) => {
  const t = (k: string) => getTranslation(language, k);
  const [activeTab, setActiveTab] = useState<'notes' | 'diagnoses' | 'medications' | 'labs'>('notes');
  const [activeLabPanel, setActiveLabPanel] = useState<number>(0);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setAvatarError(false);
    setActiveLabPanel(0);
  }, [patient.id]);

  const notesRef = useRef<HTMLDivElement>(null);
  const diagnosesRef = useRef<HTMLDivElement>(null);
  const medicationsRef = useRef<HTMLDivElement>(null);
  const labsRef = useRef<HTMLDivElement>(null);

  const switchTab = (tabId: 'notes' | 'diagnoses' | 'medications' | 'labs') => {
    setActiveTab(tabId);
    let targetRef: React.RefObject<HTMLDivElement | null> | null = null;
    if (tabId === 'notes') targetRef = notesRef;
    if (tabId === 'diagnoses') targetRef = diagnosesRef;
    if (tabId === 'medications') targetRef = medicationsRef;
    if (tabId === 'labs') targetRef = labsRef;

    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentLab = patient.labs[activeLabPanel] || patient.labs[0];

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Doctor Verification Status Banner in Clinician Mode */}
      {appRole === 'doctor' && (
        <div className="mx-3 mt-3 p-3 rounded-xl border flex items-center justify-between shadow-xs transition-all bg-white border-[#dce9ff]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                doctorAuth?.isVerified
                  ? 'bg-[#dcfce7] text-[#166534]'
                  : 'bg-[#ffdad6] text-[#ba1a1a] animate-pulse'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {doctorAuth?.isVerified ? 'verified' : 'gpp_maybe'}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-[#0b1c30]">
                  {doctorAuth?.name || 'Dr. Rajesh Sharma, MD'}
                </span>
                {doctorAuth?.isVerified ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] text-[10px] font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    NMC Verified
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold">
                    ⚠️ Unverified Session
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#40484c] truncate">
                {doctorAuth?.isVerified
                  ? `Reg: ${doctorAuth.nmcRegNo} • ${doctorAuth.stateMedicalCouncil}`
                  : 'Orders and SOAP signature locked pending National Medical Commission verification'}
              </p>
            </div>
          </div>

          {onOpenDoctorLogin && (
            <button
              onClick={onOpenDoctorLogin}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ml-2 cursor-pointer ${
                doctorAuth?.isVerified
                  ? 'bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004357]'
                  : 'bg-[#ba1a1a] hover:bg-[#93000a] text-white shadow-xs'
              }`}
            >
              {doctorAuth?.isVerified ? 'Switch Doctor' : 'Verify Login'}
            </button>
          )}
        </div>
      )}

      {/* Wellness & Preventive Proactive Banner */}
      {onOpenWellness && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-[#6ffbbe]/30 border border-[#4edea3] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00472f] text-[22px]">spa</span>
            <div>
              <strong className="text-xs text-[#002113] block">Healthy Living & Prevention Hub</strong>
              <span className="text-[10px] text-[#00472f]">6-Month checkups, balanced diet, sleep, exercise, vaccines & insurance perks</span>
            </div>
          </div>
          <button
            onClick={onOpenWellness}
            className="px-2.5 py-1.5 rounded-lg bg-[#00472f] text-white font-bold text-[11px] hover:bg-[#006141] transition-colors whitespace-nowrap active:scale-98"
          >
            Open Wellness
          </button>
        </div>
      )}

      {/* Patient Header Summary (Clean Medical Precision) */}
      <section className="px-3 pt-3">
        <div className="bg-[#ffffff] rounded-xl p-3 shadow-xs relative overflow-hidden border border-[#e5eeff]">
          {/* Decorative Clinical Glow Accent */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#5bb8fe]/15 blur-2xl pointer-events-none"></div>

          {/* Top Row: Avatar, Identity & Room Tag */}
          <div className="flex items-start justify-between gap-2 relative">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                {!avatarError && patient.photoUrl ? (
                  <img
                    className="w-14 h-14 rounded-xl object-cover shadow-xs border border-[#dce9ff]"
                    alt={`Portrait of ${patient.name}`}
                    src={patient.photoUrl}
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#004357] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                    {patient.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#ffffff] shadow-xs text-[#00472f] font-label-sm text-[11px] font-bold flex items-center gap-0.5 border border-[#e5eeff]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] inline-block animate-pulse"></span>
                  {patient.bloodType}
                </span>
              </div>
              <div className="min-w-0 flex flex-col">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="font-headline-sm text-[17px] text-[#0b1c30] font-semibold truncate">
                    {patient.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#40484c] font-label-sm text-[11px]">
                    {patient.age}y • {patient.gender}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-label-md text-[12px] text-[#40484c] tracking-normal font-medium">
                    MRN:{' '}
                    <strong className="text-[#0b1c30] font-semibold font-body-sm text-[13px] tabular-nums">
                      {patient.mrn}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Room / Bed location badge */}
            <div className="shrink-0 flex flex-col items-end">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#e5eeff] text-[#004357] font-label-md text-[12px] shadow-xs">
                <span className="material-symbols-outlined text-[16px]">meeting_room</span>
                <span className="font-bold">{patient.room}</span>
              </div>
              <span className="font-label-sm text-[11px] text-[#40484c] mt-1 font-medium">
                {patient.department}
              </span>
            </div>
          </div>

          {/* Triage & Safety Alert Badges Ribbon */}
          <div className="mt-3 pt-1 flex flex-wrap items-center gap-1.5">
            {/* Penicillin Allergy badge with clickable details */}
            <button
              type="button"
              onClick={onOpenAllergyDetails}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb4ab] font-label-sm text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
              title="Click to view full allergy documentation"
            >
              <span
                className="material-symbols-outlined text-[15px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
              <span>SEVERE PENICILLIN ALLERGY</span>
            </button>

            {/* NPO badge */}
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#dce9ff] text-[#40484c] font-label-sm text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[15px]">no_food</span>
              <span>NPO Post-Midnight</span>
            </div>

            {/* Fall Risk badge */}
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#e5eeff] text-[#00476e] font-label-sm text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[15px]">transfer_within_a_station</span>
              <span>Fall Risk</span>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Telemetry & Vitals Ribbon */}
      <section className="px-3 mt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#004357] text-[18px]">monitor_heart</span>
            <span className="font-label-md text-[12px] text-[#0b1c30] font-bold uppercase tracking-wider">
              {t('current_telemetry')}
            </span>
          </div>
          <button
            onClick={() => onShowToast('Telemetry stream refreshed: telemetry box channel #4 online')}
            className="font-label-sm text-[11px] text-[#40484c] hover:text-[#006398] flex items-center gap-1 transition-colors"
          >
            <span>{patient.vitals.syncTimeAgo}</span>
            <span className="material-symbols-outlined text-[14px]">refresh</span>
          </button>
        </div>

        {/* High-Density Metric Grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {/* Blood Pressure */}
          <div
            onClick={onOpenUpdateVitals}
            className="bg-[#ffffff] rounded-xl p-2.5 flex flex-col justify-between shadow-xs border border-[#e5eeff] cursor-pointer hover:border-[#006398]/40 transition-colors"
            title="Click to update vitals"
          >
            <div className="flex items-center justify-between text-[#40484c]">
              <span className="font-label-sm text-[11px] uppercase tracking-wide">Blood Pressure</span>
              <span className="material-symbols-outlined text-[#006141] text-[16px]">trending_flat</span>
            </div>
            <div className="my-1">
              <span className="font-data-metric text-[22px] text-[#0b1c30] tabular-nums font-bold">
                {patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic}
              </span>
              <span className="font-label-sm text-[11px] text-[#40484c] ml-0.5 font-medium">mmHg</span>
            </div>
            <span className="font-label-sm text-[11px] text-[#00472f] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
              {patient.vitals.bpStatus}
            </span>
          </div>

          {/* Heart Rate */}
          <div
            onClick={onOpenUpdateVitals}
            className="bg-[#ffffff] rounded-xl p-2.5 flex flex-col justify-between shadow-xs border border-[#e5eeff] cursor-pointer hover:border-[#006398]/40 transition-colors"
            title="Click to update vitals"
          >
            <div className="flex items-center justify-between text-[#40484c]">
              <span className="font-label-sm text-[11px] uppercase tracking-wide">Pulse (HR)</span>
              <span className="material-symbols-outlined text-[#006398] text-[16px]">ecg_heart</span>
            </div>
            <div className="my-1">
              <span className="font-data-metric text-[22px] text-[#0b1c30] tabular-nums font-bold">
                {patient.vitals.pulse}
              </span>
              <span className="font-label-sm text-[11px] text-[#40484c] ml-0.5 font-medium">bpm</span>
            </div>
            <span className="font-label-sm text-[11px] text-[#006398] font-semibold truncate">
              {patient.vitals.rhythm}
            </span>
          </div>

          {/* SpO2 */}
          <div
            onClick={onOpenUpdateVitals}
            className="bg-[#ffffff] rounded-xl p-2.5 flex flex-col justify-between shadow-xs border border-[#e5eeff] cursor-pointer hover:border-[#006398]/40 transition-colors"
            title="Click to update vitals"
          >
            <div className="flex items-center justify-between text-[#40484c]">
              <span className="font-label-sm text-[11px] uppercase tracking-wide">SpO2 Oxygen</span>
              <span className="material-symbols-outlined text-[#006141] text-[16px]">air</span>
            </div>
            <div className="my-1">
              <span className="font-data-metric text-[22px] text-[#0b1c30] tabular-nums font-bold">
                {patient.vitals.spO2}%
              </span>
            </div>
            <span className="font-label-sm text-[11px] text-[#00472f] font-semibold">
              {patient.vitals.spO2Mode}
            </span>
          </div>

          {/* Glucose */}
          <div
            onClick={onOpenUpdateVitals}
            className="bg-[#ffffff] rounded-xl p-2.5 flex flex-col justify-between shadow-xs border border-[#e5eeff] cursor-pointer hover:border-[#006398]/40 transition-colors"
            title="Click to update vitals"
          >
            <div className="flex items-center justify-between text-[#40484c]">
              <span className="font-label-sm text-[11px] uppercase tracking-wide">Blood Glucose</span>
              <span className="material-symbols-outlined text-[#40484c] text-[16px]">water_drop</span>
            </div>
            <div className="my-1">
              <span className="font-data-metric text-[22px] text-[#0b1c30] tabular-nums font-bold">
                {patient.vitals.glucose}
              </span>
              <span className="font-label-sm text-[11px] text-[#40484c] ml-0.5 font-medium">mg/dL</span>
            </div>
            <span className="font-label-sm text-[11px] text-[#40484c] font-medium truncate">
              {patient.vitals.glucoseState}
            </span>
          </div>
        </div>
      </section>

      {/* Segmented Chart Navigation Bar */}
      <section className="px-3 mt-4">
        <div
          className="bg-[#dce9ff] p-1 rounded-xl flex items-center justify-between gap-1 overflow-x-auto shadow-inner no-scrollbar"
          id="chart-tabs"
        >
          <button
            className={`flex-1 py-2 px-2.5 rounded-lg font-label-md text-[12px] text-center transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-[#ffffff] text-[#004357] shadow-xs font-semibold'
                : 'text-[#40484c] font-medium hover:text-[#0b1c30]'
            }`}
            onClick={() => switchTab('notes')}
          >
            {t('clinical_notes_tab')}
          </button>
          <button
            className={`flex-1 py-2 px-2.5 rounded-lg font-label-md text-[12px] text-center transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'diagnoses'
                ? 'bg-[#ffffff] text-[#004357] shadow-xs font-semibold'
                : 'text-[#40484c] font-medium hover:text-[#0b1c30]'
            }`}
            onClick={() => switchTab('diagnoses')}
          >
            {t('diagnoses_tab')}
          </button>
          <button
            className={`flex-1 py-2 px-2.5 rounded-lg font-label-md text-[12px] text-center transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'medications'
                ? 'bg-[#ffffff] text-[#004357] shadow-xs font-semibold'
                : 'text-[#40484c] font-medium hover:text-[#0b1c30]'
            }`}
            onClick={() => switchTab('medications')}
          >
            {t('medications_tab')}
          </button>
          <button
            className={`flex-1 py-2 px-2.5 rounded-lg font-label-md text-[12px] text-center transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'labs'
                ? 'bg-[#ffffff] text-[#004357] shadow-xs font-semibold'
                : 'text-[#40484c] font-medium hover:text-[#0b1c30]'
            }`}
            onClick={() => switchTab('labs')}
          >
            {t('labs_tab')}
          </button>
        </div>
      </section>

      {/* Tab Content Panel: Dynamic clinical blocks */}
      <div className="px-3 mt-3 space-y-3">
        {/* Section 1: Attending Clinical Note */}
        <div ref={notesRef} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-[17px] text-[#0b1c30] font-semibold">
              Recent Clinical Note
            </h2>
            <button
              onClick={onOpenAllNotes}
              className="font-label-sm text-[11px] text-[#006398] font-semibold cursor-pointer flex items-center gap-0.5 hover:underline"
            >
              <span>View All ({patient.pastNotes.length + 1})</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="bg-[#ffffff] rounded-xl p-3 shadow-xs relative border border-[#e5eeff]">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#0d5c75] flex items-center justify-center text-white font-bold shadow-xs">
                  {patient.recentNote.authorName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-label-lg text-[14px] text-[#0b1c30] font-bold">
                      {patient.recentNote.authorName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#e5eeff] text-[#004357] font-label-sm text-[11px] font-semibold">
                      {patient.recentNote.authorRole}
                    </span>
                  </div>
                  <span className="font-label-sm text-[11px] text-[#40484c]">
                    {patient.recentNote.department} • {patient.recentNote.timestamp}
                  </span>
                </div>
              </div>
              <button
                onClick={onOpenAllNotes}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#40484c] hover:bg-[#e5eeff] transition-colors"
                title="Options"
              >
                <span className="material-symbols-outlined text-[18px]">more_vert</span>
              </button>
            </div>

            <div className="mt-2.5 p-3 rounded-lg bg-[#eff4ff] text-[#0b1c30] font-body-md text-[14px] leading-relaxed">
              {patient.recentNote.content}
            </div>

            {/* Note addenda if present */}
            {patient.recentNote.addenda && patient.recentNote.addenda.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {patient.recentNote.addenda.map((ad) => (
                  <div key={ad.id} className="p-2.5 rounded-lg bg-[#ffffff] border border-[#dce9ff] text-xs">
                    <div className="flex justify-between items-center text-[10px] text-[#70787d] mb-1">
                      <strong className="text-[#004357]">Addendum • {ad.authorName} ({ad.authorRole})</strong>
                      <span>{ad.timestamp}</span>
                    </div>
                    <p className="text-[#0b1c30] leading-normal">{ad.content}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#f0f4ff]">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 font-label-sm text-[11px] px-2 py-0.5 rounded bg-[#e5eeff] text-[#40484c] font-medium">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Signed electronically
                </span>
                <span className="font-label-sm text-[11px] text-[#40484c]">
                  SOAP Note #{patient.recentNote.noteNumber}
                </span>
              </div>
              <button
                onClick={() => onOpenAddAddendum(patient.recentNote)}
                className="font-label-md text-[12px] font-semibold text-[#006398] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_comment</span>
                <span>Add Addendum</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Active Diagnoses Card (With Patient Data Sovereignty / Family Privacy Masking) */}
        <div ref={diagnosesRef} className="flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-headline-sm text-[17px] text-[#0b1c30] font-semibold">Active Diagnoses</h2>
              {patient.diagnoses.some((d) => d.isPrivate) && (
                <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  Hidden from Family
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Family Privacy Button */}
              {onOpenPrivacyModal && (
                <button
                  type="button"
                  onClick={onOpenPrivacyModal}
                  className="px-2 py-1 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004357] text-[11px] font-bold flex items-center gap-1 transition-colors border border-[#dce9ff] cursor-pointer"
                  title="Manage diagnosis visibility for family members (DPDP Act 2023)"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#006398]">family_restroom</span>
                  <span>Family Privacy</span>
                </button>
              )}

              {appRole === 'doctor' && (
                <button
                  onClick={onOpenAddDiagnosis}
                  className="text-[11px] text-[#006398] font-bold hover:underline flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span> Add ICD-10
                </button>
              )}
            </div>
          </div>

          <div className="bg-[#ffffff] rounded-xl p-2.5 shadow-xs space-y-2 border border-[#e5eeff]">
            {patient.diagnoses.map((dx) => {
              const isManaged = dx.status === 'Managed';
              const isChronic = dx.status === 'Chronic';

              return (
                <div
                  key={dx.id}
                  onClick={() => onShowToast(`ICD-10 ${dx.icd10}: ${dx.name} - ${dx.details || 'Active problem list'}`)}
                  className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    dx.isPrivate
                      ? 'bg-[#fff5f5] hover:bg-[#fee2e2]/60 border border-[#fecaca]'
                      : 'bg-[#eff4ff] hover:bg-[#dce9ff]/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 shrink-0 ${
                        dx.isPrivate ? 'bg-[#fee2e2] text-[#991b1b]' : 'bg-[#e5eeff] text-[#004357]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {dx.isPrivate ? 'lock' : dx.icon || 'cardiology'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-label-lg text-[14px] font-bold truncate ${
                            dx.isPrivate ? 'text-[#991b1b]' : 'text-[#0b1c30]'
                          }`}
                        >
                          {dx.name}
                        </span>

                        {isManaged ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] font-label-sm text-[11px] font-semibold">
                            Managed
                          </span>
                        ) : isChronic ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#00476e] font-label-sm text-[11px] font-semibold">
                            Chronic
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#40484c] font-label-sm text-[11px]">
                            {dx.statusBadgeColor || dx.status}
                          </span>
                        )}

                        {/* Family Privacy Status Indicator */}
                        {dx.isPrivate ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#991b1b] font-label-sm text-[10px] font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[11px]">lock</span>
                            Hidden from Family
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] font-label-sm text-[10px] font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[11px]">visibility</span>
                            Visible to Family
                          </span>
                        )}
                      </div>

                      <span className="font-label-sm text-[11px] text-[#40484c] block">
                        ICD-10: {dx.icd10} • Onset: {dx.onsetYear}
                        {dx.details && dx.details.includes('HbA1c') && ' • Last HbA1c: 6.8%'}
                        {dx.name.includes('Osteoarthritis') && ' • Monitored'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {/* Patient direct toggle button */}
                    {appRole === 'patient' && onToggleDiagnosisPrivacy && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleDiagnosisPrivacy(dx.id);
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          dx.isPrivate
                            ? 'bg-[#004357] text-white hover:bg-[#003140]'
                            : 'bg-white border border-[#dce9ff] text-[#991b1b] hover:bg-[#fff5f5]'
                        }`}
                        title={dx.isPrivate ? 'Click to show this diagnosis to family members' : 'Click to hide this diagnosis from family members'}
                      >
                        {dx.isPrivate ? 'Show to Family' : 'Hide from Family'}
                      </button>
                    )}
                    <span className="material-symbols-outlined text-[#40484c] text-[20px]">
                      chevron_right
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Active Medications & MAR */}
        <div ref={medicationsRef} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h2 className="font-headline-sm text-[17px] text-[#0b1c30] font-semibold">
                Active Medications ({patient.medications.length})
              </h2>
              <span className="w-2 h-2 rounded-full bg-[#006398]"></span>
            </div>
            <button
              onClick={() => onShowToast('eMAR Timeline: 08:00 Amlodipine Given, 12:00 Metformin Pending, 21:00 Atorvastatin Scheduled')}
              className="font-label-sm text-[11px] text-[#006398] font-semibold hover:underline cursor-pointer"
            >
              MAR History
            </button>
          </div>

          <div className="space-y-2">
            {patient.medications.map((med) => {
              const isGiven = med.status === 'given';
              const isDue = med.status === 'due';

              return (
                <div
                  key={med.id}
                  className="bg-[#ffffff] rounded-xl p-2.5 shadow-xs flex items-center justify-between border border-[#e5eeff]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#cce5ff] text-[#001d31] flex items-center justify-center font-bold shrink-0">
                      <span className="material-symbols-outlined text-[20px]">pill</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-label-lg text-[14px] text-[#0b1c30] font-bold">
                          {med.name}
                        </span>
                        <span className="font-label-md text-[12px] font-semibold text-[#006398]">
                          {med.dosage}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="font-label-sm text-[11px] text-[#40484c]">
                          {med.route} • {med.frequency}
                        </span>
                        {isGiven ? (
                          <span className="px-1.5 py-0.5 rounded bg-[#6ffbbe] text-[#002113] font-label-sm text-[11px] font-semibold">
                            {med.timingLabel}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[#40484c] font-label-sm text-[11px]">
                            {med.timingLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isGiven ? (
                    <span
                      className="material-symbols-outlined text-[#00472f] text-[22px] shrink-0"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      title={`Given at ${med.administeredTime || '08:00'}`}
                    >
                      check_circle
                    </span>
                  ) : isDue ? (
                    <button
                      onClick={() => onOpenAdminister(med)}
                      className="px-3 py-1.5 rounded-lg bg-[#dce9ff] text-[#004357] hover:bg-[#006398] hover:text-white transition-colors font-label-sm text-[11px] font-semibold shrink-0 cursor-pointer"
                    >
                      Administer
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenAdminister(med)}
                      className="px-3 py-1.5 rounded-lg bg-[#dce9ff] text-[#004357] hover:bg-[#006398] hover:text-white transition-colors font-label-sm text-[11px] font-semibold shrink-0 cursor-pointer"
                    >
                      Schedule
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Recent Lab Panel Preview */}
        <div ref={labsRef} className="bg-[#ffffff] rounded-xl p-3 shadow-xs border border-[#e5eeff]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#004357] text-[20px]">biotech</span>
              <h2 className="font-headline-sm text-[17px] text-[#0b1c30] font-semibold">
                {currentLab.title}
              </h2>
            </div>
            <span className="font-label-sm text-[11px] text-[#40484c]">
              {currentLab.collectedTime}
            </span>
          </div>

          {/* Quick tab switcher between lab panels */}
          {patient.labs.length > 1 && (
            <div className="flex items-center gap-1 mb-2.5 overflow-x-auto no-scrollbar">
              {patient.labs.map((lp, idx) => (
                <button
                  key={lp.id}
                  onClick={() => setActiveLabPanel(idx)}
                  className={`px-2.5 py-1 text-[10px] font-semibold rounded-md whitespace-nowrap transition-colors ${
                    activeLabPanel === idx
                      ? 'bg-[#004357] text-white'
                      : 'bg-[#eff4ff] text-[#40484c] hover:bg-[#dce9ff]'
                  }`}
                >
                  {lp.title.split(' ')[0]}
                </button>
              ))}
            </div>
          )}

          {/* Metric columns */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {currentLab.metrics.map((metric) => (
              <div key={metric.key} className="bg-[#eff4ff] p-2 rounded-lg">
                <span className="font-label-sm text-[11px] text-[#40484c] block">
                  {metric.label}
                </span>
                <span className="font-data-metric text-[22px] text-[#0b1c30] font-bold tabular-nums block">
                  {metric.value}
                </span>
                <span className="font-label-sm text-[11px] text-[#00472f] block font-semibold">
                  {metric.refRange || metric.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Clinician Action Floating Toolbar */}
      <div className="sticky bottom-2 px-3 mt-4 z-30">
        <div className="bg-[#ffffff]/95 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-[#e5eeff] flex items-center gap-2">
          {/* Order New Medication */}
          <button
            onClick={onOpenNewRx}
            className="flex-1 h-12 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-label-lg text-[14px] font-semibold flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>{t('new_rx_order')}</span>
          </button>

          {/* Update Vitals / Rapid Entry */}
          <button
            onClick={onOpenUpdateVitals}
            className="flex-1 h-12 rounded-xl bg-[#dce9ff] hover:bg-[#cbdbf5] text-[#0b1c30] font-label-lg text-[14px] font-semibold flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#006398] text-[20px]">vital_signs</span>
            <span>{t('update_vitals')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
