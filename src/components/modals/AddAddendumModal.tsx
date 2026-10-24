import React, { useState } from 'react';
import { ClinicalNote, Patient } from '../../types/clinical';

interface AddAddendumModalProps {
  patient: Patient;
  note: ClinicalNote;
  isOpen: boolean;
  onClose: () => void;
  onSaveAddendum: (noteId: string, addendumText: string, author: string, role: string) => void;
}

export const AddAddendumModal: React.FC<AddAddendumModalProps> = ({
  patient,
  note,
  isOpen,
  onClose,
  onSaveAddendum,
}) => {
  const [addendumText, setAddendumText] = useState('');
  const [authorName, setAuthorName] = useState('Dr. Rajesh Sharma, MD');
  const [authorRole, setAuthorRole] = useState('Attending');
  const [signedElectronically, setSignedElectronically] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addendumText.trim()) return;

    onSaveAddendum(note.id, addendumText.trim(), authorName, authorRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#004357] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">add_comment</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#004357]">Add Clinical Addendum</h2>
              <p className="text-xs text-[#40484c]">
                To SOAP Note #{note.noteNumber} • {patient.name}
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {/* Original note snippet */}
          <div className="p-2.5 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-[#40484c] text-[11px] italic">
            <span className="font-bold not-italic text-[#004357] block mb-0.5">Original Entry:</span>
            {note.content}
          </div>

          {/* Addendum Body */}
          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">
              Addendum Documentation <span className="text-[#ba1a1a]">*</span>
            </label>
            <textarea
              rows={4}
              value={addendumText}
              onChange={(e) => setAddendumText(e.target.value)}
              placeholder="e.g., Renal & electrolyte panel reviewed at 11:45. eGFR 78, Creatinine 0.92, K 4.2 mEq/L are within normal limits. Hemodynamics continue stable. Proceed with planned discharge regimen."
              required
              className="w-full p-3 text-xs bg-[#eff4ff] border border-[#bfc8cd] rounded-xl focus:outline-hidden focus:border-[#006398] focus:ring-2 focus:ring-[#5bb8fe]/30"
            />
          </div>

          {/* Signature credentials */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-[#40484c] block mb-0.5 font-semibold">Clinician Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full h-9 px-2.5 text-xs bg-white border border-[#bfc8cd] rounded-lg"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#40484c] block mb-0.5 font-semibold">Title / Role</label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full h-9 px-2.5 text-xs bg-white border border-[#bfc8cd] rounded-lg"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-[11px] text-[#0b1c30] cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={signedElectronically}
              onChange={(e) => setSignedElectronically(e.target.checked)}
              className="rounded text-[#004357]"
            />
            <span className="font-medium">Digitally sign with hospital PKI token</span>
          </label>

          {/* Buttons */}
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
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Append Addendum</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
