import React, { useState, useEffect } from 'react';
import { Patient } from '../../types/clinical';

interface EmergencySosModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  patient,
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [sosActive, setSosActive] = useState(false);
  const [etaSeconds, setEtaSeconds] = useState(360);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && sosActive) {
      timer = setInterval(() => {
        setEtaSeconds((prev) => (prev > 1 ? prev - 1 : 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, sosActive]);

  if (!isOpen) return null;

  const formatEta = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleTriggerSos = () => {
    setSosActive(true);
    onShowToast(`🚨 EMERGENCY SOS DISPATCHED: Ambulance 108 paged. Critical medical summary sent to St. Jude Emergency!`, 'alert');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-2 border-[#ba1a1a] flex flex-col overflow-hidden">
        {/* Urgent Header */}
        <div className="p-4 bg-[#ba1a1a] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[26px] animate-pulse">sos</span>
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider">EMERGENCY SOS DISPATCH</h2>
              <p className="text-xs text-[#ffdad6]">Instant Medical Passport & Ambulance Tracker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Critical Patient Medical Summary (Life-Saving Triage) */}
        <div className="p-4 space-y-3.5 text-xs">
          {/* Critical Highlight Cards */}
          <div className="p-3.5 rounded-xl bg-[#ffdad6] border border-[#ba1a1a] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#93000a] uppercase font-bold tracking-wider block">Patient Name</span>
                <strong className="text-base text-[#ba1a1a]">{patient.name}</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#93000a] uppercase font-bold tracking-wider block">Blood Group</span>
                <span className="px-3 py-1 rounded-full bg-[#ba1a1a] text-white text-sm font-bold">
                  {patient.bloodType}
                </span>
              </div>
            </div>

            <div className="pt-1 border-t border-[#ba1a1a]/30">
              <span className="text-[10px] text-[#93000a] uppercase font-bold tracking-wider block">
                ⚠️ CRITICAL DRUG CONTRAINDICATION
              </span>
              <div className="font-bold text-sm text-[#93000a] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span>SEVERE PENICILLIN ALLERGY (ANAPHYLAXIS)</span>
              </div>
              <p className="text-[10px] text-[#93000a] mt-0.5">
                Do not administer Penicillins, Ampicillin, Amoxicillin, or Augmentin under any circumstance.
              </p>
            </div>
          </div>

          {/* Location & Nearest Trauma Center */}
          <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0b1c30] flex items-center gap-1">
                <span className="material-symbols-outlined text-[#006398] text-[16px]">location_on</span>
                Current GPS Location
              </span>
              <span className="text-[10px] text-[#006141] font-semibold">Live GPS Fixed</span>
            </div>
            <div className="text-[11px] text-[#40484c]">
              Bandra West, Mumbai (Coordinates: 19.0596° N, 72.8295° E)
            </div>
            <div className="text-[11px] text-[#004357]">
              Nearest Hospital: <strong>St. Jude Heart Institute & Trauma Emergency (0.8 km)</strong>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#70787d] uppercase font-bold block">
                {patient.name.includes('Priya') ? 'Next of Kin / Mother' : 'Next of Kin / Daughter'}
              </span>
              <strong className="text-xs text-[#004357]">
                {patient.name.includes('Priya') ? 'Sunita Deshmukh (+91 98201 84920)' : 'Priya Deshmukh (+91 98201 49210)'}
              </strong>
            </div>
            <a
              href={patient.name.includes('Priya') ? 'tel:9820184920' : 'tel:9820149210'}
              className="px-2.5 py-1.5 rounded-lg bg-[#006398] text-white font-bold text-[11px] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">call</span>
              <span>Call</span>
            </a>
          </div>

          {/* SOS Dispatch Status / Trigger */}
          {sosActive ? (
            <div className="p-3.5 rounded-xl bg-[#ffdad6] border border-[#ba1a1a] text-center space-y-1 animate-pulse">
              <span className="text-xs font-bold text-[#ba1a1a] uppercase block">
                🚨 Advanced Life Support Ambulance Dispatched
              </span>
              <div className="text-2xl font-mono font-bold text-[#ba1a1a]">
                ETA: {formatEta(etaSeconds)}
              </div>
              <span className="text-[10px] text-[#93000a] block">
                Driver Contact: Ramesh Patil (+91 98330 11928) • Vehicle: MH-02-ER-1082
              </span>
            </div>
          ) : (
            <button
              onClick={handleTriggerSos}
              className="w-full py-3 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold text-sm shadow-lg shadow-[#ba1a1a]/30 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[22px]">e911_emergency</span>
              <span>1-TAP EMERGENCY SOS (DISPATCH 108)</span>
            </button>
          )}

          <div className="pt-1 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#eff4ff] text-[#40484c] font-semibold text-xs hover:bg-[#dce9ff]"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
