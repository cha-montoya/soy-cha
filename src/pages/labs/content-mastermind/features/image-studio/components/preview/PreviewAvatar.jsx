export default function PreviewAvatar({
  name = "Content Mastermind",
  imageUrl = null,
}) {
  const initials = getInitials(name);

  return (
    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-900">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-bold tracking-wide text-white">
          {initials}
        </div>
      )}
    </div>
  );
}

function getInitials(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "CM";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`
    .toUpperCase();
}