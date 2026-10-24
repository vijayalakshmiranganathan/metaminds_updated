import React, { useState } from 'react';
import { InvoiceBill, Patient } from '../../types/clinical';
import { LanguageCode, getTranslation } from '../../utils/i18n';

interface BillingPaymentsScreenProps {
  patient: Patient;
  invoices: InvoiceBill[];
  language: LanguageCode;
  onPayInvoice: (invoiceId: string, method: string, utr: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

export const BillingPaymentsScreen: React.FC<BillingPaymentsScreenProps> = ({
  patient,
  invoices,
  language,
  onPayInvoice,
  onShowToast,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceBill | null>(null);
  const [paymentMode, setPaymentMode] = useState<'upi' | 'card' | 'wallet'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [vpaId, setVpaId] = useState('eleanor.vance@okaxis');
  const [viewReceipt, setViewReceipt] = useState<InvoiceBill | null>(null);

  const t = (k: string) => getTranslation(language, k);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const utr = `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}/${upiApp.toUpperCase()}`;
    const method =
      paymentMode === 'upi'
        ? `UPI (${upiApp === 'gpay' ? 'Google Pay' : upiApp === 'phonepe' ? 'PhonePe' : 'Paytm'})`
        : 'Credit/Debit Card (Visa)';

    onPayInvoice(selectedInvoice.id, method, utr);
    setSelectedInvoice(null);
    onShowToast(`Payment of ₹${selectedInvoice.patientPayable} successful via ${method}!`);
  };

  const handlePrintReceipt = (inv: InvoiceBill) => {
    onShowToast(`Digital Receipt #${inv.invoiceNo} downloaded (PDF)`);
  };

  return (
    <div className="flex flex-col w-full pb-8 px-3 pt-3 space-y-3 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#004357]">{t('payments_billing')}</h1>
          <p className="text-xs text-[#40484c]">
            UPI, Cards, Itemized Invoices & Insurance Co-Pay Tracking
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-[#e5eeff] text-[#004357] font-bold text-xs flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px] text-[#006141]">security</span>
          256-Bit SSL Encrypted
        </span>
      </div>

      {/* Insurance Co-Pay Status Widget (Slide 11 Requirement) */}
      <div className="p-3.5 rounded-xl bg-white border border-[#e5eeff] shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006398] text-[20px]">health_and_safety</span>
            <div>
              <strong className="text-xs text-[#0b1c30] block">Health Insurance Co-Pay Policy</strong>
              <span className="text-[10px] text-[#70787d]">Star Health / Ayushman Bharat Cashless Network</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] font-bold text-[10px]">
            Cashless Active
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-2 rounded-lg bg-[#eff4ff]">
            <span className="text-[10px] text-[#70787d] block">Total Incurred</span>
            <strong className="text-sm text-[#004357]">₹17,550</strong>
          </div>
          <div className="p-2 rounded-lg bg-[#eff4ff]">
            <span className="text-[10px] text-[#70787d] block">Insurance Covered</span>
            <strong className="text-sm text-[#006141]">₹14,480 (82%)</strong>
          </div>
          <div className="p-2 rounded-lg bg-[#eff4ff]">
            <span className="text-[10px] text-[#70787d] block">Patient Co-Pay</span>
            <strong className="text-sm text-[#ba1a1a]">₹3,070 (18%)</strong>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="font-bold text-sm text-[#0b1c30]">Itemized Invoices & Billing ({invoices.length})</h2>
          <span className="text-[10px] text-[#70787d]">Hospital & Diagnostics</span>
        </div>

        {invoices.map((inv) => {
          const isPaid = inv.status === 'Paid';

          return (
            <div
              key={inv.id}
              className="p-3.5 rounded-xl bg-white border border-[#e5eeff] shadow-xs flex flex-col gap-2.5 hover:border-[#93ccff] transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      isPaid ? 'bg-[#cce5ff] text-[#001d31]' : 'bg-[#ffdad6] text-[#93000a]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isPaid ? 'receipt_long' : 'pending_actions'}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-[#0b1c30]">{inv.service}</h2>
                    <div className="text-[11px] text-[#40484c]">
                      {inv.provider} • {inv.date}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isPaid ? 'bg-[#6ffbbe] text-[#002113]' : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  {inv.status}
                </span>
              </div>

              {/* Itemized Breakdown Table */}
              <div className="p-2.5 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] grid grid-cols-3 gap-2 text-center text-[11px]">
                <div>
                  <span className="text-[10px] text-[#70787d] block">Gross Total</span>
                  <span className="font-bold text-[#0b1c30]">₹{inv.grossAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#70787d] block">Insurance Share</span>
                  <span className="font-bold text-[#006141]">
                    {inv.insuranceCovered > 0 ? `-₹${inv.insuranceCovered.toLocaleString()}` : '₹0'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#70787d] block">You Pay</span>
                  <strong className="text-sm text-[#ba1a1a]">₹{inv.patientPayable.toLocaleString()}</strong>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-2 border-t border-[#f0f4ff] flex items-center justify-between text-xs">
                {isPaid ? (
                  <div className="text-[10px] text-[#006141] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>Paid via {inv.paymentMethod}</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-[#ba1a1a] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    Due upon next clinic visit
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewReceipt(inv)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006398] font-bold text-xs flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                    <span>View Receipt</span>
                  </button>

                  {!isPaid && (
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-98"
                    >
                      <span className="material-symbols-outlined text-[14px]">payments</span>
                      <span>Pay via UPI (₹{inv.patientPayable})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* UPI / PAYMENT GATEWAY MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col overflow-hidden">
            <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-[#004357]">Medisync Secure Healthcare Checkout</h2>
                <p className="text-xs text-[#40484c]">Paying Invoice #{selectedInvoice.invoiceNo}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#70787d] hover:bg-[#dce9ff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="p-4 space-y-3.5 text-xs">
              {/* Amount Display */}
              <div className="p-3 rounded-xl bg-[#cce5ff]/50 border border-[#93ccff] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#00476e] font-bold uppercase">Patient Payable Co-Pay</span>
                  <div className="text-2xl font-bold text-[#001d31]">₹{selectedInvoice.patientPayable}</div>
                </div>
                <span className="text-[10px] text-[#006141] font-bold">Zero Convenience Fee</span>
              </div>

              {/* Payment Method Tabs */}
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('upi')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      paymentMode === 'upi'
                        ? 'bg-[#eff4ff] border-[#006398] text-[#004357]'
                        : 'bg-white border-[#bfc8cd] text-[#40484c]'
                    }`}
                  >
                    ⚡ UPI Instant
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('card')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      paymentMode === 'card'
                        ? 'bg-[#eff4ff] border-[#006398] text-[#004357]'
                        : 'bg-white border-[#bfc8cd] text-[#40484c]'
                    }`}
                  >
                    💳 Card / Debit
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('wallet')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      paymentMode === 'wallet'
                        ? 'bg-[#eff4ff] border-[#006398] text-[#004357]'
                        : 'bg-white border-[#bfc8cd] text-[#40484c]'
                    }`}
                  >
                    👛 NetBanking
                  </button>
                </div>
              </div>

              {/* UPI App Selection */}
              {paymentMode === 'upi' && (
                <div className="space-y-2">
                  <span className="font-semibold text-[#0b1c30] block">Choose UPI App</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'gpay', label: 'Google Pay' },
                      { id: 'phonepe', label: 'PhonePe' },
                      { id: 'paytm', label: 'Paytm' },
                      { id: 'qr', label: 'Scan QR' },
                    ].map((app) => (
                      <button
                        type="button"
                        key={app.id}
                        onClick={() => setUpiApp(app.id as any)}
                        className={`p-2 rounded-lg text-[10px] font-bold border text-center transition-all ${
                          upiApp === app.id
                            ? 'bg-[#004357] text-white border-[#004357]'
                            : 'bg-white text-[#40484c] border-[#bfc8cd]'
                        }`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-[10px] text-[#40484c] block mb-0.5">UPI ID / VPA</label>
                    <input
                      type="text"
                      value={vpaId}
                      onChange={(e) => setVpaId(e.target.value)}
                      className="w-full h-9 px-3 bg-[#eff4ff] border border-[#bfc8cd] rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-[#e5eeff]">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#bfc8cd] text-[#40484c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span>Pay ₹{selectedInvoice.patientPayable} Securely</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIGITAL RECEIPT MODAL */}
      {viewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col overflow-hidden">
            <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-[#004357]">Official Medical Receipt</h2>
                <p className="text-xs text-[#40484c]">GSTIN: 27AABCS1429B1Z2 • St. Jude Healthcare</p>
              </div>
              <button
                onClick={() => setViewReceipt(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#70787d] hover:bg-[#dce9ff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="border border-[#e5eeff] p-3 rounded-xl space-y-2 bg-[#f8f9ff]">
                <div className="flex justify-between items-center pb-2 border-b border-[#e5eeff]">
                  <div>
                    <span className="text-[10px] text-[#70787d] block">Patient Name</span>
                    <strong className="text-sm text-[#0b1c30]">{patient.name}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#70787d] block">Invoice #</span>
                    <strong className="font-mono text-xs text-[#004357]">{viewReceipt.invoiceNo}</strong>
                  </div>
                </div>

                <div className="text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#40484c]">Service:</span>
                    <span className="font-semibold text-[#0b1c30] text-right">{viewReceipt.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#40484c]">Provider:</span>
                    <span className="font-semibold text-[#0b1c30]">{viewReceipt.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#40484c]">Gross Hospital Bill:</span>
                    <span>₹{viewReceipt.grossAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#006141]">
                    <span>Insurance Settlement:</span>
                    <span>-₹{viewReceipt.insuranceCovered.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs pt-1 border-t border-[#e5eeff] text-[#004357]">
                    <span>Net Paid Amount:</span>
                    <span>₹{viewReceipt.patientPayable.toLocaleString()}</span>
                  </div>
                  {viewReceipt.upiRef && (
                    <div className="text-[10px] text-[#70787d] pt-1">
                      UTR / Bank Ref: <span className="font-mono">{viewReceipt.upiRef}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e5eeff]">
                <button
                  onClick={() => handlePrintReceipt(viewReceipt)}
                  className="px-4 py-2 rounded-xl bg-[#004357] text-white font-bold text-xs flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">print</span>
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
