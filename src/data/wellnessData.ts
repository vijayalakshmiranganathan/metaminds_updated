export interface CheckupMilestone {
  lastCheckupDate: string;
  nextCheckupDate: string;
  daysRemaining: number;
  frequency: string;
  status: 'Due Soon' | 'Completed' | 'Upcoming';
  complianceRate: number;
  recommendedTests: { name: string; category: string; description: string; done: boolean }[];
}

export interface DietNutritionPlan {
  dailyCalorieTarget: number;
  currentCalories: number;
  proteinGrams: number;
  proteinTarget: number;
  carbsGrams: number;
  carbsTarget: number;
  fatsGrams: number;
  fatsTarget: number;
  fiberGrams: number;
  fiberTarget: number;
  waterGlasses: number;
  waterTarget: number;
  plateRatio: {
    veggies: number; // 50%
    proteins: number; // 25%
    grains: number; // 25%
  };
  meals: {
    type: 'Breakfast' | 'Lunch' | 'Evening Snack' | 'Dinner';
    title: string;
    calories: number;
    description: string;
    logged: boolean;
  }[];
}

export interface SleepData {
  totalHours: string;
  sleepScore: number;
  bedTime: string;
  wakeTime: string;
  deepSleep: string;
  deepSleepPercent: number;
  remSleep: string;
  remSleepPercent: number;
  lightSleep: string;
  lightSleepPercent: number;
  circadianAlignment: 'Optimal' | 'Irregular' | 'Fair';
  trendDays: { day: string; hours: number; score: number }[];
}

export interface ExerciseActivity {
  stepsCount: number;
  stepsTarget: number;
  caloriesBurned: number;
  activeMinutes: number;
  streakDays: number;
  routines: {
    id: string;
    title: string;
    duration: string;
    intensity: 'Low' | 'Medium' | 'High';
    category: 'Yoga' | 'Pilates' | 'Cardio' | 'Strength';
    instructorOrStudio: string;
    completed: boolean;
  }[];
}

export interface DewormingVaccineItem {
  id: string;
  title: string;
  type: 'Deworming' | 'Vaccine';
  targetAudience: string;
  frequency: string;
  lastTaken: string;
  nextDue: string;
  status: 'Due Soon' | 'Up to Date' | 'Recommended';
  doseDetails: string;
  protectionFor: string;
}

export interface PartnerOffer {
  id: string;
  title: string;
  category: 'Pilates / Yoga' | 'Medical Store' | 'Insurance Partner';
  provider: string;
  discountBadge: string;
  priceOrSaving: string;
  platformCommissionNote: string;
  description: string;
  linkText: string;
  photoUrl: string;
}

export interface InsurancePolicyLink {
  policyName: string;
  policyNo: string;
  provider: string;
  sumInsured: string;
  wellnessDiscountEarned: string;
  wellnessDiscountPercent: number;
  cashlessHospitalsCount: number;
  nextRenewalDate: string;
  activePerks: string[];
}

export const WELLNESS_CHECKUP_DATA: CheckupMilestone = {
  lastCheckupDate: 'May 12, 2026',
  nextCheckupDate: 'Nov 12, 2026',
  daysRemaining: 20,
  frequency: 'Every 6 Months',
  status: 'Due Soon',
  complianceRate: 100,
  recommendedTests: [
    { name: 'Complete Blood Count (CBC) & ESR', category: 'General Bio-Screen', description: 'Screen for hidden infections, anemia, platelet levels', done: true },
    { name: 'Fasting Blood Glucose & HbA1c', category: 'Metabolic Screen', description: 'Monitor glycemic control and early insulin resistance', done: true },
    { name: 'Lipid Cardiovascular Profile', category: 'Heart Health', description: 'Cholesterol, HDL, LDL, Triglycerides ratio', done: false },
    { name: 'Kidney (KFT) & Liver (LFT) Function', category: 'Vital Organs', description: 'Serum creatinine, eGFR, SGOT, SGPT enzymes', done: false },
    { name: 'Dental Prophylaxis & Deep Scaling', category: 'Oral Health', description: 'Semi-annual plaque removal & gum health check', done: false },
    { name: 'Ophthalmology Vision & Retinal Screen', category: 'Sensory Health', description: 'Refraction & intraocular pressure (glaucoma screening)', done: true },
  ],
};

export const WELLNESS_DIET_DATA: DietNutritionPlan = {
  dailyCalorieTarget: 1850,
  currentCalories: 1420,
  proteinGrams: 75,
  proteinTarget: 85,
  carbsGrams: 180,
  carbsTarget: 210,
  fatsGrams: 42,
  fatsTarget: 50,
  fiberGrams: 28,
  fiberTarget: 35,
  waterGlasses: 6,
  waterTarget: 8,
  plateRatio: {
    veggies: 50,
    proteins: 25,
    grains: 25,
  },
  meals: [
    {
      type: 'Breakfast',
      title: 'Warm Sprouted Moong Salad & Besan Chilla',
      calories: 340,
      description: 'High protein plant-based start with mint coriander chutney, rich in vitamins & folate.',
      logged: true,
    },
    {
      type: 'Lunch',
      title: 'Rainbow Salad + Yellow Dal + Jowar/Ragi Roti',
      calories: 520,
      description: 'Slow-burning complex carbohydrates, prebiotic fiber, and probiotics from fresh buttermilk.',
      logged: true,
    },
    {
      type: 'Evening Snack',
      title: 'Roasted Foxnuts (Makhana) & Handful Almonds',
      calories: 160,
      description: 'Rich in magnesium and antioxidants with herbal green tea infusion.',
      logged: true,
    },
    {
      type: 'Dinner',
      title: 'Grilled Paneer / Tofu with Steamed Vegetables',
      calories: 400,
      description: 'Light, restorative dinner supporting overnight muscle recovery and stable sleep glucose.',
      logged: false,
    },
  ],
};

export const WELLNESS_SLEEP_DATA: SleepData = {
  totalHours: '7h 48m',
  sleepScore: 89,
  bedTime: '10:30 PM',
  wakeTime: '06:18 AM',
  deepSleep: '1h 42m',
  deepSleepPercent: 22,
  remSleep: '1h 55m',
  remSleepPercent: 25,
  lightSleep: '4h 11m',
  lightSleepPercent: 53,
  circadianAlignment: 'Optimal',
  trendDays: [
    { day: 'Mon', hours: 7.4, score: 86 },
    { day: 'Tue', hours: 7.8, score: 89 },
    { day: 'Wed', hours: 7.2, score: 84 },
    { day: 'Thu', hours: 8.1, score: 92 },
    { day: 'Fri', hours: 7.6, score: 88 },
    { day: 'Sat', hours: 8.3, score: 94 },
    { day: 'Sun', hours: 7.8, score: 89 },
  ],
};

export const WELLNESS_EXERCISE_DATA: ExerciseActivity = {
  stepsCount: 8740,
  stepsTarget: 10000,
  caloriesBurned: 485,
  activeMinutes: 52,
  streakDays: 14,
  routines: [
    {
      id: 'ex-1',
      title: 'Hatha Sun Salutations & Pranayama',
      duration: '30 mins',
      intensity: 'Low',
      category: 'Yoga',
      instructorOrStudio: 'Ananda Mindful Yoga Studio',
      completed: true,
    },
    {
      id: 'ex-2',
      title: 'Core & Spinal Reformer Alignment',
      duration: '45 mins',
      intensity: 'Medium',
      category: 'Pilates',
      instructorOrStudio: 'The Reformer Pilates Sanctuary',
      completed: true,
    },
    {
      id: 'ex-3',
      title: 'Evening Zone-2 Cardiovascular Brisk Walk',
      duration: '35 mins',
      intensity: 'Medium',
      category: 'Cardio',
      instructorOrStudio: 'Outdoor Joggers Track',
      completed: false,
    },
    {
      id: 'ex-4',
      title: 'Functional Bodyweight Mobility & Stretching',
      duration: '20 mins',
      intensity: 'Low',
      category: 'Strength',
      instructorOrStudio: 'Cult.fit Daily Routine',
      completed: false,
    },
  ],
};

export const DEWORMING_VACCINES_DATA: DewormingVaccineItem[] = [
  {
    id: 'dew-1',
    title: 'Routine Bi-Annual Deworming',
    type: 'Deworming',
    targetAudience: 'Adults & Entire Household',
    frequency: 'Every 6 Months (WHO Protocol)',
    lastTaken: 'Apr 25, 2026',
    nextDue: 'Oct 25, 2026',
    status: 'Due Soon',
    doseDetails: 'Albendazole 400 mg (Chewable single dose with evening meal)',
    protectionFor: 'Eliminates intestinal helminthes, pinworms & parasites. Improves gut nutrient absorption and reduces unexplained fatigue.',
  },
  {
    id: 'vac-1',
    title: 'Annual Quadrivalent Influenza (Flu) Vaccine',
    type: 'Vaccine',
    targetAudience: 'Adults & High Immunity Prophylaxis',
    frequency: 'Once Annually (Pre-Winter)',
    lastTaken: 'Nov 14, 2025',
    nextDue: 'Nov 14, 2026',
    status: 'Due Soon',
    doseDetails: 'Single 0.5 mL Intramuscular injection (Deltoid)',
    protectionFor: 'Protects against 4 seasonal influenza strains (H1N1, H3N2, Victoria & Yamagata lineages). Reduces respiratory infection risk by 70%.',
  },
  {
    id: 'vac-2',
    title: 'Tetanus, Diphtheria & Acellular Pertussis (Tdap)',
    type: 'Vaccine',
    targetAudience: 'All Adults',
    frequency: 'Booster Every 10 Years',
    lastTaken: 'Jun 10, 2021',
    nextDue: 'Jun 10, 2031',
    status: 'Up to Date',
    doseDetails: 'Single booster injection',
    protectionFor: 'Guards against lockjaw from accidental metal scratches, whooping cough, and respiratory diphtheria toxins.',
  },
  {
    id: 'vac-3',
    title: 'Hepatitis B Recombinant Vaccine',
    type: 'Vaccine',
    targetAudience: 'Standard Prophylaxis',
    frequency: '3-Dose Completed Course (Lifelong)',
    lastTaken: '2018 (3 Doses)',
    nextDue: 'Lifelong Immunity',
    status: 'Up to Date',
    doseDetails: 'Completed 3-dose series (0, 1, 6 months)',
    protectionFor: '100% protection against Hepatitis B virus liver inflammation and chronic cirrhosis.',
  },
  {
    id: 'vac-4',
    title: 'Pneumococcal Conjugate Vaccine (PCV20)',
    type: 'Vaccine',
    targetAudience: 'Adults 50+ / Cardiology Prophylaxis',
    frequency: 'Single Lifetime Dose',
    lastTaken: 'Not Yet Administered',
    nextDue: 'Recommended at 60y',
    status: 'Recommended',
    doseDetails: 'PCV20 / PPSV23 vaccination schedule',
    protectionFor: 'Protects against invasive bacterial pneumonia, bacteremia, and meningitis.',
  },
];

export const INSURANCE_POLICY_DATA: InsurancePolicyLink = {
  policyName: 'HDFC ERGO Optima Secure + Medisync Wellness Rider',
  policyNo: 'MED-PREV-2026-94821',
  provider: 'HDFC ERGO / Star Health Integrated Network',
  sumInsured: '₹10,00,000 Cashless',
  wellnessDiscountEarned: '₹3,450 / yr',
  wellnessDiscountPercent: 15,
  cashlessHospitalsCount: 14200,
  nextRenewalDate: 'Apr 18, 2027',
  activePerks: [
    '15% Renewal Discount unlocked via 8,000+ daily steps & 6-month checkup',
    'Free Bi-Annual Full Body Checkup (100% Cashless at St. Jude Labs)',
    '₹5,000 Annual OPD Pharmacy Voucher redeemable at partner medical stores',
    'Unlimited teleconsultations with General Physicians & Clinical Nutritionists',
  ],
};

export const PARTNER_ECOSYSTEM_DATA: PartnerOffer[] = [
  {
    id: 'part-1',
    title: 'The Reformer Pilates Sanctuary',
    category: 'Pilates / Yoga',
    provider: 'The Reformer Studio • Bandra West',
    discountBadge: '20% Medisync Member Off',
    priceOrSaving: '₹1,200 / session (Reg: ₹1,500)',
    platformCommissionNote: 'Medisync receives 15% booking revenue stream',
    description: 'Customized clinical reformer pilates targeting core activation, pelvic stabilization, and spinal posture alignment with master trainers.',
    linkText: 'Book Trial Session',
    photoUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-2',
    title: 'Ananda Mindful Yoga Studio',
    category: 'Pilates / Yoga',
    provider: 'Ananda Health • Juhu & Virtual Live',
    discountBadge: 'Flat ₹500 Off First Month',
    priceOrSaving: '₹2,500 / month (Unlimited Batches)',
    platformCommissionNote: 'Medisync receives 15% recurring affiliate revenue',
    description: 'Daily morning Hatha Yoga, Pranayama breathwork, and guided meditation to regulate cortisol levels and optimize blood pressure.',
    linkText: 'Enroll in Yoga Batch',
    photoUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-3',
    title: 'Albendazole 400mg Deworming Family Kit',
    category: 'Medical Store',
    provider: 'Apollo Pharmacy & Tata 1mg Partner Store',
    discountBadge: 'Free 2-Hour Home Delivery',
    priceOrSaving: '₹45 (Pack of 2 Tablets)',
    platformCommissionNote: 'Medisync receives 10% pharmacy fulfillment revenue',
    description: 'WHO-recommended biannual chewable deworming tablets with peppermint flavor. Safe for entire household preventive wellness.',
    linkText: 'Order Deworming Kit',
    photoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-4',
    title: 'Plant Protein & Multivitamin Daily Booster',
    category: 'Medical Store',
    provider: 'Tata 1mg Wellness Express',
    discountBadge: 'Buy 1 Get 1 at 25% Off',
    priceOrSaving: '₹1,299 (1 kg Vanilla Almond)',
    platformCommissionNote: 'Medisync receives 12% retail store commission',
    description: 'Zero added sugar, pea and brown rice protein isolate infused with 24 essential vitamins, zinc, and prebiotics for sustained vitality.',
    linkText: 'Order from Medical Store',
    photoUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-5',
    title: 'Star Health / HDFC Super Top-Up Insurance',
    category: 'Insurance Partner',
    provider: 'Star Health & Allied Insurance Co.',
    discountBadge: 'Up to 20% Health Discount',
    priceOrSaving: '₹1 Crore Cover from ₹580/mo',
    platformCommissionNote: 'Medisync receives recurring broker partnership fee',
    description: 'Link your Medisync daily step count and 6-month checkup reports to instantly slash your health insurance renewal premiums.',
    linkText: 'Link Insurance Policy',
    photoUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=240&auto=format&fit=crop&q=80',
  },
];
