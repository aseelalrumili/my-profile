import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function useLocale() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const local = useCallback(
    <T extends object, K extends keyof T & string>(obj: T, field: K): T[K] | undefined => {
      if (isAr) {
        const arKey = `${field}Ar` as K;
        if (arKey in obj) {
          const val = obj[arKey];
          if (val !== undefined && val !== null && val !== '') return val;
        }
      }
      return obj[field];
    },
    [isAr]
  );

  return { isAr, local };
}
