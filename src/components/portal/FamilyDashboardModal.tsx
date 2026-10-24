import React, { useState } from 'react';
import { FamilyMember } from '../../types/clinical';
import { INITIAL_FAMILY_MEMBERS } from '../../data/portalData';

interface FamilyDashboardModalProps {
  isOpen: boolean;
  members: FamilyMember[];
  activeMemberId: string;
  onSelectMember: (member: FamilyMember) => void;
  onAddMember?: (member: FamilyMember) => void;
  onRemoveMember?: (memberId: string) => void;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onOpenRegistration?: () => void;
}

export const FamilyDashboardModal: React.FC<FamilyDashboardModalProps> = ({
  isOpen,
  members,
  activeMemberId,
  onSelectMember,
  onAddMember,
  onRemoveMember,
  onClose,
  onShowToast,
  onOpenRegistration,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState<FamilyMember['relationship']>('Father');
  const [newAge, setNewAge] = useState('60');
  const [newBlood, setNewBlood] = useState('B+');

  if (!isOpen) return null;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMemberId = `fam-${Date.now()}`;
    const newMember: FamilyMember = {
      id: newMemberId,
      patientId: `pt-${newMemberId}`,
      name: newName.trim(),
      relationship: newRelation,
      age: Number(newAge),
      gender: newRelation === 'Mother' || newRelation === 'Daughter' ? 'Female' : 'Male',
      bloodGroup: newBlood,
      abhaId: `91-8492-4820-${Math.floor(1000 + Math.random() * 9000)}@abdm`,
      avatarUrl:
        newRelation === 'Mother' || newRelation === 'Daughter'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
      activeConditions: ['General Preventive Health'],
      allergiesCount: 0,
    };

    if (onAddMember) {
      onAddMember(newMember);
    }
    onSelectMember(newMember);
    setShowAddForm(false);
    setNewName('');
    onShowToast(`Added and selected ${newMember.name} (${newMember.relationship})!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#004357] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">family_restroom</span>
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#004357]">Family Health Dashboard</h2>
              <p className="text-xs text-[#40484c]">Manage records for your loved ones under one account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#70787d] hover:bg-[#dce9ff]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 text-xs overflow-y-auto">
          <div className="p-3 rounded-xl bg-[#cce5ff]/40 border border-[#93ccff] flex items-center justify-between">
            <span className="text-[11px] text-[#00476e] font-medium leading-relaxed">
              Seamlessly switch between family members to manage their E-prescriptions, book appointments, and sync their ABHA health vaults.
            </span>
          </div>

          {/* Filter out any Deshmukh members from the Family Dashboard */}
          {(() => {
            const activeFamilyList = members.filter(
              (m) =>
                !m.name.toLowerCase().includes('deshmukh') &&
                !m.id.toLowerCase().includes('deshmukh') &&
                !(m.patientId && m.patientId.toLowerCase().includes('deshmukh'))
            );

            if (activeFamilyList.length === 0) {
              return (
                <div className="p-5 text-center text-[#70787d] bg-[#f8f9ff] rounded-2xl border border-dashed border-[#dce9ff] space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#eff4ff] flex items-center justify-center text-[#006398]">
                    <span className="material-symbols-outlined text-[22px]">family_restroom</span>
                  </div>
                  <strong className="text-xs text-[#004357] block">No Additional Family Members Linked</strong>
                  <p className="text-[11px] text-[#40484c] max-w-xs mx-auto">
                    Link your spouse, parents, or children below to manage their health records, e-prescriptions, and ABHA accounts.
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-2.5">
                {activeFamilyList.map((m) => {
                  const isActive = m.id === activeMemberId;

                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        onSelectMember(m);
                        onClose();
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'bg-[#eff4ff] border-[#006398] ring-2 ring-[#006398]/30'
                          : 'bg-white border-[#e5eeff] hover:border-[#93ccff]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={m.avatarUrl}
                          alt={m.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#dce9ff] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <strong className="text-sm text-[#0b1c30] truncate">{m.name}</strong>
                            <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#004357] font-bold text-[10px]">
                              {m.relationship}
                            </span>
                            {isActive && (
                              <span className="px-1.5 py-0.2 rounded bg-[#6ffbbe] text-[#002113] text-[9px] font-bold">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#40484c] mt-0.5">
                            {m.age}y • Blood Group: <strong className="text-[#ba1a1a]">{m.bloodGroup}</strong> • {m.gender}
                          </div>
                          <div className="text-[10px] text-[#70787d] font-mono mt-0.5 truncate">
                            ABHA: {m.abhaId}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {m.relationship !== 'Self' && onRemoveMember && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveMember(m.id);
                            }}
                            className="p-1.5 rounded-lg text-[#70787d] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
                            title={`Remove ${m.name}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        )}
                        <span className="material-symbols-outlined text-[#006398] text-[20px]">
                          {isActive ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Add member form */}
          {showAddForm ? (
            <form onSubmit={handleAddMember} className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-2.5">
              <span className="font-bold text-xs text-[#004357] block">Add New Family Member</span>
              <div>
                <label className="text-[10px] text-[#40484c] block mb-0.5">Full Legal Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Deshmukh"
                  required
                  className="w-full h-9 px-3 bg-white border border-[#bfc8cd] rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-[#40484c] block mb-0.5">Relationship</label>
                  <select
                    value={newRelation}
                    onChange={(e) => setNewRelation(e.target.value as any)}
                    className="w-full h-9 px-2 bg-white border border-[#bfc8cd] rounded-lg text-xs"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#40484c] block mb-0.5">Age</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full h-9 px-2 bg-white border border-[#bfc8cd] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#40484c] block mb-0.5">Blood Group</label>
                  <select
                    value={newBlood}
                    onChange={(e) => setNewBlood(e.target.value)}
                    className="w-full h-9 px-2 bg-white border border-[#bfc8cd] rounded-lg text-xs"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs text-[#70787d]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#004357] text-white font-bold text-xs"
                >
                  Save Member
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#006398] text-[#006398] font-bold text-xs flex items-center justify-center gap-1 hover:bg-[#eff4ff] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>Link Another Family Member</span>
            </button>
          )}

          {onOpenRegistration && (
            <button
              onClick={() => {
                onClose();
                onOpenRegistration();
              }}
              className="w-full py-2 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004357] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#dce9ff]"
            >
              <span className="material-symbols-outlined text-[16px] text-[#006398]">manage_accounts</span>
              <span>Edit My Profile / Re-register Details</span>
            </button>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#004357] text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
