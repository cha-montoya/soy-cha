import {
  ChatCircleIcon,
  HeartIcon,
  PaperPlaneTiltIcon,
} from "@phosphor-icons/react";

const actions = [
  {
    id: "like",
    label: "Like",
    icon: HeartIcon,
  },
  {
    id: "comment",
    label: "Comment",
    icon: ChatCircleIcon,
  },
  {
    id: "share",
    label: "Share",
    icon: PaperPlaneTiltIcon,
  },
];

export default function PreviewFooter() {
  return (
    <footer className="border-t border-gray-200 pt-4">
      <div className="grid grid-cols-3 gap-2">
        {actions.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            disabled
            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-gray-500"
          >
            <Icon
              size={18}
              weight="regular"
            />

            <span>{label}</span>
          </button>
        ))}
      </div>
    </footer>
  );
}