import { LocalNotifications, type LocalNotificationSchema } from "@capacitor/local-notifications";

import { PAIN_REMINDER_IDS, type PainReminder } from "./painReminderSchedule.ts";

const NOTHING = 0;

const notificationFor = (reminder: PainReminder): LocalNotificationSchema => ({
  body: `The ${reminder.label} reading hasn't been recorded yet.`,
  id: reminder.id,
  schedule: { at: reminder.at },
  title: "Pain reading due",
});

export const reconcilePainReminders = async (desired: PainReminder[]): Promise<void> => {
  const { notifications } = await LocalNotifications.getPending();
  const scheduledIds = notifications
    .map((notification) => notification.id)
    .filter((id) => PAIN_REMINDER_IDS.includes(id));

  const stale = scheduledIds.filter((id) => !desired.some((reminder) => reminder.id === id));
  if (stale.length > NOTHING) {
    await LocalNotifications.cancel({ notifications: stale.map((id) => ({ id })) });
  }

  const missing = desired.filter((reminder) => !scheduledIds.includes(reminder.id));
  if (missing.length > NOTHING) {
    await LocalNotifications.schedule({ notifications: missing.map(notificationFor) });
  }
};
