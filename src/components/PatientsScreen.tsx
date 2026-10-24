import React, { useState } from 'react';
import { Patient } from '../types/clinical';

interface PatientsScreenProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (patient: Patient) => void;
  onOpenNewPatient?: () => void;
}

export const PatientsScreen: React.FC<PatientsScreenProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'cardiology' | 'critical' | 'allergies'>('all');

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.mrn.toLowerCase().includes(search.toLowerCase()) ||
      p.room.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'cardiology') {
      return p.department.toLowerCase().includes('cardio');
    }
    if (filter === 'critical') {
      return p.acuity === 'Critical' || p.acuity === 'Urgent';
    }
    if (filter === 'allergies') {
      return p.allergies.length > 0;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-8 px-3 pt-3 space-y-3">
      {/* Search & Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#004357]">ICU Patient Census</h1>
          <p className="text-xs text-[#40484c]">
            St. Jude Intensive Care Unit • 18 / 20 Beds Occupied
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-[#e5eeff] text-[#004357] font-bold text-xs flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
          Live Unit Telemetry
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#70787d] text-[20px]">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, MRN, or room (e.g. Sunita, 304B)..."
          className="w-full h-11 pl-10 pr-4 text-xs bg-white border border-[#dce9ff] rounded-xl shadow-xs focus:outline-hidden focus:border-[#006398] focus:ring-2 focus:ring-[#5bb8fe]/30"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-3 text-[#70787d] hover:text-[#0b1c30]"
          >
            <span className="material-symbols-outlined text-[16px]">cancel</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'all', label: `All Patients (${patients.length})` },
          { id: 'cardiology', label: 'Cardiology' },
          { id: 'critical', label: 'Urgent / Acuity' },
          { id: 'allergies', label: 'Allergy Alerts' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filter === f.id
                ? 'bg-[#004357] text-white shadow-xs'
                : 'bg-[#ffffff] text-[#40484c] border border-[#e5eeff] hover:bg-[#eff4ff]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Patient Cards List */}
      <div className="space-y-2.5">
        {filteredPatients.map((patient) => {
          const isSelected = patient.id === selectedPatientId;
          const hasPenicillin = patient.allergies.some((a) =>
            a.allergen.toUpperCase().includes('PENICILLIN')
          );

          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`p-3 rounded-xl bg-white border shadow-xs transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'border-[#006398] ring-2 ring-[#006398]/30 bg-[#f8f9ff]'
                  : 'border-[#e5eeff] hover:border-[#93ccff]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={patient.photoUrl}
                      alt={patient.name}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="w-12 h-12 rounded-xl object-cover border border-[#dce9ff]"
                    />
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-white shadow-xs text-[#00472f] font-bold text-[10px] border border-[#e5eeff]">
                      {patient.bloodType}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-sm text-[#0b1c30] truncate">
                        {patient.name}
                      </h3>
                      <span className="px-1.5 py-0.2 rounded-md bg-[#dce9ff] text-[#40484c] text-[10px]">
                        {patient.age}y • {patient.gender}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#40484c] mt-0.5">
                      MRN: <span className="font-semibold text-[#0b1c30]">{patient.mrn}</span> • {patient.department}
                    </div>
                  </div>
                </div>

                {/* Room and Status */}
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#e5eeff] text-[#004357] font-bold text-xs shadow-xs">
                    <span className="material-symbols-outlined text-[15px]">meeting_room</span>
                    <span>{patient.room}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-1 uppercase ${
                      patient.acuity === 'Critical'
                        ? 'text-[#ba1a1a]'
                        : patient.acuity === 'Urgent'
                        ? 'text-[#006398]'
                        : 'text-[#006141]'
                    }`}
                  >
                    {patient.acuity}
                  </span>
                </div>
              </div>

              {/* Safety Alerts Pill Ribbon */}
              <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px]">
                {hasPenicillin && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#ffdad6] text-[#93000a] font-bold">
                    <span className="material-symbols-outlined text-[13px]">warning</span>
                    PENICILLIN ALLERGY
                  </span>
                )}
                {patient.alerts.map((alt) => {
                  if (alt.includes('ALLERGY')) return null;
                  return (
                    <span
                      key={alt}
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#eff4ff] text-[#40484c] font-medium"
                    >
                      {alt}
                    </span>
                  );
                })}
              </div>

              {/* Vitals Ribbon preview */}
              <div className="mt-2.5 pt-2 border-t border-[#f0f4ff] grid grid-cols-4 gap-1 text-center text-[11px]">
                <div>
                  <span className="text-[9px] text-[#70787d] uppercase block">BP</span>
                  <span className="font-bold text-[#0b1c30] tabular-nums">
                    {patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#70787d] uppercase block">Pulse</span>
                  <span className="font-bold text-[#006398] tabular-nums">
                    {patient.vitals.pulse} bpm
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#70787d] uppercase block">SpO2</span>
                  <span className="font-bold text-[#00472f] tabular-nums">
                    {patient.vitals.spO2}%
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#70787d] uppercase block">Glucose</span>
                  <span className="font-bold text-[#0b1c30] tabular-nums">
                    {patient.vitals.glucose}
                  </span>
                </div>
              </div>

              {/* Action Hint */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-[#006398] font-semibold pt-1">
                <span>View Complete Chart & MAR</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
