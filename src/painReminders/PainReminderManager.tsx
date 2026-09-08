import { usePainReminders } from "./usePainReminders.ts";
import { usePainReminderTap } from "./usePainReminderTap.ts";

const PainReminderManager = () => {
  usePainReminders();
  usePainReminderTap();
  return null;
};

export default PainReminderManager;
