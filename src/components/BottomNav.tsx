import React from 'react';
import { LanguageCode, getTranslation } from '../utils/i18n';

interface BottomNavProps {
  appRole: 'doctor' | 'patient' | 'wellness';
  activeScreen: string;
  onNavigate: (screen: any) => void;
  language: LanguageCode;
  pendingRxCount?: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  appRole,
  activeScreen,
  onNavigate,
  language,
  pendingRxCount = 0,
}) => {
  const t = (k: string) => getTranslation(language, k);

  const doctorNavItems: NavItem[] = [
    { id: 'patients', label: t('patients'), icon: 'group' },
    { id: 'chart', label: t('chart'), icon: 'clinical_notes' },
    { id: 'rx', label: 'Rx', icon: 'prescriptions', badge: pendingRxCount > 0 ? pendingRxCount : undefined },
    { id: 'pharmacy', label: t('pharmacy'), icon: 'local_pharmacy' },
  ];

  const patientNavItems: NavItem[] = [
    { id: 'chart', label: t('chart'), icon: 'vital_signs' },
    { id: 'appointments', label: t('appointments'), icon: 'calendar_month' },
    { id: 'prescriptions', label: t('prescriptions'), icon: 'pill' },
    { id: 'records_vault', label: t('records_vault'), icon: 'folder_shared' },
    { id: 'payments_billing', label: t('payments_billing'), icon: 'payments' },
  ];

  const wellnessNavItems: NavItem[] = [
    { id: 'wellness_main', label: 'Wellness', icon: 'spa' },
    { id: 'appointments', label: 'Bookings', icon: 'calendar_month' },
    { id: 'records_vault', label: 'Vault', icon: 'folder_shared' },
    { id: 'payments_billing', label: 'Insurance', icon: 'loyalty' },
  ];

  const navItems =
    appRole === 'doctor'
      ? doctorNavItems
      : appRole === 'wellness'
      ? wellnessNavItems
      : patientNavItems;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/95 backdrop-blur-xl border-t border-[#e5eeff] shadow-[0_-1px_8px_rgba(0,0,0,0.04)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            activeScreen === item.id ||
            (appRole === 'wellness' && activeScreen === 'wellness' && item.id === 'wellness_main');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id === 'wellness_main' ? 'wellness' : item.id)}
              className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] transition-colors relative ${
                isActive ? 'text-[#004357] font-semibold' : 'text-[#40484c] hover:text-[#0b1c30]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#ba1a1a] text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="font-label-sm text-[10px] mt-0.5 tracking-normal whitespace-nowrap truncate max-w-[68px]">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 rounded-full bg-[#004357]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
