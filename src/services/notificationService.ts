import * as Notifications from 'expo-notifications';

const DAILY_IDENTIFIER = 'tarocarta_daily_reminder';

Notifications.setNotificationHandler({
  handleNotification: async () =>
    ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }) as Notifications.NotificationBehavior,
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(title: string, body: string): Promise<boolean> {
  const granted = await requestNotificationPermission();
  if (!granted) return false;

  await Notifications.cancelScheduledNotificationAsync(DAILY_IDENTIFIER).catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_IDENTIFIER,
    content: { title, body },
    trigger: {
      hour: 9,
      minute: 0,
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
    },
  });

  return true;
}

export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(DAILY_IDENTIFIER).catch(() => {});
}

export async function isReminderEnabled(): Promise<boolean> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.some((n) => n.identifier === DAILY_IDENTIFIER);
}
