import React, { useState } from 'react';
import { Patient, VitalsData } from '../../types/clinical';

interface UpdateVitalsModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onUpdateVitals: (vitals: Partial<VitalsData>) => void;
}

export const UpdateVitalsModal: React.FC<UpdateVitalsModalProps> = ({
  patient,
  isOpen,
  onClose,
  onUpdateVitals,
}) => {
  const current = patient.vitals;

  const [systolic, setSystolic] = useState(current.bpSystolic);
  const [diastolic, setDiastolic] = useState(current.bpDiastolic);
  const [pulse, setPulse] = useState(current.pulse);
  const [rhythm, setRhythm] = useState(current.rhythm || 'Sinus Rhythm');
  const [spO2, setSpO2] = useState(current.spO2);
  const [glucose, setGlucose] = useState(current.glucose);
  const [temp, setTemp] = useState(current.temp || 98.4);
  const [respRate, setRespRate] = useState(current.respRate || 16);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine BP status
    let bpStatus: VitalsData['bpStatus'] = 'Normal Target';
    if (systolic >= 140 || diastolic >= 90) {
      bpStatus = 'Stage 1 HTN';
    } else if (systolic >= 130 || diastolic >= 85) {
      bpStatus = 'Elevated';
    } else if (systolic >= 180 || diastolic >= 120) {
      bpStatus = 'Critical';
    }

    onUpdateVitals({
      bpSystolic: Number(systolic),
      bpDiastolic: Number(diastolic),
      bpStatus,
      pulse: Number(pulse),
      rhythm,
      spO2: Number(spO2),
      glucose: Number(glucose),
      temp: Number(temp),
      respRate: Number(respRate),
      syncTimeAgo: 'Sync just now',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#006398] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">vital_signs</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#004357]">Update Bedside Vitals</h2>
              <p className="text-xs text-[#40484c]">
                {patient.name} • Room {patient.room}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#70787d] hover:bg-[#dce9ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {/* Blood Pressure */}
          <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#0b1c30] flex items-center gap-1">
                <span className="material-symbols-outlined text-[#006398] text-[16px]">speed</span>
                Blood Pressure (mmHg)
              </span>
              <span className="text-[11px] text-[#006398] font-semibold">Target &lt; 130/80</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#40484c] block mb-0.5">Systolic</label>
                <input
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(Number(e.target.value))}
                  min="60"
                  max="260"
                  required
                  className="w-full h-10 px-3 text-sm font-bold bg-white border border-[#bfc8cd] rounded-lg tabular-nums"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#40484c] block mb-0.5">Diastolic</label>
                <input
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(Number(e.target.value))}
                  min="40"
                  max="160"
                  required
                  className="w-full h-10 px-3 text-sm font-bold bg-white border border-[#bfc8cd] rounded-lg tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Pulse & Rhythm */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f8f9ff] p-2.5 rounded-xl border border-[#e5eeff]">
              <label className="font-bold text-[#0b1c30] block mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[#006398] text-[16px]">ecg_heart</span>
                Pulse (bpm)
              </label>
              <input
                type="number"
                value={pulse}
                onChange={(e) => setPulse(Number(e.target.value))}
                min="30"
                max="220"
                required
                className="w-full h-10 px-3 text-sm font-bold bg-white border border-[#bfc8cd] rounded-lg tabular-nums"
              />
            </div>
            <div className="bg-[#f8f9ff] p-2.5 rounded-xl border border-[#e5eeff]">
              <label className="font-bold text-[#0b1c30] block mb-1">Rhythm</label>
              <select
                value={rhythm}
                onChange={(e) => setRhythm(e.target.value)}
                className="w-full h-10 px-2 text-xs bg-white border border-[#bfc8cd] rounded-lg"
              >
                <option value="Sinus Rhythm">Sinus Rhythm</option>
                <option value="Sinus Tachycardia">Sinus Tachycardia</option>
                <option value="Sinus Bradycardia">Sinus Bradycardia</option>
                <option value="Atrial Fibrillation">Atrial Fibrillation</option>
                <option value="Atrial Paced">Atrial Paced</option>
              </select>
            </div>
          </div>

          {/* SpO2 & Blood Glucose */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f8f9ff] p-2.5 rounded-xl border border-[#e5eeff]">
              <label className="font-bold text-[#0b1c30] block mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[#006141] text-[16px]">air</span>
                SpO2 Oxygen (%)
              </label>
              <input
                type="number"
                value={spO2}
                onChange={(e) => setSpO2(Number(e.target.value))}
                min="70"
                max="100"
                required
                className="w-full h-10 px-3 text-sm font-bold bg-white border border-[#bfc8cd] rounded-lg tabular-nums"
              />
            </div>
            <div className="bg-[#f8f9ff] p-2.5 rounded-xl border border-[#e5eeff]">
              <label className="font-bold text-[#0b1c30] block mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[#40484c] text-[16px]">water_drop</span>
                Glucose (mg/dL)
              </label>
              <input
                type="number"
                value={glucose}
                onChange={(e) => setGlucose(Number(e.target.value))}
                min="40"
                max="500"
                required
                className="w-full h-10 px-3 text-sm font-bold bg-white border border-[#bfc8cd] rounded-lg tabular-nums"
              />
            </div>
          </div>

          {/* Temp & Resp Rate */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#40484c] block mb-1">Temperature (°F)</label>
              <input
                type="number"
                step="0.1"
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full h-9 px-3 text-xs bg-[#eff4ff] border border-[#bfc8cd] rounded-lg tabular-nums"
              />
            </div>
            <div>
              <label className="font-semibold text-[#40484c] block mb-1">Resp Rate (bpm)</label>
              <input
                type="number"
                value={respRate}
                onChange={(e) => setRespRate(Number(e.target.value))}
                className="w-full h-9 px-3 text-xs bg-[#eff4ff] border border-[#bfc8cd] rounded-lg tabular-nums"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#e5eeff]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#bfc8cd] text-[#40484c] font-semibold text-xs hover:bg-[#eff4ff]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>Save & Sync Telemetry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
