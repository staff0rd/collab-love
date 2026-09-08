import { cancelPainReminders } from "./cancelPainReminders.ts";
import { setPainRemindersEnabled } from "./painReminderPreference.ts";

export const disablePainReminders = async (): Promise<void> => {
  await setPainRemindersEnabled(false);
  await cancelPainReminders();
};
