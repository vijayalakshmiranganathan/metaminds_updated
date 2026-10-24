import React, { useState } from 'react';
import { Diagnosis, Patient } from '../../types/clinical';

interface DiagnosisPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onToggleDiagnosisPrivacy: (dxId: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

export const DiagnosisPrivacyModal: React.FC<DiagnosisPrivacyModalProps> = ({
  isOpen,
  onClose,
  patient,
  onToggleDiagnosisPrivacy,
  onShowToast,
}) => {
  const [breakGlassEmergencyAllowed, setBreakGlassEmergencyAllowed] = useState(true);

  if (!isOpen) return null;

  const totalDiagnoses = patient.diagnoses.length;
  const privateCount = patient.diagnoses.filter((d) => d.isPrivate).length;
  const visibleCount = totalDiagnoses - privateCount;

  const handleToggle = (dx: Diagnosis) => {
    onToggleDiagnosisPrivacy(dx.id);
    const willBePrivate = !dx.isPrivate;
    onShowToast(
      willBePrivate
        ? `🔒 "${dx.name}" is now hidden from family members with shared access.`
        : `👁️ "${dx.name}" is now visible to family members.`,
      willBePrivate ? 'info' : 'success'
    );
  };

  const handleMaskAll = () => {
    patient.diagnoses.forEach((dx) => {
      if (!dx.isPrivate) onToggleDiagnosisPrivacy(dx.id);
    });
    onShowToast('🔒 All diagnoses hidden from family members under privacy consent', 'info');
  };

  const handleUnmaskAll = () => {
    patient.diagnoses.forEach((dx) => {
      if (dx.isPrivate) onToggleDiagnosisPrivacy(dx.id);
    });
    onShowToast('👁️ All diagnoses now accessible on family health dashboard', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#004357] to-[#006398] text-white flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[24px]">family_restroom</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Family Diagnosis Privacy & Consent</h2>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold uppercase tracking-wider">
                  DPDP Act 2023
                </span>
              </div>
              <p className="text-xs text-[#dce9ff] mt-0.5">
                Patient Data Sovereignty • Choose which conditions family members can view
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Informative Banner */}
        <div className="px-4 py-3 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between text-xs text-[#004357]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#006398]">lock</span>
            <span>
              <strong>{privateCount}</strong> of <strong>{totalDiagnoses}</strong> diagnoses currently hidden from family members
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleMaskAll}
              className="text-[11px] text-[#006398] font-bold hover:underline cursor-pointer"
            >
              Hide All
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={handleUnmaskAll}
              className="text-[11px] text-[#006398] font-bold hover:underline cursor-pointer"
            >
              Show All
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 no-scrollbar">
          {/* Patient Guarantee Card */}
          <div className="p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#166534] text-[20px] shrink-0 mt-0.5">
              shield
            </span>
            <div className="text-xs text-[#166534] space-y-1">
              <p className="font-semibold">Your Health Data Privacy Rights</p>
              <p className="text-[11px] text-[#14532d] leading-relaxed">
                Even when family members share access to your healthcare portal, you retain legal ownership to decide what they can see. Hidden diagnoses will remain completely private from relatives, spouse, or caregivers, while remaining accessible to your treating physicians for safe medical care.
              </p>
            </div>
          </div>

          {/* Diagnosis List with Granular Toggles */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[#70787d] uppercase tracking-wider">
              Diagnoses on Record ({patient.name})
            </h3>

            {patient.diagnoses.map((dx) => {
              const isMasked = !!dx.isPrivate;

              return (
                <div
                  key={dx.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isMasked
                      ? 'bg-[#fff5f5] border-[#fecaca]'
                      : 'bg-[#ffffff] border-[#e5eeff] hover:border-[#93ccff]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isMasked ? 'bg-[#fee2e2] text-[#991b1b]' : 'bg-[#e5eeff] text-[#004357]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {isMasked ? 'lock' : dx.icon || 'cardiology'}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-bold text-sm ${
                              isMasked ? 'text-[#991b1b]' : 'text-[#0b1c30]'
                            }`}
                          >
                            {dx.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] text-[#004357] text-[10px] font-mono font-semibold">
                            ICD-10: {dx.icd10}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isMasked
                                ? 'bg-[#fee2e2] text-[#991b1b]'
                                : 'bg-[#dcfce7] text-[#166534]'
                            }`}
                          >
                            {isMasked ? '🔒 Hidden from Family' : '👁️ Visible to Family'}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#40484c] mt-1">
                          Onset: {dx.onsetYear} • Status: {dx.status}
                          {dx.details ? ` • ${dx.details}` : ''}
                        </p>

                        {/* Preview of Family Member's View */}
                        <div className="mt-2 text-[10px] p-2 rounded-lg bg-gray-50 border border-gray-200">
                          <span className="font-semibold text-gray-500 block mb-0.5">
                            Family Member Dashboard View:
                          </span>
                          {isMasked ? (
                            <span className="text-[#b91c1c] font-medium flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">visibility_off</span>
                              [Protected] Diagnosis Hidden from Family Member View
                            </span>
                          ) : (
                            <span className="text-[#15803d] font-medium flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">visibility</span>
                              {dx.name} (ICD-10: {dx.icd10}) • Visible
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Switch Toggle */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggle(dx)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          !isMasked ? 'bg-[#006398]' : 'bg-gray-300'
                        }`}
                        title={isMasked ? 'Click to make visible to family members' : 'Click to hide from family members'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            !isMasked ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-[10px] font-semibold text-[#70787d]">
                        {isMasked ? 'Hidden' : 'Visible'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Emergency Safety Protocol Override */}
          <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006398] text-[20px]">emergency</span>
                <span className="text-xs font-bold text-[#004357]">
                  Emergency Next-of-Kin Override
                </span>
              </div>
              <input
                type="checkbox"
                id="break-glass-toggle"
                checked={breakGlassEmergencyAllowed}
                onChange={(e) => setBreakGlassEmergencyAllowed(e.target.checked)}
                className="w-4 h-4 accent-[#006398] cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-[#40484c] leading-relaxed">
              If enabled, designated primary emergency contacts can request break-glass access only during critical ICU hospitalization or emergency trauma code, with SMS alert verification sent to your phone.
            </p>
          </div>

          {/* Legal Compliance Footer Notice */}
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-[10px] text-gray-500 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Family Consent Token:</span>
              <span className="font-mono">ABHA-FAM-PRIVACY-9184</span>
            </div>
            <div>
              Medisync Privacy Hub • Ayushman Bharat Digital Mission (ABDM) • Revocable anytime
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-[#f8f9ff] border-t border-[#dce9ff] flex items-center justify-between gap-3">
          <div className="text-xs text-[#40484c]">
            <span className="font-semibold text-[#004357]">{visibleCount}</span> visible to family •{' '}
            <span className="font-semibold text-[#991b1b]">{privateCount}</span> hidden from family
          </div>
          <button
            onClick={() => {
              onShowToast('Privacy preferences updated: Hidden diagnoses will not appear on family member devices');
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-[#004357] hover:bg-[#003140] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Save Privacy Settings
          </button>
        </div>
      </div>
    </div>
  );
};
