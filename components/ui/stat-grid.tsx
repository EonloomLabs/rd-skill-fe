export function StatGrid({
  items,
}: {
  items: { value: string; label: string; note: string }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className="bg-surface p-5">
          <dt className="sr-only">{item.label}</dt>
          <dd className="ident text-[1.75rem] font-medium leading-none tracking-[-0.03em] text-ink">
            {item.value}
          </dd>
          <p className="mt-2.5 text-[0.8125rem] font-medium leading-snug text-ink">{item.label}</p>
          <p className="mt-1 text-xs leading-snug text-muted">{item.note}</p>
        </div>
      ))}
    </dl>
  );
}
