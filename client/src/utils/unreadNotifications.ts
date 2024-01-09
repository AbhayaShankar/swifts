import { NotificationsType } from "../types";

export const unreadNotificationsFunc = (notification: NotificationsType) => {
  return notification.filter((notif) => notif.isRead === false);
};
