import React, { useState } from 'react';
import { HealthDocument, Patient } from '../../types/clinical';
import { LanguageCode, getTranslation } from '../../utils/i18n';

interface DocumentsVaultScreenProps {
  patient: Patient;
  documents: HealthDocument[];
  language: LanguageCode;
  onUploadDocument: (doc: Omit<HealthDocument, 'id'>) => void;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

export const DocumentsVaultScreen: React.FC<DocumentsVaultScreenProps> = ({
  patient,
  documents,
  language,
  onUploadDocument,
  onShowToast,
}) => {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<HealthDocument | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload modal form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HealthDocument['category']>('Prescription');
  const [newDoctorOrLab, setNewDoctorOrLab] = useState('');
  const [newTags, setNewTags] = useState('General');
  const [newSummary, setNewSummary] = useState('');

  const t = (k: string) => getTranslation(language, k);

  const categories = ['All', 'Prescription', 'Blood Test', 'Radiology Scan', 'Discharge Summary'];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.doctorOrLab.toLowerCase().includes(search.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = filter === 'All' || doc.category === filter;
    return matchesSearch && matchesCat;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onUploadDocument({
      title: newTitle.trim(),
      category: newCategory,
      doctorOrLab: newDoctorOrLab.trim() || 'St. Jude Health Network',
      date: 'Today, Oct 23, 2026',
      fileSize: '1.2 MB PDF',
      tags: newTags.split(',').map((t) => t.trim()),
      verifiedAbdm: true,
      aiSummary: newSummary.trim() || 'Digitally archived and verified via Ayushman Bharat Digital Mission (ABDM).',
      documentSnippet: 'Archived clinical record uploaded by patient.',
    });

    setIsUploadOpen(false);
    setNewTitle('');
    setNewDoctorOrLab('');
    setNewSummary('');
    onShowToast(`Uploaded "${newTitle}" to ABDM Document Vault!`);
  };

  return (
    <div className="flex flex-col w-full pb-8 px-3 pt-3 space-y-3 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#004357]">{t('records_vault')}</h1>
          <p className="text-xs text-[#40484c]">
            Database of Prescriptions, Blood Tests, Scans & X-Rays • {patient.name}
          </p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          <span>Upload Report</span>
        </button>
      </div>

      {/* ABDM Interoperability Trust Card (Slide 13 Feature) */}
      <div className="p-3.5 rounded-xl bg-[#cce5ff]/50 border border-[#93ccff] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#004357] text-white flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">sync</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <strong className="text-xs text-[#001d31]">ABDM / ABHA Digital Health Locker</strong>
              <span className="px-1.5 py-0.2 rounded bg-[#6ffbbe] text-[#002113] text-[9px] font-bold uppercase">
                Linked & Verified
              </span>
            </div>
            <span className="text-[10px] text-[#00476e]">
              ABHA ID: <strong className="font-mono text-[#001d31]">{patient.abhaId || '91-8492-4820-1102@abdm'}</strong> • Portable across all clinics
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#70787d] text-[20px]">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search past prescriptions, MRI/CT scans, blood tests..."
          className="w-full h-11 pl-10 pr-4 text-xs bg-white border border-[#dce9ff] rounded-xl shadow-xs focus:outline-hidden focus:border-[#006398] focus:ring-2 focus:ring-[#5bb8fe]/30"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === cat
                ? 'bg-[#004357] text-white shadow-xs'
                : 'bg-white text-[#40484c] border border-[#e5eeff] hover:bg-[#eff4ff]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="space-y-2.5">
        {filteredDocs.map((doc) => {
          const isPrescription = doc.category === 'Prescription';
          const isBlood = doc.category === 'Blood Test';
          const isScan = doc.category === 'Radiology Scan';

          return (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="p-3.5 rounded-xl bg-white border border-[#e5eeff] shadow-xs flex flex-col gap-2 hover:border-[#93ccff] cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                      isPrescription
                        ? 'bg-[#cce5ff] text-[#001d31]'
                        : isBlood
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : isScan
                        ? 'bg-[#e5eeff] text-[#004357]'
                        : 'bg-[#dce9ff] text-[#00476e]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isPrescription ? 'prescriptions' : isBlood ? 'biotech' : isScan ? 'radiology' : 'description'}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-bold text-sm text-[#0b1c30] truncate">{doc.title}</h2>
                    <div className="text-[11px] text-[#40484c] mt-0.5">
                      {doc.doctorOrLab} • {doc.date}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] text-[#006398] font-semibold text-[10px] block">
                    {doc.category}
                  </span>
                  <span className="text-[10px] text-[#70787d] mt-1 block">{doc.fileSize}</span>
                </div>
              </div>

              {/* AI Summary Banner */}
              <div className="p-2.5 rounded-lg bg-[#eff4ff] text-[11px] text-[#004357] leading-relaxed">
                <span className="font-bold block text-[10px] uppercase text-[#006398] mb-0.5">
                  ✨ AI-Assisted Clinical Summary:
                </span>
                {doc.aiSummary}
              </div>

              {/* Tags & Action Row */}
              <div className="pt-1.5 border-t border-[#f0f4ff] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 flex-wrap">
                  {doc.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.2 rounded bg-[#f8f9ff] text-[#70787d] text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <span className="text-[#006398] font-bold text-[11px] flex items-center gap-0.5">
                  <span>View Details</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DOCUMENT VIEWER MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#004357] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <div>
                  <h2 className="font-bold text-sm text-[#004357]">{selectedDoc.title}</h2>
                  <p className="text-xs text-[#40484c]">{selectedDoc.doctorOrLab} • {selectedDoc.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#70787d] hover:bg-[#dce9ff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs overflow-y-auto">
              <div className="p-3 rounded-xl bg-[#cce5ff]/50 border border-[#93ccff]">
                <strong className="text-xs text-[#001d31] block mb-1">✨ AI Medical Report Extraction</strong>
                <p className="text-[#00476e] leading-relaxed">{selectedDoc.aiSummary}</p>
              </div>

              <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff] space-y-1">
                <strong className="text-xs text-[#0b1c30] block">Document Contents:</strong>
                <p className="text-[#40484c] leading-relaxed font-mono text-[11px] whitespace-pre-wrap">
                  {selectedDoc.documentSnippet || selectedDoc.aiSummary}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#eff4ff] flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-[#70787d] block text-[10px]">Verification Protocol</span>
                  <strong className="text-[#004357]">Ayushman Bharat Digital Health Mission (ABDM)</strong>
                </div>
                <span className="text-[#006141] font-bold">100% Tamper-Proof</span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#e5eeff]">
                <button
                  onClick={() => {
                    onShowToast(`Downloaded ${selectedDoc.title} (${selectedDoc.fileSize})`);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#e5eeff] hover:bg-[#dce9ff] text-[#004357] font-bold text-xs flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  <span>Download Document</span>
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-5 py-2 rounded-xl bg-[#004357] text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col overflow-hidden">
            <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-[#004357]">Upload Medical Report or Prescription</h2>
                <p className="text-xs text-[#40484c]">Securely store physical papers into digital vault</p>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#70787d] hover:bg-[#dce9ff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-4 space-y-3.5 text-xs">
              {/* File drop simulation area */}
              <div className="p-4 rounded-xl border-2 border-dashed border-[#006398] bg-[#eff4ff] text-center space-y-1 cursor-pointer">
                <span className="material-symbols-outlined text-3xl text-[#006398]">cloud_upload</span>
                <strong className="block text-xs text-[#004357]">Take Photo or Choose File</strong>
                <span className="text-[10px] text-[#70787d]">Supports PDF, JPG, PNG, DICOM up to 25MB</span>
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Document Title <span className="text-[#ba1a1a]">*</span></label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Dr. Rajesh Sharma Prescription, Lipid Panel Oct 2026..."
                  required
                  className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc8cd] rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full h-10 px-2 bg-[#eff4ff] border border-[#bfc8cd] rounded-xl text-xs"
                  >
                    <option value="Prescription">Prescription Sheet</option>
                    <option value="Blood Test">Blood / Lab Report</option>
                    <option value="Radiology Scan">Radiology / X-Ray / Scan</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="Vaccination">Vaccination Record</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">Doctor / Clinic / Hospital</label>
                  <input
                    type="text"
                    value={newDoctorOrLab}
                    onChange={(e) => setNewDoctorOrLab(e.target.value)}
                    placeholder="e.g., Apollo Hospital"
                    className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc8cd] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Cardiology, BloodPressure, Lab"
                  className="w-full h-9 px-3 bg-[#eff4ff] border border-[#bfc8cd] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Notes / Key Findings</label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="e.g., Blood sugar fasting was 112 mg/dL. Continue daily morning walks."
                  className="w-full p-2.5 bg-[#eff4ff] border border-[#bfc8cd] rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#e5eeff]">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#bfc8cd] text-[#40484c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
