export default function StatusBadge({ status }) {
    const styles = {
        draft: "rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-700",

        published: "bg-green-100 text-green-700 text-sm font-mono tracking-widest px-3 py-2 rounded-full",

        pending_review: "bg-yellow-100 text-yellow-700 text-sm font-mono tracking-widest px-3 py-2 rounded-full",

        image_ready: "bg-blue-100 text-blue-700 text-sm font-mono tracking-widest px-3 py-2 rounded-full",
    };

    return (
        <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
            styles[status] ?? "bg-gray-100 text-gray-700"
        }`}
        >
        {status.replace("_", " ")}
        </span>
    );
}