import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function useLocale() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const local = useCallback(
    <T extends Record<string, unknown>>(obj: T, field: string): T[typeof field] | undefined => {
      if (isAr) {
        const arKey = `${field}Ar` as keyof T;
        if (obj[arKey] !== undefined && obj[arKey] !== '') return obj[arKey];
      }
      return obj[field as keyof T];
    },
    [isAr]
  );

  return { isAr, local };
}
