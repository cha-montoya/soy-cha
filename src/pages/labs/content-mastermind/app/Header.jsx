export default function Header() {
  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
      <span className="truncate text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">Content Mastermind</span>
      <span className="shrink-0 text-sm font-normal text-slate-500">v0.5.0</span>
    </header>
  );
}
