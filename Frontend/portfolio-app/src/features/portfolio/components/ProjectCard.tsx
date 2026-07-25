import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiExternalLink } from 'react-icons/fi';
import type { Project } from '../../../types';
import LazyImage from '../../../shared/components/UI/LazyImage';

interface Props {
  project: Project;
  index?: number;
  onSelect: (project: Project) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export default function ProjectCard({ project, index = 0, onSelect, onKeyDown }: Props) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const getTitle = () => isAr && project.titleAr ? project.titleAr : project.title;
  const getDesc = () => isAr && project.descriptionAr ? project.descriptionAr : project.description;

  return (
    <motion.div
      className="project-card-masonry"
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => onSelect(project)}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${getTitle()} - ${project.type}`}
    >
      <div className="project-card-image-wrapper">
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
        {/* Hover overlay */}
        <div className="project-card-overlay">
          <div className="project-card-overlay-content">
            <FiExternalLink size={24} />
            <span>{isAr ? 'عرض التفاصيل' : 'View Details'}</span>
          </div>
        </div>
      </div>
      <div className="project-card-body">
        <div className="project-card-header">
          <span className={`type-badge ${project.type.toLowerCase()}`}>{project.type}</span>
        </div>
        <h3>{getTitle()}</h3>
        <p>{getDesc()}</p>
        {project.techStack && (
          <div className="tech-stack">
            {project.techStack.split(',').slice(0, 5).map((tech, i) => (
              <span key={i} className="tech-tag">{tech.trim()}</span>
            ))}
            {project.techStack.split(',').length > 5 && (
              <span className="tech-tag tech-tag-more">+{project.techStack.split(',').length - 5}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
