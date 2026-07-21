import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Project } from '../types';
import { getUploadUrl } from '../api/client';
import Lightbox from './Lightbox';
import ShareButtons from './ShareButtons';
import LazyImage from './LazyImage';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!project) return null;

  const getTitle = isAr && project.titleAr ? project.titleAr : project.title;
  const getDesc = isAr && project.descriptionAr ? project.descriptionAr : project.description;

  return (
    <>
      <div className="project-modal-overlay" onClick={onClose}>
        <div
          className="project-modal-panel"
          role="dialog"
          aria-modal="true"
          aria-label={getTitle}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="project-modal-close"
            aria-label="Close project details"
            onClick={onClose}
          >&times;</button>
          <span className={`project-modal-badge type-badge ${project.type.toLowerCase()}`}>
            {project.type}
          </span>
          <h2 className="project-modal-title">{getTitle}</h2>
          <p className="project-modal-desc">{getDesc}</p>
          {(project as any).problem && (
            <div className="project-modal-casestudy">
              <h4>{isAr ? 'المشكلة' : 'Problem'}</h4>
              <p>{(project as any).problemAr && isAr ? (project as any).problemAr : (project as any).problem}</p>
            </div>
          )}
          {(project as any).solution && (
            <div className="project-modal-casestudy">
              <h4>{isAr ? 'الحل' : 'Solution'}</h4>
              <p>{(project as any).solutionAr && isAr ? (project as any).solutionAr : (project as any).solution}</p>
            </div>
          )}
          {(project as any).role && (
            <div className="project-modal-casestudy">
              <h4>{isAr ? 'دوري في المشروع' : 'My Role'}</h4>
              <p>{(project as any).roleAr && isAr ? (project as any).roleAr : (project as any).role}</p>
            </div>
          )}
          {(project as any).impact && (
            <div className="project-modal-casestudy">
              <h4>{isAr ? 'الأثر / النتيجة' : 'Impact / Results'}</h4>
              <p>{(project as any).impactAr && isAr ? (project as any).impactAr : (project as any).impact}</p>
            </div>
          )}
          {project.techStack && (
            <div className="project-modal-tech">
              <span className="project-modal-tech-label">Tech Stack</span>
              <div className="tech-stack" style={{ marginTop: '0.5rem' }}>
                {project.techStack.split(',').map((tech, i) => (
                  <span key={i} className="tech-tag">{tech.trim()}</span>
                ))}
              </div>
            </div>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="btn btn-primary project-modal-live-link">
              View Live
            </a>
          )}
          {project.media.length > 0 && (
            <div className="project-modal-media-grid">
              {project.media.map((m) => (
                m.mediaType === 'Image' ? (
                  <LazyImage key={m.id} src={m.url} alt={m.fileName || ''} className="project-modal-media-img"
                    onClick={() => setLightboxImage(m.url)} />
                ) : (
                  <a key={m.id} href={getUploadUrl(m.url)} target="_blank" rel="noopener noreferrer"
                    className="project-modal-media-3d">
                    3D Model
                  </a>
                )
              ))}
            </div>
          )}
          <div className="project-modal-actions">
            <ShareButtons url={window.location.href} title={getTitle} />
          </div>
        </div>
      </div>
      {lightboxImage && <Lightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />}
    </>
  );
}
