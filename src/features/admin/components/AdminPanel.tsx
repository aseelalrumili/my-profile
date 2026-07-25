import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { logout, importData } from '../../../api/api';
import type { AppData } from '../../../types';
import { getErrorMessage } from './helpers';

import ProfileTab from './tabs/ProfileTab';
import SocialTab from './tabs/SocialTab';
import SkillsTab from './tabs/SkillsTab';
import ExperienceTab from './tabs/ExperienceTab';
import EducationTab from './tabs/EducationTab';
import ProjectsTab from './tabs/ProjectsTab';
import CertificationsTab from './tabs/CertificationsTab';
import BlogTab from './tabs/BlogTab';
import ReviewsTab from './tabs/ReviewsTab';
import TestimonialsTab from './tabs/TestimonialsTab';
import MessagesTab from './tabs/MessagesTab';
import SettingsTab from './tabs/SettingsTab';
import ResumeTab from './tabs/ResumeTab';

import {
  FiUser, FiShare2, FiTool, FiBriefcase, FiBookOpen,
  FiGrid, FiAward, FiFileText, FiStar, FiMessageSquare,
  FiSettings, FiClipboard, FiUsers
} from 'react-icons/fi';

interface Props {
  data: AppData;
  onClose: () => void;
  onDataUpdate: () => Promise<void>;
  onLogout: () => void;
}

type Tab = 'profile' | 'social' | 'skills' | 'experience' | 'education' | 'projects' | 'certifications' | 'blog' | 'testimonials' | 'reviews' | 'messages' | 'resume' | 'settings';

const tabIcons: Record<Tab, React.ReactNode> = {
  profile: <FiUser />,
  social: <FiShare2 />,
  skills: <FiTool />,
  experience: <FiBriefcase />,
  education: <FiBookOpen />,
  projects: <FiGrid />,
  certifications: <FiAward />,
  blog: <FiFileText />,
  testimonials: <FiUsers />,
  reviews: <FiStar />,
  messages: <FiMessageSquare />,
  resume: <FiClipboard />,
  settings: <FiSettings />,
};

export default function AdminPanel({ data, onClose, onDataUpdate, onLogout }: Props) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('profile');
  const [isPinned, setIsPinned] = useState(false);

  const handleLogout = () => { onLogout(); toast.info(t('admin.logout')); };

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
    { key: 'resume', label: t('resume.title') },
    { key: 'settings', label: t('admin.settings') },
  ];

  return (
    <motion.div
      className="admin-fullpage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="admin-fullpage-header">
        <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0 }}>{t('admin.dashboardTitle')}</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>{t('admin.exportData')}</button>
          <button className="btn btn-secondary btn-sm" onClick={handleImportClick} disabled={importing}>{importing ? t('admin.importing') : t('admin.importData')}</button>
          <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportFile} />
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>{t('admin.logout')}</button>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>{t('admin.close')}</button>
        </div>
      </div>

      <div className="admin-fullpage-body">
        <div className={`admin-sidebar ${isPinned ? 'pinned' : ''}`}>
          <button
            className="admin-sidebar-pin"
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
          >
            {isPinned ? '📌' : '📍'}
          </button>
          {tabs.map((t_tab) => (
            <button
              key={t_tab.key}
              className={`admin-sidebar-tab ${tab === t_tab.key ? 'active' : ''}`}
              onClick={() => setTab(t_tab.key)}
              title={t_tab.label}
            >
              <span className="admin-sidebar-icon">{tabIcons[t_tab.key]}</span>
              <span className="admin-sidebar-label">{t_tab.label}</span>
            </button>
          ))}
        </div>

        <div className="admin-fullpage-content">
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
          {tab === 'resume' && <ResumeTab data={data} onDataUpdate={onDataUpdate} />}
          {tab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </motion.div>
  );
}
