export default function FilterBar({
    value,
    onChange,
}) {

    return (

        <div className="mb-4">

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
            >

                <option value="all">
                    Todos
                </option>

                <option value="draft">
                    Draft
                </option>

                <option value="image_ready">
                    Image Ready
                </option>

                <option value="pending_review">
                    Pending Review
                </option>

                <option value="published">
                    Published
                </option>

            </select>

        </div>

    );

}