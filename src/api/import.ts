import type { AppData } from '../types';
import { updateData } from '../core/store';

export const importData = async (payload: Partial<AppData>): Promise<void> => {
  await updateData(payload as Record<string, unknown>);
};
