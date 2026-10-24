import React, { useState } from 'react';
import {
  DEWORMING_VACCINES_DATA,
  DewormingVaccineItem,
  DietNutritionPlan,
  ExerciseActivity,
  INSURANCE_POLICY_DATA,
  PARTNER_ECOSYSTEM_DATA,
  PartnerOffer,
  SleepData,
  WELLNESS_CHECKUP_DATA,
  WELLNESS_DIET_DATA,
  WELLNESS_EXERCISE_DATA,
  WELLNESS_SLEEP_DATA,
} from '../../data/wellnessData';
import { LanguageCode, getTranslation } from '../../utils/i18n';

interface WellnessHubScreenProps {
  language: LanguageCode;
  onBookCheckup: () => void;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

export const WellnessHubScreen: React.FC<WellnessHubScreenProps> = ({
  language,
  onBookCheckup,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<
    'checkup' | 'diet' | 'sleep' | 'exercise' | 'deworming' | 'insurance'
  >('checkup');

  // Interactive local states for healthy habits
  const [diet, setDiet] = useState<DietNutritionPlan>(WELLNESS_DIET_DATA);
  const [sleep] = useState<SleepData>(WELLNESS_SLEEP_DATA);
  const [exercise, setExercise] = useState<ExerciseActivity>(WELLNESS_EXERCISE_DATA);
  const [dewormingList, setDewormingList] = useState<DewormingVaccineItem[]>(DEWORMING_VACCINES_DATA);
  const [checkup] = useState(WELLNESS_CHECKUP_DATA);
  const [selectedPartner, setSelectedPartner] = useState<PartnerOffer | null>(null);

  const t = (k: string) => getTranslation(language, k);

  // Handlers
  const handleLogWater = (increment: number) => {
    setDiet((prev) => {
      const newGlasses = Math.max(0, Math.min(12, prev.waterGlasses + increment));
      return { ...prev, waterGlasses: newGlasses };
    });
    onShowToast(`Hydration updated: ${diet.waterGlasses + increment} / 8 glasses logged!`);
  };

  const handleToggleMeal = (idx: number) => {
    setDiet((prev) => {
      const newMeals = [...prev.meals];
      newMeals[idx].logged = !newMeals[idx].logged;
      return { ...prev, meals: newMeals };
    });
    onShowToast(`Meal logging updated for ${diet.meals[idx].type}`);
  };

  const handleLogSteps = (addSteps: number) => {
    setExercise((prev) => {
      const newSteps = prev.stepsCount + addSteps;
      const newCals = prev.caloriesBurned + Math.round(addSteps * 0.045);
      return { ...prev, stepsCount: newSteps, caloriesBurned: newCals };
    });
    onShowToast(`+${addSteps.toLocaleString()} steps logged! Current: ${(exercise.stepsCount + addSteps).toLocaleString()}`);
  };

  const handleToggleRoutine = (id: string) => {
    setExercise((prev) => ({
      ...prev,
      routines: prev.routines.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      ),
    }));
    onShowToast(`Workout routine progress updated!`);
  };

  const handleMarkDewormingTaken = (id: string, title: string) => {
    setDewormingList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Up to Date',
              lastTaken: 'Today, Oct 23, 2026',
              nextDue: 'Apr 23, 2027 (in 6 months)',
            }
          : item
      )
    );
    onShowToast(`Marked ${title} as taken! Next schedule set for 6 months.`);
  };

  return (
    <div className="flex flex-col w-full pb-8 px-3 pt-3 space-y-3 text-xs">
      {/* Top Banner: Preventive Health Champion */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#004357]">{t('wellness_hub')}</h1>
          <p className="text-xs text-[#40484c]">
            Proactive Health, Balanced Lifestyle & Partner Rewards
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#6ffbbe]/40 text-[#002113] border border-[#4edea3]">
          <span className="material-symbols-outlined text-[16px] text-[#00472f]">spa</span>
          <span className="font-bold text-xs">92/100 Healthy</span>
        </div>
      </div>

      {/* 6 Core Pillars Segmented Bar */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 bg-[#dce9ff] p-1 rounded-xl shadow-inner">
        {[
          { id: 'checkup', label: '6-Mo Checkup', icon: 'medical_services' },
          { id: 'diet', label: 'Balanced Diet', icon: 'nutrition' },
          { id: 'sleep', label: 'Sleep Cycles', icon: 'bedtime' },
          { id: 'exercise', label: 'Fitness & Yoga', icon: 'fitness_center' },
          { id: 'deworming', label: 'Deworm & Vaccine', icon: 'vaccines' },
          { id: 'insurance', label: 'Insurance & Stores', icon: 'loyalty' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-[#004357] shadow-xs'
                  : 'text-[#40484c] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* PILLAR 1: 6-MONTH REGULAR CHECKUP MONITOR */}
      {activeTab === 'checkup' && (
        <div className="space-y-3">
          {/* Milestone Status Card */}
          <div className="p-4 rounded-xl bg-white border border-[#e5eeff] shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-[#006398] font-bold uppercase tracking-wider block">
                  Routine Bi-Annual Health Monitor
                </span>
                <h2 className="text-base font-bold text-[#0b1c30] mt-0.5">
                  6-Month Preventive Checkup
                </h2>
                <span className="text-[11px] text-[#40484c]">
                  Frequency: <strong>Every 6 Months</strong> • WHO Preventive Standard
                </span>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full bg-[#ffdad6] text-[#93000a] font-bold text-[10px] uppercase">
                  Due in {checkup.daysRemaining} Days
                </span>
                <span className="text-[10px] text-[#70787d] block mt-1">Due: {checkup.nextCheckupDate}</span>
              </div>
            </div>

            {/* Visual Timeline Bar */}
            <div className="p-3 rounded-xl bg-[#eff4ff] space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span>Last Done: <strong>{checkup.lastCheckupDate}</strong></span>
                <span className="text-[#004357] font-bold">Cycle 85% Complete</span>
                <span>Next Due: <strong>{checkup.nextCheckupDate}</strong></span>
              </div>
              <div className="w-full bg-[#bfc8cd]/40 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#006398] h-full rounded-full transition-all" style={{ width: '85%' }} />
              </div>
            </div>

            {/* CTA to schedule */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#006141] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                100% Cashless via Linked Insurance
              </span>
              <button
                onClick={onBookCheckup}
                className="px-4 py-2 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-98 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                <span>Book 6-Mo Checkup</span>
              </button>
            </div>
          </div>

          {/* Recommended Preventive Screenings */}
          <div className="p-3.5 rounded-xl bg-white border border-[#e5eeff] shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0b1c30]">
                Recommended 6-Month Bio-Screening Tests ({checkup.recommendedTests.length})
              </h3>
              <span className="text-[10px] text-[#70787d]">NABL Standard</span>
            </div>

            <div className="space-y-2">
              {checkup.recommendedTests.map((t, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] flex items-center justify-between"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`material-symbols-outlined text-[18px] mt-0.5 ${
                        t.done ? 'text-[#006141]' : 'text-[#70787d]'
                      }`}
                    >
                      {t.done ? 'check_circle' : 'pending'}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs text-[#0b1c30]">{t.name}</strong>
                        <span className="px-1.5 py-0.2 rounded bg-[#e5eeff] text-[#004357] text-[9px] font-semibold">
                          {t.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#40484c] block">{t.description}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.done ? 'bg-[#6ffbbe]/40 text-[#002113]' : 'bg-[#dce9ff] text-[#00476e]'
                    }`}
                  >
                    {t.done ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 2: PROPER BALANCED DIET & NUTRITION */}
      {activeTab === 'diet' && (
        <div className="space-y-3">
          {/* Calorie & Macronutrient Summary Card */}
          <div className="p-4 rounded-xl bg-white border border-[#e5eeff] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#006398] font-bold uppercase tracking-wider block">Daily Nutrition Targets</span>
                <div className="text-xl font-bold text-[#004357]">
                  {diet.currentCalories} <span className="text-xs text-[#40484c] font-normal">/ {diet.dailyCalorieTarget} kcal</span>
                </div>
              </div>
              {/* Hydration Interactive Logger */}
              <div className="p-2.5 rounded-xl bg-[#cce5ff]/40 border border-[#93ccff] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006398] text-[22px]">water_drop</span>
                <div>
                  <span className="text-[10px] text-[#00476e] font-bold block">Water Hydration</span>
                  <strong className="text-xs text-[#001d31]">{diet.waterGlasses} of {diet.waterTarget} Glasses</strong>
                </div>
                <div className="flex items-center gap-1 ml-1">
                  <button
                    onClick={() => handleLogWater(-1)}
                    className="w-6 h-6 rounded-md bg-white border border-[#bfc8cd] text-xs font-bold"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleLogWater(1)}
                    className="w-6 h-6 rounded-md bg-[#004357] text-white text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Macro Bars */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-lg bg-[#eff4ff]">
                <span className="text-[#70787d] block">Protein</span>
                <strong className="text-xs text-[#004357]">{diet.proteinGrams}g</strong>
                <span className="text-[9px] text-[#40484c] block">/ {diet.proteinTarget}g</span>
              </div>
              <div className="p-2 rounded-lg bg-[#eff4ff]">
                <span className="text-[#70787d] block">Carbs</span>
                <strong className="text-xs text-[#004357]">{diet.carbsGrams}g</strong>
                <span className="text-[9px] text-[#40484c] block">/ {diet.carbsTarget}g</span>
              </div>
              <div className="p-2 rounded-lg bg-[#eff4ff]">
                <span className="text-[#70787d] block">Healthy Fats</span>
                <strong className="text-xs text-[#004357]">{diet.fatsGrams}g</strong>
                <span className="text-[9px] text-[#40484c] block">/ {diet.fatsTarget}g</span>
              </div>
              <div className="p-2 rounded-lg bg-[#eff4ff]">
                <span className="text-[#70787d] block">Dietary Fiber</span>
                <strong className="text-xs text-[#006141]">{diet.fiberGrams}g</strong>
                <span className="text-[9px] text-[#40484c] block">/ {diet.fiberTarget}g</span>
              </div>
            </div>

            {/* Balanced Plate Visualizer: 50% Veggies / 25% Protein / 25% Grains */}
            <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <strong className="text-[#0b1c30]">The Golden Balanced Plate Rule</strong>
                <span className="text-[#006141] font-semibold">ICMR & Harvard Nutrition Guide</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden">
                <div className="bg-[#6ffbbe] w-1/2 flex items-center justify-center text-[8px] font-bold text-[#002113]">
                  50% Veg & Salad
                </div>
                <div className="bg-[#5bb8fe] w-1/4 flex items-center justify-center text-[8px] font-bold text-[#001d31]">
                  25% Protein
                </div>
                <div className="bg-[#dce9ff] w-1/4 flex items-center justify-center text-[8px] font-bold text-[#00476e]">
                  25% Grains
                </div>
              </div>
            </div>
          </div>

          {/* Daily Meal Schedule & Log */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <h3 className="font-bold text-sm text-[#0b1c30]">Today's Balanced Meal Planner</h3>
              <span className="text-[10px] text-[#006398]">Tap to mark completed</span>
            </div>

            {diet.meals.map((meal, idx) => (
              <div
                key={meal.type}
                onClick={() => handleToggleMeal(idx)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  meal.logged ? 'bg-white border-[#93ccff]' : 'bg-[#f8f9ff] border-[#e5eeff]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`material-symbols-outlined text-[20px] mt-0.5 ${
                      meal.logged ? 'text-[#006141]' : 'text-[#70787d]'
                    }`}
                  >
                    {meal.logged ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-xs text-[#0b1c30]">{meal.type}: {meal.title}</strong>
                      <span className="px-1.5 py-0.2 rounded bg-[#e5eeff] text-[#004357] font-bold text-[9px]">
                        {meal.calories} kcal
                      </span>
                    </div>
                    <p className="text-[10px] text-[#40484c] mt-0.5">{meal.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PILLAR 3: SLEEP PATTERNS & CIRCADIAN RHYTHM */}
      {activeTab === 'sleep' && (
        <div className="space-y-3">
          {/* Main Sleep Quality Dashboard */}
          <div className="p-4 rounded-xl bg-white border border-[#e5eeff] shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-[#006398] font-bold uppercase tracking-wider block">Last Night's Sleep</span>
                <div className="text-2xl font-bold text-[#004357] mt-0.5">
                  {sleep.totalHours}
                </div>
                <span className="text-[11px] text-[#40484c]">
                  Bedtime: {sleep.bedTime} • Wake-up: {sleep.wakeTime}
                </span>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 rounded-full bg-[#e5eeff] border-2 border-[#006398] flex items-center justify-center text-sm font-bold text-[#004357]">
                  {sleep.sleepScore}
                </div>
                <span className="text-[10px] text-[#006141] font-bold block mt-1">Excellent Recovery</span>
              </div>
            </div>

            {/* Sleep Stages Progress Bars */}
            <div className="space-y-2 pt-1 border-t border-[#f0f4ff]">
              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-[#0b1c30] font-semibold">Deep Sleep (Physical & Tissue Repair)</span>
                  <span className="font-bold text-[#004357]">{sleep.deepSleep} ({sleep.deepSleepPercent}%)</span>
                </div>
                <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#004357] h-full rounded-full" style={{ width: `${sleep.deepSleepPercent * 2.5}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-[#0b1c30] font-semibold">REM Sleep (Mental Processing & Memory)</span>
                  <span className="font-bold text-[#006398]">{sleep.remSleep} ({sleep.remSleepPercent}%)</span>
                </div>
                <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#5bb8fe] h-full rounded-full" style={{ width: `${sleep.remSleepPercent * 2.5}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-[#0b1c30] font-semibold">Light Sleep (Core Rest)</span>
                  <span className="font-bold text-[#70787d]">{sleep.lightSleep} ({sleep.lightSleepPercent}%)</span>
                </div>
                <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#bfc8cd] h-full rounded-full" style={{ width: `${sleep.lightSleepPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Sleep Duration Trend */}
          <div className="p-3.5 rounded-xl bg-white border border-[#e5eeff] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0b1c30]">7-Day Sleep Consistency</h3>
              <span className="text-[10px] text-[#006141] font-bold">Circadian Rhythm: Optimal</span>
            </div>

            <div className="grid grid-cols-7 gap-1 pt-2 items-end h-24">
              {sleep.trendDays.map((td) => (
                <div key={td.day} className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[9px] font-bold text-[#004357]">{td.hours}h</span>
                  <div
                    className="w-full bg-[#5bb8fe] rounded-t-md transition-all hover:bg-[#004357]"
                    style={{ height: `${(td.hours / 9) * 100}%` }}
                    title={`${td.day}: ${td.hours}h, Score: ${td.score}`}
                  />
                  <span className="text-[10px] text-[#70787d]">{td.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 4: EXERCISE ROUTINES & FITNESS */}
      {activeTab === 'exercise' && (
        <div className="space-y-3">
          {/* Daily Activity Tracker */}
          <div className="p-4 rounded-xl bg-white border border-[#e5eeff] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#006398] font-bold uppercase tracking-wider block">Today's Step Count</span>
                <div className="text-2xl font-bold text-[#004357] tabular-nums">
                  {exercise.stepsCount.toLocaleString()} <span className="text-xs text-[#40484c] font-normal">/ {exercise.stepsTarget.toLocaleString()}</span>
                </div>
                <span className="text-[10px] text-[#006141] font-bold">
                  🔥 14-Day Healthy Habit Streak Active!
                </span>
              </div>
              <button
                onClick={() => handleLogSteps(1000)}
                className="px-3 py-1.5 rounded-xl bg-[#e5eeff] hover:bg-[#dce9ff] text-[#004357] font-bold text-xs flex items-center gap-1 shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px]">directions_walk</span>
                <span>+1,000 Steps</span>
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#eff4ff] h-3 rounded-full overflow-hidden">
              <div
                className="bg-[#004357] h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (exercise.stepsCount / exercise.stepsTarget) * 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-[#eff4ff]">
                <span className="text-[10px] text-[#70787d] block">Active Burn</span>
                <strong className="text-sm text-[#ba1a1a]">{exercise.caloriesBurned} kcal</strong>
              </div>
              <div className="p-2 rounded-lg bg-[#eff4ff]">
                <span className="text-[10px] text-[#70787d] block">Active Minutes</span>
                <strong className="text-sm text-[#004357]">{exercise.activeMinutes} mins</strong>
              </div>
            </div>
          </div>

          {/* Curated Daily Routines (Yoga, Pilates, Cardio) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <h3 className="font-bold text-sm text-[#0b1c30]">Daily Workout Routines</h3>
              <span className="text-[10px] text-[#006398]">Tap to toggle completion</span>
            </div>

            {exercise.routines.map((routine) => (
              <div
                key={routine.id}
                onClick={() => handleToggleRoutine(routine.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  routine.completed ? 'bg-white border-[#93ccff]' : 'bg-[#f8f9ff] border-[#e5eeff]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`material-symbols-outlined text-[20px] mt-0.5 ${
                      routine.completed ? 'text-[#006141]' : 'text-[#70787d]'
                    }`}
                  >
                    {routine.completed ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <strong className="text-xs text-[#0b1c30]">{routine.title}</strong>
                      <span className="px-1.5 py-0.2 rounded bg-[#e5eeff] text-[#004357] font-bold text-[9px]">
                        {routine.category}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#40484c] mt-0.5">
                      {routine.duration} • {routine.intensity} Intensity • {routine.instructorOrStudio}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PILLAR 5: DEWORMING & VACCINES (PREVENTIVE PROPHYLAXIS) */}
      {activeTab === 'deworming' && (
        <div className="space-y-3">
          {/* Highlight Card for Deworming (WHO Standard) */}
          <div className="p-4 rounded-xl bg-[#cce5ff]/40 border border-[#93ccff] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004357] text-[22px]">medication</span>
                <div>
                  <h3 className="font-bold text-sm text-[#001d31]">WHO Bi-Annual Deworming Protocol</h3>
                  <span className="text-[10px] text-[#00476e]">Recommended for adults and all family members every 6 months</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold">
                Due Soon
              </span>
            </div>
            <p className="text-[11px] text-[#00476e] leading-relaxed">
              Periodic preventive deworming (Albendazole 400mg) flushes gastrointestinal parasites, boosts micro-nutrient absorption (iron & B12), and prevents chronic fatigue.
            </p>
          </div>

          {/* Deworming & Vaccine Items List */}
          <div className="space-y-2.5">
            {dewormingList.map((item) => {
              const isDue = item.status === 'Due Soon';

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white border border-[#e5eeff] shadow-xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-sm text-[#0b1c30]">{item.title}</strong>
                        <span className="px-1.5 py-0.2 rounded bg-[#e5eeff] text-[#004357] text-[10px] font-bold">
                          {item.type}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#006398] font-semibold block mt-0.5">
                        {item.doseDetails}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Up to Date'
                          ? 'bg-[#6ffbbe]/50 text-[#002113]'
                          : 'bg-[#ffdad6] text-[#93000a]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#40484c] leading-relaxed">
                    {item.protectionFor}
                  </p>

                  <div className="pt-2 border-t border-[#f0f4ff] flex items-center justify-between text-[11px]">
                    <span className="text-[#70787d]">
                      Next Schedule: <strong className="text-[#0b1c30]">{item.nextDue}</strong>
                    </span>

                    {isDue && (
                      <button
                        onClick={() => handleMarkDewormingTaken(item.id, item.title)}
                        className="px-3 py-1 rounded-lg bg-[#004357] text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-98"
                      >
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        <span>Mark as Taken</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PILLAR 6: HEALTH INSURANCE LINKED & PARTNER INCOME STREAMS */}
      {activeTab === 'insurance' && (
        <div className="space-y-3">
          {/* Linked Insurance Card with Premium Discount */}
          <div className="p-4 rounded-xl bg-white border border-[#e5eeff] shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-[#006398] font-bold uppercase tracking-wider block">
                  Linked Health Insurance Policy
                </span>
                <h3 className="text-sm font-bold text-[#0b1c30] mt-0.5">
                  {INSURANCE_POLICY_DATA.policyName}
                </h3>
                <span className="text-[10px] text-[#70787d] font-mono">
                  Policy #{INSURANCE_POLICY_DATA.policyNo}
                </span>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full bg-[#6ffbbe] text-[#002113] font-bold text-[10px]">
                  {INSURANCE_POLICY_DATA.wellnessDiscountPercent}% Renewal Rebate
                </span>
                <span className="text-[10px] text-[#006141] font-bold block mt-1">
                  Saved {INSURANCE_POLICY_DATA.wellnessDiscountEarned}
                </span>
              </div>
            </div>

            {/* Active Perks Ribbon */}
            <div className="p-3 rounded-xl bg-[#eff4ff] space-y-1 text-[11px] text-[#004357]">
              <strong className="block text-xs text-[#001d31]">Active Wellness Perks Unlocked:</strong>
              <ul className="space-y-1">
                {INSURANCE_POLICY_DATA.activePerks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006141] text-[15px]">verified</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Revenue Stream Marketplace: Yoga / Pilates Studios & Medical Stores */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-0.5">
              <div>
                <h3 className="font-bold text-sm text-[#0b1c30]">Wellness Partner Network & Offers</h3>
                <span className="text-[10px] text-[#70787d]">
                  Income streams from partner studios, medical stores & insurers
                </span>
              </div>
            </div>

            {PARTNER_ECOSYSTEM_DATA.map((offer) => (
              <div
                key={offer.id}
                className="p-3.5 rounded-xl bg-white border border-[#e5eeff] shadow-xs flex flex-col gap-2 hover:border-[#93ccff] transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <img
                      src={offer.photoUrl}
                      alt={offer.title}
                      className="w-14 h-14 rounded-xl object-cover border border-[#dce9ff] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <strong className="text-sm text-[#0b1c30] truncate">{offer.title}</strong>
                        <span className="px-1.5 py-0.2 rounded bg-[#ffdad6] text-[#93000a] text-[9px] font-bold">
                          {offer.discountBadge}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#006398] font-semibold mt-0.5">
                        {offer.provider}
                      </div>
                      <div className="text-[10px] text-[#006141] font-bold mt-0.5">
                        {offer.priceOrSaving}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[#40484c] leading-relaxed">
                  {offer.description}
                </p>

                <div className="p-2 rounded-lg bg-[#f8f9ff] flex items-center justify-between text-[10px]">
                  <span className="text-[#70787d]">Ecosystem Monetization:</span>
                  <span className="text-[#004357] font-bold">{offer.platformCommissionNote}</span>
                </div>

                <div className="pt-2 border-t border-[#f0f4ff] flex items-center justify-end">
                  <button
                    onClick={() => setSelectedPartner(offer)}
                    className="px-4 py-1.5 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-98 transition-all"
                  >
                    <span>{offer.linkText}</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PARTNER BOOKING & COMMERCE MODAL */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col overflow-hidden">
            <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#004357]">{selectedPartner.title}</h3>
                <span className="text-xs text-[#40484c]">{selectedPartner.provider}</span>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#70787d] hover:bg-[#dce9ff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs">
              <img
                src={selectedPartner.photoUrl}
                alt={selectedPartner.title}
                className="w-full h-36 rounded-xl object-cover"
              />

              <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
                <strong className="text-xs text-[#004357] block mb-1">Medisync Partner Perks</strong>
                <p className="text-[#0b1c30] leading-relaxed">{selectedPartner.description}</p>
                <div className="mt-2 text-sm font-bold text-[#006141]">{selectedPartner.priceOrSaving}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#f8f9ff] text-[10px] text-[#70787d]">
                Integrated Partner Checkout via UPI & Insurance OPD credits. Free cancellation up to 4 hours prior.
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#e5eeff]">
                <button
                  type="button"
                  onClick={() => setSelectedPartner(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#bfc8cd] text-[#40484c]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onShowToast(`Booking / Order request sent to ${selectedPartner.provider}!`);
                    setSelectedPartner(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#004357] text-white font-bold text-xs"
                >
                  Confirm & Apply Member Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
