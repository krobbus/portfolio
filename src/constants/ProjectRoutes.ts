import { projects } from './ProjectRef';

type ProjectMeta = {
  num: number;
  name: string;
  summary: string;
};

const meta: Record<string, ProjectMeta> = {
  '[Project 06]': {
    num: 6,
    name: 'Cart & Clover',
    summary:
      'A full-stack e-commerce platform with a product catalog, shopping cart, user accounts, and order management, secured with role-based access for shoppers, sellers, and admins.',
  },
  '[Project 05]': {
    num: 5,
    name: 'Edukatura',
    summary:
      'A learning management system for courses, modules, assignments, and quizzes, with enrollment, grading workflows, and role-based access for learners, instructors, and admins.',
  },
  '[Project 04]': {
    num: 4,
    name: '8-Bit',
    summary:
      'An interactive 8-bit web game that guides students through college program matching and career exploration, powered by personalized recommendations from the Gemini API.',
  },
  '[Project 03]': {
    num: 3,
    name: 'MES Asset Management',
    summary:
      'An internal dashboard that digitizes the tracking of 500+ pieces of engineering equipment, including their measurements and acquisition costs.',
  },
  '[Project 02]': {
    num: 2,
    name: 'FoRent',
    summary:
      'A rental property platform where landlords and tenants manage listings, applications, leases, maintenance requests, and Stripe-powered rent payments.',
  },
  '[Project 01]': {
    num: 1,
    name: 'PokeDex',
    summary:
      'A retro-inspired Pokedex for browsing 1,300+ Pokemon with search, type filtering, sorting, and detailed cards, built on the PokeAPI.',
  },
};

export const projectList = projects.map((project) => ({
  ...project,
  ...meta[project.id],
}));

export type ProjectEntry = (typeof projectList)[number];

export function projectPath(project: Pick<ProjectEntry, 'num' | 'name'>) {
  const params = new URLSearchParams({
    id: String(project.num),
    title: project.name,
  });
  return `/projects?${params.toString()}`;
}