import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { logout, importData } from '../api/api';
import type { AppData } from '../types';
import { getErrorMessage } from './admin/helpers';

import ProfileTab from './admin/tabs/ProfileTab';
import SocialTab from './admin/tabs/SocialTab';
import SkillsTab from './admin/tabs/SkillsTab';
import ExperienceTab from './admin/tabs/ExperienceTab';
import EducationTab from './admin/tabs/EducationTab';
import ProjectsTab from './admin/tabs/ProjectsTab';
import CertificationsTab from './admin/tabs/CertificationsTab';
import BlogTab from './admin/tabs/BlogTab';
import TestimonialsTab from './admin/tabs/TestimonialsTab';
import ReviewsTab from './admin/tabs/ReviewsTab';
import MessagesTab from './admin/tabs/MessagesTab';
import SettingsTab from './admin/tabs/SettingsTab';

interface Props {
  data: AppData;
  onClose: () => void;
  onDataUpdate: () => Promise<void>;
  onLogout: () => void;
}

type Tab = 'profile' | 'social' | 'skills' | 'experience' | 'education' | 'projects' | 'certifications' | 'blog' | 'testimonials' | 'reviews' | 'messages' | 'settings';

export default function AdminPanel({ data, onClose, onDataUpdate, onLogout }: Props) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('profile');

  const handleLogout = () => { logout(); onLogout(); toast.info(t('admin.logout')); };

  const handleExport = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'portfolio-data.json'; a.click();
    URL.revokeObjectURL(url);
    toast.success(t('admin.dataExported'));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const handleImportClick = () => { fileInputRef.current?.click(); };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      await importData(json);
      toast.success(t('admin.dataImported'));
      await onDataUpdate();
    } catch (err: any) {
      toast.error(getErrorMessage(err, t('admin.importError')));
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profile', label: t('admin.profile') },
    { key: 'social', label: t('admin.social') },
    { key: 'skills', label: t('admin.skills') },
    { key: 'experience', label: t('admin.experience') },
    { key: 'education', label: t('admin.education') },
    { key: 'projects', label: t('admin.projects') },
    { key: 'certifications', label: t('admin.certifications') },
    { key: 'blog', label: t('admin.blog') },
    { key: 'testimonials', label: t('admin.testimonials') },
    { key: 'reviews', label: t('admin.reviews') },
    { key: 'messages', label: t('admin.messages') },
    { key: 'settings', label: t('admin.settings') },
  ];

  return (
    <div className="admin-overlay" onClick={onClose}>
      <motion.div
        className="admin-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '800px' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)' }}>{t('admin.title')}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleExport}>{t('admin.exportData')}</button>
            <button className="btn btn-secondary btn-sm" onClick={handleImportClick} disabled={importing}>{importing ? t('admin.importing') : t('admin.importData')}</button>
            <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportFile} />
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>{t('admin.logout')}</button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>{t('admin.close')}</button>
          </div>
        </div>

        <div className="admin-tabs">
          {tabs.map((t_tab) => (
            <button key={t_tab.key} className={`admin-tab ${tab === t_tab.key ? 'active' : ''}`} onClick={() => setTab(t_tab.key)}>
              {t_tab.label}
            </button>
          ))}
        </div>

        {tab === 'profile' && <ProfileTab data={data} onDataUpdate={onDataUpdate} />}
        {tab === 'social' && <SocialTab data={data} onDataUpdate={onDataUpdate} />}
        {tab === 'skills' && <SkillsTab data={data} onDataUpdate={onDataUpdate} />}
        {tab === 'experience' && <ExperienceTab data={data} onDataUpdate={onDataUpdate} />}
        {tab === 'education' && <EducationTab data={data} onDataUpdate={onDataUpdate} />}
        {tab === 'projects' && <ProjectsTab data={data} onDataUpdate={onDataUpdate} />}
        {tab === 'certifications' && <CertificationsTab data={data} onDataUpdate={onDataUpdate} />}
        {tab === 'blog' && <BlogTab data={data} onDataUpdate={onDataUpdate} />}
        {tab === 'testimonials' && <TestimonialsTab data={data} onDataUpdate={onDataUpdate} />}
        {tab === 'reviews' && <ReviewsTab data={data} onDataUpdate={onDataUpdate} />}
        {tab === 'messages' && <MessagesTab />}
        {tab === 'settings' && <SettingsTab />}
      </motion.div>
    </div>
  );
}
