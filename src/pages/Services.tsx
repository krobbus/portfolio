import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { type Variant, type Tier, type AddOn, type System, tiers, addOns, systems } from '../constants/ServicesRef';
import emailjs from '@emailjs/browser';

const formatPrice = (value: number) => `$${value.toLocaleString('en-US')}`;

const pillClass = (active: boolean) =>
  `inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-left text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)] ${
    active
      ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]'
      : 'border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]'
  }`;

const cardClass = (active: boolean) =>
  `flex w-full cursor-pointer flex-col gap-2 border p-4 text-left text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)] ${
    active
      ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]'
      : 'border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]'
  }`;

const sectionTitleClass = 'text-sm font-semibold uppercase tracking-wider text-[var(--muted)]';

function PriceTag({ price, monthly = false, custom = false, included = false }: { price: number; monthly?: boolean; custom?: boolean; included?: boolean }) {
  if (custom) return <span className="shrink-0 text-xs opacity-80">Quote</span>;
  if (included) return <span className="shrink-0 text-xs opacity-80">Included</span>;
  if (price === 0) return null;
  return (
    <span className="shrink-0">
      +{formatPrice(price)}
      {monthly ? '/mo' : ''}
    </span>
  );
}

function LineItems({ tier, variant, selectedAddOns, selectedSystems, freeSystemId }: { tier: Tier; variant: Variant | undefined; selectedAddOns: AddOn[]; selectedSystems: System[]; freeSystemId: string | undefined }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <span>
          {tier.label}: {tier.name}
          {variant && <span className="block text-xs text-[var(--muted)]">{variant.name}</span>}
        </span>
        <span className="shrink-0">{formatPrice(tier.price)}</span>
      </div>

      {variant && variant.price > 0 && (
        <div className="flex items-start justify-between gap-4 text-[var(--muted)]">
          <span>{variant.name}</span>
          <PriceTag price={variant.price} />
        </div>
      )}

      {selectedSystems.map((item) => (
        <div key={item.id} className="flex items-start justify-between gap-4 text-[var(--muted)]">
          <span>{item.name}</span>
          <PriceTag price={item.price} custom={item.custom} included={item.id === freeSystemId} />
        </div>
      ))}

      {selectedAddOns.map((item) => (
        <div key={item.id} className="flex items-start justify-between gap-4 text-[var(--muted)]">
          <span>{item.name}</span>
          <PriceTag price={item.price} monthly={item.monthly} custom={item.custom} />
        </div>
      ))}
    </>
  );
}

function Modal({ title, subtitle, onClose, children } : { title: string; subtitle?: string; onClose: () => void; children: ReactNode;}) {
  const titleId = useId();
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
        aria-labelledby={titleId}
        className="my-auto w-full max-w-xl space-y-6 border border-[var(--border)] bg-[var(--bg)] p-6 font-sans text-[var(--fg)] shadow-2xl sm:p-8"
      >
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 id={titleId} className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h2>
            {subtitle && <p className="text-sm text-[var(--muted)]">{subtitle}</p>}
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={`Close ${title.toLowerCase()}`}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] transition-colors hover:border-[var(--fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </header>

        {children}
      </section>
    </div>
  );
}

function DetailsContent({ tier, variant, selectedAddOns, selectedSystems } : { tier: Tier; variant: Variant | undefined; selectedAddOns: AddOn[]; selectedSystems: System[] }) {
  const extras = [
    { title: 'Selected systems', items: selectedSystems },
    { title: 'Selected add-ons', items: selectedAddOns },
  ].filter((group) => group.items.length > 0);

  return (
    <div className="space-y-4 text-justify tracking-wider">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">{tier.label}</p>
          <h2 className="font-serif text-xl font-semibold leading-snug sm:text-2xl">{tier.name}</h2>
          {variant && <p className="text-sm text-[var(--muted)]">{variant.name}</p>}
        </div>

        <div className="shrink-0 text-right">
          <p className="text-xs text-[var(--muted)]">Starting at</p>
          <p className="text-xl font-semibold">{formatPrice(tier.price)}</p>
          {tier.negotiable && <p className="text-xs text-[var(--muted)]">Negotiable</p>}
        </div>
      </div>

      <dl className="space-y-3 text-sm">
        <div className="mt-6 space-y-1.5">
          <dt className="text-xs uppercase tracking-wider text-[var(--muted)]">Timeline</dt>
          <dd>Delivered in {tier.timeline}.</dd>
        </div>

        <div className="mt-6 space-y-1.5">
          <dt className="text-xs uppercase tracking-wider text-[var(--muted)]">Best for</dt>
          <dd>{variant?.bestFor ?? tier.bestFor}</dd>
        </div>

        <div className="mt-6 space-y-1.5">
          <dt className="flex justify-between items-center gap-2 text-xs uppercase tracking-wider text-[var(--muted)]">
            Core goal
            <span>
              {
                tier.id == "tier-1" ? "Including available templates" : 
                tier.id == "tier-3" ? "Including application Types" : null
              }
            </span>
          </dt>
          <dd>{variant?.coreGoal ?? tier.coreGoal}</dd>
        </div>

        <div className="mt-6 space-y-1.5">
          <dt className="text-xs uppercase tracking-wider text-[var(--muted)]">Tier Benefits</dt>
          <dd>
            <ul className="list-disc space-y-1.5 pl-5 marker:text-[var(--muted)]">
              {tier.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </dd>
        </div>

        {extras.map((group) => (
          <div key={group.title} className="mt-6 space-y-1.5">
            <dt className="text-xs uppercase tracking-wider text-[var(--muted)]">{group.title}</dt>
            <dd>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.id} className="border-l-2 border-[var(--border)] pl-3">
                    <span className="block font-semibold">{item.name}</span>
                    <span className="block text-[var(--muted)]">{item.description}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-xs text-[var(--muted)]">Hosting, domain, and third-party API fees are not included.</p>
    </div>
  );
}

function SummaryDialog({ tier, variant, selectedAddOns, selectedSystems, freeSystemId, oneTime, monthly, hasCustom, onClose }: { tier: Tier; variant: Variant | undefined; selectedAddOns: AddOn[]; selectedSystems: System[]; freeSystemId: string | undefined; oneTime: number; monthly: number; hasCustom: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const describe = (item: { name: string; price: number; custom?: boolean }, monthlyItem = false) =>
    item.custom ? `${item.name} (custom quote)` : `${item.name} (+${formatPrice(item.price)}${monthlyItem ? '/month' : ''})`;

  const summaryText = [
    `Service: ${tier.label} - ${tier.name}`,
    variant ? `${tier.variantLabel === 'Application types' ? 'Application type' : 'Template'}: ${variant.name}${variant.price > 0 ? ` (+${formatPrice(variant.price)})` : ''}` : null,
    `Base price: ${formatPrice(tier.price)}${tier.negotiable ? ' (starting, negotiable)' : ' (starting)'}`,
    `Timeline: ${tier.timeline}`,
    tier.hasSystems
      ? selectedSystems.length
        ? `Systems: ${selectedSystems.map((item) => (item.id === freeSystemId ? `${item.name} (included)` : describe(item))).join(', ')}`
        : 'Systems: None'
      : null,
    selectedAddOns.length
      ? `Add-ons: ${selectedAddOns.map((item) => describe(item, item.monthly)).join(', ')}`
      : 'Add-ons: None',
    `Estimated one-time total: ${formatPrice(oneTime)}${hasCustom ? ' (excluding custom requests)' : ''}`,
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
    <Modal title="YOUR ESTIMATE" subtitle="Review your selection and send it over." onClose={onClose}>
      <div className="space-y-3 border-y border-[var(--border)] py-4 text-sm">
        <LineItems tier={tier} variant={variant} selectedAddOns={selectedAddOns} selectedSystems={selectedSystems} freeSystemId={freeSystemId} />

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
          {hasCustom && ' Custom requests are quoted separately.'}
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
    </Modal>
  );
}

export default function Services() {
  const [selectedTierId, setSelectedTierId] = useState(tiers[0].id);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(tiers[0].variants?.[0].id);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [selectedSystemIds, setSelectedSystemIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const selectedTier = tiers.find((tier) => tier.id === selectedTierId) ?? tiers[0];
  const selectedVariant = selectedTier.variants?.find((variant) => variant.id === selectedVariantId);

  const selectedAddOns = useMemo(
    () => addOns.filter((item) => selectedAddOnIds.includes(item.id)),
    [selectedAddOnIds]
  );

  const selectedSystems = useMemo(
    () =>
      selectedTier.hasSystems
        ? selectedSystemIds
            .map((id) => systems.find((item) => item.id === id))
            .filter((item): item is System => Boolean(item))
        : [],
    [selectedSystemIds, selectedTier.hasSystems]
  );

  const freeSystemId = selectedSystems.find((item) => !item.custom)?.id;

  const oneTime =
    selectedTier.price +
    (selectedVariant?.price ?? 0) +
    selectedSystems.reduce((sum, item) => sum + (item.id === freeSystemId ? 0 : item.price), 0) +
    selectedAddOns.filter((item) => !item.monthly).reduce((sum, item) => sum + item.price, 0);

  const monthly = selectedAddOns.filter((item) => item.monthly).reduce((sum, item) => sum + item.price, 0);
  const hasCustom = selectedAddOns.some((item) => item.custom) || selectedSystems.some((item) => item.custom);

  const closeDialog = useCallback(() => setDialogOpen(false), []);
  const closeDetails = useCallback(() => setDetailsOpen(false), []);

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
    setSelectedVariantId(tier.variants?.[0].id);
    if (!tier.hasSystems) setSelectedSystemIds([]);
  };

  const viewDetails = (tier: Tier) => {
    if (tier.id !== selectedTier.id) chooseTier(tier);
    setDetailsOpen(true);
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
            <div className="w-full space-y-3">
              <h3 className={sectionTitleClass}>Service tiers</h3>

              <div className="grid gap-6" role="radiogroup" aria-label="Service tiers">
                {tiers.map((tier) => (
                  <div key={tier.id} className="grid gap-2 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => viewDetails(tier)}
                      aria-haspopup="dialog"
                      className="group ml-auto inline-flex cursor-pointer items-center gap-2 text-xs text-[var(--muted)] underline-offset-4 transition-colors duration-200 hover:text-[var(--fg)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)] lg:hidden"
                    >
                      View details
                      <i
                        className="fa-solid fa-chevron-right text-[10px] transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      ></i>
                    </button>

                    <button
                      type="button"
                      role="radio"
                      aria-checked={selectedTier.id === tier.id}
                      onClick={() => chooseTier(tier)}
                      className={`${cardClass(selectedTier.id === tier.id)} font-bold tracking-wider`}
                    >
                      <div className="flex w-full justify-between gap-2">
                        <span className="text-xs uppercase tracking-wider opacity-70">{tier.label}</span>
                        <span className="opacity-70">From {formatPrice(tier.price)}</span>
                      </div>

                      {tier.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {selectedTier.variants && (
              <div className="space-y-3">
                <h3 className={sectionTitleClass}>{selectedTier.variantLabel}</h3>

                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={selectedTier.variantLabel}>
                  {selectedTier.variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      role="radio"
                      aria-checked={selectedVariant?.id === variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={pillClass(selectedVariant?.id === variant.id)}
                    >
                      {variant.name}
                      <PriceTag price={variant.price} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedTier.hasSystems && (
              <div className="space-y-3">
                <h3 className={sectionTitleClass}>Interactive systems</h3>

                <div className="flex flex-wrap gap-2" role="group" aria-label="Interactive systems">
                  {systems
                    .slice()
                    .sort((a, b) => {
                      if (a.price === 0 && b.price !== 0) return 1;
                      if (b.price === 0 && a.price !== 0) return -1;
                      return a.price - b.price;
                    })
                    .map((item) => {
                      const active = selectedSystemIds.includes(item.id);
                      const included = !item.custom && (freeSystemId === undefined || item.id === freeSystemId);

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
                          <PriceTag price={item.price} custom={item.custom} included={included} />
                        </button>
                      );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className={sectionTitleClass}>Add-on expansions</h3>

              <div className="flex flex-wrap gap-2" role="group" aria-label="Add-on expansions">
                {addOns
                  .slice()
                  .sort((a, b) => {
                    if (a.price === 0 && b.price !== 0) return 1;
                    if (b.price === 0 && a.price !== 0) return -1;
                    return a.price - b.price;
                  })
                  .map((item) => {
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
                        <PriceTag price={item.price} monthly={item.monthly} custom={item.custom} />
                      </button>
                    );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden w-full space-y-6 border border-[var(--border)] px-6 py-6 font-sans lg:sticky lg:top-10 lg:block">
          <div className="border-b border-[var(--border)] pb-6">
            <DetailsContent
              tier={selectedTier}
              variant={selectedVariant}
              selectedAddOns={selectedAddOns}
              selectedSystems={selectedSystems}
            />
          </div>

          <div className="space-y-3">
            <h3 className={sectionTitleClass}>Pricing calculator</h3>

            <div className="space-y-2 text-sm">
              <LineItems
                tier={selectedTier}
                variant={selectedVariant}
                selectedAddOns={selectedAddOns}
                selectedSystems={selectedSystems}
                freeSystemId={freeSystemId}
              />
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
                {hasCustom && ' Custom requests are quoted separately.'}
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

      <div className="sticky bottom-0 z-[90] -mx-5 border-t border-[var(--border)] bg-[var(--bg)] px-5 py-3 font-sans shadow-[0_-8px_24px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="space-y-3">
          <button
            type="button"
            aria-expanded={calculatorOpen}
            aria-controls="mobileCalculator"
            onClick={() => setCalculatorOpen((open) => !open)}
            className="flex w-full cursor-pointer items-center justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
          >
            <span className={sectionTitleClass}>Pricing calculator</span>
            <i
              className={`fa-solid fa-chevron-up text-xs text-[var(--muted)] transition-transform duration-200 ${
                calculatorOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            ></i>
          </button>

          {calculatorOpen && (
            <div
              id="mobileCalculator"
              className="max-h-[40dvh] space-y-2 overflow-y-auto border-t border-[var(--border)] pt-3 text-sm"
            >
              <LineItems
                tier={selectedTier}
                variant={selectedVariant}
                selectedAddOns={selectedAddOns}
                selectedSystems={selectedSystems}
                freeSystemId={freeSystemId}
              />

              <p className="pt-1 text-xs text-[var(--muted)]">
                Starting prices. Final quote is confirmed after we talk.
                {hasCustom && ' Custom requests are quoted separately.'}
              </p>
            </div>
          )}

          <div className="flex items-start justify-between gap-4 border-t border-[var(--border)] pt-4">
            <div>
              <p className="text-xs text-[var(--muted)]">Estimated total</p>
              <p className="font-serif text-2xl font-bold leading-none" aria-live="polite">{formatPrice(oneTime)}</p>
              {monthly > 0 && <p className="mt-1 text-xs text-[var(--muted)]">+ {formatPrice(monthly)}/month</p>}
            </div>

            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="flex shrink-0 cursor-pointer items-center justify-center gap-2 border border-[var(--fg)] bg-[var(--fg)] px-5 py-2 text-sm text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--bg)] hover:text-[var(--fg)]"
            >
              <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
              Submit inquiry
            </button>
          </div>
        </div>
      </div>

      {detailsOpen && (
        <Modal title="SERVICE DETAILS" onClose={closeDetails}>
          <DetailsContent
            tier={selectedTier}
            variant={selectedVariant}
            selectedAddOns={selectedAddOns}
            selectedSystems={selectedSystems}
          />
        </Modal>
      )}

      {dialogOpen && (
        <SummaryDialog
          tier={selectedTier}
          variant={selectedVariant}
          selectedAddOns={selectedAddOns}
          selectedSystems={selectedSystems}
          freeSystemId={freeSystemId}
          oneTime={oneTime}
          monthly={monthly}
          hasCustom={hasCustom}
          onClose={closeDialog}
        />
      )}
    </article>
  );
}