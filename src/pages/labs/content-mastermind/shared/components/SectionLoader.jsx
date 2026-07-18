import Spinner from "./Spinner";

export default function SectionLoader({
    text = "Loading...",
}) {
    return (
        <div className="flex h-full min-h-[420px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">

                <Spinner
                    size={34}
                    className="text-primary"
                />

                <p className="text-sm text-gray-500">
                    {text}
                </p>

            </div>
        </div>
    );
}