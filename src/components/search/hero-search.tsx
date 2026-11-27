"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { RangeCalendar, type Range } from "@/components/items/range-calendar";
import { ArrowIcon, CalendarIcon, SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { localTodayISO } from "@/lib/dates";
import { formatINR, formatShortDate } from "@/lib/format";

/** What the search box needs to know about an item. Comes from the server (later: GET /items). */
export type Suggestion = {
  id: string;
  title: string;
  categoryName: string;
  area: string;
  dayPrice: number;
  weekRate: number;
  popular: boolean;
};

type Props = {
  suggestions: Suggestion[];
  categories: { slug: string; name: string }[];
  /** Item title shown as an example in the empty field. The parent changes it over time. */
  example: string;
};

const MAX_RESULTS = 5;
/** PRD: a rental is at most 30 days. */
const MAX_DAYS = 30;

const MotionLink = motion.create(Link);

const panelMotion = {
  initial: { opacity: 0, y: -8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
  transition: { type: "spring", stiffness: 520, damping: 36 },
} as const;

const list: Variants = { hidden: {}, shown: { transition: { staggerChildren: 0.035 } } };
const row: Variants = { hidden: { opacity: 0, y: 6 }, shown: { opacity: 1, y: 0 } };

/**
 * S01 search, in the shape of a Google search bar: item, dates, search.
 * Focus opens live suggestions; the dates button opens the same calendar as the item page.
 * It is still a GET form to /search, so it works before JavaScript loads.
 */
export function HeroSearch({ suggestions, categories, example }: Props) {
  const id = useId();
  const listId = `${id}-list`;
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const datesButtonRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const [panel, setPanel] = useState<"none" | "suggest" | "dates">("none");
  const [active, setActive] = useState(-1);
  const [range, setRange] = useState<Range>({ from: null, to: null });
  const [today, setToday] = useState<string | null>(null);

  // Close the open panel on a click or tap anywhere outside the form.
  useEffect(() => {
    if (panel === "none") return;
    const onDown = (event: PointerEvent) => {
      if (!formRef.current?.contains(event.target as Node)) setPanel("none");
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [panel]);

  const q = query.trim().toLowerCase();
  const matches = q
    ? suggestions.filter((s) => `${s.title} ${s.categoryName}`.toLowerCase().includes(q)).slice(0, MAX_RESULTS)
    : suggestions.filter((s) => s.popular).slice(0, 4);

  const dates = range.from && range.to ? { from: range.from, to: range.to } : null;
  const itemHref = (itemId: string) => (dates ? `/items/${itemId}?from=${dates.from}&to=${dates.to}` : `/items/${itemId}`);
  const searchHref = (extra: Record<string, string> = {}) => {
    const params = new URLSearchParams(extra);
    if (query.trim()) params.set("q", query.trim());
    if (dates) {
      params.set("from", dates.from);
      params.set("to", dates.to);
    }
    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
  };

  const options = [...matches.map((s) => itemHref(s.id)), ...(q ? [searchHref()] : [])];
  const showSuggest = panel === "suggest";

  function close() {
    setPanel("none");
    setActive(-1);
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setPanel("suggest");
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (event.key === "Enter" && showSuggest && active >= 0 && options[active]) {
      event.preventDefault();
      close();
      router.push(options[active]);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    close();
    router.push(searchHref());
  }

  function openDates() {
    setToday((t) => t ?? localTodayISO());
    setActive(-1);
    setPanel((p) => (p === "dates" ? "none" : "dates"));
  }

  const datesLabel = dates
    ? `${formatShortDate(dates.from)} to ${formatShortDate(dates.to)}`
    : range.from
      ? `${formatShortDate(range.from)} to …`
      : "Add dates";

  return (
    <form
      ref={formRef}
      action="/search"
      method="get"
      role="search"
      onSubmit={onSubmit}
      onKeyDown={(event) => {
        if (event.key === "Escape" && panel !== "none") {
          // Focus goes back to the control that opened the panel.
          if (panel === "dates") datesButtonRef.current?.focus();
          close();
        }
      }}
      onBlur={(event) => {
        // Tabbing out of the form closes the panel; moving inside it does not.
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) close();
      }}
      className="relative"
    >
      <div className="flex flex-col gap-1 rounded-[28px] border border-rule bg-card p-2 transition-[border-color,box-shadow] duration-200 focus-within:border-action focus-within:ring-4 focus-within:ring-action/15 sm:flex-row sm:items-center sm:rounded-full sm:pl-5">
        <div
          // A click on the icon or the padding still puts the cursor in the field.
          onMouseDown={(event) => {
            if (event.target !== inputRef.current) {
              event.preventDefault();
              inputRef.current?.focus();
            }
          }}
          className="flex min-w-0 flex-1 cursor-text items-center gap-3 px-3 sm:px-0"
        >
          <SearchIcon className="size-6 shrink-0 text-ink-soft" />
          <label htmlFor={`${id}-q`} className="sr-only">
            What do you want to rent?
          </label>
          <div className="relative min-w-0 flex-1">
            <input
              ref={inputRef}
              id={`${id}-q`}
              name="q"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(-1);
                setPanel("suggest");
              }}
              onFocus={() => setPanel("suggest")}
              onKeyDown={onInputKeyDown}
              autoComplete="off"
              role="combobox"
              aria-expanded={showSuggest}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={showSuggest && active >= 0 ? `${id}-opt-${active}` : undefined}
              // The bar around this field draws the focus ring, so the field drops the global outline
              // (`!` because the global :focus-visible rule sits outside Tailwind's layers).
              className="h-12 w-full bg-transparent text-lg text-ink outline-none focus-visible:outline-none!"
            />
            {query === "" && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center overflow-hidden text-lg whitespace-nowrap text-ink-soft"
              >
                Try&nbsp;
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={example}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-110%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="truncate font-semibold text-ink"
                  >
                    {example}
                  </motion.span>
                </AnimatePresence>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-rule pt-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-2">
          <button
            ref={datesButtonRef}
            type="button"
            onClick={openDates}
            aria-expanded={panel === "dates"}
            aria-controls={`${id}-dates`}
            className={cn(
              "flex h-12 min-w-0 flex-1 items-center gap-2.5 rounded-full px-4 text-left transition-colors hover:bg-plate sm:min-w-40 sm:flex-none",
              panel === "dates" && "bg-plate",
            )}
          >
            <CalendarIcon className="size-5 shrink-0 text-ink-soft" />
            <span className="min-w-0 leading-tight">
              <span className="block text-xs text-ink-soft">Dates</span>
              <span className={cn("block truncate text-sm font-semibold", !dates && !range.from && "text-ink-soft")}>
                {datesLabel}
              </span>
            </span>
          </button>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-action px-6 font-semibold text-white transition-colors hover:bg-action-dark"
          >
            <SearchIcon className="size-5 sm:hidden" />
            Search
          </motion.button>
        </div>
      </div>

      {/* Sent only when set, so an empty search has a clean URL. */}
      <input type="hidden" name="from" value={dates?.from ?? ""} disabled={!dates} />
      <input type="hidden" name="to" value={dates?.to ?? ""} disabled={!dates} />

      <AnimatePresence>
        {showSuggest && (
          <motion.div
            key="suggest"
            {...panelMotion}
            style={{ originY: 0 }}
            className="absolute inset-x-0 top-full z-30 mt-2 rounded-[28px] border border-rule bg-card p-2"
          >
            <p className="px-3 pt-2 pb-1 text-xs font-semibold text-ink-soft">
              {q ? (matches.length ? "Items" : `No item names match “${query.trim()}”`) : "Popular right now"}
            </p>
            <motion.div
              id={listId}
              role="listbox"
              aria-label="Suggestions"
              variants={list}
              initial="hidden"
              animate="shown"
            >
              {matches.map((s, index) => (
                <MotionLink
                  key={s.id}
                  id={`${id}-opt-${index}`}
                  href={itemHref(s.id)}
                  role="option"
                  aria-selected={active === index}
                  variants={row}
                  onMouseEnter={() => setActive(index)}
                  onClick={close}
                  className={cn("flex items-center gap-3 rounded-2xl px-2 py-2", active === index && "bg-plate")}
                >
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-plate">
                    <Image src={`/items/${s.id}.svg`} alt="" fill unoptimized sizes="48px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">
                      <Highlight text={s.title} query={query.trim()} />
                    </span>
                    <span className="block truncate text-sm text-ink-soft">
                      {s.categoryName} in {s.area}
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-sm">
                    <span className="type-condensed text-lg font-extrabold">{formatINR(s.dayPrice)}</span>
                    <span className="text-ink-soft"> a day</span>
                  </span>
                </MotionLink>
              ))}
              {q && (
                <MotionLink
                  id={`${id}-opt-${matches.length}`}
                  href={searchHref()}
                  role="option"
                  aria-selected={active === matches.length}
                  variants={row}
                  onMouseEnter={() => setActive(matches.length)}
                  onClick={close}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-2 py-2 text-action",
                    active === matches.length && "bg-action-wash",
                  )}
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-action-wash">
                    <SearchIcon className="size-5" />
                  </span>
                  <span className="flex-1 font-semibold">Search everything for “{query.trim()}”</span>
                  <ArrowIcon className="size-5 shrink-0" />
                </MotionLink>
              )}
            </motion.div>

            {(!q || matches.length === 0) && (
              <div className="mt-2 border-t border-rule px-3 pt-3 pb-2">
                <p className="text-xs font-semibold text-ink-soft">Browse by category</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={searchHref({ category: c.slug })}
                      onClick={close}
                      className="inline-flex h-9 items-center rounded-full border border-rule px-3.5 text-sm font-medium hover:border-ink"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {panel === "dates" && today && (
          <motion.div
            key="dates"
            id={`${id}-dates`}
            role="dialog"
            aria-label="Pickup and return dates"
            {...panelMotion}
            style={{ originY: 0 }}
            className="absolute inset-x-0 top-full z-30 mt-2 rounded-[28px] border border-rule bg-card p-4 sm:left-auto sm:w-[360px]"
          >
            <RangeCalendar
              today={today}
              value={range}
              onChange={setRange}
              unavailable={[]}
              minDays={1}
              maxDays={MAX_DAYS}
            />
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  close();
                  datesButtonRef.current?.focus();
                }}
                className="h-10 rounded-full bg-ink px-5 text-sm font-semibold text-paper"
              >
                {dates ? "Use these dates" : "Close"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

/** Marks the part of a title that matches what was typed. */
function Highlight({ text, query }: { text: string; query: string }) {
  const at = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="rounded bg-tag-wash text-ink">{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  );
}
