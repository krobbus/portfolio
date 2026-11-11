import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { projectList } from '../constants/ProjectRoutes';

const SITE_NAME = 'Alef Justin Loresca';
const SITE_URL = 'https://alefjustinloresca.vercel.app';
const HOME_TITLE = `${SITE_NAME} | Full Stack Web Developer`;
const HOME_DESCRIPTION =
  'Alef Justin Loresca is a Full Stack Web Developer in Laguna, Philippines, building modern websites with React, TypeScript, Express.js, and PostgreSQL.';

type PageMeta = {
  title: string;
  description: string;
  canonicalPath: string;
  noindex?: boolean;
};

const pages: Record<string, PageMeta> = {
  '/': {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    canonicalPath: '/',
  },
  '/about': {
    title: `About | ${SITE_NAME}`,
    description:
      'Learn about Alef Justin Loresca, a Full Stack Web Developer, and the tech stack behind the projects: React, TypeScript, Express.js, PostgreSQL, and more.',
    canonicalPath: '/about',
  },
  '/projects': {
    title: `Projects | ${SITE_NAME}`,
    description:
      'Selected projects by Alef Justin Loresca, including e-commerce, learning management, rental property, and AI-driven game applications.',
    canonicalPath: '/projects',
  },
  '/certifications': {
    title: `Certifications | ${SITE_NAME}`,
    description:
      'Certifications earned by Alef Justin Loresca in front end development, back end development, and software engineering.',
    canonicalPath: '/certifications',
  },
  '/services': {
    title: `Services | ${SITE_NAME}`,
    description:
      'Web development services by Alef Justin Loresca: landing pages, custom designs, and full web systems with an instant price estimate.',
    canonicalPath: '/services',
  },
  '/contact': {
    title: `Contact | ${SITE_NAME}`,
    description:
      'Get in touch with Alef Justin Loresca for web development projects, collaborations, questions, or to schedule a meeting.',
    canonicalPath: '/contact',
  },
  '/game': {
    title: `Play as Alef | ${SITE_NAME}`,
    description: 'Take a quick break and play a small coin-collecting browser game built with Phaser.js.',
    canonicalPath: '/game',
  },
};

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function applyMeta({ title, description, canonicalPath, noindex }: PageMeta) {
  const url = `${SITE_URL}${canonicalPath}`;

  document.title = title;
  upsertCanonical(url);
  upsertMeta('name', 'description', description);
  upsertMeta(
    'name',
    'robots',
    noindex
      ? 'noindex, follow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  );
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', url);
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
}

export default function usePageTitle() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id');

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    const normalizedPath = path === '/home' ? '/' : path;

    if (normalizedPath === '/projects' && projectId) {
      const project = projectList.find((item) => String(item.num) === projectId);

      if (project) {
        applyMeta({
          title: `${project.name} | ${SITE_NAME}`,
          description: project.summary,
          canonicalPath: `/projects?id=${project.num}`,
        });
      } else {
        applyMeta({
          title: `Project Not Found | ${SITE_NAME}`,
          description: 'The project you are looking for could not be found.',
          canonicalPath: '/projects',
          noindex: true,
        });
      }
      return;
    }

    const page = pages[normalizedPath];

    if (page) {
      applyMeta(page);
      return;
    }

    applyMeta({
      title: `Page Not Found | ${SITE_NAME}`,
      description: 'The page you are looking for does not exist.',
      canonicalPath: '/',
      noindex: true,
    });
  }, [pathname, projectId]);
}