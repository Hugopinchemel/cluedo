<template>
  <div :class="{ 'global-glitch': isGlobalGlitch }">
    <NuxtLayout>
      <NuxtPage/>
      <WinResponsiveGuard/>
    </NuxtLayout>
    <WinBsodScreen v-if="isBsodActive"/>

    <!-- Filtre SVG pour l'effet de fonte -->
    <svg style="position: absolute; width: 0; height: 0; pointer-events: none;">
      <filter id="melt-filter">
        <feTurbulence baseFrequency="0.05 0.01" numOctaves="2" result="warp" type="fractalNoise"/>
        <feColorMatrix in="warp" result="warpVertical" type="matrix"
                       values="0 0 0 0 0.5 0 1 0 0 0 0 0 0 0 0.5 0 0 0 0 1"/>
        <feDisplacementMap in="SourceGraphic" in2="warpVertical" scale="80" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import WinResponsiveGuard from '~/components/win/ResponsiveGuard.vue'
import WinBsodScreen from '~/components/win/BsodScreen.vue'
import {useWindows} from '~/composables/useWindows'

const {isBsodActive, isGlobalGlitch} = useWindows()
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

<style lang="scss">
:root {
  background: black;
}

.global-glitch {
  filter: url(#melt-filter);
  animation: melt-animation 4.5s cubic-bezier(.47, .01, .63, .99) forwards;
  pointer-events: none;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  background: black;
  position: relative;
  z-index: 999999;
}

@keyframes melt-animation {
  0% {
    transform: translateY(0);
    filter: url(#melt-filter) blur(0px);
  }
  20% {
    transform: translateY(100px);
    filter: url(#melt-filter) blur(2px);
  }
  45% {
    transform: translateY(400px);
    filter: url(#melt-filter) blur(4px);
  }
  100% {
    transform: translateY(120vh);
    filter: url(#melt-filter) blur(10px);
  }
}
</style>
