import React, { useState, useEffect } from 'react';
import { Patient } from '../../types/clinical';

interface EmergencyCodeModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onLogEvent: (msg: string) => void;
}

export const EmergencyCodeModal: React.FC<EmergencyCodeModalProps> = ({
  patient,
  isOpen,
  onClose,
  onLogEvent,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [codeType, setCodeType] = useState<'Code Blue (Cardiac Arrest)' | 'Rapid Response' | 'Code STEMI'>('Code Blue (Cardiac Arrest)');
  const [checklist, setChecklist] = useState({
    teamPaged: true,
    crashCartArrived: true,
    airwaySecured: false,
    ivAccess: true,
    firstEpiGiven: false,
    defibAttached: false,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setElapsedSeconds(0);
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleToggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStandDown = () => {
    onLogEvent(`Emergency Code concluded. Team stood down for Room ${patient.room}. Duration: ${formatTimer(elapsedSeconds)}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-2 border-[#ba1a1a] flex flex-col overflow-hidden">
        {/* Urgent Header */}
        <div className="p-4 bg-[#ba1a1a] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[28px] animate-bounce">emergency</span>
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider">HOSPITAL CODE ACTIVATION</h2>
              <p className="text-xs text-[#ffdad6]">
                {patient.name} • Room {patient.room} • ST. JUDE ICU
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Stopwatch & Acuity Banner */}
        <div className="p-4 bg-[#ffdad6]/40 border-b border-[#ffdad6] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#93000a] font-bold uppercase tracking-wider">Elapsed Resuscitation Time</span>
            <div className="text-3xl font-mono font-bold text-[#ba1a1a] tabular-nums">
              {formatTimer(elapsedSeconds)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#70787d] font-bold uppercase">Code Type</span>
            <select
              value={codeType}
              onChange={(e) => setCodeType(e.target.value as any)}
              className="text-xs font-bold text-[#93000a] bg-white border border-[#ba1a1a]/30 rounded-lg p-1 mt-0.5"
            >
              <option value="Code Blue (Cardiac Arrest)">Code Blue (Cardiac Arrest)</option>
              <option value="Rapid Response">Rapid Response (Deterioration)</option>
              <option value="Code STEMI">Code STEMI (Acute MI)</option>
            </select>
          </div>
        </div>

        {/* Resuscitation Checklist */}
        <div className="p-4 space-y-3 text-xs">
          <div className="text-[11px] font-bold text-[#0b1c30] uppercase tracking-wide flex items-center justify-between">
            <span>Critical Response Checklist</span>
            <span className="text-[#ba1a1a] font-bold">AHA ACLS Protocol</span>
          </div>

          <div className="space-y-2">
            {[
              { key: 'teamPaged', label: 'Resuscitation Code Team Paged & Dispatched' },
              { key: 'crashCartArrived', label: 'Crash Cart & Defibrillator at Bedside' },
              { key: 'ivAccess', label: 'Large Bore IV / IO Access Verified Patent' },
              { key: 'defibAttached', label: 'Defibrillator Quick-Combo Pads Applied' },
              { key: 'firstEpiGiven', label: 'Epinephrine 1mg IV Push (Timer: Q3-5M)' },
              { key: 'airwaySecured', label: 'Advanced Airway / Bag-Valve-Mask Ventilating' },
            ].map((item) => {
              const isChecked = checklist[item.key as keyof typeof checklist];
              return (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => handleToggleCheck(item.key as keyof typeof checklist)}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                    isChecked
                      ? 'bg-[#eff4ff] border-[#006398] text-[#004357] font-semibold'
                      : 'bg-white border-[#bfc8cd] text-[#40484c]'
                  }`}
                >
                  <span className="text-xs">{item.label}</span>
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      isChecked ? 'text-[#006141]' : 'text-[#bfc8cd]'
                    }`}
                  >
                    {isChecked ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#e5eeff]">
            <button
              onClick={() => {
                onLogEvent(`Epinephrine 1mg IV Push administered at ${formatTimer(elapsedSeconds)}.`);
              }}
              className="px-3 py-2 rounded-xl bg-[#006398] text-white font-bold text-xs hover:bg-[#004b73] transition-colors"
            >
              + Log Epinephrine 1mg
            </button>
            <button
              onClick={handleStandDown}
              className="px-4 py-2 rounded-xl bg-[#ba1a1a] text-white font-bold text-xs hover:bg-[#93000a] transition-colors"
            >
              Code Stand Down / ROSC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
