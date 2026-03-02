import { useMemo } from 'react'

/**
 * useUTMPersonalization
 * Lee los parámetros UTM de la URL y devuelve el copy correspondiente.
 * Corre en React, no en GTM — evita la race condition en SPAs.
 *
 * GTM sigue siendo útil para el TRACKING (evento hero_personalized),
 * pero el swap de copy debe vivir aquí, donde React controla el DOM.
 *
 * @returns {{ headline: string, sub: string, cta: string, variant: string }}
 */

const COPY = {
  recruiter: {
    headline: 'Hola, visitante de <span class="italic text-primary">LinkedIn</span> 👋',
    sub:      'Esto es lo que necesitas saber: Tengo más de 20 años entre diseño y growth. Actualmente disponible para nuevas oportunidades.',
    cta:      'Ver mi CV',
    variant:  'recruiter',
  },
  propuesta: {
    headline: 'Esto es lo que puedo hacer <span class="italic text-primary">por tu marca.</span>',
    sub:      'Estrategia de crecimiento, diseño y marketing automation, en un solo perfil.',
    cta:      'Ver servicios',
    variant:  'propuesta',
  },
  referral: {
    headline: 'Bienvenido. Ya tenemos <span class="italic text-primary">algo en común.</span>',
    sub:      'Alguien pensó que deberíamos conocernos. Buen gusto de su parte.',
    cta:      'Conoce mi trabajo',
    variant:  'referral',
  },
  default: {
    headline: 'Estrategia que se ve. Diseño que <span class="italic text-primary">convierte.</span>',
    sub:      'Soy Carlos \'Cha\' Montoya, estratega de crecimiento digital y diseñador gráfico con más de 20 años conectando creatividad con resultados de negocio.',
    cta:      'Conóceme',
    variant:  'default',
  },
}

export function useUTMPersonalization() {
  const copy = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const medium = (params.get('utm_medium') || '').toLowerCase()
    const source = (params.get('utm_source') || '').toLowerCase()

    let selected

    if (medium === 'recruiter' || source === 'linkedin') {
      selected = COPY.recruiter
    } else if (medium === 'propuesta' || medium === 'email') {
      selected = COPY.propuesta
    } else if (source === 'referral' || medium === 'referral') {
      selected = COPY.referral
    } else {
      selected = COPY.default
    }

    // Evento a dataLayer para GA4 — GTM solo trackea, no manipula DOM
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event:           'hero_personalized',
      utmMedium:       medium || '(none)',
      utmSource:       source || '(none)',
      copyVariant:     selected.variant,
    })

    return selected
  }, []) // Solo corre una vez al montar

  return copy
}