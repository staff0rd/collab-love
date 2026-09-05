import { createObservableBooleanPreference } from "../lib/booleanPreference.ts";

const preference = createObservableBooleanPreference("pain-reminders-enabled");

export const getPainRemindersEnabled = preference.get;
export const setPainRemindersEnabled = preference.set;
export const subscribeToPainReminderPreference = preference.subscribe;
