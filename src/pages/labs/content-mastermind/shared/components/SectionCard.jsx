export default function SectionCard({
  title,
  action,
  children,
}) {
  return (
    <section className="rounded-xl border bg-white p-5">

      <div className="mb-4 flex items-center justify-between">

        <h2 className="text-base font-semibold text-slate-950">
          {title}
        </h2>

        {action}

      </div>

      {children}

    </section>
  );
}