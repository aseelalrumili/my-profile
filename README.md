# Aseel Alrumili - Portfolio

A modern, bilingual portfolio website built with React, TypeScript, and Vite.

**Live Demo:** https://aseelalrumili.vercel.app/

## Tech Stack

- **React 18** + **TypeScript** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations and transitions
- **i18next** - Internationalization (EN/AR)
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Vercel** - Deployment and hosting

## Features

### Portfolio Sections
- **Hero** - Animated landing with floating shapes and particles
- **About** - Personal bio and introduction
- **Skills** - Technical skills showcase
- **Projects** - Project gallery with modal details
- **Certifications** - Professional certifications display
- **Experience** - Work experience timeline
- **Testimonials** - Client testimonials
- **Reviews** - User reviews with submission form
- **Contact** - Contact form and information
- **Blog** - Blog posts with comments support
- **Resume Builder** - ATS-friendly and regular resume builders

### Core Features
- **Admin Panel** - Full content management system with tabs for Profile, Skills, Projects, Experience, Education, Certifications, Blog, Testimonials, Reviews, Resume, Social, Messages, and Settings
- **Dark/Light Theme** - Toggle between themes with persistent preference
- **EN/AR Bilingual** - Full Arabic and English language support with RTL layout
- **Responsive Design** - Optimized for all screen sizes
- **Split-Name Support** - Handles first/last name display for both languages
- **Splash Screen** - Animated loading screen on first visit
- **Page Transitions** - Smooth animated route transitions
- **404 Page** - Custom not-found page
- **Back to Top** - Floating scroll-to-top button
- **Share Buttons** - Social media sharing on blog posts
- **Lightbox** - Image lightbox for project galleries
- **Lazy Loading** - Code-split routes for optimal performance

## Project Structure

```
src/
├── api/                  # API client functions (profile, projects, blog, certifications, reviews, resume, testimonials)
│   ├── api.ts            # Central fetch functions
│   ├── client.ts         # Axios instance configuration
│   └── ...
├── core/                 # Core app configuration
│   ├── i18n/             # i18next setup with EN/AR translation files
│   ├── store.ts          # Global state store
│   └── types/            # Core type definitions
├── features/             # Feature modules
│   ├── admin/            # Admin panel (AdminPanel, LoginModal, tabs for each content type)
│   ├── blog/             # Blog pages, posts, and comment section
│   ├── certifications/   # Certifications display and dedicated page
│   ├── portfolio/        # Main portfolio sections (Hero, About, Skills, Projects, Experience, Contact)
│   ├── resume/           # Resume builders (ATS and Regular) and resume page
│   ├── reviews/          # Reviews display and submission form
│   └── testimonials/     # Testimonials carousel
├── shared/               # Shared utilities and components
│   ├── api/              # Shared API helpers
│   ├── components/
│   │   ├── Effects/      # Particles, PageTransition, SectionDivider, ErrorBoundary
│   │   ├── Layout/       # Navbar, Footer, PageLayout, BackToTop
│   │   └── UI/           # LoadingScreen, SplashScreen, Lightbox, LazyImage, SectionHeader, etc.
│   ├── context/          # ThemeContext, AuthContext
│   ├── hooks/            # useCountUp, useLocale
│   └── styles/           # Global styles
├── routes/
│   └── AppRoutes.tsx     # Route definitions and page composition
├── types.ts              # Main TypeScript type definitions
├── fallbackData.ts       # Fallback demo data when backend is unavailable
├── App.tsx               # Root app component
└── main.tsx              # Entry point
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Clone and Install

```bash
git clone https://github.com/username/repo-temp.git
cd repo-temp
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

This project uses a backend API for data. When the backend is unavailable, the app falls back to built-in demo data (`src/fallbackData.ts`).

No `.env` file is required for the frontend to run. The backend API URL is configured in `src/api/client.ts`.

## Admin Access

1. Navigate to the portfolio page and click the admin icon (gear icon in the navbar)
2. The **Login Modal** will appear
3. Admin credentials are managed through the backend API
4. Once logged in, you can manage all portfolio content through the **Admin Panel** tabs:
   - **Profile** - Update name, bio, and profile image
   - **Skills** - Add/edit/remove technical skills
   - **Projects** - Manage project entries with images and descriptions
   - **Experience** - Work history management
   - **Education** - Education history
   - **Certifications** - Professional certifications
   - **Blog** - Create and edit blog posts
   - **Testimonials** - Client testimonial management
   - **Reviews** - View and moderate user reviews
   - **Resume** - Resume builder content
   - **Social** - Social media links
   - **Messages** - Contact form submissions
   - **Settings** - Site-wide settings

## Deployment

This project is deployed on **Vercel**.

### Vercel Deployment

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Vercel auto-detects the Vite framework
4. Set the root directory if needed
5. Deploy

The app is live at: https://aseelalrumili.vercel.app/

### Build Command
```
npx vite build
```

### Output Directory
```
dist
```

## License

Private project.
