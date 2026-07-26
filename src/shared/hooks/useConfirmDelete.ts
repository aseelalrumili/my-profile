import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function useConfirmDelete() {
  const { t } = useTranslation();
  const confirmDelete = useCallback(
    () => window.confirm(t('admin.confirmDelete')),
    [t]
  );
  return confirmDelete;
}
