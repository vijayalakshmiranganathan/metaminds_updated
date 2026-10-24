import React, { useState } from 'react';
import { Medication, Patient } from '../../types/clinical';

interface AdministerMedModalProps {
  patient: Patient;
  medication: Medication | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAdminister: (medId: string, timeString: string) => void;
}

export const AdministerMedModal: React.FC<AdministerMedModalProps> = ({
  patient,
  medication,
  isOpen,
  onClose,
  onConfirmAdminister,
}) => {
  const [barcodeScanned, setBarcodeScanned] = useState(false);
  const [nurseName, setNurseName] = useState('S. Kulkarni, RN');
  const [siteNotes, setSiteNotes] = useState('Administered with lunch meal as scheduled.');

  if (!isOpen || !medication) return null;

  const handleScan = () => {
    setBarcodeScanned(true);
  };

  const handleConfirm = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    onConfirmAdminister(medication.id, timeString);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#006398] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">vaccines</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#004357]">eMAR Bedside Administration</h2>
              <p className="text-xs text-[#40484c]">
                Point-of-Care 5-Rights Verification
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
        <div className="p-4 space-y-3.5 text-xs">
          {/* Medication Highlight Card */}
          <div className="p-3.5 rounded-xl bg-[#cce5ff]/50 border border-[#93ccff] flex items-start justify-between">
            <div>
              <div className="text-[10px] text-[#00476e] font-bold uppercase tracking-wider">Scheduled Medication</div>
              <div className="text-base font-bold text-[#001d31] flex items-center gap-1.5 mt-0.5">
                <span>{medication.name}</span>
                <span className="text-[#006398] font-bold">{medication.dosage}</span>
              </div>
              <div className="text-xs text-[#40484c] mt-0.5">
                {medication.route} • {medication.frequency}
              </div>
            </div>
            <div className="px-2 py-1 rounded-md bg-white border border-[#93ccff] text-[#006398] font-bold text-[11px]">
              {medication.timingLabel}
            </div>
          </div>

          {/* 5 Rights Checklist */}
          <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff] space-y-2">
            <div className="text-[11px] font-bold text-[#0b1c30] uppercase tracking-wide flex items-center justify-between">
              <span>5-Rights Clinical Safeguards</span>
              <span className="text-[#006141] flex items-center gap-0.5 text-[10px]">
                <span className="material-symbols-outlined text-[14px]">verified</span> Active Protocol
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-white border border-[#e5eeff]">
                <span className="text-[#70787d] block text-[10px]">1. Right Patient</span>
                <strong className="text-[#0b1c30]">{patient.name}</strong>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#e5eeff]">
                <span className="text-[#70787d] block text-[10px]">2. Right Drug</span>
                <strong className="text-[#0b1c30]">{medication.name}</strong>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#e5eeff]">
                <span className="text-[#70787d] block text-[10px]">3. Right Dose</span>
                <strong className="text-[#0b1c30]">{medication.dosage}</strong>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#e5eeff]">
                <span className="text-[#70787d] block text-[10px]">4. Right Route</span>
                <strong className="text-[#0b1c30]">{medication.route}</strong>
              </div>
            </div>
          </div>

          {/* Barcode Wristband Scan Affordance */}
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006398] text-[20px]">qr_code_scanner</span>
              <div>
                <div className="font-bold text-xs text-[#004357]">Patient Wristband Verification</div>
                <div className="text-[10px] text-[#40484c]">
                  {barcodeScanned ? (
                    <span className="text-[#006141] font-bold">✓ Scanned: MRN {patient.mrn} Verified</span>
                  ) : (
                    'Scan barcode on patient bedside wristband'
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleScan}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                barcodeScanned
                  ? 'bg-[#6ffbbe] text-[#00472f]'
                  : 'bg-[#006398] text-white hover:bg-[#004b73]'
              }`}
            >
              {barcodeScanned ? 'Verified' : 'Simulate Scan'}
            </button>
          </div>

          {/* Nurse signature & notes */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-[#40484c] block mb-0.5 font-semibold">Administering Nurse</label>
              <input
                type="text"
                value={nurseName}
                onChange={(e) => setNurseName(e.target.value)}
                className="w-full h-9 px-2.5 text-xs bg-[#f8f9ff] border border-[#bfc8cd] rounded-lg"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#40484c] block mb-0.5 font-semibold">Bedside Notes</label>
              <input
                type="text"
                value={siteNotes}
                onChange={(e) => setSiteNotes(e.target.value)}
                className="w-full h-9 px-2.5 text-xs bg-[#f8f9ff] border border-[#bfc8cd] rounded-lg"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#e5eeff]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#bfc8cd] text-[#40484c] font-semibold text-xs hover:bg-[#eff4ff]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl bg-[#00472f] hover:bg-[#006141] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Confirm Administration</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
