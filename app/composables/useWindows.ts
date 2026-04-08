import {ref} from 'vue'
import {
    ICON_APP_CALCULATOR,
    ICON_APP_EDGE,
    ICON_APP_EXPLORER,
    ICON_APP_NOTEPAD,
    ICON_APP_PDF,
    ICON_APP_PHOTOS,
    ICON_APP_SETTINGS,
} from '~/composables/icons'

export interface AppDef {
    id: string
    name: string
    icon: string
    defaultWidth: number
    defaultHeight: number
}

export interface WinInstance {
    id: string
    appId: string
    title: string
    x: number
    y: number
    width: number
    height: number
    minimized: boolean
    maximized: boolean
    zIndex: number
    // saved pos/size before maximize
    _prevX?: number
    _prevY?: number
    _prevW?: number
    _prevH?: number
}

export const APPS: AppDef[] = [
<<<<<<< Updated upstream
  { id: 'explorer',    name: 'Explorateur de fichiers', icon: ICON_APP_EXPLORER,   defaultWidth: 860, defaultHeight: 540 },
  { id: 'notepad',     name: 'Bloc-notes',              icon: ICON_APP_NOTEPAD,    defaultWidth: 640, defaultHeight: 420 },
  { id: 'calculator',  name: 'Calculatrice',            icon: ICON_APP_CALCULATOR, defaultWidth: 310, defaultHeight: 490 },
  { id: 'settings',    name: 'Paramètres',              icon: ICON_APP_SETTINGS,   defaultWidth: 860, defaultHeight: 580 },
  { id: 'edge',        name: 'Microsoft Edge',          icon: ICON_APP_EDGE,       defaultWidth: 960, defaultHeight: 620 },
  { id: 'photos',      name: 'Photos',                  icon: ICON_APP_PHOTOS,     defaultWidth: 820, defaultHeight: 560 },
  { id: 'pdfviewer',   name: 'Lecteur PDF',             icon: ICON_APP_PDF,        defaultWidth: 820, defaultHeight: 680 },
  { id: 'pdfviewer2',  name: 'Dossier_interne.pdf',     icon: ICON_APP_PDF,        defaultWidth: 820, defaultHeight: 680 },
=======
    {id: 'explorer', name: 'Explorateur de fichiers', icon: ICON_APP_EXPLORER, defaultWidth: 860, defaultHeight: 540},
    {id: 'notepad', name: 'Bloc-notes', icon: ICON_APP_NOTEPAD, defaultWidth: 640, defaultHeight: 420},
    {id: 'calculator', name: 'Calculatrice', icon: ICON_APP_CALCULATOR, defaultWidth: 310, defaultHeight: 490},
    {id: 'settings', name: 'Paramètres', icon: ICON_APP_SETTINGS, defaultWidth: 860, defaultHeight: 580},
    {id: 'edge', name: 'Microsoft Edge', icon: ICON_APP_EDGE, defaultWidth: 960, defaultHeight: 620},
    {id: 'photos', name: 'Photos', icon: ICON_APP_PHOTOS, defaultWidth: 820, defaultHeight: 560},
    {id: 'pdfviewer', name: 'Lecteur PDF', icon: ICON_APP_PDF, defaultWidth: 820, defaultHeight: 680},
>>>>>>> Stashed changes
]

// Module-level singleton state
const windows = ref<WinInstance[]>([])
let _z = 100

export function useWindows() {
    function focusWindow(id: string) {
        const w = windows.value.find(w => w.id === id)
        if (w) {
            _z++;
            w.zIndex = _z
        }
    }

    function openApp(appId: string) {
        const app = APPS.find(a => a.id === appId)
        if (!app) return

        // restore minimized
        const minimized = windows.value.find(w => w.appId === appId && w.minimized)
        if (minimized) {
            minimized.minimized = false
            focusWindow(minimized.id)
            return
        }

        // bring to front if already open
        const existing = windows.value.find(w => w.appId === appId && !w.minimized)
        if (existing) {
            focusWindow(existing.id)
            return
        }

        const offset = windows.value.length * 24
        _z++
        const id = `w-${Date.now()}`
        windows.value.push({
            id,
            appId,
            title: app.name,
            x: 80 + offset,
            y: 50 + offset,
            width: app.defaultWidth,
            height: app.defaultHeight,
            minimized: false,
            maximized: false,
            zIndex: _z,
        })
    }

    function closeWindow(id: string) {
        const idx = windows.value.findIndex(w => w.id === id)
        if (idx !== -1) windows.value.splice(idx, 1)
    }

    function minimizeWindow(id: string) {
        const w = windows.value.find(w => w.id === id)
        if (w) w.minimized = true
    }

    function toggleMaximize(id: string) {
        const w = windows.value.find(w => w.id === id)
        if (!w) return
        if (!w.maximized) {
            w._prevX = w.x;
            w._prevY = w.y;
            w._prevW = w.width;
            w._prevH = w.height
            w.maximized = true
        } else {
            w.maximized = false
            w.x = w._prevX ?? 80;
            w.y = w._prevY ?? 50
            w.width = w._prevW ?? 800;
            w.height = w._prevH ?? 500
        }
        focusWindow(id)
    }

    function moveWindow(id: string, x: number, y: number) {
        const w = windows.value.find(w => w.id === id)
        if (w && !w.maximized) {
            w.x = x;
            w.y = y
        }
    }

    function resizeWindow(id: string, width: number, height: number) {
        const w = windows.value.find(w => w.id === id)
        if (w && !w.maximized) {
            w.width = Math.max(200, width)
            w.height = Math.max(120, height)
        }
    }

    const activeWindows = computed(() =>
        windows.value.filter(w => !w.minimized).sort((a, b) => a.zIndex - b.zIndex)
    )

    const taskbarWindows = computed(() => windows.value)

    return {
        windows,
        activeWindows,
        taskbarWindows,
        openApp,
        closeWindow,
        minimizeWindow,
        toggleMaximize,
        focusWindow,
        moveWindow,
        resizeWindow,
    }
}
