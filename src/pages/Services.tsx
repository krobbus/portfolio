import { useEffect, useMemo, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

type Template = {
  id: string;
  name: string;
  bestFor: string;
  coreGoal: string;
};

type Tier = {
  id: string;
  name: string;
  label: string;
  price: number;
  negotiable?: boolean;
  timeline: string;
  bestFor: string;
  coreGoal?: string;
  benefits: string[];
  templates?: Template[];
};

type AddOn = {
  id: string;
  name: string;
  price: number;
  monthly?: boolean;
  description: string;
  other?: boolean;
};

type System = {
  id: string;
  name: string;
  price: number;
  description: string;
  other?: boolean;
};

const tiers: Tier[] = [
  {
    id: 'tier-1',
    name: 'Template-Based Landing Page',
    label: 'Tier 1',
    price: 65,
    timeline: '1 to 3 business days',
    bestFor: 'Those who need a high-converting site deployed fast.',
    benefits: [
      'Custom-styled, clean and modern UI',
      'High-performance, fully mobile responsive, and speed optimization',
      'Search Engine Optimization (SEO) optimized metadata structure for better search visibility',
      'Built-in booking/contact form linked straight to your email',
      'Social media links direct chat integration',
      'Fast turnaround with a ready-to-launch structure',
    ],
    templates: [
      {
        id: 'local',
        name: 'The Local Service Business',
        bestFor: 'Cleaning services, plumbing, repair shops, dental clinics, salons, or contractors.',
        coreGoal: 'Drive phone calls, instant quote requests, or calendar appointments.',
      },
      {
        id: 'ecommerce',
        name: 'The E-Commerce & Product Showcase',
        bestFor: 'Independent clothing brands, boutique food products, artisan crafts, or physical gadgets.',
        coreGoal: 'Direct product purchase, add-to-cart conversions, and visual storytelling.',
      },
      {
        id: 'creator',
        name: 'The Digital Creator, Coach, or SaaS',
        bestFor: 'Course creators, fitness coaches, consultants, or B2B software tools.',
        coreGoal: 'Lead capture (email list building), webinar signups, or software free trials.',
      },
      {
        id: 'portfolio',
        name: 'The Portfolio & Creative Agency',
        bestFor: 'Graphic designers, videographers, architecture firms, or creative freelancers.',
        coreGoal: 'Showcasing past work, establishing elite aesthetic taste, and booking discovery calls.',
      },
    ],
  },
  {
    id: 'tier-2',
    name: 'Non-Templated Landing Page',
    label: 'Tier 2',
    price: 120,
    negotiable: true,
    timeline: '7 to 10 business days',
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
];

const addOns: AddOn[] = [
    { id: 'care', name: 'Monthly Care Plan', price: 20, monthly: true, description: 'Security updates, uptime monitoring, minor edits' },
    { id: 'branding', name: 'Logo & Brand Color Palette Alignment', price: 30, description: 'Consistent visual identity' },
    { id: 'newsletter', name: 'Email Newsletter Integration', price: 20, description: 'Mailchimp / Resend setup' },
    { id: 'booking', name: 'Appointment & Event Booking Calendar', price: 45, description: 'Let clients schedule directly' },
    { id: 'addons', name: 'Request Other Add-Ons', price: 0, other: true, description: 'Request other add-ons based on your business/service needs' },
];

const systems: System[] = [
    { id: 'calculator', name: 'Interactive Pricing Calculator', price: 50, description: 'Cost estimator for your visitors' },
    { id: 'directory', name: 'Real-Time Search & Filtering Directory', price: 60, description: 'Searchable, filterable listings' },
    { id: 'shop', name: 'E-Commerce Catalog & Cart System', price: 90, description: 'Full shop experience' },
    { id: 'portal', name: 'Client Dashboard / Portal Hub', price: 150, description: 'A private space for your clients' },
    { id: 'systems', name: 'Request Other Systems', price: 0, other: true, description: 'Request other functional system based on your business/service needs' },
]

const formatPrice = (value: number) => `$${value.toLocaleString('en-US')}`;

const pillClass = (active: boolean) =>
  `inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-left text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)] ${
    active
      ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]'
      : 'border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]'
  }`;

const cardClass = (active: boolean) =>
  `w-full flex flex-col cursor-pointer gap-2 border p-4 text-left text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)] ${
    active
      ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]'
      : 'border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]'
  }`;

function SummaryDialog({ tier, template, selectedAddOns, selectedSystems, oneTime, monthly, onClose } : { tier: Tier; template: Template | undefined; selectedAddOns: AddOn[]; selectedSystems: System[]; oneTime: number; monthly: number; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const summaryText = [
    `Service: ${tier.label} - ${tier.name}`,
    template ? `Template: ${template.name}` : null,
    `Base price: ${formatPrice(tier.price)}${tier.negotiable ? ' (starting, negotiable)' : ' (starting)'}`,
    `Timeline: ${tier.timeline}`,
    selectedAddOns.length
      ? `Add-ons: ${selectedAddOns
          .map((item) => `${item.name} (+${formatPrice(item.price)}${item.monthly ? '/month' : ''})`)
          .join(', ')}`
      : 'Add-ons: None',
    `Estimated one-time total: ${formatPrice(oneTime)}`,
    monthly > 0 ? `Recurring: ${formatPrice(monthly)}/month` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    try {
      await emailjs.send(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        {
          name,
          email,
          subject: "I'D LIKE TO MAKE A PROPOSAL",
          message: `${message}\n\n--- Service Summary ---\n${summaryText}`,
        },
        import.meta.env.VITE_PUBLIC_KEY
      );
      alert("Message sent! I'll get back to you soon.");
      onClose();
    } catch (err) {
      alert(`Something went wrong — please try again. ${err}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="summaryTitle"
        className="my-auto w-full max-w-xl space-y-6 border border-[var(--border)] bg-[var(--bg)] p-6 font-sans text-[var(--fg)] shadow-2xl sm:p-8"
      >
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 id="summaryTitle" className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
              YOUR ESTIMATE
            </h2>
            <p className="text-sm text-[var(--muted)]">Review your selection and send it over.</p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close summary"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] transition-colors hover:border-[var(--fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </header>

        <div className="space-y-3 border-y border-[var(--border)] py-4 text-sm">
          <div className="flex items-start justify-between gap-4">
            <span>
              {tier.label}: {tier.name}
              {template && <span className="block text-xs text-[var(--muted)]">{template.name}</span>}
            </span>
            <span className="shrink-0">{formatPrice(tier.price)}</span>
          </div>

          {selectedAddOns.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 text-[var(--muted)]">
              <span>{item.name}</span>
                {item.price != 0 ? (
                    <span className="shrink-0">
                        +{formatPrice(item.price)}
                        {item.monthly ? '/mo' : ''}
                    </span>
                ) : null}
            </div>
          ))}

          {selectedSystems.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 text-[var(--muted)]">
              <span>{item.name}</span>
                {item.price != 0 ? (
                    <span className="shrink-0">
                        +{formatPrice(item.price)}
                    </span>
                ) : null}
            </div>
          ))}


          <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-3 text-base font-semibold">
            <span>One-time total</span>
            <span>{formatPrice(oneTime)}</span>
          </div>

          {monthly > 0 && (
            <div className="flex items-center justify-between gap-4 text-[var(--muted)]">
              <span>Recurring</span>
              <span>{formatPrice(monthly)}/month</span>
            </div>
          )}

          <p className="text-xs text-[var(--muted)]">
            Timeline: {tier.timeline}.{' '}
            {tier.negotiable ? 'Starting price, negotiable.' : 'Starting price, final quote confirmed after we talk.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="space-y-1">
            <label htmlFor="summaryName" className="text-sm text-[var(--muted)]">Name</label>
            <input
              id="summaryName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[var(--border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--fg)]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="summaryEmail" className="text-sm text-[var(--muted)]">
              Email <span className="text-[var(--required)]">*</span>
            </label>
            <input
              id="summaryEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[var(--border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--fg)]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="summaryMessage" className="text-sm text-[var(--muted)]">
              Message <span className="text-[var(--required)]">*</span>
            </label>
            <textarea
              id="summaryMessage"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full resize-y border border-[var(--border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--fg)]"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="flex cursor-pointer items-center justify-center gap-2 border border-[var(--fg)] bg-[var(--fg)] px-5 py-2 text-sm text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--bg)] hover:text-[var(--fg)] disabled:opacity-50"
          >
            <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
            {sending ? 'Sending...' : 'Send inquiry'}
          </button>

          <span className="text-sm text-[var(--muted)]">
            Please don’t include passwords and other sensitive information.
          </span>
        </form>
      </section>
    </div>
  );
}

export default function Services() {
  const [selectedTierId, setSelectedTierId] = useState(tiers[0].id);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(tiers[0].templates![0].id);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [selectedSystemIds, setSelectedSystemIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedTier = tiers.find((tier) => tier.id === selectedTierId) ?? tiers[0];
  const selectedTemplate = selectedTier.templates?.find((template) => template.id === selectedTemplateId);
  const selectedAddOns = useMemo(
    () => addOns.filter((item) => selectedAddOnIds.includes(item.id)),
    [selectedAddOnIds]
  );

  const selectedSystems = useMemo(
    () => systems.filter((item) => selectedSystemIds.includes(item.id)),
    [selectedSystemIds]
  );

  const oneTime =
    selectedTier.price + selectedAddOns.filter((item) => !item.monthly).reduce((sum, item) => sum + item.price, 0);
  const monthly = selectedAddOns.filter((item) => item.monthly).reduce((sum, item) => sum + item.price, 0);

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const toggleSystem = (id: string) => {
    setSelectedSystemIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const chooseTier = (tier: Tier) => {
    setSelectedTierId(tier.id);
    if (tier.templates) setSelectedTemplateId(tier.templates[0].id);
  };

  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">SERVICES</h1>
        <p className="text-[var(--muted)]">
          Choose a service, add what you need, and get an instant estimate.
        </p>
      </header>

      <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="w-full space-y-8 border border-[var(--border)] px-6 py-6">
          <header className="space-y-1">
            <h2 className="font-serif text-xl font-bold tracking-tight sm:text-2xl">CHOOSE A SERVICE</h2>
            <p className="font-sans text-sm text-[var(--muted)]">
              Every service can be discussed through a call or meeting.
            </p>
          </header>

          <div className="space-y-6 font-sans">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Service tiers</h3>

              <div className="w-full flex flex-wrap gap-2 tracking-wider font-bold" role="radiogroup" aria-label="Service tiers">
                {tiers.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    role="radio"
                    aria-checked={selectedTier.id === tier.id}
                    onClick={() => chooseTier(tier)}
                    className={cardClass(selectedTier.id === tier.id)}
                  >
                    <div className="w-full flex justify-between gap-2">
                      <span className="text-xs uppercase tracking-wider opacity-70">{tier.label}</span>
                      <span className="opacity-70">{formatPrice(tier.price)}</span>
                    </div>
                    
                    {tier.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedTier.templates && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Available templates
                </h3>

                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Available templates">
                  {selectedTier.templates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      role="radio"
                      aria-checked={selectedTemplate?.id === template.id}
                      onClick={() => setSelectedTemplateId(template.id)}
                      className={pillClass(selectedTemplate?.id === template.id)}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                Add-on expansions
              </h3>

              <div className="flex flex-wrap gap-2" role="group" aria-label="Add-on expansions">
                {addOns.map((item) => {
                  const active = selectedAddOnIds.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      title={item.description}
                      onClick={() => toggleAddOn(item.id)}
                      className={pillClass(active)}
                    >
                      <i className={`fa-solid ${active ? 'fa-check' : 'fa-plus'} text-xs`} aria-hidden="true"></i>
                      {item.name}
											{item.price != 0 ? (
												<span className="shrink-0">
													+{formatPrice(item.price)}
													{item.monthly ? '/mo' : ''}
												</span>
											) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                Available interactive systems
              </h3>
              
              <div className="flex flex-wrap gap-2" role="group" aria-label="System expansions">
                {systems.map((item) => {
                  const active = selectedSystemIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      title={item.description}
                      onClick={() => toggleSystem(item.id)}
                      className={pillClass(active)}
                    >
                      <i className={`fa-solid ${active ? 'fa-check' : 'fa-plus'} text-xs`} aria-hidden="true"></i>
                      {item.name}
                      {item.price != 0 ? (
												<span className="shrink-0">
													+{formatPrice(item.price)}
												</span>
											) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-6 border border-[var(--border)] px-6 py-6 font-sans lg:sticky lg:top-10">
          <div className="space-y-4 border-b border-[var(--border)] pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)]">{selectedTier.label}</p>
                <h2 className="font-serif text-xl font-semibold leading-snug sm:text-2xl">{selectedTier.name}</h2>
                {selectedTemplate && <p className="text-sm text-[var(--muted)]">{selectedTemplate.name}</p>}
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xs text-[var(--muted)]">Starting at</p>
                <p className="text-xl font-semibold">{formatPrice(selectedTier.price)}</p>
                {selectedTier.negotiable && <p className="text-xs text-[var(--muted)]">Negotiable</p>}
              </div>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="space-y-2">
                <dt className="text-xs uppercase tracking-wider text-[var(--muted)]">Details</dt>
                <dd>Delivered in {selectedTier.timeline}.</dd>
              </div>

              <div className="space-y-2">
                <dt className="text-xs uppercase tracking-wider text-[var(--muted)]">Best for</dt>
                <dd>{selectedTemplate?.bestFor ?? selectedTier.bestFor}</dd>
              </div>

              <div className="space-y-2">
                <dt className="text-xs uppercase tracking-wider text-[var(--muted)]">Core goal</dt>
                <dd>{selectedTemplate?.coreGoal ?? selectedTier.coreGoal}</dd>
              </div>

              <div className="space-y-2">
                <dt className="text-xs uppercase tracking-wider text-[var(--muted)]">Benefits</dt>
                <dd>
                  <ul className="list-disc space-y-1.5 pl-5 marker:text-[var(--muted)]">
                    {selectedTier.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </dd>
              </div>

              <p className="text-xs text-[var(--muted)]">
                Hosting, domain, and third-party API fees are not included.
              </p>
            </dl>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Pricing calculator
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-start justify-between gap-4">
                <span>{selectedTier.label} base</span>
                <span className="shrink-0">{formatPrice(selectedTier.price)}</span>
              </div>

              {selectedAddOns.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-6 text-[var(--muted)]">
                  <span>{item.name}</span>
                  {item.price != 0 ? (
										<span className="shrink-0">
											+{formatPrice(item.price)}
											{item.monthly ? '/mo' : ''}
										</span>
									) : null}
                </div>
              ))}

              {selectedSystems.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-6 text-[var(--muted)]">
                  <span>{item.name}</span>
                  {item.price != 0 ? (
										<span className="shrink-0">
											+{formatPrice(item.price)}
										</span>
									) : null}
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-[var(--border)] pt-4">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-[var(--muted)]">Estimated total</span>
                <span className="font-serif text-3xl font-bold" aria-live="polite">{formatPrice(oneTime)}</span>
              </div>
              {monthly > 0 && (
                <div className="flex items-baseline justify-between gap-4 text-sm text-[var(--muted)]">
                  <span>Plus recurring</span>
                  <span>{formatPrice(monthly)}/month</span>
                </div>
              )}
              <p className="text-xs text-[var(--muted)]">
                Starting prices. Final quote is confirmed after we talk.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="flex w-full cursor-pointer items-center justify-center gap-2 border border-[var(--fg)] bg-[var(--fg)] px-5 py-2 text-sm text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--bg)] hover:text-[var(--fg)]"
          >
            <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
            Submit inquiry
          </button>
        </div>
      </section>

      {dialogOpen && (
        <SummaryDialog
          tier={selectedTier}
          template={selectedTemplate}
          selectedAddOns={selectedAddOns}
          selectedSystems={selectedSystems}
          oneTime={oneTime}
          monthly={monthly}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </article>
  );
}