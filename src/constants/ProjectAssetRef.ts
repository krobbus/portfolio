type ProjectSlide = {
  src: string;
  caption: string;
};

export const assets = {
  cartandclover: [
    { src: '/images/cartandclover/cartandclover-header.png', caption: 'Header and Navigation' },
    { src: '/images/cartandclover/cartandclover-marketplace.png', caption: 'Marketplace' },
    { src: '/images/cartandclover/cartandclover-cart.png', caption: 'Shopping Cart' },
    { src: '/images/cartandclover/cartandclover-order-review.png', caption: 'Order Review' },
    { src: '/images/cartandclover/cartandclover-shipping-details.png', caption: 'Shipping Details' },
  ],
  edukatura: [
    { src: '/images/edukatura/edukatura-header.png', caption: 'Dashboard Header' },
    { src: '/images/edukatura/edukatura-login.png', caption: 'Login' },
    { src: '/images/edukatura/edukatura-catalog.png', caption: 'Course Catalog' },
    { src: '/images/edukatura/edukatura-module-courseworks.png', caption: 'Module and Coursework List' },
    { src: '/images/edukatura/edukatura-quiz.png', caption: 'Quiz Coursework' },
    { src: '/images/edukatura/edukatura-grading.png', caption: 'Grading' },
  ],
  eightbit: [
    { src: '/images/8bit/8bit-account-login.png', caption: 'Account Login' },
    { src: '/images/8bit/8bit-outdoor.png', caption: 'Outdoor Scene' },
    { src: '/images/8bit/8bit-left-wing.png', caption: 'Left Wing Scene' },
    { src: '/images/8bit/8bit-hallway.png', caption: 'Hallway Scene' },
    { src: '/images/8bit/8bit-right-wing.png', caption: 'Right Wing Scene' },

    { src: '/images/8bit/8bit-character-creation.png', caption: 'Character Creation' },
    { src: '/images/8bit/8bit-preferences-discovery.png', caption: 'Preferences Discovery' },
    { src: '/images/8bit/8bit-course-selection.png', caption: 'Course Selection' },
    { src: '/images/8bit/8bit-account-registration.png', caption: 'Account Registration' },

    { src: '/images/8bit/8bit-profile.png', caption: 'Player Profile' },
    { src: '/images/8bit/8bit-view-other-profiles.png', caption: 'View Other Dashboards' },
    { src: '/images/8bit/8bit-statistics.png', caption: 'Courses Statistics' },
    { src: '/images/8bit/8bit-skills-and-personality.png', caption: 'Skills & Personality List' },
    { src: '/images/8bit/8bit-ai-comment-and-actions.png', caption: 'AI Comment and Suggestions, and Account Actions' },
    
    
    { src: '/images/8bit/8bit-assessment-types.png', caption: 'Assessment Types' },
    { src: '/images/8bit/8bit-course-related-assessment.png', caption: 'Course-Related Assessment' },
    { src: '/images/8bit/8bit-skill-assessment.png', caption: 'Skill Assessment' },
    { src: '/images/8bit/8bit-personality-assessment.png', caption: 'Personality Assessment' },
    { src: '/images/8bit/8bit-answer-animation.png', caption: 'Answer Animation' },
    { src: '/images/8bit/8bit-explanation-sources.png', caption: 'Explanation Sources' },
    { src: '/images/8bit/8bit-assessment-result.png', caption: 'Assessment Result' },

    { src: '/images/8bit/8bit-ready-for-evaluation.png', caption: 'Ready for Evaluation' },
    { src: '/images/8bit/8bit-ai-comment-suggestions-result.png', caption: 'AI Comment Suggestions' },
    { src: '/images/8bit/8bit-career-report.png', caption: 'Career Report' },

    { src: '/images/8bit/8bit-key-guide.png', caption: 'Key Guide (Top-Left Corner)' },
    { src: '/images/8bit/8bit-npc-dialogue.png', caption: 'NPC Dialogue' },
    { src: '/images/8bit/8bit-leaderboard.png', caption: 'Leaderboard' },
    { src: '/images/8bit/8bit-profile-creation-hint.png', caption: 'Profile Creation Notification' },
  ],
  assetmanagement: [
    { src: '/images/assetmanagement.png', caption: 'Asset Management Overview' },
  ],
  forent: [
    { src: '/images/forent/forent-header.png', caption: 'Header and Navigation' },
    { src: '/images/forent/forent-marketplace.png', caption: 'Marketplace' },
    { src: '/images/forent/forent-pagination.png', caption: 'Marketplace Pagination' },
    { src: '/images/forent/forent-gallery.png', caption: 'Property Image Gallery' },
    { src: '/images/forent/forent-property-details.png', caption: 'Property Details' },
    { src: '/images/forent/forent-property-applications.png', caption: 'Property Applications' },
    { src: '/images/forent/forent-property-rentals.png', caption: 'Property Rentals' },
    { src: '/images/forent/forent-maintenance-form.png', caption: 'Maintenance Request Form' },
    { src: '/images/forent/forent-maintenance-requests.png', caption: 'Maintenance Requests' },
    { src: '/images/forent/forent-payments.png', caption: 'Payment History' },
    { src: '/images/forent/forent-stripe-payment.png', caption: 'Stripe Payment' },
    { src: '/images/forent/forent-payment-successful.png', caption: 'Successful Payment' },
    { src: '/images/forent/forent-payment-cancel.png', caption: 'Cancelled Payment' },
    { src: '/images/forent/forent-view-profile.png', caption: 'View Profile' },
    { src: '/images/forent/forent-update-profile.png', caption: 'Update Profile' },
  ],
  pokedex: [
    { src: '/images/pokedex/pokedex-intro.png', caption: 'Introduction' },
    { src: '/images/pokedex/pokedex-card.png', caption: 'Pokemon Detail Card' },
    { src: '/images/pokedex/pokedex-shiny-mode.png', caption: 'Shiny Mode' },
    { src: '/images/pokedex/pokedex-shiny-card.png', caption: 'Shiny Pokemon DetailCard' },
  ],
} satisfies Record<string, ProjectSlide[]>;
