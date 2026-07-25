export const fetchVisitors = async () => [];

export const trackVisitor = async (_page: string) => {};

export const fetchVisitorAnalytics = async () => ({
  totalVisitors: 0,
  todayVisitors: 0,
  thisWeek: 0,
  thisMonth: 0,
  topPages: [] as { page: string; count: number }[],
  dailyVisits: [] as { date: string; count: number }[],
});
