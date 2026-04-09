<template>
  <div class="lock-screen" @click="$emit('unlock')" @keydown.any="$emit('unlock')">
    <div class="lock-bg"/>
    <div class="lock-content">
      <div class="lock-time">{{ time }}</div>
      <div class="lock-date">{{ date }}</div>
      <div class="lock-hint">
        <svg fill="currentColor" height="14" viewBox="0 0 24 24" width="14">
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
        Cliquez pour déverrouiller
      </div>
    </div>
    <!-- Bottom status icons -->
    <div class="lock-status">
      <span title="Réseau">
        <svg fill="white" height="16" viewBox="0 0 24 24" width="16"><path
            d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
      </span>
      <span title="Accessibilité">
        <svg fill="white" height="16" viewBox="0 0 24 24" width="16"><circle cx="12" cy="4" r="2"/><path
            d="M19 13v-2c0-1.1-.9-2-2-2h-2.93c-.48 0-.91.3-1.09.74l-1.16 2.91c-.1.26-.1.54 0 .8l1.14 2.86c.18.46.62.77 1.1.77H17c1.1 0 2-.9 2-2v-.08c.56-.26 1-.83 1-1.5v-1c0-.83-.67-1.5-1.5-1.5H17v-1h2zm-7 6.5c-.83 0-1.5-.67-1.5-1.5h-2c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5h-2c0 .83-.67 1.5-1.5 1.5z"/></svg>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineEmits<{ unlock: [] }>()

const now = ref(new Date())
onMounted(() => {
  const t = setInterval(() => now.value = new Date(), 1000)
  onUnmounted(() => clearInterval(t))
})

const time = computed(() =>
    now.value.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})
)
const date = computed(() =>
    now.value.toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long'})
)
</script>

<style scoped>
.lock-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  z-index: 9999;
  overflow: hidden;
}

.lock-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 70% 60% at 25% 60%, rgba(74, 144, 217, 0.25) 0%, transparent 65%),
  radial-gradient(ellipse 50% 70% at 75% 30%, rgba(83, 52, 131, 0.3) 0%, transparent 65%),
  radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0, 100, 200, 0.15) 0%, transparent 60%),
  linear-gradient(160deg, #0d1b2e 0%, #112244 40%, #1a0d2e 70%, #0a1520 100%);
}

.lock-content {
  position: relative;
  text-align: center;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.lock-time {
  font-size: 96px;
  font-weight: 200;
  letter-spacing: -2px;
  line-height: 1;
  margin-bottom: 8px;
}

.lock-date {
  font-size: 22px;
  font-weight: 300;
  text-transform: capitalize;
  margin-bottom: 48px;
  opacity: 0.9;
}

.lock-hint {
  font-size: 13px;
  font-weight: 300;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.lock-status {
  position: absolute;
  bottom: 20px;
  right: 24px;
  display: flex;
  gap: 16px;
  opacity: 0.8;
}
</style>
