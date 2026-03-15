import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function ContactForm() {

    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        message: ""
    })

    const [status, setStatus] = useState("idle")

    const handleChange = (e) => {

        const { name, value } = e.target

        if (name === "phone") {

        const numericValue = value.replace(/\D/g, "")

        setFormData({
            ...formData,
            phone: numericValue.slice(0, 10)
        })

        return
        }

        setFormData({
        ...formData,
        [name]: value
        })
    }

    const handleSubmit = async (e) => {
    e.preventDefault()

    setStatus("loading")

    const leadData = {
        name: formData.name,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        message: formData.message,
        page_url: window.location.href,
        referrer: document.referrer,
        user_agent: navigator.userAgent
        }

        const { error } = await supabase
            .from("leads")
            .insert([leadData])

        if (error) {
            console.error(error)
            setStatus("error")
        } else {
            setStatus("success")

            setFormData({
            name:"",
            lastName:"",
            email:"",
            phone:"",
            company:"",
            message:""
            })
        }
        const form = new FormData(e.target)

            if (form.get("website")) {
            return
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 font-sans">

            <input
                type="text"
                name="website"
                style={{ display: "none" }}
                tabIndex="-1"
                autoComplete="off"
            />

            {/* NAME ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    name="name"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
                />

                <input
                    name="lastName"
                    placeholder="Apellido"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
                />
            </div>

            {/* EMAIL + PHONE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
                />

                <input
                    name="phone"
                    placeholder="Teléfono Móvil"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
                />
            </div>

            <input
                name="company"
                placeholder="Empresa"
                value={formData.company}
                onChange={handleChange}
                className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
            />

            <textarea
                name="message"
                placeholder="Mensaje"
                value={formData.message}
                onChange={handleChange}
                className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
            />

            {/* <button type="submit" className="btn-glitch-fill">
                <span className="text">// Enviar mensaje</span>
                <span className="text-decoration"> _</span>
                <span className="decoration">⇒</span>
            </button> */}

            <button type="submit" disabled={status === "loading"} className="btn-glitch-fill">

                {status === "idle" && (
                    <>
                    <span className="text">// Enviar mensaje</span>
                    <span className="text-decoration"> _</span>
                    <span className="decoration">⇒</span>
                    </>
                )}

                {status === "loading" && (
                    <span>Enviando...</span>
                )}

                {status === "success" && (
                    <span>✓ Mensaje enviado</span>
                )}

                {status === "error" && (
                    <span>Error. Intenta nuevamente</span>
                )}

            </button>

        </form>
    )
}
