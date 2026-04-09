<template>
  <div class="auth-screen">
    <WinLockScreen v-if="phase === 'lock'" @unlock="onUnlock"/>
    <WinLoginScreen v-else-if="phase === 'login'" @back="phase = 'lock'" @login="goDesktop"/>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({layout: false})

const phase = ref<'lock' | 'login'>('lock')

const requestFullscreen = () => {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  }
}

const onUnlock = () => {
  requestFullscreen()
  phase.value = 'login'
}

async function goDesktop() {
  await navigateTo('/desktop')
}
</script>

<style scoped>
.auth-screen {
  width: 100%;
  height: 100%;
  position: fixed;
  inset: 0;
}
</style>
