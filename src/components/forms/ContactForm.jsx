import { useState } from "react"
import { useTranslation } from "react-i18next"
import { supabase } from "../../lib/supabase"
import { XIcon, CheckIcon, SpinnerGapIcon } from "@phosphor-icons/react"


export default function ContactForm() {
    const { t } = useTranslation()

    const [formData, setFormData] = useState({
        name: "", lastName: "", email: "", phone: "", company: "", message: ""
    })

    const [status, setStatus] = useState("idle")

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === "phone") {
        const numericValue = value.replace(/\D/g, "")
        setFormData({ ...formData, phone: numericValue.slice(0, 10) })
        return
        }

        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus("loading")

        const form = new FormData(e.target)
        if (form.get("website")) return

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

        const { error } = await supabase.from("leads").insert([leadData])

        if (error) {
        console.error(error)
        setStatus("error")
        } else {
        setStatus("success")
        setFormData({ name: "", lastName: "", email: "", phone: "", company: "", message: "" })
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
            name="name"
            placeholder={t("contact.form.name")}
            value={formData.name}
            onChange={handleChange}
            required
            className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
            />
            <input
            name="lastName"
            placeholder={t("contact.form.lastName")}
            value={formData.lastName}
            onChange={handleChange}
            className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
            type="email"
            name="email"
            placeholder={t("contact.form.email")}
            value={formData.email}
            onChange={handleChange}
            required
            className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
            />
            <input
            name="phone"
            placeholder={t("contact.form.phone")}
            value={formData.phone}
            onChange={handleChange}
            className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
            />
        </div>

        <input
            name="company"
            placeholder={t("contact.form.company")}
            value={formData.company}
            onChange={handleChange}
            className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
        />

        <textarea
            name="message"
            placeholder={t("contact.form.message")}
            value={formData.message}
            onChange={handleChange}
            className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
        />

        <button type="submit" disabled={status === "loading"} className="btn-glitch-fill">
            {status === "idle" && (
            <>
                <span className="text">// {t("contact.form.idle")}</span>
                <span className="text-decoration"> _</span>
                <span className="decoration">⇒</span>
            </>
            )}
            {status === "loading" && (
                <>
                    <span><SpinnerGapIcon /> {t("contact.form.loading")}</span>
                </>
            )}
            {status === "success" && (
                <>
                    <span><CheckIcon /> {t("contact.form.success")}</span>
                </>
            )}
            {status === "error" && (
                <>
                    <span><XIcon /> {t("contact.form.error")}</span>
                </>
            )}
        </button>

        </form>
    )
}
