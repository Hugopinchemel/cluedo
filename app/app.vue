<template>
  <NuxtLayout>
    <NuxtPage/>
    <WinResponsiveGuard/>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import WinResponsiveGuard from '~/components/win/ResponsiveGuard.vue'

const hasInteracted = ref(false)

const triggerFullscreen = () => {
  if (hasInteracted.value) return

  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {
      // Fail silently or handle error
    })
    hasInteracted.value = true
    window.removeEventListener('mousedown', triggerFullscreen)
    window.removeEventListener('keydown', triggerFullscreen)
  }
}

onMounted(() => {
  window.addEventListener('mousedown', triggerFullscreen)
  window.addEventListener('keydown', triggerFullscreen)
})

onUnmounted(() => {
  window.removeEventListener('mousedown', triggerFullscreen)
  window.removeEventListener('keydown', triggerFullscreen)
})

// SEO & Structured Data
useHead({
  htmlAttrs: {
    lang: 'fr'
  },
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': '35mm — Portfolio interactif d\'Hugo Pinchemel',
        'url': 'https://35mm.hugo-pinchemel.fr/',
        'description': 'Portfolio interactif simulant un bureau Windows 10. Explorez mes projets à travers une interface immersive.'
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'Hugo Pinchemel',
        'url': 'https://35mm.hugo-pinchemel.fr/',
        'jobTitle': 'Software Engineer / Creative Developer',
        'sameAs': [
          'https://github.com/hugo-pinchemel',
          // Add other social links if available, but these are placeholders
        ]
      })
    }
  ]
})
</script>
