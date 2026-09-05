import { LocalNotifications } from "@capacitor/local-notifications";

const GRANTED = "granted";

export const requestNotificationAccess = async (): Promise<boolean> => {
  const { display } = await LocalNotifications.requestPermissions();
  return display === GRANTED;
};
