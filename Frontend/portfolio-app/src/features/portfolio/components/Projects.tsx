import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import type { AppData, Project } from '../../../types';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

interface Props {
  data?: AppData;
}

export default function Projects({ data }: Props) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!data) return null;

  const hasDesign = data.projects.some(p => p.type === 'Design');
  const hasCode = data.projects.some(p => p.type === 'Code');
  const hasFullstack = data.projects.some(p => p.type === 'Full-stack');
  const categories = ['All', ...([hasDesign && 'Design', hasCode && 'Code', hasFullstack && 'Full-stack'].filter(Boolean) as string[])];

  const categoryLabels: Record<string, string> = {
    All: t('projects.filterAll'),
    Design: t('projects.filterDesign'),
    Code: t('projects.filterCode'),
    'Full-stack': t('projects.filterFullstack'),
  };

  const categoryCounts: Record<string, number> = {
    All: data.projects.length,
    Design: data.projects.filter(p => p.type === 'Design').length,
    Code: data.projects.filter(p => p.type === 'Code').length,
    'Full-stack': data.projects.filter(p => p.type === 'Full-stack').length,
  };

  const filtered = useMemo(() => {
    let result = filter === 'All' ? data.projects : data.projects.filter((p) => p.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => {
        const title = (isAr && p.titleAr ? p.titleAr : p.title).toLowerCase();
        const desc = (isAr && p.descriptionAr ? p.descriptionAr : p.description || '').toLowerCase();
        const tech = (p.techStack || '').toLowerCase();
        return title.includes(q) || desc.includes(q) || tech.includes(q);
      });
    }
    return result;
  }, [data.projects, filter, search, isAr]);

  const featured = data.projects.slice(0, 2);

  return (
    <section className="section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t('projects.title')}
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t('projects.subtitle')}
      </motion.p>

      {/* Featured projects showcase */}
      {featured.length > 0 && !search && filter === 'All' && (
        <motion.div
          className="projects-featured"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {featured.map((project, idx) => {
            const getTitle = () => isAr && project.titleAr ? project.titleAr : project.title;
            const getDesc = () => isAr && project.descriptionAr ? project.descriptionAr : project.description;
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

      {/* Search bar */}
      <motion.div
        className="projects-search"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <FiSearch className="projects-search-icon" size={18} />
        <input
          type="text"
          placeholder={t('projects.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="projects-search-input"
          aria-label={t('projects.search')}
        />
        {search && (
          <button className="projects-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
            <FiX size={16} />
          </button>
        )}
      </motion.div>

      {/* Category tabs with counts */}
      <motion.div
        className="projects-filter"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
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
