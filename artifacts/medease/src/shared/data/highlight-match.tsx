interface HighlightMatchProps {
  text: string;
  query?: string;
  className?: string;
}

/** Highlights search query matches within table cell text. */
export function HighlightMatch({
  text,
  query,
  className,
}: HighlightMatchProps) {
  if (!query?.trim()) {
    return <span className={className}>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(query.trim())})`, 'gi'));

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <mark
            key={`${part}-${index}`}
            className="rounded bg-yellow-200/80 px-0.5 text-inherit dark:bg-yellow-500/30"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </span>
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
