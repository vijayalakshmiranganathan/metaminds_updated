import React, { useState } from 'react';
import { DoctorAuth, FamilyMember } from '../types/clinical';
import { LANGUAGES, LanguageCode, getTranslation } from '../utils/i18n';

interface HeaderProps {
  appRole: 'doctor' | 'patient' | 'wellness';
  onToggleAppRole: (role: 'doctor' | 'patient' | 'wellness') => void;
  activeScreen: string;
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onEmergencyClick: () => void;
  onOpenFamilyDashboard: () => void;
  selectedUnit: string;
  onSelectUnit: (unit: string) => void;
  activeMemberName?: string;
  activeFamilyMember?: FamilyMember;
  doctorAuth?: DoctorAuth;
  onOpenDoctorLogin?: () => void;
  onOpenDiagnosisPrivacy?: () => void;
  onOpenRegistration?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  appRole,
  onToggleAppRole,
  activeScreen,
  language,
  onSelectLanguage,
  onEmergencyClick,
  onOpenFamilyDashboard,
  selectedUnit,
  onSelectUnit,
  activeMemberName = 'My Profile',
  activeFamilyMember,
  doctorAuth,
  onOpenDoctorLogin,
  onOpenDiagnosisPrivacy,
  onOpenRegistration,
}) => {
  const [showUnitMenu, setShowUnitMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const units = ['ST. JUDE ICU', 'STEP-DOWN CCU', 'CARDIOVASCULAR ICU', 'PACU SURGICAL'];

  const t = (k: string) => getTranslation(language, k);

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/95 backdrop-blur-xl border-b border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-4xl mx-auto h-16 px-3 sm:px-4 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-[#dce9ff] shrink-0 bg-white flex items-center justify-center">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-25_at_12.21.54_AM_4c858893.jpeg"
              alt="Medisync App Icon"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 relative">
              <span className="font-headline-sm text-[17px] text-[#004357] font-semibold tracking-tight">
                {t('app_title')}
              </span>

              {appRole === 'doctor' ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowUnitMenu(!showUnitMenu)}
                    className="px-1.5 py-0.5 rounded-full bg-[#cce5ff] hover:bg-[#bde9ff] text-[#001d31] font-label-sm text-[10px] font-bold uppercase transition-colors flex items-center gap-0.5"
                    title="Change ICU Ward / Unit"
                  >
                    <span>{selectedUnit}</span>
                    <span className="material-symbols-outlined text-[12px]">arrow_drop_down</span>
                  </button>

                  {onOpenDoctorLogin && (
                    <button
                      onClick={onOpenDoctorLogin}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                        doctorAuth?.isVerified
                          ? 'bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#166534] border border-[#86efac]'
                          : 'bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] animate-pulse border border-[#ffb4ab]'
                      }`}
                      title={doctorAuth?.isVerified ? `Verified: ${doctorAuth.nmcRegNo}` : 'Click to verify doctor credentials'}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {doctorAuth?.isVerified ? 'verified' : 'gpp_maybe'}
                      </span>
                      <span className="hidden sm:inline">
                        {doctorAuth?.isVerified ? 'NMC Verified' : 'Verify Login'}
                      </span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={onOpenFamilyDashboard}
                    className="px-2 py-0.5 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004357] font-label-sm text-[10px] font-bold transition-colors flex items-center gap-1 border border-[#93ccff]"
                    title="Switch Family Member Dashboard"
                  >
                    <span className="material-symbols-outlined text-[12px]">family_restroom</span>
                    <span className="truncate max-w-[85px]">{activeFamilyMember ? activeFamilyMember.name : activeMemberName}</span>
                    {activeFamilyMember && (
                      <span className="px-1 py-0.2 rounded bg-[#004357] text-white text-[8px] font-bold">
                        {activeFamilyMember.relationship}
                      </span>
                    )}
                    <span className="material-symbols-outlined text-[12px]">arrow_drop_down</span>
                  </button>

                  {onOpenDiagnosisPrivacy && (
                    <button
                      onClick={onOpenDiagnosisPrivacy}
                      className="px-1.5 py-0.5 rounded-full bg-white hover:bg-[#eff4ff] text-[#004357] font-label-sm text-[10px] font-bold transition-colors flex items-center gap-0.5 border border-[#dce9ff] cursor-pointer"
                      title="Family Diagnosis Privacy (Hide or show diagnoses from family members)"
                    >
                      <span className="material-symbols-outlined text-[12px] text-[#006398]">family_restroom</span>
                      <span className="hidden sm:inline">Family Privacy</span>
                    </button>
                  )}
                </div>
              )}

              {/* Unit Switcher Dropdown */}
              {showUnitMenu && (
                <div className="absolute top-7 left-12 w-48 bg-white rounded-xl shadow-xl border border-[#dce9ff] py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-[#70787d] uppercase tracking-wider">
                    Select Clinical Unit
                  </div>
                  {units.map((u) => (
                    <button
                      key={u}
                      onClick={() => {
                        onSelectUnit(u);
                        setShowUnitMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between ${
                        u === selectedUnit
                          ? 'bg-[#e5eeff] text-[#004357] font-semibold'
                          : 'text-[#0b1c30] hover:bg-[#eff4ff]'
                      }`}
                    >
                      <span>{u}</span>
                      {u === selectedUnit && (
                        <span className="material-symbols-outlined text-[14px] text-[#006398]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-label-md text-[11px] text-[#40484c] font-medium leading-none capitalize">
                {t(activeScreen) || activeScreen}
              </span>
              <span className="text-[10px] text-[#70787d]">•</span>
              <span className="text-[10px] text-[#006398] font-bold">
                {appRole === 'doctor'
                  ? t('hospital_ehr')
                  : appRole === 'wellness'
                  ? t('wellness_prevention')
                  : t('patient_portal')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions: Role Toggle, Language Picker, Emergency Button, Profile */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* 3-Way Mode Switcher: Doctor vs Patient vs Wellness */}
          <div className="bg-[#eff4ff] p-0.5 rounded-lg border border-[#dce9ff] flex items-center">
            <button
              onClick={() => onToggleAppRole('doctor')}
              className={`px-1.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                appRole === 'doctor'
                  ? 'bg-[#004357] text-white shadow-xs'
                  : 'text-[#40484c] hover:text-[#0b1c30]'
              }`}
              title="Doctor EHR (ICU Bedside & MAR)"
            >
              {t('doctor')}
            </button>
            <button
              onClick={() => onToggleAppRole('patient')}
              className={`px-1.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                appRole === 'patient'
                  ? 'bg-[#004357] text-white shadow-xs'
                  : 'text-[#40484c] hover:text-[#0b1c30]'
              }`}
              title="Patient & Family Care Portal"
            >
              {t('patient')}
            </button>
            <button
              onClick={() => onToggleAppRole('wellness')}
              className={`px-1.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                appRole === 'wellness'
                  ? 'bg-[#006141] text-white shadow-xs'
                  : 'text-[#00472f] hover:text-[#0b1c30]'
              }`}
              title="Wellness & Prevention Hub (Healthy Living)"
            >
              {t('wellness')}
            </button>
          </div>

          {/* Multilingual Selector (Slide 10 Feature: Breaking the Language Barrier) */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-2 py-1 rounded-lg bg-white border border-[#dce9ff] text-[#004357] font-semibold text-[11px] flex items-center gap-1 hover:bg-[#eff4ff] transition-colors"
              title="Change Language (Breaking the Language Barrier)"
            >
              <span className="material-symbols-outlined text-[15px] text-[#006398]">translate</span>
              <span className="hidden sm:inline">{currentLangObj.nativeName}</span>
              <span className="material-symbols-outlined text-[12px]">expand_more</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 top-9 w-44 bg-white rounded-xl shadow-xl border border-[#dce9ff] py-1 z-50 animate-in fade-in">
                <div className="px-3 py-1 text-[10px] font-bold text-[#70787d] uppercase tracking-wider border-b border-[#e5eeff]">
                  Select Language
                </div>
                <div className="max-h-60 overflow-y-auto no-scrollbar">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                        lang.code === language
                          ? 'bg-[#e5eeff] text-[#004357] font-bold'
                          : 'text-[#0b1c30] hover:bg-[#eff4ff]'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-[#70787d]">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Emergency SOS Button */}
          <button
            onClick={onEmergencyClick}
            aria-label="Emergency SOS"
            className="w-9 h-9 rounded-full flex items-center justify-center p-1 hover:bg-[#ffdad6]/70 active:scale-95 transition-all cursor-pointer relative"
            title="Emergency SOS / Ambulance Dispatch"
          >
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-24_at_7.35.39_PM_ec3e6564.jpeg"
              alt="Emergency SOS Siren"
              className="w-7 h-7 object-contain drop-shadow-xs animate-pulse"
            />
          </button>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="relative flex items-center p-0.5 rounded-full hover:ring-2 hover:ring-[#006398]/30 transition-all"
              title="Account Menu"
            >
              <div className="w-8 h-8 rounded-full bg-[#004357] flex items-center justify-center text-white text-xs font-bold">
                {appRole === 'doctor'
                  ? (doctorAuth?.name ? doctorAuth.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('').slice(0, 2) : 'RS')
                  : (activeFamilyMember ? activeFamilyMember.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'SD')}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4edea3] ring-2 ring-white"></span>
            </button>

            {/* Profile Popover */}
            {showProfileMenu && (
              <div className="absolute right-0 top-10 w-64 bg-white rounded-xl shadow-xl border border-[#dce9ff] p-3 z-50">
                <div className="flex items-center gap-2 pb-2 border-b border-[#e5eeff]">
                  <div className="w-9 h-9 rounded-full bg-[#004357] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {appRole === 'doctor'
                      ? (doctorAuth?.name ? doctorAuth.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('').slice(0, 2) : 'RS')
                      : (activeFamilyMember ? activeFamilyMember.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'ME')}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0b1c30] truncate">
                      {appRole === 'doctor' ? (doctorAuth?.name || 'Dr. Rajesh Sharma, MD') : (activeFamilyMember?.name || activeMemberName || 'My Profile')}
                    </div>
                    <div className="text-[10px] text-[#40484c] truncate">
                      {appRole === 'doctor'
                        ? (doctorAuth?.isVerified ? `✓ ${doctorAuth.nmcRegNo}` : '⚠️ Unverified Doctor')
                        : (activeFamilyMember ? `${activeFamilyMember.relationship} • ABHA: ${activeFamilyMember.abhaId}` : 'ABHA Verified Profile')}
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-[#70787d] space-y-1.5">
                  {appRole === 'doctor' ? (
                    <>
                      <div className="text-[10px] text-[#40484c] bg-[#eff4ff] p-1.5 rounded-lg border border-[#dce9ff]">
                        <div className="font-semibold text-[#004357]">Council Verification:</div>
                        <div className="truncate">{doctorAuth?.stateMedicalCouncil || 'National Medical Commission'}</div>
                      </div>
                      {onOpenDoctorLogin && (
                        <button
                          onClick={() => {
                            onOpenDoctorLogin();
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left py-1 text-[#006398] font-semibold flex items-center gap-1.5 hover:underline cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          <span>Manage Doctor Verification</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {onOpenDiagnosisPrivacy && (
                        <button
                          onClick={() => {
                            onOpenDiagnosisPrivacy();
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left py-1 text-[#006398] font-semibold flex items-center gap-1.5 hover:underline cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">family_restroom</span>
                          <span>{t('family_privacy')}</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onOpenFamilyDashboard();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left py-1 text-[#006398] font-semibold flex items-center gap-1.5 hover:underline cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">family_restroom</span>
                        <span>{t('switch_family_member')}</span>
                      </button>
                    </>
                  )}

                  {onOpenRegistration && (
                    <button
                      onClick={() => {
                        onOpenRegistration();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left py-1.5 px-2 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004357] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer my-1.5 border border-[#dce9ff]"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#006398]">how_to_reg</span>
                      <span>{t('switch_user_edit')}</span>
                    </button>
                  )}

                  <div className="flex justify-between pt-1 border-t border-[#f0f4ff]">
                    <span>Active Portal:</span>{' '}
                    <strong className="text-[#0b1c30]">
                      {appRole === 'doctor' ? t('doctor_view') : appRole === 'wellness' ? t('wellness_hub') : t('patient_view')}
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="mt-3 w-full py-1 text-center text-xs font-semibold text-[#006398] bg-[#eff4ff] hover:bg-[#dce9ff] rounded-lg transition-colors cursor-pointer"
                >
                  {t('close')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
