import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { fetchVisitorAnalytics, getSettings, updateSettings, updateProfile, API } from '../../../../api/api';
import type { AppData } from '../../../../types';
import { getErrorMessage } from '../helpers';

interface Props {
  data: AppData;
  onDataUpdate: () => Promise<void>;
}

interface AnalyticsData {
  totalVisitors: number;
  todayVisitors: number;
  thisWeek: number;
  thisMonth: number;
  topPages: { page: string; count: number }[];
  dailyVisits: { date: string; count: number }[];
}

const SECTION_KEYS = [
  'aboutSectionVisible',
  'skillsSectionVisible',
  'experienceSectionVisible',
  'educationSectionVisible',
  'projectsSectionVisible',
  'certificationsSectionVisible',
  'blogSectionVisible',
  'testimonialsSectionVisible',
  'reviewsSectionVisible',
] as const;

const SECTION_LABELS: Record<string, string> = {
  aboutSectionVisible: 'about.title',
  skillsSectionVisible: 'skills.title',
  experienceSectionVisible: 'experience.title',
  educationSectionVisible: 'education.title',
  projectsSectionVisible: 'projects.title',
  certificationsSectionVisible: 'certifications.title',
  blogSectionVisible: 'blog.title',
  testimonialsSectionVisible: 'testimonials.title',
  reviewsSectionVisible: 'reviews.title',
};

export default function SettingsTab({ data, onDataUpdate }: Props) {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchVisitorAnalytics().catch(() => ({
        totalVisitors: 0, todayVisitors: 0, thisWeek: 0, thisMonth: 0,
        topPages: [], dailyVisits: [],
      })),
      getSettings().catch(() => ({})),
    ]).then(([a, s]) => {
      setAnalytics(a);
      setSettings(s);
    });
  }, []);

  const handleSaveSections = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      await onDataUpdate();
      toast.success(t('admin.settingsSaved'));
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, t('admin.failed')));
    } finally {
      setSaving(false);
    }
  };

  const handleSectionToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: prev[key] === 'true' ? 'false' : 'true' }));
  };

  const handleThemeColorChange = async (color: string) => {
    setSettings(prev => ({ ...prev, themeColor: color }));
    try {
      await updateProfile({ themeColor: color } as Partial<AppData['profile']>);
      document.documentElement.style.setProperty('--accent-primary', color);
      await onDataUpdate();
      toast.success(t('admin.profileUpdated'));
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, t('admin.failed')));
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) return toast.error(t('admin.passwordRequired'));
    if (newPassword.length < 8) return toast.error(t('admin.passwordTooShort'));
    if (newPassword !== confirmPassword) return toast.error(t('admin.passwordMismatch'));
    setChangingPassword(true);
    try {
      await API.post('/admin/update-password', { newPassword });
      toast.success(t('admin.passwordChanged'));
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, t('admin.failedToUpdatePassword')));
    } finally {
      setChangingPassword(false);
    }
  };

  if (!analytics) return <div>{t('loading')}</div>;

  const maxDaily = Math.max(...analytics.dailyVisits.map(d => d.count), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      <section>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>{t('admin.sectionVisibility')}</h3>
        <div className="admin-card">
          {SECTION_KEYS.map((key) => (
            <div key={key} className="list-item" style={{ justifyContent: 'space-between' }}>
              <span>{t(SECTION_LABELS[key])}</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings[key] !== 'false'}
                  onChange={() => handleSectionToggle(key)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          ))}
          <button className="btn btn-primary btn-sm" onClick={handleSaveSections} disabled={saving}>
            {saving ? t('admin.saving') : t('admin.saveSectionVisibility')}
          </button>
        </div>
      </section>

      <section>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>{t('admin.themeSettings')}</h3>
        <div className="admin-card">
          <div className="form-group">
            <label>{t('admin.themeColor')}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="color"
                value={settings.themeColor || '#c9a84c'}
                onChange={(e) => handleThemeColorChange(e.target.value)}
                style={{ width: 48, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer' }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>{settings.themeColor || '#c9a84c'}</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>{t('admin.changePassword')}</h3>
        <div className="admin-card">
          <div className="form-group">
            <label>{t('admin.newPassword')}</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('admin.newPasswordPlaceholder')}
            />
          </div>
          <div className="form-group">
            <label>{t('admin.confirmPassword')}</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('admin.confirmPasswordPlaceholder')}
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleChangePassword} disabled={changingPassword}>
            {changingPassword ? t('admin.saving') : t('admin.changePassword')}
          </button>
        </div>
      </section>

      <section>
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
      </section>
    </div>
  );
}
