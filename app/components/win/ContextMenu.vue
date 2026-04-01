<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="ctx-menu"
      :style="{ left: x + 'px', top: y + 'px' }"
      @click.stop
    >
      <div v-for="(item, i) in items" :key="i">
        <div v-if="item.separator" class="separator" />
        <button v-else class="ctx-item" :disabled="item.disabled" @click="run(item)">
          <Icon v-if="item.icon" :name="item.icon" class="ctx-icon" />
          <span v-else class="ctx-icon-placeholder" />
          <span class="ctx-label">{{ item.label }}</span>
          <span class="ctx-shortcut">{{ item.shortcut ?? '' }}</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
export interface MenuItem {
  label?: string
  icon?: string
  shortcut?: string
  action?: () => void
  separator?: boolean
  disabled?: boolean
}

const props = defineProps<{
  visible: boolean
  x: number
  y: number
  items: MenuItem[]
}>()

const emit = defineEmits<{ close: [] }>()

function run(item: MenuItem) {
  item.action?.()
  emit('close')
}

// Adjust position so menu stays in viewport
const adjusted = computed(() => {
  if (!props.visible) return { x: props.x, y: props.y }
  const menuW = 220, menuH = props.items.length * 32
  return {
    x: Math.min(props.x, window.innerWidth - menuW - 8),
    y: Math.min(props.y, window.innerHeight - menuH - 8),
  }
})
</script>

<style scoped>
.ctx-menu {
  position: fixed;
  min-width: 220px;
  background: rgba(40, 40, 40, 0.97);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  padding: 4px 0;
  z-index: 9000;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}

.ctx-item {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 7px 16px;
  gap: 10px;
  color: rgba(255,255,255,0.9);
  font-size: 13px;
  text-align: left;
  transition: background 0.1s;

  &:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
  &:disabled { opacity: 0.4; cursor: default; }
}

.ctx-icon { width: 16px; height: 16px; flex-shrink: 0; }
.ctx-icon-placeholder { width: 16px; flex-shrink: 0; }
.ctx-label { flex: 1; }
.ctx-shortcut { font-size: 11px; color: rgba(255,255,255,0.4); }

.separator {
  height: 1px;
  background: rgba(255,255,255,0.1);
  margin: 4px 0;
}
</style>
