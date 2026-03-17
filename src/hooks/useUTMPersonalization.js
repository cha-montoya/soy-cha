import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const COPY = {
  recruiter: {
    es: {
      headline: 'Hola, visitante de <span class="italic text-primary">LinkedIn</span> 👋',
      sub:      'Esto es lo que necesitas saber: Tengo más de 20 años entre diseño y growth. Actualmente disponible para nuevas oportunidades.',
      cta:      'Ver mi CV',
    },
    en: {
      headline: 'Hey, <span class="italic text-primary">LinkedIn</span> visitor 👋',
      sub:      'Here\'s what you need to know: 20+ years across design and growth. Currently open to new opportunities.',
      cta:      'View my CV',
    },
  },
  propuesta: {
    es: {
      headline: 'Esto es lo que puedo hacer <span class="italic text-primary">por tu marca.</span>',
      sub:      'Estrategia de crecimiento, diseño y marketing automation, en un solo perfil.',
      cta:      'Ver servicios',
    },
    en: {
      headline: 'Here\'s what I can do <span class="italic text-primary">for your brand.</span>',
      sub:      'Growth strategy, design and marketing automation — one profile, full stack.',
      cta:      'View services',
    },
  },
  referral: {
    es: {
      headline: 'Bienvenido. Ya tenemos <span class="italic text-primary">algo en común.</span>',
      sub:      'Alguien pensó que deberíamos conocernos. Buen gusto de su parte.',
      cta:      'Conoce mi trabajo',
    },
    en: {
      headline: 'Welcome. We already have <span class="italic text-primary">something in common.</span>',
      sub:      'Someone thought we should meet. Good taste on their part.',
      cta:      'See my work',
    },
  },
  default: {
    es: {
      headline: 'Estrategia que se ve. Diseño que <span class="italic text-primary">convierte.</span>',
      sub:      'Soy Carlos \'Cha\' Montoya, estratega de crecimiento digital y diseñador gráfico con más de 20 años conectando creatividad con resultados de negocio.',
      cta:      'Conóceme',
    },
    en: {
      headline: 'Strategy you can see. Design that <span class="italic text-primary">converts.</span>',
      sub:      'I\'m Carlos \'Cha\' Montoya, a digital growth strategist and graphic designer with 20+ years connecting creativity with business results.',
      cta:      'Meet me',
    },
  },
}

export function useUTMPersonalization() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'es'

  const copy = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const medium = (params.get('utm_medium') || '').toLowerCase()
    const source = (params.get('utm_source') || '').toLowerCase()

    let variant

    if (medium === 'recruiter' || source === 'linkedin') {
      variant = 'recruiter'
    } else if (medium === 'propuesta' || medium === 'email') {
      variant = 'propuesta'
    } else if (source === 'referral' || medium === 'referral') {
      variant = 'referral'
    } else {
      variant = 'default'
    }

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event:       'hero_personalized',
      utmMedium:   medium || '(none)',
      utmSource:   source || '(none)',
      copyVariant: variant,
    })

    return variant
  }, []) // variant only needs to be computed once

  return { ...COPY[copy][lang], variant: copy }
}