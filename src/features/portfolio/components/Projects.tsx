import { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiFolder } from 'react-icons/fi';
import type { AppData, Project } from '../../../types';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import SectionHeader from '../../../shared/components/UI/SectionHeader';
import { useLocale } from '../../../shared/hooks/useLocale';

interface Props {
  data?: AppData;
}

function Projects({ data }: Props) {
  const { t } = useTranslation();
  const { isAr, local } = useLocale();
  const [filter, setFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!data) return null;

  const projects = data.projects || [];
  const hasDesign = projects.some(p => p.type === 'Design');
  const hasCode = projects.some(p => p.type === 'Code');
  const hasFullstack = projects.some(p => p.type === 'Full-stack');
  const categories = ['All', ...([hasDesign && 'Design', hasCode && 'Code', hasFullstack && 'Full-stack'].filter(Boolean) as string[])];

  const categoryLabels: Record<string, string> = {
    All: t('projects.filterAll'),
    Design: t('projects.filterDesign'),
    Code: t('projects.filterCode'),
    'Full-stack': t('projects.filterFullstack'),
  };

  const categoryCounts: Record<string, number> = {
    All: data.projects.length,
    Design: projects.filter(p => p.type === 'Design').length,
    Code: projects.filter(p => p.type === 'Code').length,
    'Full-stack': projects.filter(p => p.type === 'Full-stack').length,
  };

  const filtered = useMemo(() => {
    return filter === 'All' ? projects : projects.filter((p) => p.type === filter);
  }, [projects, filter, isAr]);

  const featured = projects.slice(0, 2);

  return (
    <section className="section">
      <SectionHeader title={t('projects.title')} subtitle={t('projects.subtitle')} icon={<FiFolder />} />

      {/* Featured projects showcase */}
      {featured.length > 0 && filter === 'All' && (
        <motion.div
          className="projects-featured"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {featured.map((project, idx) => {
            const getTitle = () => local(project, 'title') || project.title;
            const getDesc = () => local(project, 'description') || '';
            const primaryImg = (project.media || []).find((m) => m.mediaType === 'Image' && m.isPrimary) || (project.media || []).find((m) => m.mediaType === 'Image');
            return (
              <motion.div
                key={project.id}
                className="project-featured-card"
                onClick={() => setSelectedProject(project)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedProject(project); } }}
                aria-label={`${getTitle()} - ${project.type}`}
              >
                <div className="project-featured-img">
                  {primaryImg ? (
                    <img src={primaryImg.url} alt={getTitle()} loading="lazy" />
                  ) : (
                    <div className="project-card-image-placeholder">{project.type === 'Code' ? '💻' : '🎨'}</div>
                  )}
                </div>
                <div className="project-featured-body">
                  <span className={`type-badge ${project.type.toLowerCase()}`}>{project.type}</span>
                  <h3>{getTitle()}</h3>
                  <p>{getDesc()}</p>
                  {project.techStack && (
                    <div className="tech-stack">
                      {project.techStack.split(',').slice(0, 4).map((tech, i) => (
                        <span key={i} className="tech-tag">{tech.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Category tabs with counts (without All) */}
      <motion.div
        className="projects-filter"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {categories.filter(c => c !== 'All').map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(filter === cat ? 'All' : cat)}
          >
            <span>{categoryLabels[cat] || cat}</span>
            <span className="filter-btn-count">{categoryCounts[cat] || 0}</span>
          </button>
        ))}
      </motion.div>

      {/* Results */}
      {filtered.length === 0 ? (
        <motion.div
          className="projects-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>{t('projects.noResults')}</p>
        </motion.div>
      ) : (
        <div className="projects-grid-masonry">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onSelect={setSelectedProject}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedProject(project); } }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/portfolio" className="btn btn-outline" style={{ display: 'inline-block', width: 'auto', textDecoration: 'none' }}>
          {t('projects.viewAll')}
        </Link>
      </div>
    </section>
  );
}

export default memo(Projects);
