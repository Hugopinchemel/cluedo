<template>
  <div class="notepad">
    <!-- Menu bar -->
    <div class="menu-bar">
      <div
          v-for="menu in menus"
          :key="menu.label"
          :class="{ open: openMenu === menu.label }"
          class="menu-item"
          @click="toggleMenu(menu.label)"
      >
        {{ menu.label }}
        <div v-if="openMenu === menu.label" class="dropdown">
          <button
              v-for="item in menu.items"
              :key="item.label"
              :class="{ separator: item.separator }"
              class="dd-item"
              @click.stop="item.action?.(); openMenu = null"
          >
            <span>{{ item.label }}</span>
            <span class="shortcut">{{ item.shortcut }}</span>
          </button>
        </div>
      </div>
    </div>
    <!-- Editor -->
    <textarea
        v-model="content"
        :style="{ fontFamily: fontFamily, fontSize: fontSize + 'px', wordWrap: wordWrap ? 'normal' : 'off' }"
        class="editor"
        spellcheck="false"
    />
    <!-- Status bar -->
    <div class="status-bar">
      <span>Ln {{ lineCount }}, Col {{ colCount }}</span>
      <span>100%</span>
      <span>Windows (CRLF)</span>
      <span>UTF-8</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface MenuItem {
  label: string
  shortcut?: string
  action?: () => void
  separator?: boolean
}

interface Menu {
  label: string
  items: MenuItem[]
}

const content = ref(`Bienvenue dans le Bloc-notes Windows 10 !

Ceci est une simulation réaliste.
Vous pouvez taper du texte ici.`)
const fontFamily = ref('Consolas')
const fontSize = ref(14)
const wordWrap = ref(true)
const openMenu = ref<string | null>(null)

const lineCount = computed(() => {
  const pos = content.value.indexOf('\n')
  return pos === -1 ? 1 : content.value.substring(0, pos).split('\n').length
})
const colCount = computed(() => 1)

function newFile() {
  content.value = ''
}

function selectAll() {
  const el = document.querySelector('.editor') as HTMLTextAreaElement
  el?.select()
}

const menus: Menu[] = [
  {
    label: 'Fichier',
    items: [
      {label: 'Nouveau', shortcut: 'Ctrl+N', action: newFile},
      {label: 'Nouveau fenêtre', shortcut: 'Ctrl+Maj+N'},
      {separator: true, label: ''},
      {label: 'Ouvrir...', shortcut: 'Ctrl+O'},
      {label: 'Enregistrer', shortcut: 'Ctrl+S'},
      {label: 'Enregistrer sous...', shortcut: 'Ctrl+Maj+S'},
      {separator: true, label: ''},
      {label: 'Mise en page...'},
      {label: 'Imprimer...', shortcut: 'Ctrl+P'},
      {separator: true, label: ''},
      {label: 'Quitter'},
    ],
  },
  {
    label: 'Édition',
    items: [
      {label: 'Annuler', shortcut: 'Ctrl+Z'},
      {separator: true, label: ''},
      {label: 'Couper', shortcut: 'Ctrl+X'},
      {label: 'Copier', shortcut: 'Ctrl+C'},
      {label: 'Coller', shortcut: 'Ctrl+V'},
      {label: 'Supprimer', shortcut: 'Suppr'},
      {separator: true, label: ''},
      {label: 'Rechercher...', shortcut: 'Ctrl+F'},
      {label: 'Remplacer...', shortcut: 'Ctrl+H'},
      {label: 'Atteindre...', shortcut: 'Ctrl+G'},
      {separator: true, label: ''},
      {label: 'Sélectionner tout', shortcut: 'Ctrl+A', action: selectAll},
      {label: 'Heure/Date', shortcut: 'F5', action: () => content.value += new Date().toLocaleString('fr-FR')},
    ],
  },
  {
    label: 'Format',
    items: [
      {label: 'Retour automatique à la ligne', action: () => wordWrap.value = !wordWrap.value},
      {label: 'Police...'},
    ],
  },
  {
    label: 'Affichage',
    items: [
      {label: 'Zoom avant', shortcut: 'Ctrl++', action: () => fontSize.value++},
      {label: 'Zoom arrière', shortcut: 'Ctrl+-', action: () => fontSize.value--},
      {label: 'Rétablir le zoom par défaut', shortcut: 'Ctrl+0', action: () => fontSize.value = 14},
      {separator: true, label: ''},
      {label: 'Barre d\'état'},
    ],
  },
  {
    label: 'Aide',
    items: [
      {label: 'Aide du Bloc-notes'},
      {separator: true, label: ''},
      {label: 'À propos du Bloc-notes'},
    ],
  },
]

function toggleMenu(label: string) {
  openMenu.value = openMenu.value === label ? null : label
}

onMounted(() => {
  document.addEventListener('click', () => openMenu.value = null)
})
</script>

<style scoped>
.notepad {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
}

.menu-bar {
  display: flex;
  background: #f0f0f0;
  border-bottom: 1px solid #d0d0d0;
  flex-shrink: 0;
  position: relative;
}

.menu-item {
  padding: 4px 10px;
  font-size: 12px;
  cursor: default;
  position: relative;
  border-radius: 2px;
  transition: background 0.1s;
  color: #1a1a1a;

  &:hover, &.open {
    background: rgba(0, 0, 0, 0.08);
  }
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 220px;
  background: #f0f0f0;
  border: 1px solid #c0c0c0;
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  padding: 2px 0;
}

.dd-item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 6px 16px;
  font-size: 12px;
  text-align: left;
  color: #1a1a1a;
  cursor: default;
  transition: background 0.1s;

  &:hover {
    background: var(--accent);
    color: white;

    .shortcut {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  &.separator {
    height: 1px;
    background: #d0d0d0;
    padding: 0;
    margin: 2px 0;
    pointer-events: none;
  }
}

.shortcut {
  color: #666;
  font-size: 11px;
}

.editor {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 14px;
  resize: none;
  background: white;
  color: #1a1a1a;
  line-height: 1.5;
  overflow: auto;
}

.status-bar {
  display: flex;
  gap: 24px;
  padding: 2px 8px;
  font-size: 12px;
  color: #555;
  background: #f0f0f0;
  border-top: 1px solid #d0d0d0;
  flex-shrink: 0;
}
</style>
