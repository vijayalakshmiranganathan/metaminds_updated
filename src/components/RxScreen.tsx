import React, { useState } from 'react';
import { Patient, RxOrder } from '../types/clinical';

interface RxScreenProps {
  patient: Patient;
  orders: RxOrder[];
  onOpenNewRx: () => void;
  onDiscontinueOrder: (orderId: string) => void;
  onShowToast: (msg: string) => void;
}

export const RxScreen: React.FC<RxScreenProps> = ({
  patient,
  orders,
  onOpenNewRx,
  onDiscontinueOrder,
  onShowToast,
}) => {
  const [tab, setTab] = useState<'active' | 'timeline' | 'all'>('active');

  const patientOrders = orders.filter((o) => o.patientId === patient.id);

  return (
    <div className="flex flex-col w-full pb-8 px-3 pt-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#004357]">Prescriptions & CPOE</h1>
          <p className="text-xs text-[#40484c]">
            Active Orders for <strong className="text-[#0b1c30]">{patient.name}</strong> • Room {patient.room}
          </p>
        </div>
        <button
          onClick={onOpenNewRx}
          className="px-3.5 py-2 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>New Order</span>
        </button>
      </div>

      {/* Safety Alert Ribbon */}
      {patient.allergies.length > 0 && (
        <div className="p-3 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[#ba1a1a] text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
          <div className="text-xs text-[#93000a] leading-tight">
            <strong>Active Allergy Safety Warning:</strong> {patient.name} has a documented{' '}
            <span className="font-bold underline">{patient.allergies[0].allergen}</span> allergy (
            {patient.allergies[0].reaction}). Automatic clinical decision support will block beta-lactam prescriptions.
          </div>
        </div>
      )}

      {/* Tab filter */}
      <div className="bg-[#dce9ff] p-1 rounded-xl flex items-center justify-between gap-1 shadow-inner">
        <button
          onClick={() => setTab('active')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-center transition-all ${
            tab === 'active'
              ? 'bg-white text-[#004357] shadow-xs'
              : 'text-[#40484c] hover:text-[#0b1c30]'
          }`}
        >
          Active Orders ({patientOrders.length})
        </button>
        <button
          onClick={() => setTab('timeline')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-center transition-all ${
            tab === 'timeline'
              ? 'bg-white text-[#004357] shadow-xs'
              : 'text-[#40484c] hover:text-[#0b1c30]'
          }`}
        >
          24h MAR Timeline
        </button>
        <button
          onClick={() => setTab('all')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-center transition-all ${
            tab === 'all'
              ? 'bg-white text-[#004357] shadow-xs'
              : 'text-[#40484c] hover:text-[#0b1c30]'
          }`}
        >
          All Unit Rx ({orders.length})
        </button>
      </div>

      {/* Content depending on tab */}
      {tab === 'timeline' ? (
        <div className="bg-white rounded-xl p-3 border border-[#e5eeff] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#004357]">Scheduled Dose Windows</span>
            <span className="text-[11px] text-[#70787d]">Today, Oct 23</span>
          </div>

          <div className="space-y-2">
            {[
              { time: '08:00', med: 'Amlodipine 5 mg', status: 'Given', nurse: 'S. Kulkarni, RN', bg: 'bg-[#6ffbbe]/30 text-[#002113]' },
              { time: '12:00', med: 'Metformin 500 mg', status: 'Due Now', nurse: 'Awaiting Administration', bg: 'bg-[#cce5ff] text-[#00476e]' },
              { time: '18:00', med: 'Electrolyte Replacement Protocol', status: 'Scheduled', nurse: 'Pharmacy Prepared', bg: 'bg-[#eff4ff] text-[#40484c]' },
              { time: '21:00', med: 'Atorvastatin 20 mg', status: 'Scheduled', nurse: 'Night Shift Shift-B', bg: 'bg-[#eff4ff] text-[#40484c]' },
            ].map((slot, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-[#e5eeff] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-12 font-mono font-bold text-[#004357]">{slot.time}</span>
                  <div>
                    <strong className="text-[#0b1c30] block">{slot.med}</strong>
                    <span className="text-[10px] text-[#70787d]">{slot.nurse}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${slot.bg}`}>
                  {slot.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {(tab === 'active' ? patientOrders : orders).map((ord) => (
            <div
              key={ord.id}
              className="p-3 rounded-xl bg-white border border-[#e5eeff] shadow-xs flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#cce5ff] text-[#001d31] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[18px]">prescriptions</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-sm text-[#0b1c30]">{ord.medName}</span>
                      <span className="font-semibold text-xs text-[#006398]">{ord.dosage}</span>
                      {ord.urgent && (
                        <span className="px-1.5 py-0.2 rounded bg-[#ffdad6] text-[#93000a] text-[10px] font-bold">
                          STAT
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#40484c]">
                      {ord.route} • {ord.frequency} • {ord.patientName}
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-[#e5eeff] text-[#004357] text-[10px] font-bold">
                  {ord.status}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-[#eff4ff] text-[11px] text-[#40484c] flex items-center justify-between">
                <span>Indication: <strong className="text-[#0b1c30]">{ord.indication}</strong></span>
                <span>Ordered: {ord.orderedAt}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#f0f4ff] text-xs">
                <span className="text-[11px] text-[#70787d]">
                  Prescriber: <strong className="text-[#0b1c30]">{ord.prescribingDoctor}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onShowToast(`Order #${ord.id} verified by Dr. Rajesh Sharma, MD`)}
                    className="text-[#006398] font-bold text-xs hover:underline"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => {
                      onDiscontinueOrder(ord.id);
                      onShowToast(`Discontinued ${ord.medName} order.`);
                    }}
                    className="text-[#ba1a1a] font-bold text-xs hover:underline"
                  >
                    Discontinue
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
