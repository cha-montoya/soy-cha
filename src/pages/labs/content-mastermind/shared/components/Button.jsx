export default function Button({
    children,
    variant = "primary",
    disabled = false,
    onClick,
    className = "",
    type = "button",
    }) {
    const variants = {
        primary:
        "bg-blue-600 text-white hover:bg-blue-700",

        secondary:
        "bg-gray-100 text-gray-700 hover:bg-gray-200",

        success:
        "bg-green-600 text-white hover:bg-green-700",

        warning:
        "bg-yellow-500 text-white hover:bg-yellow-600",

        danger:
        "bg-red-600 text-white hover:bg-red-700",
    };

    return (
        <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`
            inline-flex
            items-center
            justify-center
            rounded-lg
            px-4
            py-2
            text-sm
            font-medium
            transition-colors
            duration-200
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${variants[variant]}
            ${className}
        `}
        >
        {children}
        </button>
    );
}