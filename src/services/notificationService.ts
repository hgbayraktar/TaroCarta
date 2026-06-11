const DAILY_IDENTIFIER = 'tarocarta_daily_reminder';

async function getNotifications() {
  return import('expo-notifications');
}

export async function requestNotificationPermission(): Promise<boolean> {
  const Notifications = await getNotifications();
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(title: string, body: string): Promise<boolean> {
  const granted = await requestNotificationPermission();
  if (!granted) return false;

  const Notifications = await getNotifications();
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
  const Notifications = await getNotifications();
  await Notifications.cancelScheduledNotificationAsync(DAILY_IDENTIFIER).catch(() => {});
}

export async function isReminderEnabled(): Promise<boolean> {
  const Notifications = await getNotifications();
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.some((n) => n.identifier === DAILY_IDENTIFIER);
}
