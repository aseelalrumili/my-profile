import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchVisitorAnalytics } from '../../../api/api';

interface AnalyticsData {
  totalVisitors: number;
  todayVisitors: number;
  thisWeek: number;
  thisMonth: number;
  topPages: { page: string; count: number }[];
  dailyVisits: { date: string; count: number }[];
}

export default function SettingsTab() {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => { fetchVisitorAnalytics().then(setAnalytics).catch(() => {}); }, []);

  if (!analytics) return <div>{t('loading')}</div>;

  const maxDaily = Math.max(...analytics.dailyVisits.map(d => d.count), 1);

  return (
    <div>
      <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>{t('admin.visitorStats')}</h3>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="number">{analytics.totalVisitors}</div>
          <div className="label">{t('admin.totalVisitors')}</div>
        </div>
        <div className="analytics-card">
          <div className="number">{analytics.todayVisitors}</div>
          <div className="label">{t('admin.today')}</div>
        </div>
        <div className="analytics-card">
          <div className="number">{analytics.thisWeek}</div>
          <div className="label">{t('admin.thisWeek')}</div>
        </div>
        <div className="analytics-card">
          <div className="number">{analytics.thisMonth}</div>
          <div className="label">{t('admin.thisMonth')}</div>
        </div>
      </div>

      {analytics.topPages.length > 0 && (
        <div className="analytics-section">
          <h4>{t('admin.topPages')}</h4>
          {analytics.topPages.map((p) => (
            <div className="list-item" key={p.page}>
              <div className="list-item-info">
                <h4>{p.page}</h4>
                <p>{p.count} {t('admin.visitors')}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {analytics.dailyVisits.length > 0 && (
        <div className="analytics-section">
          <h4>{t('admin.dailyVisits')}</h4>
          <div className="analytics-bar-chart">
            {analytics.dailyVisits.map((d) => (
              <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                <div className="analytics-bar" style={{ height: `${(d.count / maxDaily) * 100}%` }} title={`${d.date}: ${d.count}`} />
                <div className="analytics-bar-label">{d.date.slice(5)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
