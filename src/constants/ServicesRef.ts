export type Variant = {
  id: string;
  name: string;
  bestFor: string;
  coreGoal: string;
  coreDetails: Array<{ header: string; detail: string }>;
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
  sectionLimit?: number;
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
  tierIds?: string[];
  priceByTier?: Partial<Record<string, number>>;
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
    price: 149,
    negotiable: true,
    timeline: '1 - 3 business days',
    bestFor: 'Those who need a high-converting site deployed fast.',
    coreGoal: 'A polished, ready-to-launch site that turns visitors into customers.',
    benefits: [
      'Fast turnaround with a ready-to-launch structure',
      'templated-styled, clean and modern UI',
      'High-performance, fully mobile responsive, and speed optimization',
      'Search Engine Optimization (SEO) optimized metadata structure for better search visibility',
      'Built-in quotation/booking/contact form linked straight to your email',
      'Social media links and direct chat integration',
      'A concise, conversion-focused structure that can replace unused sections or core goals with stronger page priorities',
    ],
    variantLabel: 'Available templates',
    variants: [
      {
        id: 'local',
        name: 'The Local Service Business',
        bestFor: 'Ideal for local service providers, neighborhood contractors, tradespeople, and appointment-based businesses looking to establish an immediate, professional web presence and turn local search traffic into direct customer inquiries.',
        coreGoal: 'Drive phone calls, instant quote requests, and scheduled appointments by seamlessly guiding local customers through a high-converting structure.',
        coreDetails: [
          { header: 'Hero Section', detail: 'Captures immediate local attention with a clear value proposition, compelling headline, and instant call-to-action button.' },
          { header: 'Trust Points Banner', detail: 'Instantly builds local credibility and consumer confidence through verified badges, licenses, and guarantees.' },
          { header: 'How It Works (Step-by-Step Guide)', detail: 'Simplifies the customer journey by breaking down your booking or service process into clear, friction-free steps.' },
          { header: 'Our Services (with Recommended Service)', detail: 'Showcases your core offerings transparently, highlighting your most popular or recommended local service package.' },
          { header: 'Customer Testimonials', detail: 'Leverages local social proof and authentic reviews to reassure hesitant visitors.' },
          { header: 'Service Area & Business Hours', detail: 'Displays your exact operational radius, service locations, and working hours so local customers know immediately if you serve their area and when you are open.' },
          { header: 'Contact Section (Request a Quote)', detail: 'Converts active intent into leads with a streamlined, direct inquiry form linked straight to your email.' },
          { header: 'Footer (Social Links)', detail: 'Anchors the page professionally with essential contact details, business hours, and social channels.' },
        ],
        price: 0,
      },
      {
        id: 'ecommerce',
        name: 'The E-Commerce & Product Showcase',
        bestFor: 'Independent clothing brands, boutique food products, artisan crafts, or physical gadgets.',
        coreGoal: 'Drive direct product sales, seamless checkouts, and high-engagement visual storytelling by guiding shoppers through an immersive retail layout.',
        coreDetails: [
          { header: 'Hero Section', detail: 'Captures customer attention immediately with striking product imagery, a compelling value proposition, and an urgent shop-now call to action.' },
          { header: 'Brand Partnership Banner (or Announcement Bar)', detail: 'Showcases trusted brand collaborations, retailer stockists, or flexible top-bar promotional notices.' },
          { header: 'About Section (with Gallery Display)', detail: 'Tells your brand\'s unique story while visually displaying product craftsmanship and lifestyle shots.' },
          { header: 'Product Display Section (with Order via Link & Inquire via Email)', detail: 'Showcases featured items cleanly, offering direct purchase pathways and quick inquiry options for custom sizes or bulk orders.' },
          { header: 'Brand Values Section', detail: 'Highlights what makes your products unique, such as ethical sourcing, premium materials, or sustainable packaging.' },
          { header: 'Customer Reviews', detail: 'Builds social proof and consumer confidence through authentic buyer feedback and ratings.' },
          { header: 'Trust Built-In', detail: 'Reinforces purchase security with secure checkout badges, clear return policies, and shipping guarantees.' },
          { header: 'Frequently Asked Questions (FAQ)', detail: 'Eliminates pre-purchase hesitation and reduces support inquiries by clearly answering common customer questions about shipping, returns, sizing, and product care.'},
          { header: 'Contact Section', detail: 'Makes it easy for customers to reach out with order questions, support inquiries, or wholesale requests.' },
          { header: 'Footer (with Social Links)', detail: 'Anchors the page with vital policy links, newsletter sign-ups, and active social media channels.' },
        ],
        price: 0,
      },
      {
        id: 'portfolio',
        name: 'The Portfolio & Creative Agency',
        bestFor: 'Graphic designers, videographers, architecture firms, or creative freelancers.',
        coreGoal: 'Showcase past work, establish elite aesthetic taste, and drive discovery call bookings by guiding creative clients through a sophisticated, high-end visual experience.',
        coreDetails: [
          { header: 'Theme Toggle (Light & Dark Mode)', detail: 'Lets visitors experience the portfolio in both clean light and sleek dark aesthetics.' },
          { header: 'Hero Section', detail: 'Captures attention instantly with bold typography, a stunning creative statement, and a direct call to action.' },
          { header: 'Teams We\'ve Worked With / Partnerships Banner', detail: 'Builds instant high-tier credibility by displaying logos of past collaborators, brands, or media outlets.' },
          { header: 'Business / Project Works Section', detail: 'Displays your best case studies and visual portfolio pieces in an immersive grid or gallery layout.' },
          { header: 'Service Section', detail: 'Clearly breaks down your specialized creative capabilities and brand identity with descriptive overviews.' },
          { header: 'Packages Section (with Recommended Package)', detail: 'Outlines your fixed-rate tiers or engagement options, highlighting a popular "Recommended" package to guide client selection.' },
          { header: 'Client Testimonials / Social Proof', detail: 'Builds instant authority and trust by showcasing authentic reviews, quotes, or case study results from past satisfied clients and brands.'},
          { header: 'Contact Section', detail: 'Converts browsing prospects into leads with a streamlined inquiry form for project proposals or consultations.' },
          { header: 'Footer (with Social Links)', detail: 'Anchors the page professionally with essential copyright details, quick links, and active creative social channels.' },
        ],
        price: 0,
      },
    ],
  },
  {
    id: 'tier-2',
    name: 'Non-Templated Landing Page',
    label: 'Tier 2',
    price: 199,
    negotiable: true,
    timeline: '3 - 5 business days',
    bestFor:
      'Brands that need a totally unique layout, custom animations, brand-specific design systems, or specialized workflows.',
    coreGoal: 'A distinctive, brand-defining web presence that stands apart from template sites.',
    benefits: [
      'Priority support and 1 month of minor tweaks post-launch',
      '100% custom-designed UI/UX tailored to your brand with advanced layout styling and custom architecture',
      'Search Engine Optimization (SEO) optimized metadata structure for better search visibility',
      'Built-in quotation/booking/contact form linked straight to your email',
      'Social media links and direct chat integration',
      'A custom section strategy limited to 10 focused sections/core goals to keep the page clear, persuasive, and conversion-first',
    ],
    sectionLimit: 10,
  },
  {
    id: 'tier-3',
    name: 'Web Systems',
    label: 'Tier 3',
    price: 299,
    negotiable: true,
    timeline: '7 - 14 business days',
    bestFor:
      'Businesses and teams that need working software: dashboards, stores, internal tools, or customer-facing platforms.',
    coreGoal: 'Replace manual, scattered workflows with a secure, reliable system built around how you operate.',
    benefits: [
      'Priority support and 1 month of minor fixes post-launch',
      'Responsive full-stack architecture with a database, API, and authentication tailored to your workflow',
      'Role-based access control for admins, staff, and customers',
      'Deployment to production with environment and security configuration',
      'Clear documentation and a handover walkthrough',
      'Built for scalable systems with a clear limit of 1 section per core workflow and room to expand as the product grows',
    ],
    sectionLimit: 10,
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
    tierIds: ['tier-1', 'tier-2', 'tier-3'],
    priceByTier: { 'tier-1': 20, 'tier-2': 20, 'tier-3': 25 },
  },
  {
    id: 'branding',
    name: 'Logo & Brand Color Palette Alignment',
    price: 30,
    description:
      'Consistent visual identity styling, typography pairing, custom color schemes, and brand asset integration',
    tierIds: ['tier-1', 'tier-2', 'tier-3'],
    priceByTier: { 'tier-1': 30, 'tier-2': 30, 'tier-3': 35 },
  },
  {
    id: 'analytics',
    name: 'Analytics & Conversion Tracking',
    price: 25,
    description:
      'Privacy-friendly analytics, event and goal tracking, and a simple report so you can see what is working',
    tierIds: ['tier-1', 'tier-2'],
    priceByTier: { 'tier-1': 25, 'tier-2': 25 },
  },
  {
    id: 'cms',
    name: 'CMS / Content Editing Access',
    price: 50,
    description:
      'Editable blog, service, or product content blocks so you can update pages without waiting on developer support',
    tierIds: ['tier-1', 'tier-2', 'tier-3'],
    priceByTier: { 'tier-1': 50, 'tier-2': 50, 'tier-3': 60 },
  },
  {
    id: 'extra-section',
    name: 'Extra Section / Core Goal Block',
    price: 40,
    description:
      'Adds one more strategic section or key conversion block to extend the page without losing clarity or momentum',
    tierIds: ['tier-1', 'tier-2', 'tier-3'],
    priceByTier: { 'tier-1': 30, 'tier-2': 40, 'tier-3': 50 },
  },
  {
    id: 'other-addons',
    name: 'Request Other Add-Ons',
    price: 0,
    custom: true,
    description:
      'Request custom add-ons tailored specifically to your unique business requirements and operational workflows',
    tierIds: ['tier-1', 'tier-2', 'tier-3'],
  },
]

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