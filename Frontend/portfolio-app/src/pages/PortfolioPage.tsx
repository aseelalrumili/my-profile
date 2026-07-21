import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { AppData, Project } from '../types';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';

export default function PortfolioPage({ data }: { data: AppData | null }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!data) return <div className="section"><p>{t('loading')}</p></div>;

  const categories = ['All', 'Design', 'Code'];
  const filtered = filter === 'All' ? data.projects : data.projects.filter((p) => p.type === filter);

  return (
    <main className="section">
      <Link to="/" className="portfolio-back-link">
        &larr; Home
      </Link>

      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t('portfolioPage.title')}
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t('portfolioPage.subtitle')}
      </motion.p>

      <div className="projects-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'All' ? t('projects.filterAll') : cat === 'Design' ? t('projects.filterDesign') : t('projects.filterCode')}
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
    </main>
  );
}
