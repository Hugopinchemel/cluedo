<template>
  <div class="explorer">
    <!-- Ribbon -->
    <div class="ribbon">
      <div class="ribbon-tabs">
        <button
            v-for="tab in ['Accueil', 'Partager', 'Affichage']"
            :key="tab"
            :class="{ active: activeTab === tab }"
            class="ribbon-tab"
            @click="activeTab = tab"
        >{{ tab }}
        </button>
      </div>
      <div class="ribbon-actions">
        <button class="rib-btn" title="Nouveau dossier" @click="newFolder">
          <img v-if="ICON_EXPLORER_NEW_FOLDER.startsWith('/')" :src="ICON_EXPLORER_NEW_FOLDER" alt="" height="16"
               width="16"/>
          <Icon v-else :name="ICON_EXPLORER_NEW_FOLDER"/>
          <span>Nouveau dossier</span>
        </button>
        <div class="rib-sep"/>
        <button class="rib-btn" title="Copier">
          <img v-if="ICON_EXPLORER_COPY.startsWith('/')" :src="ICON_EXPLORER_COPY" alt="" height="16" width="16"/>
          <Icon v-else :name="ICON_EXPLORER_COPY"/>
          <span>Copier</span>
        </button>
        <button class="rib-btn" title="Coller">
          <img v-if="ICON_EXPLORER_PASTE.startsWith('/')" :src="ICON_EXPLORER_PASTE" alt="" height="16" width="16"/>
          <Icon v-else :name="ICON_EXPLORER_PASTE"/>
          <span>Coller</span>
        </button>
        <div class="rib-sep"/>
        <button class="rib-btn" title="Renommer">
          <img v-if="ICON_EXPLORER_RENAME.startsWith('/')" :src="ICON_EXPLORER_RENAME" alt="" height="16" width="16"/>
          <Icon v-else :name="ICON_EXPLORER_RENAME"/>
          <span>Renommer</span>
        </button>
        <button class="rib-btn" title="Supprimer">
          <img v-if="ICON_EXPLORER_DELETE.startsWith('/')" :src="ICON_EXPLORER_DELETE" alt="" height="16" width="16"/>
          <Icon v-else :name="ICON_EXPLORER_DELETE"/>
          <span>Supprimer</span>
        </button>
      </div>
    </div>

    <!-- Nav bar -->
    <div class="nav-bar">
      <button :disabled="!canBack" class="nav-btn" @click="goBack">
        <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
      <button :disabled="!canForward" class="nav-btn" @click="goForward">
        <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
        </svg>
      </button>
      <button class="nav-btn" @click="goUp">
        <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
          <path d="M4 11v2h12l-5.5 5.5 1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5 16 11H4z" transform="rotate(-90 12 12)"/>
        </svg>
      </button>
      <!-- Address bar -->
      <div class="address-bar">
        <span
            v-for="(part, i) in breadcrumbs"
            :key="i"
            class="breadcrumb"
            @click="navigateTo(part.path)"
        >
          {{ part.name }}
          <svg v-if="i < breadcrumbs.length - 1" fill="currentColor" height="12" viewBox="0 0 24 24" width="12"><path
              d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </span>
      </div>
      <!-- Search -->
      <div class="search-box">
        <svg fill="#888" height="14" viewBox="0 0 24 24" width="14">
          <path
              d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input :placeholder="`Rechercher dans ${currentFolder.name}`"/>
      </div>
    </div>

    <!-- Main content -->
    <div class="content">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="sidebar-section">
          <div class="sidebar-title">Accès rapide</div>
          <button
              v-for="item in quickAccess"
              :key="item.name"
              :class="{ active: currentPath === item.path }"
              class="sidebar-item"
              @click="navigateTo(item.path)"
          >
            <img v-if="item.icon.startsWith('/')" :src="item.icon" alt="" class="sidebar-icon-img" height="16"
                 width="16"/>
            <Icon v-else :name="item.icon" class="sidebar-icon"/>
            <span>{{ item.name }}</span>
          </button>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-title">Ce PC</div>
          <button
              v-for="item in thisPC"
              :key="item.name"
              class="sidebar-item"
              @click="navigateTo(item.path)"
          >
            <img v-if="item.icon.startsWith('/')" :src="item.icon" alt="" class="sidebar-icon-img" height="16"
                 width="16"/>
            <Icon v-else :name="item.icon" class="sidebar-icon"/>
            <span>{{ item.name }}</span>
          </button>
        </div>
      </div>

      <!-- Files area -->
      <div class="files-area">
        <div v-if="viewMode === 'grid'" class="files-grid">
          <div
              v-for="item in currentItems"
              :key="item.name"
              :class="{ selected: selected === item.name }"
              class="file-tile"
              @click="selected = item.name"
              @dblclick="onItemDblClick(item)"
          >
            <img v-if="item.icon.startsWith('/')" :src="item.icon" alt="" class="file-icon-img" height="40" width="40"/>
            <Icon v-else :name="item.icon" class="file-icon"/>
            <span class="file-name">{{ item.name }}</span>
          </div>
        </div>
        <div v-else class="files-list">
          <div class="list-header">
            <span class="col-name">Nom</span>
            <span class="col-date">Date de modification</span>
            <span class="col-type">Type</span>
            <span class="col-size">Taille</span>
          </div>
          <div
              v-for="item in currentItems"
              :key="item.name"
              :class="{ selected: selected === item.name }"
              class="list-row"
              @click="selected = item.name"
              @dblclick="onItemDblClick(item)"
          >
            <span class="col-name">
              <img v-if="item.icon.startsWith('/')" :src="item.icon" alt="" class="row-icon-img" height="16"
                   width="16"/>
              <Icon v-else :name="item.icon" class="row-icon"/>
              {{ item.name }}
            </span>
            <span class="col-date">{{ item.date }}</span>
            <span class="col-type">{{ item.typeName }}</span>
            <span class="col-size">{{ item.size }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Status bar -->
    <div class="status-bar">
      <span>{{ currentItems?.length ?? 0 }} élément(s)</span>
      <span v-if="selected">{{ selected }} sélectionné(s)</span>
      <div class="view-toggle">
        <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
          <svg fill="currentColor" height="14" viewBox="0 0 24 24" width="14">
            <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/>
          </svg>
        </button>
        <button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
          <svg fill="currentColor" height="14" viewBox="0 0 24 24" width="14">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ICON_APP_TRASH,
  ICON_DESKTOP_PC,
  ICON_DRIVE_DVD,
  ICON_DRIVE_HDD,
  ICON_EXPLORER_COPY,
  ICON_EXPLORER_DELETE,
  ICON_EXPLORER_NEW_FOLDER,
  ICON_EXPLORER_PASTE,
  ICON_EXPLORER_RENAME,
  ICON_FILE_DOC,
  ICON_FILE_EXE,
  ICON_FILE_TEXT,
  ICON_FILE_ZIP,
  ICON_FOLDER_DOCUMENTS,
  ICON_FOLDER_DOWNLOADS,
  ICON_FOLDER_GENERIC,
  ICON_FOLDER_MUSIC,
  ICON_FOLDER_PICTURES,
  ICON_FOLDER_VIDEOS,
} from '~/composables/icons'

interface FsItem {
  name: string
  icon: string
  type: 'folder-icons' | 'file'
  path?: string
  date: string
  typeName: string
  size: string
  openWith?: string
  openUrl?: string
}

const {openApp} = useWindows()

const activeTab = ref('Accueil')
const viewMode = ref<'grid' | 'list'>('grid')
const selected = ref('')
const currentPath = ref('quick/desktop')
const history = ref<string[]>([])
const forwardHistory = ref<string[]>([])

const quickAccess = [
  {icon: ICON_DESKTOP_PC, name: 'Bureau', path: 'quick/desktop'},
  {icon: ICON_FOLDER_DOWNLOADS, name: 'Téléchargements', path: 'quick/downloads'},
  {icon: ICON_FOLDER_DOCUMENTS, name: 'Documents', path: 'quick/documents'},
  {icon: ICON_FOLDER_PICTURES, name: 'Images', path: 'quick/pictures'},
  {icon: ICON_FOLDER_MUSIC, name: 'Musique', path: 'quick/music'},
  {icon: ICON_FOLDER_VIDEOS, name: 'Vidéos', path: 'quick/videos'},
]

const thisPC = [
  {icon: ICON_DESKTOP_PC, name: 'Bureau', path: 'quick/desktop'},
  {icon: ICON_DRIVE_HDD, name: 'Disque local (C:)', path: 'drive/c'},
  {icon: ICON_DRIVE_DVD, name: 'Lecteur DVD (D:)', path: 'drive/d'},
]

const filesystem: Record<string, FsItem[]> = {
  'quick/desktop': [
    {
      name: 'Ce PC',
      icon: ICON_DESKTOP_PC,
      type: 'folder-icons',
      path: 'drive/c',
      date: '01/04/2026 10:00',
      typeName: 'Dossier système',
      size: ''
    },
    {
      name: 'Corbeille',
      icon: ICON_APP_TRASH,
      type: 'folder-icons',
      path: 'trash',
      date: '01/04/2026 10:00',
      typeName: 'Corbeille',
      size: ''
    },
    {
      name: 'Notes.txt',
      icon: ICON_FILE_TEXT,
      type: 'file',
      date: '01/04/2026 09:30',
      typeName: 'Fichier texte',
      size: '2 Ko',
      openWith: 'notepad',
    },
    {
      name: 'Projet.docx',
      icon: ICON_FILE_DOC,
      type: 'file',
      date: '31/03/2026 18:00',
      typeName: 'Document Word',
      size: '45 Ko',
      openWith: 'notepad',
    },
  ],
  'quick/downloads': [
    {
      name: 'setup.exe',
      icon: ICON_FILE_EXE,
      type: 'file',
      date: '30/03/2026 14:00',
      typeName: 'Application',
      size: '58 Mo',
    },
    {
      name: 'archive.zip',
      icon: ICON_FILE_ZIP,
      type: 'file',
      date: '29/03/2026 11:30',
      typeName: 'Archive ZIP',
      size: '120 Mo',
    },
    {
      name: 'photo.jpg',
      icon: ICON_FOLDER_PICTURES,
      type: 'file',
      date: '28/03/2026',
      typeName: 'Image JPEG',
      size: '3,2 Mo',
      openWith: 'photos',
    },
  ],
  'quick/documents': [
    {
      name: 'Travail',
      icon: ICON_FOLDER_GENERIC,
      type: 'folder-icons',
      path: 'quick/documents/travail',
      date: '01/04/2026',
      typeName: 'Dossier de fichiers',
      size: ''
    },
    {
      name: 'Personnel',
      icon: ICON_FOLDER_GENERIC,
      type: 'folder-icons',
      path: 'quick/documents/perso',
      date: '28/03/2026',
      typeName: 'Dossier de fichiers',
      size: ''
    },
    {
      name: 'CV.docx',
      icon: ICON_FILE_DOC,
      type: 'file',
      date: '15/03/2026',
      typeName: 'Document Word',
      size: '42 Ko',
      openWith: 'notepad'
    },
  ],
  'quick/pictures': [
    {
      name: 'Vacances 2025',
      icon: ICON_FOLDER_GENERIC,
      type: 'folder-icons',
      path: 'quick/pictures/vacances',
      date: '10/09/2025',
      typeName: 'Dossier de fichiers',
      size: ''
    },
    {
      name: 'fond_ecran.jpg',
      icon: ICON_FOLDER_PICTURES,
      type: 'file',
      date: '01/01/2026',
      typeName: 'Image JPEG',
      size: '8,4 Mo',
      openWith: 'photos',
    },
    {
      name: 'photo_profil.png',
      icon: ICON_FOLDER_PICTURES,
      type: 'file',
      date: '15/02/2026',
      typeName: 'Image PNG',
      size: '2,1 Mo',
      openWith: 'photos',
    },
  ],
  'drive/c': [
    {
      name: 'Utilisateurs',
      icon: ICON_FOLDER_GENERIC,
      type: 'folder-icons',
      path: 'drive/c/users',
      date: '01/04/2026',
      typeName: 'Dossier de fichiers',
      size: ''
    },
    {
      name: 'Windows',
      icon: ICON_FOLDER_GENERIC,
      type: 'folder-icons',
      path: 'drive/c/windows',
      date: '01/04/2026',
      typeName: 'Dossier de fichiers',
      size: ''
    },
    {
      name: 'Program Files',
      icon: ICON_FOLDER_GENERIC,
      type: 'folder-icons',
      path: 'drive/c/pf',
      date: '01/04/2026',
      typeName: 'Dossier de fichiers',
      size: ''
    },
    {
      name: 'Program Files (x86)',
      icon: ICON_FOLDER_GENERIC,
      type: 'folder-icons',
      path: 'drive/c/pf86',
      date: '01/04/2026',
      typeName: 'Dossier de fichiers',
      size: ''
    },
  ],
  'quick/music': [
    {
      name: 'playlist.mp3',
      icon: ICON_FILE_TEXT,
      type: 'file',
      date: '10/02/2026',
      typeName: 'Fichier audio',
      size: '4,5 Mo'
    },
    {
      name: 'podcast.mp3',
      icon: ICON_FILE_TEXT,
      type: 'file',
      date: '05/03/2026',
      typeName: 'Fichier audio',
      size: '12 Mo'
    },
  ],
  'quick/videos': [
    {
      name: 'vacances.mp4',
      icon: ICON_FILE_TEXT,
      type: 'file',
      date: '15/09/2025',
      typeName: 'Fichier vidéo',
      size: '250 Mo'
    },
    {
      name: 'tuto_vue.mp4',
      icon: ICON_FILE_TEXT,
      type: 'file',
      date: '20/03/2026',
      typeName: 'Fichier vidéo',
      size: '180 Mo'
    },
  ],
  'quick/documents/travail': [
    {
      name: 'rapport_mensuel.docx',
      icon: ICON_FILE_DOC,
      type: 'file',
      date: '01/04/2026',
      typeName: 'Document Word',
      size: '38 Ko',
      openWith: 'notepad'
    },
    {
      name: 'notes_reunion.txt',
      icon: ICON_FILE_TEXT,
      type: 'file',
      date: '28/03/2026',
      typeName: 'Fichier texte',
      size: '5 Ko',
      openWith: 'notepad'
    },
    {
      name: 'budget_2026.docx',
      icon: ICON_FILE_DOC,
      type: 'file',
      date: '15/03/2026',
      typeName: 'Document Word',
      size: '22 Ko',
      openWith: 'notepad'
    },
  ],
  'quick/documents/perso': [
    {
      name: 'liste_courses.txt',
      icon: ICON_FILE_TEXT,
      type: 'file',
      date: '05/04/2026',
      typeName: 'Fichier texte',
      size: '1 Ko',
      openWith: 'notepad'
    },
    {
      name: 'idees_vacances.docx',
      icon: ICON_FILE_DOC,
      type: 'file',
      date: '20/03/2026',
      typeName: 'Document Word',
      size: '15 Ko',
      openWith: 'notepad'
    },
  ],
  'quick/pictures/vacances': [
    {
      name: 'plage_sunset.jpg',
      icon: ICON_FOLDER_PICTURES,
      type: 'file',
      date: '08/09/2025',
      typeName: 'Image JPEG',
      size: '5,2 Mo',
      openWith: 'photos'
    },
    {
      name: 'groupe.jpg',
      icon: ICON_FOLDER_PICTURES,
      type: 'file',
      date: '09/09/2025',
      typeName: 'Image JPEG',
      size: '3,8 Mo',
      openWith: 'photos'
    },
    {
      name: 'panorama.png',
      icon: ICON_FOLDER_PICTURES,
      type: 'file',
      date: '10/09/2025',
      typeName: 'Image PNG',
      size: '12 Mo',
      openWith: 'photos'
    },
  ],
  'drive/c/users': [
    {
      name: 'Hugo',
      icon: ICON_FOLDER_GENERIC,
      type: 'folder-icons',
      path: 'quick/desktop',
      date: '01/04/2026',
      typeName: 'Dossier de fichiers',
      size: ''
    },
    {
      name: 'Public',
      icon: ICON_FOLDER_GENERIC,
      type: 'folder-icons',
      path: 'drive/c/users/public',
      date: '01/04/2026',
      typeName: 'Dossier de fichiers',
      size: ''
    },
  ],
  'drive/c/users/public': [
    {
      name: 'Documents',
      icon: ICON_FOLDER_DOCUMENTS,
      type: 'folder-icons',
      path: 'quick/documents',
      date: '01/04/2026',
      typeName: 'Dossier de fichiers',
      size: ''
    },
  ],
  'drive/c/windows': [
    {
      name: 'System32',
      icon: ICON_FOLDER_GENERIC,
      type: 'folder-icons',
      path: 'drive/c/windows/sys32',
      date: '01/04/2026',
      typeName: 'Dossier de fichiers',
      size: ''
    },
    {
      name: 'Fonts',
      icon: ICON_FOLDER_GENERIC,
      type: 'folder-icons',
      path: 'drive/c/windows/fonts',
      date: '01/04/2026',
      typeName: 'Dossier de fichiers',
      size: ''
    },
  ],
  'drive/c/windows/sys32': [
    {name: 'cmd.exe', icon: ICON_FILE_EXE, type: 'file', date: '01/04/2026', typeName: 'Application', size: '289 Ko'},
    {name: 'notepad.exe', icon: ICON_FILE_EXE, type: 'file', date: '01/04/2026', typeName: 'Application', size: '201 Ko'},
    {name: 'ne_lis_pas.txt', icon: ICON_FILE_TEXT, type: 'file', date: '01/04/2026 03:14', typeName: 'Fichier texte', size: '1 Ko', openWith: 'edge', openUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'},
  ],
  'drive/c/windows/fonts': [
    {
      name: 'Arial.ttf',
      icon: ICON_FILE_TEXT,
      type: 'file',
      date: '01/04/2026',
      typeName: 'Fichier de police',
      size: '764 Ko'
    },
    {
      name: 'Segoe UI.ttf',
      icon: ICON_FILE_TEXT,
      type: 'file',
      date: '01/04/2026',
      typeName: 'Fichier de police',
      size: '1,2 Mo'
    },
  ],
  'drive/c/pf': [
    {
      name: 'Microsoft Edge',
      icon: ICON_FOLDER_GENERIC,
      type: 'folder-icons',
      path: 'drive/c/pf/edge',
      date: '01/04/2026',
      typeName: 'Dossier de fichiers',
      size: ''
    },
    {
      name: 'Windows Defender',
      icon: ICON_FOLDER_GENERIC,
      type: 'folder-icons',
      path: 'drive/c/pf/defender',
      date: '01/04/2026',
      typeName: 'Dossier de fichiers',
      size: ''
    },
  ],
  'drive/c/pf/edge': [
    {
      name: 'msedge.exe',
      icon: ICON_FILE_EXE,
      type: 'file',
      date: '01/04/2026',
      typeName: 'Application',
      size: '3,4 Mo',
      openWith: 'edge'
    },
  ],
  'drive/c/pf/defender': [
    {
      name: 'MsMpEng.exe',
      icon: ICON_FILE_EXE,
      type: 'file',
      date: '01/04/2026',
      typeName: 'Application',
      size: '12 Mo'
    },
  ],
  'drive/c/pf86': [
    {
      name: 'Common Files',
      icon: ICON_FOLDER_GENERIC,
      type: 'folder-icons',
      path: 'drive/c/pf86/common',
      date: '01/04/2026',
      typeName: 'Dossier de fichiers',
      size: ''
    },
  ],
  'drive/c/pf86/common': [
    {
      name: 'readme.txt',
      icon: ICON_FILE_TEXT,
      type: 'file',
      date: '01/04/2026',
      typeName: 'Fichier texte',
      size: '1 Ko',
      openWith: 'notepad'
    },
  ],
  'drive/d': [
    {name: 'Aucun disque inséré', icon: ICON_FILE_TEXT, type: 'file', date: '', typeName: '', size: ''},
  ],
  'trash': [
    {name: 'conversation_supprimee.txt', icon: ICON_FILE_TEXT, type: 'file', date: '31/03/2026 23:58', typeName: 'Fichier texte', size: '4 Ko', openWith: 'notepad'},
    {name: 'ancien_projet.docx', icon: ICON_FILE_DOC, type: 'file', date: '20/03/2026', typeName: 'Document Word', size: '33 Ko', openWith: 'notepad'},
    {name: 'recu_pharmacie.pdf', icon: ICON_FILE_DOC, type: 'file', date: '29/03/2026', typeName: 'Document PDF', size: '156 Ko'},
    {name: 'screenshot_old.png', icon: ICON_FOLDER_PICTURES, type: 'file', date: '15/03/2026', typeName: 'Image PNG', size: '1,5 Mo', openWith: 'photos'},
  ],
  'default': [],
}


const currentFolder = computed(() => {
  const parts = currentPath.value.split('/')
  return {name: parts[parts.length - 1] || 'Ce PC', path: currentPath.value}
})

const breadcrumbs = computed(() => {
  const parts = currentPath.value.split('/')
  const crumbs = [{name: 'Ce PC', path: ''}]
  let p = ''
  for (const part of parts) {
    p = p ? `${p}/${part}` : part
    const label = quickAccess.find(q => q.path === p)?.name ?? part
    crumbs.push({name: label, path: p})
  }
  return crumbs
})

const currentItems = computed(() =>
    filesystem[currentPath.value] ?? filesystem['default']
)

const canBack = computed(() => history.value.length > 0)
const canForward = computed(() => forwardHistory.value.length > 0)

function navigateTo(path: string) {
  if (!path || path === currentPath.value) return
  history.value.push(currentPath.value)
  forwardHistory.value = []
  currentPath.value = path
  selected.value = ''
}

function goBack() {
  if (!canBack.value) return
  forwardHistory.value.push(currentPath.value)
  currentPath.value = history.value.pop()!
}

function goForward() {
  if (!canForward.value) return
  history.value.push(currentPath.value)
  currentPath.value = forwardHistory.value.pop()!
}

function goUp() {
  const parts = currentPath.value.split('/')
  if (parts.length > 1) {
    const parentPath = parts.slice(0, -1).join('/')
    navigateTo(parentPath)
  }
}

function onItemDblClick(item: FsItem) {
  if (item.type === 'folder-icons' && item.path) {
    navigateTo(item.path)
  } else if (item.type === 'file' && item.openWith) {
    openApp(item.openWith, item.openUrl)
  }
}

function newFolder() {
  const items = filesystem[currentPath.value]
  if (items) {
    items.push({
      name: 'Nouveau dossier',
      icon: ICON_FOLDER_GENERIC,
      type: 'folder-icons',
      date: new Date().toLocaleDateString('fr-FR'),
      typeName: 'Dossier de fichiers',
      size: ''
    })
  }
}
</script>

<style scoped>
.explorer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  font-size: 13px;
}

.ribbon {
  flex-shrink: 0;
  border-bottom: 1px solid #d0d0d0;
}

.ribbon-tabs {
  display: flex;
  background: #f0f0f0;
  padding-top: 4px;
}

.ribbon-tab {
  padding: 5px 14px;
  font-size: 12px;
  border-radius: 4px 4px 0 0;
  color: #333;
  transition: background 0.1s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &.active {
    background: white;
    border: 1px solid #d0d0d0;
    border-bottom: 1px solid white;
    margin-bottom: -1px;
  }
}

.ribbon-actions {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  gap: 2px;
  background: white;
}

.rib-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 11px;
  color: #333;
  transition: background 0.1s;

  &:hover {
    background: rgba(0, 120, 212, 0.1);
  }

  span:first-child {
    font-size: 16px;
  }
}

.rib-sep {
  width: 1px;
  height: 36px;
  background: #d0d0d0;
  margin: 0 4px;
}

.nav-bar {
  display: flex;
  align-items: center;
  padding: 4px 6px;
  gap: 4px;
  border-bottom: 1px solid #d0d0d0;
  background: #fafafa;
  flex-shrink: 0;
}

.nav-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  color: #333;
  transition: background 0.1s;

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.08);
  }

  &:disabled {
    opacity: 0.35;
  }
}

.address-bar {
  flex: 1;
  height: 28px;
  background: white;
  border: 1px solid #c0c0c0;
  border-radius: 2px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 0;
  overflow: hidden;

  &:focus-within {
    border-color: var(--accent);
  }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  color: #333;
  cursor: default;
  padding: 2px 4px;
  border-radius: 2px;
  white-space: nowrap;

  &:hover {
    background: rgba(0, 0, 0, 0.07);
  }

  &:last-child {
    font-weight: 500;
  }
}

.search-box {
  height: 28px;
  width: 180px;
  border: 1px solid #c0c0c0;
  border-radius: 2px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 6px;
  flex-shrink: 0;

  input {
    border: none;
    outline: none;
    font-size: 12px;
    flex: 1;
    background: transparent;
    color: #333;

    &::placeholder {
      color: #999;
    }
  }

  &:focus-within {
    border-color: var(--accent);
  }
}

.content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  flex-shrink: 0;
  padding: 8px 0;
}

.sidebar-section {
  margin-bottom: 8px;
}

.sidebar-title {
  font-size: 11px;
  font-weight: 700;
  color: #666;
  padding: 4px 16px 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 16px;
  font-size: 12px;
  color: #333;
  text-align: left;
  transition: background 0.1s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &.active {
    background: var(--accent-light);
    color: var(--accent-dark);
  }
}

.files-area {
  flex: 1;
  overflow: auto;
  padding: 8px;
}

.files-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-content: flex-start;
}

.file-tile {
  width: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 6px 8px;
  border-radius: 4px;
  cursor: default;
  transition: background 0.1s;

  &:hover {
    background: rgba(0, 120, 212, 0.1);
  }

  &.selected {
    background: rgba(0, 120, 212, 0.2);
  }
}

.file-icon {
  font-size: 36px;
}

.file-name {
  font-size: 11px;
  text-align: center;
  color: #1a1a1a;
  max-width: 84px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.files-list {
  width: 100%;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 0.8fr;
  padding: 4px 8px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 12px;
  font-weight: 600;
  color: #555;
  background: #f8f8f8;
  position: sticky;
  top: 0;
}

.list-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 0.8fr;
  padding: 5px 8px;
  font-size: 12px;
  color: #1a1a1a;
  cursor: default;
  align-items: center;
  transition: background 0.1s;

  &:hover {
    background: rgba(0, 120, 212, 0.06);
  }

  &.selected {
    background: rgba(0, 120, 212, 0.15);
  }
}

.col-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.row-icon {
  font-size: 16px;
}

.status-bar {
  display: flex;
  align-items: center;
  padding: 3px 10px;
  font-size: 12px;
  color: #555;
  border-top: 1px solid #d0d0d0;
  background: #f5f5f5;
  gap: 16px;
  flex-shrink: 0;
}

.view-toggle {
  margin-left: auto;
  display: flex;
  gap: 2px;

  button {
    padding: 3px 5px;
    border-radius: 2px;
    color: #555;
    transition: background 0.1s;

    &:hover {
      background: rgba(0, 0, 0, 0.08);
    }

    &.active {
      background: rgba(0, 120, 212, 0.15);
      color: var(--accent);
    }
  }
}
</style>
