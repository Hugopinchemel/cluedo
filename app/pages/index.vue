<template>
  <div class="auth-screen">
    <WinLockScreen v-if="phase === 'lock'" @unlock="phase = 'login'" />
    <WinLoginScreen v-else-if="phase === 'login'" @login="goDesktop" @back="phase = 'lock'" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const phase = ref<'lock' | 'login'>('lock')

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
