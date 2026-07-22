import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { updateProfile } from '../../../api/api';
import { getUploadUrl, fileToBase64, convertToWebP } from '../../../api/client';
import type { AppData, Profile } from '../../../types';
import { getErrorMessage } from '../helpers';

export default function ProfileTab({ data, onDataUpdate }: { data: AppData; onDataUpdate: () => Promise<void> }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    fullName: data.profile.fullName, fullNameAr: data.profile.fullNameAr || '',
    jobTitle: data.profile.jobTitle, jobTitleAr: data.profile.jobTitleAr || '',
    bio: data.profile.bio || '', bioAr: data.profile.bioAr || '',
    email: data.profile.email || '', phone: data.profile.phone || '',
    location: data.profile.location || '', locationAr: data.profile.locationAr || '',
    heroEffect: data.profile.heroEffect, themeColor: data.profile.themeColor,
    statsProjects: data.profile.statsProjects, statsExperience: data.profile.statsExperience,
    statsClients: data.profile.statsClients, statsAwards: data.profile.statsAwards,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = { ...form };
      if (photoFile) payload.photoUrl = await fileToBase64(await convertToWebP(photoFile));
      if (resumeFile) payload.resumeUrl = await fileToBase64(await convertToWebP(resumeFile));
      await updateProfile(payload);
      await onDataUpdate();
      toast.success(t('admin.profileUpdated'));
    } catch (err: any) { toast.error(getErrorMessage(err, t('admin.failedToUpdateProfile'))); }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>{t('admin.uploadPhoto')}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          {data.profile.photoUrl ? (
            <img src={getUploadUrl(data.profile.photoUrl)} alt={t('admin.photo')} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
          ) : (
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>?</div>
          )}
          <label className="file-upload-area" style={{ flex: 1 }}>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
            <p>{photoFile ? photoFile.name : t('admin.uploadPhoto')}</p>
          </label>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>{t('admin.fullName')}</label><input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
        <div className="form-group"><label>{t('admin.fullName')} ({t('admin.arSuffix')})</label><input type="text" value={form.fullNameAr} onChange={(e) => setForm({ ...form, fullNameAr: e.target.value })} /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>{t('admin.jobTitle')}</label><input type="text" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} /></div>
        <div className="form-group"><label>{t('admin.jobTitle')} ({t('admin.arSuffix')})</label><input type="text" value={form.jobTitleAr} onChange={(e) => setForm({ ...form, jobTitleAr: e.target.value })} /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>{t('admin.bio')}</label><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
        <div className="form-group"><label>{t('admin.bio')} ({t('admin.arSuffix')})</label><textarea value={form.bioAr} onChange={(e) => setForm({ ...form, bioAr: e.target.value })} /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>{t('admin.email')}</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="form-group"><label>{t('admin.phone')}</label><input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>{t('admin.location')}</label><input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
        <div className="form-group"><label>{t('admin.location')} ({t('admin.arSuffix')})</label><input type="text" value={form.locationAr} onChange={(e) => setForm({ ...form, locationAr: e.target.value })} /></div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>{t('admin.heroEffect')}</label>
          <select value={form.heroEffect} onChange={(e) => setForm({ ...form, heroEffect: e.target.value as Profile['heroEffect'] })}>
            <option value="Parallax">{t('admin.parallax')}</option><option value="Hologram">{t('admin.hologram')}</option><option value="3DPlane">{t('admin.3dPlane')}</option>
          </select>
        </div>
        <div className="form-group"><label>{t('admin.themeColor')}</label><input type="color" value={form.themeColor} onChange={(e) => setForm({ ...form, themeColor: e.target.value })} style={{ height: '38px', padding: '4px', cursor: 'pointer' }} /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>{t('admin.projectsCount')}</label><input type="number" value={form.statsProjects} onChange={(e) => setForm({ ...form, statsProjects: parseInt(e.target.value) || 0 })} /></div>
        <div className="form-group"><label>{t('admin.experienceYears')}</label><input type="number" value={form.statsExperience} onChange={(e) => setForm({ ...form, statsExperience: parseInt(e.target.value) || 0 })} /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>{t('admin.clients')}</label><input type="number" value={form.statsClients} onChange={(e) => setForm({ ...form, statsClients: parseInt(e.target.value) || 0 })} /></div>
        <div className="form-group"><label>{t('admin.awards')}</label><input type="number" value={form.statsAwards} onChange={(e) => setForm({ ...form, statsAwards: parseInt(e.target.value) || 0 })} /></div>
      </div>
      <div className="form-group">
        <label>{t('admin.uploadCv')}</label>
        <label className="file-upload-area">
          <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
          <p>{resumeFile ? resumeFile.name : data.profile.resumeUrl ? t('admin.current') + data.profile.resumeUrl.split('/').pop() : t('admin.uploadCv')}</p>
        </label>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? t('admin.saving') : t('admin.save')}</button>
    </form>
  );
}
