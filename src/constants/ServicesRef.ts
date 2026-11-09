export type Variant = {
  id: string;
  name: string;
  bestFor: string;
  coreGoal: string;
  price: number;
};

export type Tier = {
  id: string;
  name: string;
  label: string;
  price: number;
  negotiable?: boolean;
  timeline: string;
  bestFor: string;
  coreGoal: string;
  benefits: string[];
  variantLabel?: string;
  variants?: Variant[];
  hasSystems?: boolean;
};

export type AddOn = {
  id: string;
  name: string;
  price: number;
  monthly?: boolean;
  description: string;
  custom?: boolean;
};

export type System = {
  id: string;
  name: string;
  price: number;
  description: string;
  custom?: boolean;
};

export const tiers: Tier[] = [
  {
    id: 'tier-1',
    name: 'Template-Based Landing Page',
    label: 'Tier 1',
    price: 89,
    timeline: '1 - 3 business days',
    bestFor: 'Those who need a high-converting site deployed fast.',
    coreGoal: 'A polished, ready-to-launch site that turns visitors into customers.',
    benefits: [
      'Custom-styled, clean and modern UI',
      'High-performance, fully mobile responsive, and speed optimization',
      'Search Engine Optimization (SEO) optimized metadata structure for better search visibility',
      'Built-in booking/contact form linked straight to your email',
      'Social media links and direct chat integration',
      'Fast turnaround with a ready-to-launch structure',
    ],
    variantLabel: 'Available templates',
    variants: [
      {
        id: 'local',
        name: 'The Local Service Business',
        bestFor: 'Cleaning services, plumbing, repair shops, dental clinics, salons, or contractors.',
        coreGoal: 'Drive phone calls, instant quote requests, or calendar appointments.',
        price: 0,
      },
      {
        id: 'ecommerce',
        name: 'The E-Commerce & Product Showcase',
        bestFor: 'Independent clothing brands, boutique food products, artisan crafts, or physical gadgets.',
        coreGoal: 'Direct product purchase, add-to-cart conversions, and visual storytelling.',
        price: 0,
      },
      {
        id: 'creator',
        name: 'The Digital Creator, Coach, or SaaS',
        bestFor: 'Course creators, fitness coaches, consultants, or B2B software tools.',
        coreGoal: 'Lead capture (email list building), webinar signups, or software free trials.',
        price: 0,
      },
      {
        id: 'portfolio',
        name: 'The Portfolio & Creative Agency',
        bestFor: 'Graphic designers, videographers, architecture firms, or creative freelancers.',
        coreGoal: 'Showcasing past work, establishing elite aesthetic taste, and booking discovery calls.',
        price: 0,
      },
    ],
  },
  {
    id: 'tier-2',
    name: 'Non-Templated Landing Page',
    label: 'Tier 2',
    price: 129,
    negotiable: true,
    timeline: '3 - 5 business days',
    bestFor:
      'Brands that need a totally unique layout, custom animations, brand-specific design systems, or specialized workflows.',
    coreGoal: 'A distinctive, brand-defining web presence that stands apart from template sites.',
    benefits: [
      '100% custom-designed UI/UX tailored to your brand',
      'Advanced layout styling, custom component architecture, and smooth scroll animations',
      'Multi-step interactive lead capture or quote-request forms',
      'Search Engine Optimization (SEO) optimized metadata structure for better search visibility',
      'Priority support and 1 month of minor tweaks post-launch',
    ],
  },
  {
    id: 'tier-3',
    name: 'Web Systems & Applications',
    label: 'Tier 3',
    price: 249,
    negotiable: true,
    timeline: '7 - 14 business days',
    bestFor:
      'Businesses and teams that need working software: dashboards, stores, internal tools, or customer-facing platforms.',
    coreGoal: 'Replace manual, scattered workflows with a secure, reliable system built around how you operate.',
    benefits: [
      'Full-stack architecture with a database, API, and authentication tailored to your workflow',
      'Responsive, accessible interface built with modern React and TypeScript',
      'Role-based access control for admins, staff, and customers',
      'Deployment to production with environment and security configuration',
      'Clear documentation and a handover walkthrough',
      'Priority support and 1 month of minor fixes post-launch',
    ],
    variantLabel: 'Application types',
    variants: [
      {
        id: 'spa',
        name: 'Single-Page Application (SPA)',
        bestFor: 'Dashboards, trackers, calculators, and tools that benefit from instant, app-like interaction.',
        coreGoal: 'A fast, fluid experience where users work without full page reloads.',
        price: 0,
      },
      {
        id: 'mpa',
        name: 'Multi-Page Application',
        bestFor: 'Content-rich platforms, marketplaces, and portals with many distinct sections and routes.',
        coreGoal: 'Clear structure, shareable pages, and strong search visibility across a larger product.',
        price: 50,
      },
    ],
    hasSystems: true,
  },
];

export const addOns: AddOn[] = [
  {
    id: 'care',
    name: 'Monthly Care Plan',
    price: 20,
    monthly: true,
    description:
      'Security updates, uptime monitoring, performance optimization, and minor content edits to keep your site running smoothly',
  },
  {
    id: 'branding',
    name: 'Logo & Brand Color Palette Alignment',
    price: 30,
    description:
      'Consistent visual identity styling, typography pairing, custom color schemes, and brand asset integration',
  },
  {
    id: 'booking',
    name: 'Appointment & Event Booking Calendar',
    price: 45,
    description:
      'Interactive scheduling widgets, direct calendar synchronization, automated client reminders, and time-slot management',
  },
  {
    id: 'analytics',
    name: 'Analytics & Conversion Tracking',
    price: 25,
    description:
      'Privacy-friendly analytics, event and goal tracking, and a simple report so you can see what is working',
  },
  {
    id: 'other-addons',
    name: 'Request Other Add-Ons',
    price: 0,
    custom: true,
    description:
      'Request custom add-ons tailored specifically to your unique business requirements and operational workflows',
  },
];

export const systems: System[] = [
  {
    id: 'project',
    name: 'Project & Work Management',
    price: 60,
    description: 'Kanban boards, issue tracking, task assignment, and documentation',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce & Marketplaces',
    price: 90,
    description:
      'Storefront catalogs, checkouts, merchant admin panels, two-sided marketplaces, payment integrations and processing management, financial reporting',
  },
  {
    id: 'enterprise',
    name: 'Enterprise & Business Operations',
    price: 150,
    description:
      'Customer relationship management (CRM), sales pipelines, lead tracking, customer support ticketing, and role-based authentication (RBAC) systems',
  },
  {
    id: 'learning',
    name: 'Learning & Content Platforms',
    price: 120,
    description: 'Course catalogs, enrollment, quizzes and assignments, grading workflows, and progress tracking',
  },
  {
    id: 'other-systems',
    name: 'Request Other Systems',
    price: 0,
    custom: true,
    description:
      'Request a custom system tailored specifically to your unique business requirements and operational workflows',
  },
];