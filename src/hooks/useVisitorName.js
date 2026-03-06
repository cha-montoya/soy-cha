import { useEffect, useState } from "react"

export function useVisitorName() {
    const [name, setName] = useState("")

    useEffect(() => {
        const stored = localStorage.getItem("visitorName")
        if (stored) setName(stored)
    }, [])

    const saveName = (value) => {
        localStorage.setItem("visitorName", value)
        setName(value)
    }

    return { name, saveName }
}