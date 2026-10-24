import React, { useState } from 'react';
import { ClinicalNote, Patient } from '../../types/clinical';

interface AllNotesModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onOpenAddAddendum: (note: ClinicalNote) => void;
}

export const AllNotesModal: React.FC<AllNotesModalProps> = ({
  patient,
  isOpen,
  onClose,
  onOpenAddAddendum,
}) => {
  const [filterType, setFilterType] = useState('all');

  if (!isOpen) return null;

  const allNotes: ClinicalNote[] = [patient.recentNote, ...patient.pastNotes];

  const filteredNotes = filterType === 'all'
    ? allNotes
    : allNotes.filter((n) => n.type.toLowerCase().includes(filterType.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#004357] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">history_edu</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#004357]">Clinical Notes History</h2>
              <p className="text-xs text-[#40484c]">
                {patient.name} • {patient.mrn} • Room {patient.room}
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

        {/* Filter Pills */}
        <div className="p-3 bg-[#f8f9ff] border-b border-[#e5eeff] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Notes' },
            { id: 'soap', label: 'SOAP Notes' },
            { id: 'rounds', label: 'Rounds' },
            { id: 'consult', label: 'Consults' },
            { id: 'nursing', label: 'Nursing Shift' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === f.id
                  ? 'bg-[#004357] text-white shadow-xs'
                  : 'bg-[#e5eeff] text-[#004357] hover:bg-[#dce9ff]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notes List */}
        <div className="p-4 overflow-y-auto space-y-3.5 divide-y divide-[#e5eeff]">
          {filteredNotes.map((note) => (
            <div key={note.id} className="pt-3.5 first:pt-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#0d5c75] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {note.authorName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-[#0b1c30]">{note.authorName}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-[#e5eeff] text-[#004357] text-[10px] font-semibold">
                        {note.authorRole}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#40484c]">
                      {note.department} • {note.timestamp}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] text-[#006398] font-mono text-[10px] font-bold">
                  #{note.noteNumber}
                </span>
              </div>

              <div className="mt-2.5 p-3 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-xs leading-relaxed">
                {note.content}
              </div>

              {/* Addenda if present */}
              {note.addenda && note.addenda.length > 0 && (
                <div className="mt-2 pl-3 border-l-2 border-[#006398] space-y-1.5">
                  <span className="text-[10px] font-bold text-[#006398] uppercase tracking-wide">
                    Addenda Attached ({note.addenda.length})
                  </span>
                  {note.addenda.map((ad) => (
                    <div key={ad.id} className="p-2 rounded-lg bg-white border border-[#dce9ff] text-[11px]">
                      <div className="flex items-center justify-between text-[#70787d] text-[10px] mb-1">
                        <strong>{ad.authorName} ({ad.authorRole})</strong>
                        <span>{ad.timestamp}</span>
                      </div>
                      <p className="text-[#0b1c30]">{ad.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-2 flex items-center justify-between text-[11px] text-[#40484c]">
                <span className="flex items-center gap-1 text-[#006141] font-medium text-[10px]">
                  <span className="material-symbols-outlined text-[13px]">verified</span> Signed Electronically
                </span>
                <button
                  onClick={() => {
                    onOpenAddAddendum(note);
                    onClose();
                  }}
                  className="font-semibold text-[#006398] hover:underline flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[14px]">add_comment</span> Add Addendum
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
