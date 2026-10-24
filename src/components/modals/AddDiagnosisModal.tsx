import React, { useState } from 'react';
import { Diagnosis, Patient } from '../../types/clinical';

interface AddDiagnosisModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onAddDiagnosis: (diagnosis: Omit<Diagnosis, 'id'>) => void;
}

const COMMON_ICD10 = [
  { name: 'Atrial Fibrillation', icd10: 'I48.91', status: 'Managed' as const, icon: 'ecg_heart' },
  { name: 'Chronic Kidney Disease (Stage 3)', icd10: 'N18.3', status: 'Monitored' as const, icon: 'biotech' },
  { name: 'Hyperlipidemia', icd10: 'E78.5', status: 'Managed' as const, icon: 'bloodtype' },
  { name: 'Asthma (Mild Intermittent)', icd10: 'J45.20', status: 'Monitored' as const, icon: 'air' },
  { name: 'Coronary Artery Disease', icd10: 'I25.10', status: 'Managed' as const, icon: 'cardiology' },
  { name: 'Gastroesophageal Reflux Disease (GERD)', icd10: 'K21.9', status: 'Managed' as const, icon: 'medication' },
];

export const AddDiagnosisModal: React.FC<AddDiagnosisModalProps> = ({
  patient,
  isOpen,
  onClose,
  onAddDiagnosis,
}) => {
  const [name, setName] = useState('');
  const [icd10, setIcd10] = useState('');
  const [status, setStatus] = useState<Diagnosis['status']>('Managed');
  const [onsetYear, setOnsetYear] = useState('2026');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (p: (typeof COMMON_ICD10)[0]) => {
    setName(p.name);
    setIcd10(p.icd10);
    setStatus(p.status);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !icd10.trim()) return;

    onAddDiagnosis({
      name: name.trim(),
      icd10: icd10.trim().toUpperCase(),
      status,
      onsetYear,
      details: details.trim() || 'Recorded during ICU inpatient stay',
      icon: 'cardiology',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#004357] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#004357]">Add ICD-10 Diagnosis</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {/* Quick ICD Presets */}
          <div>
            <span className="text-[10px] text-[#70787d] uppercase font-bold block mb-1">Common ICD-10 Codes:</span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_ICD10.map((c) => (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => handleSelectPreset(c)}
                  className="px-2 py-1 text-[11px] rounded-lg bg-[#e5eeff] text-[#004357] hover:bg-[#006398] hover:text-white transition-colors"
                >
                  {c.name} ({c.icd10})
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">Diagnosis Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Atrial Fibrillation"
              required
              className="w-full h-10 px-3 text-xs bg-[#eff4ff] border border-[#bfc8cd] rounded-lg focus:outline-hidden focus:border-[#006398]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">ICD-10 Code</label>
              <input
                type="text"
                value={icd10}
                onChange={(e) => setIcd10(e.target.value)}
                placeholder="e.g. I48.91"
                required
                className="w-full h-10 px-3 text-xs bg-[#eff4ff] border border-[#bfc8cd] rounded-lg focus:outline-hidden focus:border-[#006398] uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-10 px-2 text-xs bg-[#eff4ff] border border-[#bfc8cd] rounded-lg focus:outline-hidden focus:border-[#006398]"
              >
                <option value="Managed">Managed</option>
                <option value="Chronic">Chronic</option>
                <option value="Monitored">Monitored</option>
                <option value="Acute">Acute</option>
                <option value="Resolving">Resolving</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">Onset Year</label>
              <input
                type="text"
                value={onsetYear}
                onChange={(e) => setOnsetYear(e.target.value)}
                className="w-full h-9 px-3 text-xs bg-[#eff4ff] border border-[#bfc8cd] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">Clinical Notes</label>
              <input
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="e.g. Asymptomatic rate controlled"
                className="w-full h-9 px-3 text-xs bg-[#eff4ff] border border-[#bfc8cd] rounded-lg"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#e5eeff]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#bfc8cd] text-[#40484c] font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#004357] text-white font-bold text-xs hover:bg-[#0d5c75]"
            >
              Save Diagnosis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
