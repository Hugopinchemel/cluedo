<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
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
</script>
