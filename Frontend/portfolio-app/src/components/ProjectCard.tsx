import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Project } from '../types';
import LazyImage from './LazyImage';

interface Props {
  project: Project;
  onSelect: (project: Project) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export default function ProjectCard({ project, onSelect, onKeyDown }: Props) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const getTitle = () => isAr && project.titleAr ? project.titleAr : project.title;
  const getDesc = () => isAr && project.descriptionAr ? project.descriptionAr : project.description;

  return (
    <motion.div
      className="project-card-masonry"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(project)}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${getTitle()} - ${project.type}`}
    >
      {(() => {
        const primaryImg = (project.media || []).find((m) => m.mediaType === 'Image' && m.isPrimary) || (project.media || []).find((m) => m.mediaType === 'Image');
        return primaryImg ? (
          <LazyImage src={primaryImg.url} alt={getTitle()} className="project-card-image" />
        ) : (
          <div className="project-card-image project-card-image-placeholder">
            {(project.media || []).length > 0 ? '3D Project' : 'No image'}
          </div>
        );
      })()}
      <div className="project-card-body">
        <span className={`type-badge ${project.type.toLowerCase()}`}>{project.type}</span>
        <h3>{getTitle()}</h3>
        <p>{getDesc()}</p>
        {project.techStack && (
          <div className="tech-stack">
            {project.techStack.split(',').map((tech, i) => (
              <span key={i} className="tech-tag">{tech.trim()}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
