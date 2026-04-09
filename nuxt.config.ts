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
            title: 'Windows 10',
            htmlAttrs: {lang: 'fr'},
            meta: [
                {name: 'viewport', content: 'width=device-width, initial-scale=1'},
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
    },
})