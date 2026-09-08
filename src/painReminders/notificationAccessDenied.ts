import { LocalNotifications } from "@capacitor/local-notifications";

const DENIED = "denied";

export const notificationAccessDenied = async (): Promise<boolean> => {
  const { display } = await LocalNotifications.checkPermissions();
  return display === DENIED;
};
