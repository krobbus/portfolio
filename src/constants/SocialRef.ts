export type Social = {
  id: string;
  label: string;
  handle: string;
  href: string;
  icon: string;
};

export const socials: Social[] = [
  {
    id: 'github',
    label: 'GitHub',
    handle: '@krobbus',
    href: 'https://github.com/krobbus',
    icon: 'fa-brands fa-github',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: '@in/alefjustinloresca',
    href: 'https://www.linkedin.com/in/alefjustinloresca/',
    icon: 'fa-brands fa-linkedin-in',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@ajloresca',
    href: 'https://www.instagram.com/ajloresca/',
    icon: 'fa-brands fa-instagram',
  },
];