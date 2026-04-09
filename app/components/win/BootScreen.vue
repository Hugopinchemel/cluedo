<template>
  <div class="boot-screen">
    <div aria-hidden="true" class="scanlines"/>

    <div class="boot-content">
      <!-- Logo -->
      <div class="boot-logo">
        <pre aria-hidden="true" class="ascii-logo">{{ logoText }}</pre>
        <div class="boot-subtitle">{{ subtitle }}</div>
      </div>

      <!-- Log -->
      <div ref="logRef" aria-label="Journal de démarrage" aria-live="polite" class="boot-log" role="log">
        <div v-for="(item, i) in visibleItems" :key="i" class="boot-line">
          <span :class="`tag-${item.state}`" class="boot-tag">
            <template v-if="item.state === 'loading'">[ loading ]</template>
            <template v-else-if="item.state === 'ok'">[&nbsp;&nbsp; ok &nbsp;&nbsp;]</template>
            <template v-else-if="item.state === 'loaded'">[ loaded &nbsp;]</template>
            <template v-else-if="item.state === 'warn'">[&nbsp; warn &nbsp;]</template>
            <template v-else-if="item.state === 'fail'">[ FAILED &nbsp;]</template>
          </span>
          <span class="boot-label">{{ item.label }}</span>
        </div>
        <span v-if="!finished" aria-hidden="true" class="cursor">_</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{ done: [] }>()

const START_GAP = 140 // ms entre chaque ligne qui apparaît

interface VisibleItem {
  label: string
  state: string
}

const logoText = ref('')
const subtitle = ref('')
const visibleItems = ref<VisibleItem[]>([])
const finished = ref(false)
const logRef = ref<HTMLElement | null>(null)

function scrollToBottom() {
  if (logRef.value) {
    logRef.value.scrollTop = logRef.value.scrollHeight
  }
}

onMounted(async () => {
  const res = await fetch('/boot.json')
  const config = await res.json()

  logoText.value = (config.logo as string[]).join('\n')
  subtitle.value = config.subtitle

  let lastResolveTime = 0

  config.items.forEach((item: { label: string; duration: number; status: string }, i: number) => {
    const appearAt = i * START_GAP
    const resolveAt = appearAt + item.duration
    lastResolveTime = Math.max(lastResolveTime, resolveAt)

    setTimeout(() => {
      visibleItems.value.push({label: item.label, state: 'loading'})
      nextTick(scrollToBottom)
    }, appearAt)

    setTimeout(() => {
      visibleItems.value[i].state = item.status
      nextTick(scrollToBottom)
    }, resolveAt)
  })

  setTimeout(() => {
    finished.value = true
    setTimeout(() => emit('done'), 600)
  }, lastResolveTime + 400)
})
</script>

<style scoped>
.boot-screen {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', Consolas, monospace;
  overflow: hidden;
}

.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 3px,
      rgba(0, 0, 0, 0.15) 3px,
      rgba(0, 0, 0, 0.15) 4px
  );
  pointer-events: none;
  z-index: 1;
}

.boot-content {
  position: relative;
  z-index: 2;
  width: min(780px, 90vw);
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Logo */
.boot-logo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.ascii-logo {
  font-size: clamp(10px, 1.4vw, 15px);
  line-height: 1.4;
  color: #c8c8c8;
  white-space: pre;
  margin: 0;
  letter-spacing: 0.5px;
}

.boot-subtitle {
  font-size: 12px;
  color: #555;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding-left: 2px;
}

/* Log */
.boot-log {
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-height: 300px;
  overflow: hidden;
}

.boot-line {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-size: 13px;
  line-height: 1.5;
  animation: line-in 0.08s ease;
}

@keyframes line-in {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.boot-tag {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  width: 11ch;
}

.tag-loading {
  color: #e0a500;
}

.tag-ok {
  color: #3ddc84;
}

.tag-loaded {
  color: #5bc8f5;
}

.tag-warn {
  color: #ffb347;
}

.tag-fail {
  color: #ff4d4d;
}

.boot-label {
  color: #a0a0a0;
}

.cursor {
  display: inline-block;
  color: #e0a500;
  animation: blink 0.9s step-end infinite;
  margin-top: 4px;
  margin-left: 2px;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
