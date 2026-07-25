import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { AppData, Project } from '../../../types';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import SectionHeader from '../../../shared/components/UI/SectionHeader';

export default function PortfolioPage({ data }: { data: AppData | null }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!data) return <div className="section"><p>{t('loading')}</p></div>;

  const projects = data.projects || [];
  const hasDesign = projects.some(p => p.type === 'Design');
  const hasCode = projects.some(p => p.type === 'Code');
  const hasFullstack = projects.some(p => p.type === 'Full-stack');
  const categories = ['All', ...([hasDesign && 'Design', hasCode && 'Code', hasFullstack && 'Full-stack'].filter(Boolean) as string[])];
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.type === filter);

  return (
    <main className="section">
      <Link to="/" className="portfolio-back-link">
        &larr; Home
      </Link>

      <SectionHeader title={t('portfolioPage.title')} subtitle={t('portfolioPage.subtitle')} animate />

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
