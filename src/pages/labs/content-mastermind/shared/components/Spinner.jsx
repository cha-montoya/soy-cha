import { SpinnerGapIcon } from "@phosphor-icons/react";

export default function Spinner({
    size = 18,
    className = "",
    }) {
    return (
        <SpinnerGapIcon
        size={size}
        className={`animate-spin ${className}`}
        />
    );
}