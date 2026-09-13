export const scheduledItemIntent = <Detail extends Record<string, string>>(
  detail: Detail,
  now: Date,
) => ({
  ...detail,
  clientNow: now.toISOString(),
  timeZone: new Intl.DateTimeFormat().resolvedOptions().timeZone,
});
