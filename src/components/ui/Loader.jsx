import { useEffect, useState } from "react"

const words = ["Estrategia", "Diseño", "Desarrollo"]

function Loader({ finishLoading }) {

    const [progress, setProgress] = useState(0)
    const [wordIndex, setWordIndex] = useState(0)
    const [reveal, setReveal] = useState(false)

    useEffect(() => {

        const progressInterval = setInterval(() => {

        setProgress(prev => {

            if (prev >= 100) {

            clearInterval(progressInterval)

            setReveal(true)

            setTimeout(() => {
                finishLoading()
            }, 900)

            return 100
            }

            return prev + 1
        })

        }, 18)

        const wordInterval = setInterval(() => {
        setWordIndex(prev => (prev + 1) % words.length)
        }, 700)

        return () => {
        clearInterval(progressInterval)
        clearInterval(wordInterval)
        }

    }, [])

    return (

        <div className={`fixed inset-0 bg-black text-white flex items-center justify-center z-[9999] transition-transform duration-1000 ${reveal ? "loader-reveal" : ""}`}>

            <div className="text-center">

                <div className="mt-8 text-9xl text-white font-display font-black tracking-tight">
                    {progress}%
                </div>
                
                <div className="h-10 mt-4 overflow-hidden">
                    <p
                        key={wordIndex}
                        className="text-neutral-100 text-lg animate-fadeUp"
                    >
                        {words[wordIndex]}
                    </p>
                </div>

                <h1 className="mt-8 font-display text-xl md:text-lg font-black tracking-tight">
                    Carlos 'Cha' Montoya
                </h1>

                {/* full width progress bar */}

                <div className="absolute bottom-20 left-0 w-full h-[2px] bg-neutral-800">

                    <div
                    className="h-full bg-main-color transition-all duration-200"
                    style={{ width: `${progress}%` }}
                    />

                </div>

            </div>

        </div>
    )
}

export default Loader
