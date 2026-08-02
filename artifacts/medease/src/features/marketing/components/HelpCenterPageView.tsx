import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import {
  helpCenterPage,
  type HelpFaqCategoryId,
} from '@/features/marketing/content/help-center-fr';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { Input } from '@/shared/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { cn } from '@/shared/lib/utils';

const toneClass = {
  orange: 'bg-orange-100 text-orange-700',
  blue: 'bg-sky-100 text-sky-800',
  teal: 'bg-teal-100 text-teal-800',
  purple: 'bg-violet-100 text-violet-800',
  green: 'bg-emerald-100 text-emerald-800',
};

export function HelpCenterPageView() {
  const page = helpCenterPage;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<HelpFaqCategoryId>('all');

  useDocumentTitle(page.seo.title);

  useEffect(() => {
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', page.seo.description);
    }
  }, []);

  const groups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return page.faq.groups
      .filter((group) => filter === 'all' || group.id === filter)
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (!normalized) return true;
          return (
            item.question.toLowerCase().includes(normalized) ||
            item.answer.toLowerCase().includes(normalized)
          );
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [filter, query, page.faq.groups]);

  return (
    <>
      <section className="pb-12 pt-28 md:pb-16 md:pt-32">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b8f9e]">
            {page.hero.eyebrow}
          </p>
          <h1 className="font-[family-name:var(--marketing-display)] text-4xl font-extrabold tracking-tight text-[#072a47] sm:text-5xl">
            {page.hero.titleLead}{' '}
            <span className="text-[#0b8f9e]">{page.hero.titleAccent}</span>
          </h1>
          <p className="mt-4 text-muted-foreground">{page.hero.subtitle}</p>

          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={page.hero.searchPlaceholder}
              className="h-12 rounded-full border-[#0b8f9e]/25 bg-card pl-11 shadow-sm"
              aria-label="Rechercher dans l'aide"
            />
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {page.channels.map((channel) => (
            <div
              key={channel.title}
              className="rounded-2xl border border-border bg-card p-5 text-left shadow-sm"
            >
              <div className="mb-3 h-10 w-10 rounded-xl bg-[#0b8f9e]/12" />
              <h2 className="font-semibold text-[#072a47]">{channel.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {channel.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="border-t border-border/60 bg-muted/30 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b8f9e]">
              {page.faq.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {page.faq.title}
            </h2>
          </div>

          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {page.faq.filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                  filter === item.id
                    ? 'border-[#0b8f9e] bg-[#0b8f9e] text-white'
                    : 'border-border bg-card text-muted-foreground hover:border-[#0b8f9e]/40 hover:text-foreground',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-10">
            {groups.map((group) => (
              <div key={group.id}>
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className={cn(
                      'inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                      toneClass[group.tone],
                    )}
                  >
                    {group.title.charAt(0)}
                  </span>
                  <h3 className="text-lg font-semibold text-[#072a47]">
                    {group.title}
                  </h3>
                </div>
                <Accordion type="multiple" className="rounded-2xl border bg-card px-4">
                  {group.items.map((item) => (
                    <AccordionItem key={item.question} value={item.question}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}

            {groups.length === 0 ? (
              <p className="text-center text-muted-foreground">
                Aucune réponse ne correspond à votre recherche.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
