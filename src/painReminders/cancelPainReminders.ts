import { LocalNotifications } from "@capacitor/local-notifications";

import { PAIN_REMINDER_IDS } from "./painReminderSchedule.ts";

export const cancelPainReminders = async (): Promise<void> => {
  await LocalNotifications.cancel({
    notifications: PAIN_REMINDER_IDS.map((id) => ({ id })),
  });
};
