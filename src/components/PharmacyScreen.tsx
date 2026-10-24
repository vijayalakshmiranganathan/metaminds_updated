import React, { useState } from 'react';
import { Patient, RxOrder } from '../types/clinical';

interface PharmacyScreenProps {
  patient: Patient;
  orders: RxOrder[];
  onShowToast: (msg: string) => void;
}

export const PharmacyScreen: React.FC<PharmacyScreenProps> = ({
  patient,
  orders,
  onShowToast,
}) => {
  const [dispenseQueue, setDispenseQueue] = useState([
    {
      id: 'disp-1',
      patientName: 'Sunita Deshmukh (304B)',
      drug: 'Metformin 500 mg',
      type: 'Unit Dose Oral Blister',
      orderedTime: '08:00 AM',
      status: 'Ready for Pyxis Loading',
      station: 'Station 3 ICU Pyxis #A2',
    },
    {
      id: 'disp-2',
      patientName: 'Arjun Patel (302A)',
      drug: 'Metoprolol Tartrate 25 mg',
      type: 'Unit Dose Oral',
      orderedTime: '06:45 AM',
      status: 'Verified by Pharmacist',
      station: 'Station 3 ICU Pyxis #B1',
    },
    {
      id: 'disp-3',
      patientName: 'Sunita Deshmukh (304B)',
      drug: 'Normal Saline 0.9% 1000 mL',
      type: 'Sterile IV Infusion Bag',
      orderedTime: '09:00 AM',
      status: 'Cleanroom Compounding',
      station: 'Central IV Admixture Lab',
    },
  ]);

  const handleDispense = (id: string, drug: string) => {
    setDispenseQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Dispensed to Unit' } : item
      )
    );
    onShowToast(`Dispensed ${drug} to Pyxis Station 3`);
  };

  return (
    <div className="flex flex-col w-full pb-8 px-3 pt-3 space-y-3 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#004357]">Hospital Pharmacy & MAR Dispenser</h1>
          <p className="text-xs text-[#40484c]">
            St. Jude Central Pharmacy & ICU Automated Dispensing Units
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-[#e5eeff] text-[#004357] font-bold text-xs flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-[#006141]">check_circle</span>
          Pharmacist On Duty
        </span>
      </div>

      {/* Pyxis Automated Cabinet Telemetry */}
      <div className="p-3 rounded-xl bg-white border border-[#e5eeff] shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006398] text-[20px]">inventory_2</span>
            <div>
              <span className="font-bold text-[#0b1c30] block">Pyxis MedStation 4000 (ICU Station 3)</span>
              <span className="text-[10px] text-[#70787d]">Proximity: 12 ft from Room 304B</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] font-bold text-[10px]">
            Online & Synced
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-2 rounded-lg bg-[#eff4ff]">
            <span className="text-[10px] text-[#70787d] block">Oral Meds</span>
            <strong className="text-sm text-[#004357]">96% Stock</strong>
          </div>
          <div className="p-2 rounded-lg bg-[#eff4ff]">
            <span className="text-[10px] text-[#70787d] block">Refrigerated IV</span>
            <strong className="text-sm text-[#004357]">Secure 38°F</strong>
          </div>
          <div className="p-2 rounded-lg bg-[#eff4ff]">
            <span className="text-[10px] text-[#70787d] block">Emergency Drawer</span>
            <strong className="text-sm text-[#006141]">Ready / Sealed</strong>
          </div>
        </div>
      </div>

      {/* Dispensing Queue */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="font-bold text-sm text-[#0b1c30]">Inpatient Dispensing Queue ({dispenseQueue.length})</h2>
          <span className="text-[10px] text-[#70787d]">Auto-ordered via CPOE</span>
        </div>

        {dispenseQueue.map((item) => (
          <div key={item.id} className="p-3 rounded-xl bg-white border border-[#e5eeff] shadow-xs flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#e5eeff] text-[#004357] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">vaccines</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0b1c30]">{item.drug}</div>
                  <div className="text-[11px] text-[#40484c]">
                    For: <strong className="text-[#004357]">{item.patientName}</strong> • {item.type}
                  </div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.status === 'Dispensed to Unit'
                    ? 'bg-[#6ffbbe] text-[#002113]'
                    : item.status.includes('Cleanroom')
                    ? 'bg-[#ffdad6] text-[#93000a]'
                    : 'bg-[#cce5ff] text-[#00476e]'
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#eff4ff] text-[11px] text-[#40484c] flex items-center justify-between">
              <span>Target: <strong>{item.station}</strong></span>
              <span>Req: {item.orderedTime}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#f0f4ff]">
              {item.status !== 'Dispensed to Unit' ? (
                <button
                  onClick={() => handleDispense(item.id, item.drug)}
                  className="px-3 py-1.5 rounded-lg bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-98 transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                  <span>Dispense to Station</span>
                </button>
              ) : (
                <span className="text-[#006141] font-bold text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Available in Drawer #4
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
