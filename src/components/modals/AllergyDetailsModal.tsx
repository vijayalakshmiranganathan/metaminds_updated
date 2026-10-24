import React from 'react';
import { Patient } from '../../types/clinical';

interface AllergyDetailsModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onAddAllergy: (allergen: string, severity: 'Severe' | 'Moderate' | 'Mild', reaction: string) => void;
}

export const AllergyDetailsModal: React.FC<AllergyDetailsModalProps> = ({
  patient,
  isOpen,
  onClose,
  onAddAllergy,
}) => {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newAllergen, setNewAllergen] = React.useState('');
  const [newSeverity, setNewSeverity] = React.useState<'Severe' | 'Moderate' | 'Mild'>('Moderate');
  const [newReaction, setNewReaction] = React.useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergen.trim()) return;
    onAddAllergy(newAllergen.trim(), newSeverity, newReaction.trim() || 'Documented sensitivity');
    setShowAddForm(false);
    setNewAllergen('');
    setNewReaction('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#ffdad6] border-b border-[#ba1a1a]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
            <div>
              <h2 className="text-base font-bold text-[#93000a]">Clinical Allergy Profile</h2>
              <p className="text-xs text-[#ba1a1a]">
                {patient.name} • MRN {patient.mrn}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#93000a] hover:bg-[#ffdad6]/80 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3.5 text-xs">
          {patient.allergies.map((allergy) => (
            <div key={allergy.id} className="p-3.5 rounded-xl bg-[#ffdad6]/40 border border-[#ba1a1a]/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#93000a] uppercase tracking-wide">
                  {allergy.allergen}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#ba1a1a] text-white font-bold text-[10px] uppercase">
                  {allergy.severity}
                </span>
              </div>
              <div className="text-[#0b1c30]">
                <strong>Manifested Reaction:</strong> {allergy.reaction}
              </div>
              <div className="text-[11px] text-[#40484c]">
                <strong>Verified:</strong> {allergy.confirmedDate} (ICU Triage Intake)
              </div>
              {allergy.notes && (
                <div className="mt-1 p-2 rounded-lg bg-white/80 border border-[#ba1a1a]/20 text-[11px] text-[#40484c]">
                  <strong>Clinical Guidance:</strong> {allergy.notes}
                </div>
              )}
            </div>
          ))}

          {/* Cross sensitivity warning */}
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-[#004357] space-y-1">
            <div className="font-bold text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#006398]">verified_user</span>
              Safe Alternative Drug Classes
            </div>
            <p className="text-[11px] text-[#40484c] leading-relaxed">
              When treating suspected infections in {patient.name}: Prefer Macrolides (Azithromycin), Glycopeptides (Vancomycin), Fluoroquinolones, or Aminoglycosides.
            </p>
          </div>

          {/* Add allergy form toggle */}
          {showAddForm ? (
            <form onSubmit={handleAdd} className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-2.5">
              <div className="font-bold text-xs text-[#0b1c30]">Add New Drug / Food Allergy</div>
              <input
                type="text"
                placeholder="Substance (e.g., Codeine, Latex, Iodine)..."
                value={newAllergen}
                onChange={(e) => setNewAllergen(e.target.value)}
                required
                className="w-full h-9 px-3 text-xs bg-white border border-[#bfc8cd] rounded-lg"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  className="w-full h-9 px-2 text-xs bg-white border border-[#bfc8cd] rounded-lg"
                >
                  <option value="Severe">Severe (Anaphylaxis)</option>
                  <option value="Moderate">Moderate (Rash/Hives)</option>
                  <option value="Mild">Mild (GI upset)</option>
                </select>
                <input
                  type="text"
                  placeholder="Reaction description..."
                  value={newReaction}
                  onChange={(e) => setNewReaction(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-white border border-[#bfc8cd] rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs text-[#70787d] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-[#004357] text-white text-xs font-bold"
                >
                  Save Allergy
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2 rounded-xl border border-dashed border-[#006398] text-[#006398] hover:bg-[#eff4ff] text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Document Additional Allergy
            </button>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#004357] text-white font-bold text-xs hover:bg-[#0d5c75]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
