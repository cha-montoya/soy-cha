import { useEffect, useRef } from "react"

export default function ServicesLogoMarquee() {

    const logos = [
        "../../logos/eloqua.svg",
        "../../logos/hubspot.svg",
        "../../logos/marketo.svg",
        "../../logos/responsys.svg",
        "../../logos/salesforce.svg",
        "../../logos/acoustic.svg"
    ]

    // duplicamos para loop infinito
    const loopLogos = [...logos, ...logos]

    const marqueeRef = useRef(null)

    useEffect(() => {
        const el = marqueeRef.current

        let animation

        const start = () => {
        animation = el.animate(
            [
            { transform: "translateX(0)" },
            { transform: "translateX(-50%)" }
            ],
            {
            duration: 20000,
            iterations: Infinity,
            easing: "linear"
            }
        )
        }

        start()

        return () => animation?.cancel()
    }, [])

    return (
        <div className="w-full overflow-hidden mt-12">

        <div
            ref={marqueeRef}
            className="flex w-max items-center"
        >
            {loopLogos.map((logo, i) => (
            <div
                key={i}
                className="flex items-center justify-center w-[160px] h-[70px] mx-8"
            >
                <img
                src={logo}
                alt="ESP logo"
                className="max-h-[32px] max-w-[120px] object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition duration-300"
                />
            </div>
            ))}
        </div>

        </div>
    )
}