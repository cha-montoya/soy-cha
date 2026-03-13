import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

export default function Loader({ onFinish }) {

    const loaderRef = useRef(null)
    const barRef = useRef(null)

    useEffect(() => {

        const tl = gsap.timeline({
        onComplete: () => {
            if(onFinish) onFinish()
        }
        })

        tl.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
            scaleX: 1,
            duration: 1.2,
            ease: "power2.out",
            transformOrigin: "left"
        }
        )
        .to(loaderRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
        delay: 0.2
        })

    }, [])

    return (
        <div
        ref={loaderRef}
        className="fixed inset-0 z-[9999] bg-neutral-950 flex flex-col items-center justify-center text-white"
        >

        <h1 className="font-black tracking-tight font-display text-4xl mb-10">
            Carlos 'Cha' Montoya
        </h1>

        <div className="w-40 h-[2px] bg-neutral-800 overflow-hidden">
            <div
            ref={barRef}
            className="w-full h-full bg-primary"
            />
        </div>

        </div>
    )
}