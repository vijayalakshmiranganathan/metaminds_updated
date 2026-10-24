import React, { useState } from 'react';
import { UserRegistrationData } from '../../types/clinical';
import {
  LANGUAGES,
  LanguageCode,
  getTranslation,
  translateAllergy,
  translateCondition,
} from '../../utils/i18n';

interface UserRegistrationScreenProps {
  onComplete: (data: UserRegistrationData) => void;
  initialData?: Partial<UserRegistrationData>;
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
}

const COMMON_ALLERGIES = [
  'No Known Drug Allergies (NKDA)',
  'Penicillin',
  'Sulfa Drugs',
  'Aspirin / NSAIDs',
  'Peanuts & Nuts',
  'Dust / Pollen',
  'Shellfish',
];

const COMMON_CONDITIONS = [
  'Healthy / No Chronic Conditions',
  'Hypertension (High BP)',
  'Type 2 Diabetes',
  'Asthma / Bronchitis',
  'Thyroid Disorder',
  'High Cholesterol',
  'Migraine',
  'Heart Condition',
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const UserRegistrationScreen: React.FC<UserRegistrationScreenProps> = ({
  onComplete,
  initialData,
  language,
  onSelectLanguage,
}) => {
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [age, setAge] = useState<number>(initialData?.age || 32);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>(initialData?.gender || 'Male');
  const [phone, setPhone] = useState(initialData?.phone || '98201 48291');
  const [email, setEmail] = useState(initialData?.email || '');
  const [city, setCity] = useState(initialData?.city || 'Mumbai, Maharashtra');
  const [bloodGroup, setBloodGroup] = useState(initialData?.bloodGroup || 'O+');
  const [abhaId, setAbhaId] = useState(
    initialData?.abhaId ||
      `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}@abdm`
  );
  const [healthGoal, setHealthGoal] = useState(initialData?.healthGoal || 'Routine Health & Telemetry');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(
    initialData?.allergies && initialData.allergies.length > 0
      ? initialData.allergies
      : ['No Known Drug Allergies (NKDA)']
  );
  const [customAllergy, setCustomAllergy] = useState(initialData?.customAllergy || '');
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    initialData?.conditions && initialData.conditions.length > 0
      ? initialData.conditions
      : ['Healthy / No Chronic Conditions']
  );
  const [customCondition, setCustomCondition] = useState(initialData?.customCondition || '');
  const [emergencyContactName, setEmergencyContactName] = useState(
    initialData?.emergencyContactName || ''
  );
  const [emergencyContactRelation, setEmergencyContactRelation] = useState(
    initialData?.emergencyContactRelation || 'Spouse / Family'
  );
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(
    initialData?.emergencyContactPhone || '98765 43210'
  );

  const [formError, setFormError] = useState<string | null>(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const t = (k: string) => getTranslation(language, k);

  const handleGenerateAbhaId = () => {
    const p1 = Math.floor(1000 + Math.random() * 9000);
    const p2 = Math.floor(1000 + Math.random() * 9000);
    const p3 = Math.floor(1000 + Math.random() * 9000);
    setAbhaId(`91-${p1}-${p2}-${p3}@abdm`);
  };

  const toggleAllergy = (item: string) => {
    if (item === 'No Known Drug Allergies (NKDA)') {
      setSelectedAllergies(['No Known Drug Allergies (NKDA)']);
      return;
    }

    const withoutNkda = selectedAllergies.filter(
      (a) => a !== 'No Known Drug Allergies (NKDA)'
    );

    if (withoutNkda.includes(item)) {
      const next = withoutNkda.filter((a) => a !== item);
      setSelectedAllergies(
        next.length === 0 ? ['No Known Drug Allergies (NKDA)'] : next
      );
    } else {
      setSelectedAllergies([...withoutNkda, item]);
    }
  };

  const toggleCondition = (item: string) => {
    if (item === 'Healthy / No Chronic Conditions') {
      setSelectedConditions(['Healthy / No Chronic Conditions']);
      return;
    }

    const withoutHealthy = selectedConditions.filter(
      (c) => c !== 'Healthy / No Chronic Conditions'
    );

    if (withoutHealthy.includes(item)) {
      const next = withoutHealthy.filter((c) => c !== item);
      setSelectedConditions(
        next.length === 0 ? ['Healthy / No Chronic Conditions'] : next
      );
    } else {
      setSelectedConditions([...withoutHealthy, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFormError(language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name to generate your health record.');
      return;
    }

    if (age <= 0 || age > 125) {
      setFormError(language === 'hi' ? 'कृपया 1 से 120 के बीच वैध आयु दर्ज करें।' : 'Please enter a valid age between 1 and 120.');
      return;
    }

    setFormError(null);

    const finalAllergies = [...selectedAllergies];
    if (customAllergy.trim() && !finalAllergies.includes(customAllergy.trim())) {
      finalAllergies.push(customAllergy.trim());
    }

    const finalConditions = [...selectedConditions];
    if (customCondition.trim() && !finalConditions.includes(customCondition.trim())) {
      finalConditions.push(customCondition.trim());
    }

    const userData: UserRegistrationData = {
      fullName: fullName.trim(),
      age: Number(age),
      gender,
      phone: phone.trim() || '98201 48291',
      email: email.trim(),
      bloodGroup,
      abhaId: abhaId.trim() || '91-8492-4820-1102@abdm',
      city: city.trim() || 'Mumbai, Maharashtra',
      healthGoal,
      allergies: finalAllergies,
      customAllergy: customAllergy.trim(),
      conditions: finalConditions,
      customCondition: customCondition.trim(),
      emergencyContactName: emergencyContactName.trim() || 'Primary Emergency Contact',
      emergencyContactRelation,
      emergencyContactPhone: emergencyContactPhone.trim() || '98765 43210',
      preferredMode: 'patient',
    };

    onComplete(userData);
  };

  const initials = fullName.trim()
    ? fullName
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ME';

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col justify-between selection:bg-[#006398]/20">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e5eeff] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-[#dce9ff] shrink-0 bg-white flex items-center justify-center">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-25_at_12.21.54_AM_4c858893.jpeg"
                alt="Medisync Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[18px] text-[#004357] tracking-tight">{t('app_title')}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#006398] text-[10px] font-bold border border-[#dce9ff]">
                  ABDM {t('verified')}
                </span>
              </div>
              <p className="text-[11px] text-[#40484c]">
                {t('hospital_ehr')} • {t('patient_portal')} • {t('current_telemetry')}
              </p>
            </div>
          </div>

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="px-2.5 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004357] text-xs font-semibold flex items-center gap-1 transition-colors border border-[#dce9ff] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#006398]">translate</span>
              <span>{LANGUAGES.find((l) => l.code === language)?.nativeName || 'English'}</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-[#dce9ff] py-1 z-50">
                <div className="px-3 py-1 text-[10px] font-bold text-[#70787d] uppercase tracking-wider border-b border-[#e5eeff]">
                  Language / भाषा / ભાષા
                </div>
                <div className="max-h-56 overflow-y-auto no-scrollbar">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between cursor-pointer ${
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
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:py-8">
        {/* Welcome Intro Hero */}
        <div className="mb-6 sm:mb-8 p-5 sm:p-6 bg-gradient-to-br from-[#004357] via-[#0d5c75] to-[#006398] rounded-2xl text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold tracking-wide mb-2 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              {t('patient_onboarding_title')}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              {t('welcome_enter_details')}
            </h1>
            <p className="text-sm text-[#bde9ff] leading-relaxed">
              {t('onboarding_desc')}
            </p>
          </div>
        </div>

        {/* Live ID Preview & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Registration Form (8 cols on lg) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#dce9ff] shadow-xs p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && (
                <div className="p-3.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs font-semibold flex items-center gap-2 border border-[#ffb4ab]">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{formError}</span>
                </div>
              )}

              {/* Step 1: Personal Identification */}
              <div>
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#e5eeff]">
                  <span className="w-6 h-6 rounded-full bg-[#004357] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="font-bold text-sm text-[#004357] uppercase tracking-wide">
                    {t('personal_identity')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#40484c] mb-1">
                      {t('full_name')} <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#bfc8cd] focus:border-[#006398] focus:ring-2 focus:ring-[#006398]/20 outline-none text-sm transition-all text-[#0b1c30] font-medium"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#40484c] mb-1">
                      {t('age_years')} <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="120"
                        required
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#bfc8cd] focus:border-[#006398] focus:ring-2 focus:ring-[#006398]/20 outline-none text-sm font-semibold text-[#0b1c30]"
                      />
                      <div className="flex gap-1 shrink-0">
                        {[25, 45, 60].map((quickAge) => (
                          <button
                            key={quickAge}
                            type="button"
                            onClick={() => setAge(quickAge)}
                            className="px-2 py-1 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[10px] font-bold text-[#004357] cursor-pointer"
                          >
                            {quickAge}y
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#40484c] mb-1">{t('gender')}</label>
                    <div className="grid grid-cols-3 gap-1 bg-[#eff4ff] p-1 rounded-xl border border-[#dce9ff]">
                      {(['Male', 'Female', 'Other'] as const).map((g) => {
                        const genderLabel = g === 'Male' ? t('male') : g === 'Female' ? t('female') : t('other');
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              gender === g
                                ? 'bg-[#004357] text-white shadow-xs'
                                : 'text-[#40484c] hover:text-[#0b1c30]'
                            }`}
                          >
                            {genderLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#40484c] mb-1">
                      {t('mobile_number')}
                    </label>
                    <div className="flex items-center rounded-xl border border-[#bfc8cd] focus-within:border-[#006398] focus-within:ring-2 focus-within:ring-[#006398]/20 overflow-hidden bg-white">
                      <span className="px-2.5 py-2 bg-[#eff4ff] border-r border-[#dce9ff] text-xs font-bold text-[#004357]">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98201 48291"
                        className="w-full px-3 py-2 text-sm outline-none font-medium text-[#0b1c30]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#40484c] mb-1">
                      {t('email_address')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#bfc8cd] focus:border-[#006398] focus:ring-2 focus:ring-[#006398]/20 outline-none text-sm font-medium text-[#0b1c30]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#40484c] mb-1">
                      {t('city_residence')}
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bandra West, Mumbai"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#bfc8cd] focus:border-[#006398] focus:ring-2 focus:ring-[#006398]/20 outline-none text-sm font-medium text-[#0b1c30]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Clinical Vitals & ABHA Health Account */}
              <div>
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#e5eeff]">
                  <span className="w-6 h-6 rounded-full bg-[#004357] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="font-bold text-sm text-[#004357] uppercase tracking-wide">
                    {t('blood_group_step')}
                  </h2>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#40484c] mb-1.5">
                      {t('blood_group')}
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                      {BLOOD_GROUPS.map((bg) => (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => setBloodGroup(bg)}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            bloodGroup === bg
                              ? 'bg-[#006398] text-white border-[#006398] shadow-xs'
                              : 'bg-[#eff4ff] text-[#004357] border-[#dce9ff] hover:bg-[#dce9ff]'
                          }`}
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#40484c]">
                        {t('abha_number_label')}
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateAbhaId}
                        className="text-[11px] text-[#006398] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">autorenew</span>
                        {t('auto_generate_id')}
                      </button>
                    </div>
                    <div className="flex items-center rounded-xl border border-[#bfc8cd] focus-within:border-[#006398] overflow-hidden bg-white">
                      <input
                        type="text"
                        value={abhaId}
                        onChange={(e) => setAbhaId(e.target.value)}
                        placeholder="91-8492-4820-1102@abdm"
                        className="w-full px-3.5 py-2.5 text-xs font-mono font-semibold text-[#004357] outline-none"
                      />
                      <span className="px-3 py-2 bg-[#dcfce7] text-[#166534] text-[11px] font-bold border-l border-[#86efac] flex items-center gap-1 shrink-0">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        {t('verified')}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#70787d] mt-1">
                      Official 14-digit NDHM digital health identity standard under the Ayushman Bharat Digital Mission.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Allergies & Existing Health Conditions */}
              <div>
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#e5eeff]">
                  <span className="w-6 h-6 rounded-full bg-[#004357] text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="font-bold text-sm text-[#004357] uppercase tracking-wide">
                    {t('allergies_history')}
                  </h2>
                </div>

                <div className="space-y-3.5">
                  {/* Known Drug Allergies */}
                  <div>
                    <label className="block text-xs font-bold text-[#40484c] mb-1.5">
                      {t('known_allergies')}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_ALLERGIES.map((allergy) => {
                        const isSelected = selectedAllergies.includes(allergy);
                        const isNkda = allergy.includes('NKDA');
                        const translatedLabel = translateAllergy(language, allergy);

                        return (
                          <button
                            key={allergy}
                            type="button"
                            onClick={() => toggleAllergy(allergy)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? isNkda
                                  ? 'bg-[#dcfce7] text-[#166534] border-[#86efac]'
                                  : 'bg-[#ffdad6] text-[#ba1a1a] border-[#ffb4ab]'
                                : 'bg-white text-[#40484c] border-[#bfc8cd] hover:bg-[#eff4ff]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {isSelected ? (isNkda ? 'check_circle' : 'warning') : 'add'}
                            </span>
                            <span>{translatedLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Existing Conditions */}
                  <div>
                    <label className="block text-xs font-bold text-[#40484c] mb-1.5">
                      {t('existing_conditions')}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_CONDITIONS.map((cond) => {
                        const isSelected = selectedConditions.includes(cond);
                        const isHealthy = cond.includes('Healthy');
                        const translatedCond = translateCondition(language, cond);

                        return (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => toggleCondition(cond)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? isHealthy
                                  ? 'bg-[#dcfce7] text-[#166534] border-[#86efac]'
                                  : 'bg-[#cce5ff] text-[#004357] border-[#93ccff]'
                                : 'bg-white text-[#40484c] border-[#bfc8cd] hover:bg-[#eff4ff]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {isSelected ? 'check' : 'add'}
                            </span>
                            <span>{translatedCond}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Emergency Contact Details */}
              <div>
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#e5eeff]">
                  <span className="w-6 h-6 rounded-full bg-[#004357] text-white text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h2 className="font-bold text-sm text-[#004357] uppercase tracking-wide">
                    {t('emergency_contacts_step')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-2">
                  <div>
                    <label className="block text-xs font-bold text-[#40484c] mb-1">
                      {t('emergency_contact_person')}
                    </label>
                    <input
                      type="text"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      placeholder="e.g. Anita Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#bfc8cd] focus:border-[#006398] outline-none text-sm font-medium text-[#0b1c30]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#40484c] mb-1">
                      {t('emergency_contact_phone')}
                    </label>
                    <input
                      type="tel"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#bfc8cd] focus:border-[#006398] outline-none text-sm font-medium text-[#0b1c30]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA Button - Direct Health ID Creation */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-[#004357] hover:bg-[#003444] active:scale-99 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[22px]">verified_user</span>
                  <span>{t('create_health_id_btn')}</span>
                </button>
                <p className="text-center text-[11px] text-[#70787d] mt-2 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#166534]">check_circle</span>
                  <span>Directly generates your verified Ayushman Bharat Digital Health Account (ABHA)</span>
                </p>
              </div>
            </form>
          </div>

          {/* Right Column: Live Smart Health ID Card (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-gradient-to-br from-[#002b38] to-[#004357] rounded-2xl p-5 text-white shadow-xl border border-[#0d5c75] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5bb8fe]/15 rounded-full blur-2xl pointer-events-none"></div>

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-white/20 flex items-center justify-center shrink-0 border border-white/20">
                    <img
                      src="/assets/aistudio/WhatsApp_Image_2026-10-25_at_12.21.54_AM_4c858893.jpeg"
                      alt="Medisync Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold tracking-wider text-[#bde9ff] block">
                      {t('medisync_health_id')}
                    </span>
                    <span className="text-[9px] text-white/60">GOVT. OF INDIA • ABDM COMPLIANT</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/20 text-[#6ffbbe] text-[10px] font-bold border border-[#4edea3]/30">
                  {t('live_card')}
                </span>
              </div>

              {/* Card Body: User Avatar & Live Details */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#006398] to-[#5bb8fe] flex items-center justify-center text-white text-xl font-bold shadow-md border-2 border-white/30 shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-white truncate">
                    {fullName.trim() || 'Your Name Here'}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#bde9ff] mt-0.5">
                    <span>{age} yrs</span>
                    <span>•</span>
                    <span>{gender === 'Male' ? t('male') : gender === 'Female' ? t('female') : t('other')}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded bg-white/20 font-bold text-white text-[10px]">
                      {bloodGroup}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/70 block truncate mt-0.5">
                    {city || 'India'}
                  </span>
                </div>
              </div>

              {/* ABHA Barcode & Number */}
              <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs border border-white/10 space-y-1 mb-3">
                <div className="text-[9px] font-semibold text-[#bde9ff] uppercase tracking-wider flex items-center justify-between">
                  <span>{t('abha_number_label')}</span>
                  <span className="text-[#4edea3] text-[9px] font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[11px]">verified</span> {t('active')}
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-white tracking-wider">
                  {abhaId}
                </div>
              </div>

              {/* Health Badges */}
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-white/80">
                  <span>{t('known_allergies')}:</span>
                  <span
                    className={`font-semibold truncate max-w-[170px] ${
                      selectedAllergies.some((a) => !a.includes('NKDA'))
                        ? 'text-[#ffb4ab]'
                        : 'text-[#4edea3]'
                    }`}
                  >
                    {selectedAllergies.map((a) => translateAllergy(language, a)).join(', ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-white/80">
                  <span>{t('existing_conditions')}:</span>
                  <span className="font-semibold text-[#bde9ff] truncate max-w-[170px]">
                    {selectedConditions.map((c) => translateCondition(language, c))[0] || 'Routine Health'}
                  </span>
                </div>

                {emergencyContactName && (
                  <div className="flex items-center justify-between text-white/80">
                    <span>{t('emergency_contact_person')}:</span>
                    <span className="font-semibold text-white truncate max-w-[170px]">
                      {emergencyContactName} ({emergencyContactPhone})
                    </span>
                  </div>
                )}
              </div>

              {/* QR Scan Simulation */}
              <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[10px] text-white/60">
                <span>{t('scan_for_inpatient')}</span>
                <span className="material-symbols-outlined text-[20px] text-white/80">qr_code_2</span>
              </div>
            </div>

            {/* Privacy & Security Pledge */}
            <div className="p-4 rounded-xl bg-white border border-[#dce9ff] text-xs text-[#40484c] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#004357]">
                <span className="material-symbols-outlined text-[18px] text-[#006398]">security</span>
                <span>{t('privacy_guaranteed')}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#70787d]">
                Your health data is locally encrypted. You have granular consent control to hide or
                share individual diagnoses with family members or hospital staff.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e5eeff] py-3 text-center text-xs text-[#70787d]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t('app_title')} • {t('app_tagline')}</span>
          <span className="text-[11px]">Secure Point-of-Care EHR & Patient Vault</span>
        </div>
      </footer>
    </div>
  );
};
