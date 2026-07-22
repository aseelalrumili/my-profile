import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { createProject, updateProject, deleteProject, deleteMedia, fetchProjects } from '../../../api/api';
import { getUploadUrl, uploadImage, getCachedImage } from '../../../api/client';
import type { AppData, Project } from '../../../types';
import { getErrorMessage } from '../helpers';

function ProjectForm({ project, onSave, onClose, onDeleteMedia }: {
  project: Project | null; onSave: (payload: any) => Promise<void>; onClose: () => void; onDeleteMedia: (id: number) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [type, setType] = useState(project?.type || 'Design');
  const [category, setCategory] = useState(project?.category || '');
  const [techStack, setTechStack] = useState(project?.techStack || '');
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl || '');
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true);
    const media: any[] = [];
    if (project) {
      for (const m of project.media) {
        if (m.url.startsWith('data:')) media.push(m);
      }
    }
    for (const f of files) {
      const url = await uploadImage(f);
      media.push({
        id: Date.now() + Math.random(),
        mediaType: 'Image',
        url,
        fileName: f.name,
        isPrimary: media.length === 0,
      });
    }
    const payload: any = { title, description, type, category, techStack, liveUrl, sortOrder: '0', media };
    await onSave(payload); setSaving(false);
  };

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent)' }}>
      <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>{project ? t('admin.editProject') : t('admin.newProject')}</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.title')}</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div className="form-group"><label>{t('admin.type')}</label><select value={type} onChange={(e) => setType(e.target.value as Project['type'])}><option value="Design">{t('admin.design')}</option><option value="Code">{t('admin.code')}</option></select></div>
        </div>
        <div className="form-group"><label>{t('admin.description')}</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.category')}</label><input type="text" value={category} onChange={(e) => setCategory(e.target.value)} /></div>
          <div className="form-group"><label>{t('admin.techStack')}</label><input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder={t('admin.techStackPlaceholder')} /></div>
        </div>
        <div className="form-group"><label>{t('admin.liveUrl')}</label><input type="url" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} /></div>
        <div className="form-group">
          <label>{t('admin.files')}</label>
          <label className="file-upload-area">
            <input type="file" multiple accept=".jpg,.jpeg,.png,.gif,.webp" style={{ display: 'none' }} onChange={(e) => setFiles(Array.from(e.target.files || []))} />
            <p>{files.length > 0 ? `${files.length} ${t('admin.filesCount')}` : t('admin.selectFiles')}</p>
          </label>
        </div>
        {project && project.media.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {project.media.map((m) => (
              <div key={m.id} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                {m.mediaType === 'Image' ? <img src={getCachedImage(getUploadUrl(m.url)) || getUploadUrl(m.url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>3D</div>}
                <button type="button" onClick={() => onDeleteMedia(m.id)} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', border: 'none', color: 'var(--danger)', width: '18px', height: '18px', borderRadius: '50%', cursor: 'pointer', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>x</button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={saving}>{saving ? t('admin.saving') : project ? t('admin.update') : t('admin.create')}</button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>{t('admin.cancel')}</button>
        </div>
      </form>
    </div>
  );
}

export default function ProjectsTab({ data, onDataUpdate }: { data: AppData; onDataUpdate: () => Promise<void> }) {
  const { t } = useTranslation();
  const [items, setItems] = useState<Project[]>(data.projects);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    try { await deleteProject(id); setItems(items.filter(i => i.id !== id)); toast.success(t('admin.deleted')); }
    catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  return (
    <div>
      <button className="btn btn-primary" style={{ width: 'auto', marginBottom: '1rem' }} onClick={() => { setEditingProject(null); setShowForm(true); }}>+ {t('admin.newProject')}</button>
      {items.map((item) => (
        <div key={item.id} className="list-item">
          <div className="list-item-info"><h4>{item.title}</h4><p>{item.type} {item.category && `- ${item.category}`} {item.media.length > 0 && `- ${item.media.length} ${t('admin.filesCount')}`}</p></div>
          <div className="list-item-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => { setEditingProject(item); setShowForm(true); }}>{t('admin.edit')}</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>{t('admin.delete')}</button>
          </div>
        </div>
      ))}
      {showForm && (
        <ProjectForm
          project={editingProject}
          onSave={async (payload) => {
            try {
              if (editingProject) await updateProject(editingProject.id, payload);
              else await createProject(payload);
              setShowForm(false); setEditingProject(null);
              setItems(await fetchProjects());
              toast.success(t('admin.projectSaved'));
            } catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
          }}
          onClose={() => { setShowForm(false); setEditingProject(null); }}
          onDeleteMedia={async (id) => { await deleteMedia(id); setItems(items.filter(i => !i.media.some(m => m.id === id))); }}
        />
      )}
    </div>
  );
}
