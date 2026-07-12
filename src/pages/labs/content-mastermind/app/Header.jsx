export default function Header() {
    return (
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 md:px-16 h-20">

            <span className="text-xl md:text-3xl font-black tracking-tight font-display">
            Content Mastermind
            </span>

            <span className="text-sm text-gray-500">
                v0.1.0
            </span>
        </header>
    );
}