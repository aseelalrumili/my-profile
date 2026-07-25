import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Project } from '../../../types';
import Lightbox from '../../../shared/components/UI/Lightbox';
import ShareButtons from '../../../shared/components/UI/ShareButtons';
import LazyImage from '../../../shared/components/UI/LazyImage';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  const { t, i18n } = useTranslation();
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
          {project.problem && (
            <div className="project-modal-casestudy">
              <h4>{t('projects.problem')}</h4>
              <p>{isAr && project.problemAr ? project.problemAr : project.problem}</p>
            </div>
          )}
          {project.solution && (
            <div className="project-modal-casestudy">
              <h4>{t('projects.solution')}</h4>
              <p>{isAr && project.solutionAr ? project.solutionAr : project.solution}</p>
            </div>
          )}
          {project.role && (
            <div className="project-modal-casestudy">
              <h4>{t('projects.role')}</h4>
              <p>{isAr && project.roleAr ? project.roleAr : project.role}</p>
            </div>
          )}
          {project.impact && (
            <div className="project-modal-casestudy">
              <h4>{t('projects.impact')}</h4>
              <p>{isAr && project.impactAr ? project.impactAr : project.impact}</p>
            </div>
          )}
          {project.techStack && (
            <div className="project-modal-tech">
              <span className="project-modal-tech-label">{t('projects.techStack')}</span>
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
              {t('projects.viewLive')}
            </a>
          )}
          {project.media.length > 0 && (
            <div className="project-modal-media-grid">
              {project.media.map((m) => (
                m.mediaType === 'Image' ? (
                  <LazyImage key={m.id} src={m.url} alt={m.fileName || ''} className="project-modal-media-img"
                    onClick={() => setLightboxImage(m.url)} />
                ) : (
                  <a key={m.id} href={m.url} target="_blank" rel="noopener noreferrer"
                    className="project-modal-media-3d">
                    {t('projects.model3d')}
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
