<template>
  <Teleport to="body">
    <div
        v-if="visible"
        :style="{ left: adjusted.x + 'px', top: adjusted.y + 'px' }"
        aria-label="Menu contextuel"
        class="ctx-menu"
        role="menu"
        @click.stop
        @keydown.escape="emit('close')"
        @keydown.arrow-down.prevent="focusNext"
        @keydown.arrow-up.prevent="focusPrev"
    >
      <div v-for="(item, i) in items" :key="i">
        <div v-if="item.separator" aria-hidden="true" class="separator" role="separator"/>
        <button
            v-else
            :aria-disabled="item.disabled"
            :disabled="item.disabled"
            class="ctx-item"
            role="menuitem"
            @click="run(item)"
        >
          <Icon v-if="item.icon" :name="item.icon" aria-hidden="true" class="ctx-icon"/>
          <span v-else aria-hidden="true" class="ctx-icon-placeholder"/>
          <span class="ctx-label">{{ item.label }}</span>
          <span v-if="item.shortcut" aria-label="`Raccourci : ${item.shortcut}`" class="ctx-shortcut">{{
              item.shortcut
            }}</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
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
  if (!props.visible) return {x: props.x, y: props.y}
  const menuW = 220, menuH = props.items.length * 32
  return {
    x: Math.min(props.x, window.innerWidth - menuW - 8),
    y: Math.min(props.y, window.innerHeight - menuH - 8),
  }
})

// Keyboard navigation between menu items
function getMenuItems(): HTMLButtonElement[] {
  return Array.from(document.querySelectorAll('.ctx-menu [role="menuitem"]:not([disabled])'))
}

function focusNext() {
  const items = getMenuItems()
  const idx = items.indexOf(document.activeElement as HTMLButtonElement)
  const next = items[(idx + 1) % items.length]
  next?.focus()
}

function focusPrev() {
  const items = getMenuItems()
  const idx = items.indexOf(document.activeElement as HTMLButtonElement)
  const prev = items[(idx - 1 + items.length) % items.length]
  prev?.focus()
}
</script>

<style scoped>
.ctx-menu {
  position: fixed;
  min-width: 220px;
  background: rgba(40, 40, 40, 0.97);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 4px 0;
  z-index: 9000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.ctx-item {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 7px 16px;
  gap: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  text-align: left;
  transition: background 0.1s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
}

.ctx-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.ctx-icon-placeholder {
  width: 16px;
  flex-shrink: 0;
}

.ctx-label {
  flex: 1;
}

.ctx-shortcut {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

.separator {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 4px 0;
}
</style>
