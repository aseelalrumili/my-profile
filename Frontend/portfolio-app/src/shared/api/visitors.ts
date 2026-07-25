export const fetchVisitors = async () => {
  try {
    const raw = localStorage.getItem('portfolio_visitors');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

export const trackVisitor = async (page: string) => {
  try {
    const raw = localStorage.getItem('portfolio_visitors');
    const visitors: { page: string; timestamp: string }[] = raw ? JSON.parse(raw) : [];
    visitors.push({ page, timestamp: new Date().toISOString() });
    if (visitors.length > 1000) visitors.splice(0, visitors.length - 1000);
    localStorage.setItem('portfolio_visitors', JSON.stringify(visitors));
  } catch {}
};

export const fetchVisitorAnalytics = async () => {
  try {
    const raw = localStorage.getItem('portfolio_visitors');
    const visitors: { page: string; timestamp: string }[] = raw ? JSON.parse(raw) : [];
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10);
    const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString().slice(0, 10);

    const pageCounts: Record<string, number> = {};
    const dailyCounts: Record<string, number> = {};
    let todayVisitors = 0;
    let thisWeek = 0;
    let thisMonth = 0;

    for (const v of visitors) {
      const d = v.timestamp.slice(0, 10);
      pageCounts[v.page] = (pageCounts[v.page] || 0) + 1;
      dailyCounts[d] = (dailyCounts[d] || 0) + 1;
      if (d === today) todayVisitors++;
      if (d >= weekAgo) thisWeek++;
      if (d >= monthAgo) thisMonth++;
    }

    return {
      totalVisitors: visitors.length,
      todayVisitors,
      thisWeek,
      thisMonth,
      topPages: Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).map(([page, count]) => ({ page, count })),
      dailyVisits: Object.entries(dailyCounts).sort((a, b) => a[0].localeCompare(b[0])).map(([date, count]) => ({ date, count })),
    };
  } catch {
    return { totalVisitors: 0, todayVisitors: 0, thisWeek: 0, thisMonth: 0, topPages: [], dailyVisits: [] };
  }
};
