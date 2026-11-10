import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { projectList } from '../constants/ProjectRoutes';

const SITE_NAME = 'Alef Justin Loresca';
const HOME_TITLE = `${SITE_NAME} | Full Stack Web Developer`;

const pageTitles: Record<string, string> = {
  '/about': 'About',
  '/projects': 'Projects',
  '/certifications': 'Certifications',
  '/services': 'Services',
  '/contact': 'Contact',
  '/game': 'Play as Alef',
};

export default function usePageTitle() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id');

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

    if (path === '/' || path === '/home') {
      document.title = HOME_TITLE;
      return;
    }

    if (path === '/projects' && projectId) {
      const project = projectList.find((item) => String(item.num) === projectId);
      document.title = project
        ? `${project.name} | ${SITE_NAME}`
        : `Project Not Found | ${SITE_NAME}`;
      return;
    }

    const title = pageTitles[path];
    document.title = title ? `${title} | ${SITE_NAME}` : `Page Not Found | ${SITE_NAME}`;
  }, [pathname, projectId]);
}