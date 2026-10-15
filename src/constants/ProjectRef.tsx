export const projects = [
    {
        id: '[Project 06]',
        title: 'Cart & Clover | E-Commerce Website',
        description: 'Full-Stack Developer, Internship Project',
        link: "https://cart-and-clover.vercel.app/",
        linkText: 'cart-and-clover.vercel.app/',
        src: '/images/cartandclover.png',
        caption: 'Cart And Clover Header and Navigation',
        pills: ['React', 'Node.js', 'Express.js', 'MongoDB'],
        points: [
            'Developed a full-stack e-commerce platform with React, Node.js, Express.js, and MongoDB, featuring a product catalog, product management APIs, a shopping cart, user accounts, and order management.',
            'Implements secure cryptographic password hashing (such as bcrypt) to protect user credentials before saving them to the database.',
            'Uses JSON Web Tokens for issuing session tokens, verifying secure API requests, and managing authenticated sessions.',
            'Implements strict Role-Based Access Control (RBAC) with three distinct user roles (Shopper, Seller, and Admin) governed by global management flags (isAdmin, canManage, isSeller) that dynamically secure backend endpoints and toggle UI controls.',
            'Links customers, ordered items (with product references, quantities, and prices), shipping addresses, payment methods, total amounts, payment status flags, and fulfillment statuses.'
        ]
    },
    {
        id: '[Project 05]',
        title: 'Edukatura | Learning Management System (LMS)',
        description: 'Full-Stack Developer, Internship Project',
        link: null,
        src: '/images/edukatura.png', 
        caption: 'Edukatura Dashboard',
        pills: ['React', 'Node.js', 'Express.js', 'MongoDB'],
        points: [
            'Architected and built a complete platform for managing courses, learners, modules, and coursework (assignments and quizzes) with React, Node.js, Express.js, and MongoDB',
            'Implements secure cryptographic password hashing (using bcrypt) to protect user credentials before storing them, alongside excluding password hashes when loading authenticated user profiles.',
            'Uses JSON Web Tokens (JWTs) for issuing session tokens, verifying secure API requests, and securely managing authenticated user sessions.',
            'Implements strict Role-Based Access Control (RBAC) across three distinct user roles (Learner, Instructor, and Admin), dynamically securing backend endpoints and toggling UI controls based on verified roles.',
            'Features comprehensive course and content management tools allowing instructors to create, edit, and organize courses, modules, assignments, and quizzes.',
            'Manages learner participation, course enrollments, coursework submissions, and robust grading workflows for instructors and administrators, backed by complete user administration tools.'

        ]
    },
    {
        id: '[Project 04]',
        title: 'An AI-Driven 8-Bit Web Game For Personalized College Program Matching and Career Exploration',
        description: 'Lead Full-Stack Developer, Capstone Project',
        link: 'https://krobbus.github.io/8-Bit/',
        linkText: 'krobbus.github.io/8-Bit/',
        src: '/images/8bit.png', 
        caption: 'Classroom Scene (Quiz Game)',
        pills: ['React', 'TypeScript', 'PhaserJS', 'Firebase', 'Gemini API'],
        points: [
            'Lead a team of 3 as the Lead Full-Stack Developer to architect and launch an interactive web game designed to guide students through college program matching and career exploration.',
            'Engineered an AI-driven recommendation engine by integrating the Gemini API, processing user inputs in real-time to deliver highly personalized college and career pathways.',
            'Developed a fully responsive, mobile-first user interface using ReactJs and PhaserJS, ensuring seamless gameplay and accessibility across desktop, tablet, and mobile devices.',
            'Collaborated cross-functionally to manage project timelines, conduct code reviews, and ensure the seamless integration of front-end components with back-end AI services.'
        ]
    },
    {
        id: '[Project 03]',
        title: 'Mechanical Engineering Section (MES) Asset Management',
        description: 'Full-Stack Developer, 3-Month Project-Based Internship Project',
        link: null,
        src: '/images/assetmanagement.png', 
        caption: 'Asset Management Overview',
        pills: ['React', 'TypeScript', 'TailwindCSS', 'Express.js', 'PostgreSQL'],
        points: [
            'Developed a custom asset management dashboard using ReactJS to digitize and streamline the tracking of engineering equipment, measurements, and acquisition costs.',
            'Engineered a secure data-entry workflow utilizing React Hook Form and standard validation, reducing manual entry errors for critical equipment metrics and pricing.',
            'Designed a relational PostgreSQL database schema to efficiently store, categorize, and retrieve technical specifications and financial data for 500+ physical assets.',
            'Implemented a responsive, table-driven user interface with Tailwind CSS, allowing Deputy Chief and the engineering staffs to easily search, filter, and update equipment statuses in real-time.'
        ]
    },
    {
        id: '[Project 02]',
        title: 'FoRent | Rental Property Management System',
        description: 'Lead Full-Stack Developer and Web Designer, 3rd year Project',
        link: 'https://forent-rental.vercel.app/',
        linkText: 'forent-rental.vercel.app/',
        src: '/images/forent.png',
        caption: 'FoRent Marketplace',
        pills: ['React', 'TypeScript', 'Express.js', 'Stripe.js', 'PostgreSQL', 'Neon'],
        points: [
            'Architected a full-stack property management platform using React, TypeScript, Node.js, and Express, creating distinct, feature-rich management for landlords and tenants to manage leases, maintenance, and applications.',
            'Designed and implemented a relational database schema using PostgreSQL (hosted on Neon) to efficiently handle complex data relationships across users, properties, transactions, and maintenance requests.',
            'Integrated Stripe for secure rent and deposit payments, enabling tenants to pay online and landlords to track transaction history and payment status in real time.',
            'Deployed scalable application infrastructure utilizing Vercel for the frontend and Render for the backend, ensuring high availability and smooth delivery of updates.'
        ]
    },
    {
        id: '[Project 01]',
        title: 'PokeDex',
        description: 'Front-End Developer, 1st year Project',
        link: 'https://pokedex-by-alef.vercel.app/',
        linkText: 'pokedex-by-alef.vercel.app/',
        src: '/images/pokedex.png', 
        caption: 'Pokedex Detail Card',
        pills: ['React', 'TypeScript', 'PokeAPI', 'Nested CSS'],
        points: [
            'Redesigned a retro-inspired Pokedex built with React and TypeScript, refocusing the original 1st-year project into a clean, dedicated data-reference tool by removing unnecessary account and static-page features.',
            'Integrated the PokeAPI to fetch real-time data for over 1,300 Pokemon, implementing batched loading and secondary API calls to populate detailed modal views with descriptions and abilities.',
            'Built smart search, type filtering, and sorting functionality, with robust error handling for misspelled queries, missing sprites, and empty filter results.',
            'Designed an adaptive UI using custom CSS3 Grid and Flexbox, including type-based icon sets and an animated landing page transition to enhance the overall browsing experience.'
        ]
    }
];