import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import type { AppData, Project } from '../../../types';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import SectionHeader from '../../../shared/components/UI/SectionHeader';
import { useLocale } from '../../../shared/hooks/useLocale';

export default function PortfolioPage({ data }: { data: AppData | null }) {
  const { t } = useTranslation();
  const { isAr, local } = useLocale();
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!data) return <div className="section"><p>{t('loading')}</p></div>;

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
    All: projects.length,
    Design: projects.filter(p => p.type === 'Design').length,
    Code: projects.filter(p => p.type === 'Code').length,
    'Full-stack': projects.filter(p => p.type === 'Full-stack').length,
  };

  const filtered = useMemo(() => {
    let result = filter === 'All' ? projects : projects.filter((p) => p.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => {
        const title = local(p, 'title')?.toLowerCase() || '';
        const desc = local(p, 'description')?.toLowerCase() || '';
        const tech = (p.techStack || '').toLowerCase();
        return title.includes(q) || desc.includes(q) || tech.includes(q);
      });
    }
    return result;
  }, [projects, filter, search, isAr]);

  return (
    <main className="section">
      <Link to="/" className="portfolio-back-link">
        &larr; Home
      </Link>

      <SectionHeader title={t('portfolioPage.title')} subtitle={t('portfolioPage.subtitle')} animate />

      {/* Search bar */}
      <motion.div
        className="projects-search"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
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

      <div className="projects-filter">
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
