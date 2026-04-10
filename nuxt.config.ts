// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {
        enabled: true,

        timeline: {
            enabled: true,
        },
    },
    modules: ['@nuxt/icon'],
    css: ['~/assets/css/main.scss'],
    app: {
        head: {
            title: '35mm — Portfolio d\'Hugo Pinchemel',
            htmlAttrs: {
                lang: 'fr',
            },
            meta: [
                {charset: 'utf-8'},
                {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                {
                    name: 'description',
                    content: '35mm — Portfolio interactif d\'Hugo Pinchemel, simulant un bureau Windows 10. Explorez mes projets à travers une interface immersive.'
                },
                // Open Graph
                {property: 'og:title', content: '35mm — Portfolio d\'Hugo Pinchemel'},
                {
                    property: 'og:description',
                    content: 'Portfolio interactif simulant un bureau Windows 10. Explorez mes projets à travers une interface immersive.'
                },
                {property: 'og:image', content: 'https://35mm.hugo-pinchemel.fr/og-image.png'},
                {property: 'og:url', content: 'https://35mm.hugo-pinchemel.fr/'},
                {property: 'og:type', content: 'website'},
                // Twitter Cards
                {name: 'twitter:card', content: 'summary_large_image'},
                {name: 'twitter:title', content: '35mm — Portfolio d\'Hugo Pinchemel'},
                {
                    name: 'twitter:description',
                    content: 'Portfolio interactif simulant un bureau Windows 10. Explorez mes projets à travers une interface immersive.'
                },
                {name: 'twitter:image', content: 'https://35mm.hugo-pinchemel.fr/og-image.png'},
                {name: 'theme-color', content: '#0078d4'},
            ],
            link: [
                {rel: 'canonical', href: 'https://35mm.hugo-pinchemel.fr/'},
                {rel: 'manifest', href: '/manifest.json'},
                {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
            ],
        },
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    silenceDeprecations: ['mixed-decls'],
                },
            },
        },
        optimizeDeps: {
            include: ['pdfjs-dist'],
        },
    },
})
