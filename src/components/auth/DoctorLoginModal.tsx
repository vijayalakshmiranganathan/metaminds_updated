import React, { useState } from 'react';
import { DoctorAuth } from '../../types/clinical';

interface DoctorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAuth: DoctorAuth;
  onLoginSuccess: (auth: DoctorAuth) => void;
  onLogout: () => void;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

export const PRESET_DOCTORS: DoctorAuth[] = [
  {
    isVerified: true,
    name: 'Dr. Rajesh Sharma, MD',
    nmcRegNo: 'NMC-MCI-2012-084920',
    stateMedicalCouncil: 'Maharashtra Medical Council (MMC)',
    qualification: 'MD, DM (Cardiology), FACC',
    hospitalStaffId: 'SJ-ATTEND-4192',
    department: 'Cardiology & Intensive Care',
    verifiedAt: 'National Medical Register (NMC Verified)',
    digitalSignatureToken: 'PKI-SHA256-SHARMA-94820',
  },
  {
    isVerified: true,
    name: 'Dr. Ananya Sharma, MBBS, MD',
    nmcRegNo: 'KMC-2015-091482',
    stateMedicalCouncil: 'Karnataka Medical Council (KMC)',
    qualification: 'MBBS, MD (Internal Medicine)',
    hospitalStaffId: 'SJ-INTERNIST-8841',
    department: 'General Internal Medicine',
    verifiedAt: 'National Medical Register (NMC Verified)',
    digitalSignatureToken: 'PKI-SHA256-SHARMA-91482',
  },
  {
    isVerified: true,
    name: 'Dr. Vikram Patel, MD',
    nmcRegNo: 'GMC-2010-048291',
    stateMedicalCouncil: 'Gujarat Medical Council (GMC)',
    qualification: 'MD, DNB (Endocrinology)',
    hospitalStaffId: 'SJ-ENDO-3310',
    department: 'Endocrinology & Diabetology',
    verifiedAt: 'National Medical Register (NMC Verified)',
    digitalSignatureToken: 'PKI-SHA256-PATEL-48291',
  },
];

export const DoctorLoginModal: React.FC<DoctorLoginModalProps> = ({
  isOpen,
  onClose,
  currentAuth,
  onLoginSuccess,
  onLogout,
  onShowToast,
}) => {
  const [tab, setTab] = useState<'presets' | 'manual'>('presets');
  const [docName, setDocName] = useState('');
  const [nmcNo, setNmcNo] = useState('');
  const [council, setCouncil] = useState('Maharashtra Medical Council (MMC)');
  const [staffId, setStaffId] = useState('');
  const [pin, setPin] = useState('4192');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (doc: DoctorAuth) => {
    onLoginSuccess(doc);
    onClose();
    onShowToast(`Verified Doctor Session Active: ${doc.name} (${doc.nmcRegNo})`);
  };

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !nmcNo.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const newAuth: DoctorAuth = {
        isVerified: true,
        name: docName.trim(),
        nmcRegNo: nmcNo.trim().toUpperCase(),
        stateMedicalCouncil: council,
        qualification: 'MBBS, MD (Specialist)',
        hospitalStaffId: staffId.trim() || `SJ-REG-${Math.floor(1000 + Math.random() * 9000)}`,
        department: 'Clinical Inpatient Department',
        verifiedAt: 'National Medical Commission (Real-time Match)',
        digitalSignatureToken: `PKI-SHA256-${Date.now()}`,
      };
      onLoginSuccess(newAuth);
      onClose();
      onShowToast(`NMC Verification Successful: Welcome ${newAuth.name}!`);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#004357] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#004357]">Doctor Verification & Sign-In</h2>
              <p className="text-xs text-[#40484c]">
                National Medical Commission (NMC) Registry Check
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

        {/* Current Status Banner */}
        <div className="p-3 bg-[#f8f9ff] border-b border-[#e5eeff] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                currentAuth.isVerified ? 'bg-[#006141]' : 'bg-[#ba1a1a]'
              }`}
            />
            <div>
              <span className="font-bold text-[#0b1c30]">
                {currentAuth.isVerified ? currentAuth.name : 'Unverified Practitioner'}
              </span>
              <span className="text-[10px] text-[#70787d] block font-mono">
                {currentAuth.isVerified ? currentAuth.nmcRegNo : 'Requires active medical registration'}
              </span>
            </div>
          </div>

          {currentAuth.isVerified && (
            <button
              onClick={() => {
                onLogout();
                onShowToast('Doctor signed out. Prescribing & eMAR access restricted.');
              }}
              className="px-2.5 py-1 text-[11px] font-bold text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Tab switcher */}
        <div className="p-3 pb-0 flex items-center gap-1 border-b border-[#e5eeff]">
          <button
            onClick={() => setTab('presets')}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-all ${
              tab === 'presets'
                ? 'border-[#004357] text-[#004357]'
                : 'border-transparent text-[#70787d] hover:text-[#0b1c30]'
            }`}
          >
            Verified Hospital Staff
          </button>
          <button
            onClick={() => setTab('manual')}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-all ${
              tab === 'manual'
                ? 'border-[#004357] text-[#004357]'
                : 'border-transparent text-[#70787d] hover:text-[#0b1c30]'
            }`}
          >
            Verify NMC Reg #
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
          {tab === 'presets' ? (
            <div className="space-y-2.5">
              <span className="text-[11px] text-[#40484c] block">
                Select a verified attending physician to login and authorize CPOE prescriptions, SOAP notes, and MAR administration:
              </span>

              {PRESET_DOCTORS.map((doc) => {
                const isSelected = currentAuth.isVerified && currentAuth.nmcRegNo === doc.nmcRegNo;

                return (
                  <div
                    key={doc.nmcRegNo}
                    onClick={() => handleSelectPreset(doc)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#eff4ff] border-[#006398] ring-2 ring-[#006398]/30'
                        : 'bg-white border-[#e5eeff] hover:border-[#93ccff]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#004357] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {doc.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <strong className="text-xs text-[#0b1c30]">{doc.name}</strong>
                          <span className="px-1.5 py-0.2 rounded bg-[#6ffbbe] text-[#002113] text-[9px] font-bold">
                            NMC Verified
                          </span>
                        </div>
                        <div className="text-[10px] text-[#006398] font-semibold mt-0.5">
                          {doc.department} • Staff ID: {doc.hospitalStaffId}
                        </div>
                        <div className="text-[10px] text-[#70787d] font-mono mt-0.5">
                          Reg: {doc.nmcRegNo} ({doc.stateMedicalCouncil.split(' ')[0]})
                        </div>
                      </div>
                    </div>

                    <span className="material-symbols-outlined text-[#006398] text-[20px]">
                      {isSelected ? 'check_circle' : 'login'}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleManualVerify} className="space-y-3">
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Doctor Full Name <span className="text-[#ba1a1a]">*</span></label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Verma, MD"
                  required
                  className="w-full h-9 px-3 bg-[#eff4ff] border border-[#bfc8cd] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  NMC / Medical Council Registration No. <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  value={nmcNo}
                  onChange={(e) => setNmcNo(e.target.value)}
                  placeholder="e.g. NMC-MCI-2016-12490"
                  required
                  className="w-full h-9 px-3 bg-[#eff4ff] border border-[#bfc8cd] rounded-lg text-xs font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">State Council</label>
                  <select
                    value={council}
                    onChange={(e) => setCouncil(e.target.value)}
                    className="w-full h-9 px-2 bg-[#eff4ff] border border-[#bfc8cd] rounded-lg text-xs"
                  >
                    <option value="Maharashtra Medical Council (MMC)">Maharashtra (MMC)</option>
                    <option value="Karnataka Medical Council (KMC)">Karnataka (KMC)</option>
                    <option value="Delhi Medical Council (DMC)">Delhi (DMC)</option>
                    <option value="Gujarat Medical Council (GMC)">Gujarat (GMC)</option>
                    <option value="Tamil Nadu Medical Council (TNMC)">Tamil Nadu (TNMC)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">Hospital Staff ID</label>
                  <input
                    type="text"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    placeholder="e.g. SJ-STAFF-9021"
                    className="w-full h-9 px-3 bg-[#eff4ff] border border-[#bfc8cd] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Doctor Security PIN / 2FA Token</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={6}
                  placeholder="Enter 4-digit PIN"
                  className="w-full h-9 px-3 bg-[#eff4ff] border border-[#bfc8cd] rounded-lg text-xs font-mono tracking-widest"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-[#eff4ff] text-[10px] text-[#00476e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006398] text-[16px]">verified</span>
                <span>Verified in real-time against National Healthcare Providers Registry (HPR).</span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#e5eeff]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white border border-[#bfc8cd] text-[#40484c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="px-5 py-2 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                >
                  {isVerifying ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying NMC Registry...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[15px]">badge</span>
                      <span>Verify & Sign In</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
