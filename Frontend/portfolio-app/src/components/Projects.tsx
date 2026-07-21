import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { AppData, Project } from '../types';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

interface Props {
  data?: AppData;
}

export default function Projects({ data }: Props) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!data) return null;

  const hasDesign = data.projects.some(p => p.type === 'Design');
  const hasCode = data.projects.some(p => p.type === 'Code');
  const hasFullstack = data.projects.some(p => p.type === 'Full-stack');
  const categories = ['All', ...([hasDesign && 'Design', hasCode && 'Code', hasFullstack && 'Full-stack'].filter(Boolean) as string[])];

  const filtered = filter === 'All' ? data.projects : data.projects.filter((p) => p.type === filter);

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

      <div className="projects-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'All' ? t('projects.filterAll') : cat === 'Design' ? t('projects.filterDesign') : cat === 'Code' ? t('projects.filterCode') : 'Full-stack'}
          </button>
        ))}
      </div>

      <div className="projects-grid-masonry">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={setSelectedProject}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedProject(project); } }}
            />
          ))}
        </AnimatePresence>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/portfolio" className="btn btn-outline" style={{ display: 'inline-block', width: 'auto', textDecoration: 'none' }}>
          {t('projects.viewAll')}
        </Link>
      </div>
    </section>
  );
}
