import React, { useState } from 'react';
import { Patient } from '../../types/clinical';
import { PENICILLIN_DRUGS } from '../../data/patients';

interface NewRxModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onSubmitOrder: (order: {
    medName: string;
    dosage: string;
    route: string;
    frequency: string;
    indication: string;
    urgent: boolean;
  }) => void;
}

const COMMON_MEDS = [
  { name: 'Metoprolol Tartrate', defaultDose: '25 mg', route: 'Oral', freq: 'BID', ind: 'Rate Control' },
  { name: 'Lisinopril', defaultDose: '10 mg', route: 'Oral', freq: 'Daily', ind: 'Hypertension' },
  { name: 'Furosemide (Lasix)', defaultDose: '20 mg', route: 'IV Piggyback', freq: 'Daily (Morning)', ind: 'Diuresis' },
  { name: 'Vancomycin', defaultDose: '1000 mg', route: 'IV Piggyback', freq: 'Q12H', ind: 'Bacterial Infection' },
  { name: 'Azithromycin', defaultDose: '500 mg', route: 'Oral', freq: 'Daily', ind: 'Respiratory Prophylaxis' },
  { name: 'Amoxicillin (Penicillin-class)', defaultDose: '500 mg', route: 'Oral', freq: 'TID', ind: 'Antibiotic' },
  { name: 'Ampicillin (Penicillin-class)', defaultDose: '1 g', route: 'IV Piggyback', freq: 'Q6H', ind: 'Systemic Coverage' },
  { name: 'Piperacillin / Tazobactam (Zosyn)', defaultDose: '3.375 g', route: 'IV Piggyback', freq: 'Q6H', ind: 'Broad Spectrum' },
  { name: 'Atorvastatin', defaultDose: '40 mg', route: 'Oral', freq: 'QHS (Bedtime)', ind: 'Lipid Reduction' },
  { name: 'Heparin (SubQ)', defaultDose: '5000 units', route: 'SubQ', freq: 'TID', ind: 'DVT Prophylaxis' },
];

export const NewRxModal: React.FC<NewRxModalProps> = ({
  patient,
  isOpen,
  onClose,
  onSubmitOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMed, setSelectedMed] = useState('');
  const [dose, setDose] = useState('');
  const [route, setRoute] = useState('Oral');
  const [frequency, setFrequency] = useState('Daily (Morning)');
  const [indication, setIndication] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [overrideAllergy, setOverrideAllergy] = useState(false);

  if (!isOpen) return null;

  // Check if current drug conflicts with patient allergies
  const checkHasPenicillinAllergy = patient.allergies.some(
    (a) => a.allergen.toUpperCase().includes('PENICILLIN') && a.severity === 'Severe'
  );

  const isCurrentMedPenicillin =
    PENICILLIN_DRUGS.some((p) =>
      (selectedMed || searchQuery).toLowerCase().includes(p)
    );

  const hasAllergyConflict = checkHasPenicillinAllergy && isCurrentMedPenicillin;

  const handleSelectPredefined = (m: (typeof COMMON_MEDS)[0]) => {
    setSelectedMed(m.name);
    setSearchQuery(m.name);
    setDose(m.defaultDose);
    setRoute(m.route);
    setFrequency(m.freq);
    setIndication(m.ind);
    setOverrideAllergy(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMedName = selectedMed || searchQuery.trim();
    if (!finalMedName || !dose.trim()) return;

    if (hasAllergyConflict && !overrideAllergy) {
      return;
    }

    onSubmitOrder({
      medName: finalMedName,
      dosage: dose.trim(),
      route,
      frequency,
      indication: indication || 'Cardiology inpatient management',
      urgent: isUrgent,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#004357] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#004357]">New Prescription Order (CPOE)</h2>
              <p className="text-xs text-[#40484c]">
                Ordering for <strong className="text-[#0b1c30]">{patient.name}</strong> • Room {patient.room}
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Patient Safety Ribbon Reminder */}
          {patient.allergies.length > 0 && (
            <div className="p-2.5 rounded-xl bg-[#ffdad6]/60 border border-[#ba1a1a]/30 flex items-start gap-2">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[18px] shrink-0 mt-0.5">warning</span>
              <div className="text-[11px] leading-tight text-[#93000a]">
                <strong className="font-bold">Active Patient Allergy:</strong>{' '}
                {patient.allergies.map((a) => `${a.allergen} (${a.reaction})`).join('; ')}
              </div>
            </div>
          )}

          {/* Drug Search */}
          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">
              Medication Name <span className="text-[#ba1a1a]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedMed(e.target.value);
                }}
                placeholder="Search drug (e.g., Metoprolol, Lasix, Amoxicillin)..."
                required
                className="w-full h-11 px-3 text-xs bg-[#eff4ff] border border-[#bfc8cd] rounded-lg focus:outline-hidden focus:border-[#006398] focus:ring-2 focus:ring-[#5bb8fe]/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedMed('');
                  }}
                  className="absolute right-3 top-3 text-[#70787d] hover:text-[#0b1c30]"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                </button>
              )}
            </div>

            {/* Quick Presets Carousel */}
            <div className="mt-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] text-[#70787d] uppercase font-semibold shrink-0">Common:</span>
              {COMMON_MEDS.slice(0, 5).map((m) => (
                <button
                  type="button"
                  key={m.name}
                  onClick={() => handleSelectPredefined(m)}
                  className="px-2 py-0.5 text-[10px] rounded-md bg-[#e5eeff] text-[#004357] hover:bg-[#006398] hover:text-white transition-colors whitespace-nowrap"
                >
                  {m.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* CRITICAL ALLERGY CONFLICT WARNING */}
          {hasAllergyConflict && (
            <div className="p-3 rounded-xl bg-[#ffdad6] border-2 border-[#ba1a1a] text-[#93000a] space-y-2 animate-pulse">
              <div className="flex items-center gap-2 font-bold text-xs">
                <span className="material-symbols-outlined text-[20px]">gpp_maybe</span>
                <span>CRITICAL CLINICAL DECISION SUPPORT ALERT</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                <strong>Severe Penicillin Allergy Match:</strong> {patient.name} has a documented severe reaction
                (Anaphylaxis) to Penicillin derivatives. Prescribing <strong>{selectedMed || searchQuery}</strong>{' '}
                carries life-threatening risk.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleSelectPredefined(COMMON_MEDS[3]); // Vancomycin
                  }}
                  className="px-2.5 py-1 text-[11px] bg-white text-[#004357] font-bold rounded-md shadow-xs hover:bg-[#f8f9ff]"
                >
                  Switch to Vancomycin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectPredefined(COMMON_MEDS[4]); // Azithromycin
                  }}
                  className="px-2.5 py-1 text-[11px] bg-white text-[#004357] font-bold rounded-md shadow-xs hover:bg-[#f8f9ff]"
                >
                  Switch to Azithromycin
                </button>
              </div>
              <label className="flex items-center gap-1.5 pt-1 text-[10px] cursor-pointer text-[#0b1c30]">
                <input
                  type="checkbox"
                  checked={overrideAllergy}
                  onChange={(e) => setOverrideAllergy(e.target.checked)}
                  className="rounded text-[#ba1a1a] focus:ring-[#ba1a1a]"
                />
                <span className="font-semibold">Physician emergency override with ICU desensitization protocol</span>
              </label>
            </div>
          )}

          {/* Dose & Route Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Dose & Strength <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="text"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder="e.g., 25 mg, 500 mg, 10 mL"
                required
                className="w-full h-10 px-3 text-xs bg-[#eff4ff] border border-[#bfc8cd] rounded-lg focus:outline-hidden focus:border-[#006398]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">Route</label>
              <select
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-[#eff4ff] border border-[#bfc8cd] rounded-lg focus:outline-hidden focus:border-[#006398]"
              >
                <option value="Oral">Oral (PO)</option>
                <option value="IV Piggyback">IV Piggyback (IVPB)</option>
                <option value="IV Push">IV Push (IVP)</option>
                <option value="SubQ">Subcutaneous (SubQ)</option>
                <option value="Intramuscular">Intramuscular (IM)</option>
                <option value="Inhalation">Inhalation (Nebulizer)</option>
                <option value="Topical">Topical</option>
              </select>
            </div>
          </div>

          {/* Frequency & Indication */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-[#eff4ff] border border-[#bfc8cd] rounded-lg focus:outline-hidden focus:border-[#006398]"
              >
                <option value="Daily (Morning)">Daily (Morning - 08:00)</option>
                <option value="BID (With meals)">BID (Twice Daily - 08:00, 12:00)</option>
                <option value="TID">TID (Three times daily)</option>
                <option value="QHS (Bedtime)">QHS (Bedtime - 21:00)</option>
                <option value="Q6H">Q6H (Every 6 hours)</option>
                <option value="Q8H">Q8H (Every 8 hours)</option>
                <option value="PRN (As needed)">PRN (As needed for pain/nausea)</option>
                <option value="STAT (Once now)">STAT (Emergency Immediate Dose)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">Clinical Indication</label>
              <input
                type="text"
                value={indication}
                onChange={(e) => setIndication(e.target.value)}
                placeholder="e.g., Hemodynamic stability"
                className="w-full h-10 px-3 text-xs bg-[#eff4ff] border border-[#bfc8cd] rounded-lg focus:outline-hidden focus:border-[#006398]"
              />
            </div>
          </div>

          {/* Urgent / STAT Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#e5eeff]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006398] text-[18px]">bolt</span>
              <div>
                <div className="font-bold text-xs text-[#004357]">STAT Urgent Delivery</div>
                <div className="text-[10px] text-[#40484c]">Prioritize in Pharmacy unit dispenser</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 text-[#006398] rounded"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#e5eeff] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#bfc8cd] text-[#40484c] font-semibold text-xs hover:bg-[#eff4ff]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={hasAllergyConflict && !overrideAllergy}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm flex items-center gap-1.5 transition-all ${
                hasAllergyConflict && !overrideAllergy
                  ? 'bg-[#70787d] cursor-not-allowed opacity-60'
                  : 'bg-[#004357] hover:bg-[#0d5c75] active:scale-98'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Sign & Transmit Rx</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
