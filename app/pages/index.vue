<template>
  <div class="auth-screen">
    <Transition name="boot-fade">
      <WinBootScreen v-if="phase === 'boot'" @done="phase = 'lock'"/>
    </Transition>
    <WinLockScreen v-if="phase === 'lock'" @unlock="onUnlock"/>
    <WinLoginScreen v-else-if="phase === 'login'" @back="phase = 'lock'" @login="goDesktop" @shutdown="onSleep"/>

    <Transition name="sleep">
      <div
          v-if="sleepActive"
          aria-label="Cliquez pour réveiller l'ordinateur"
          class="sleep-overlay"
          role="button"
          tabindex="0"
          @click="onWakeUp"
          @keydown.enter="onWakeUp"
          @keydown.space.prevent="onWakeUp"
      />
    </Transition>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({layout: false})

const phase = ref<'boot' | 'lock' | 'login'>('boot')
const sleepActive = ref(false)

useHead({
  title: computed(() => {
    if (phase.value === 'boot') return 'Démarrage — 35mm'
    if (phase.value === 'login') return 'Connexion — 35mm'
    return 'Écran de verrouillage — 35mm'
  })
})

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

function onSleep() {
  sleepActive.value = true
}

function onWakeUp() {
  sleepActive.value = false
  phase.value = 'lock'
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

.boot-fade-leave-active {
  transition: opacity 0.5s ease;
}

.boot-fade-leave-to {
  opacity: 0;
}

.sleep-overlay {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 99999;
  cursor: pointer;
}

.sleep-enter-active {
  transition: opacity 0.8s ease;
}

.sleep-leave-active {
  transition: opacity 0.6s ease;
}

.sleep-enter-from,
.sleep-leave-to {
  opacity: 0;
}

.sleep-enter-to,
.sleep-leave-from {
  opacity: 1;
}
</style>
