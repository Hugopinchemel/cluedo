import {ref} from 'vue'
import {
    ICON_APP_CALCULATOR,
    ICON_APP_EDGE,
    ICON_APP_EXPLORER,
    ICON_APP_NOTEPAD,
    ICON_APP_PAINT,
    ICON_APP_PDF,
    ICON_APP_PHOTOS,
    ICON_APP_POWERPOINT,
    ICON_APP_MUSIC,
    ICON_APP_SETTINGS,
    ICON_APP_TERMINAL,
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
    initialUrl?: string
}

export const APPS: AppDef[] = [
    {id: 'explorer', name: 'Explorateur de fichiers', icon: ICON_APP_EXPLORER, defaultWidth: 860, defaultHeight: 540},
    {id: 'notepad', name: 'Bloc-notes', icon: ICON_APP_NOTEPAD, defaultWidth: 640, defaultHeight: 420},
    {id: 'calculator', name: 'Calculatrice', icon: ICON_APP_CALCULATOR, defaultWidth: 310, defaultHeight: 490},
    {id: 'settings', name: 'Paramètres', icon: ICON_APP_SETTINGS, defaultWidth: 860, defaultHeight: 580},
    {id: 'edge', name: 'Microsoft Edge', icon: ICON_APP_EDGE, defaultWidth: 960, defaultHeight: 620},
    {id: 'photos', name: 'Photos', icon: ICON_APP_PHOTOS, defaultWidth: 820, defaultHeight: 560},
    {id: 'pdfviewer', name: 'Dossier_d\'Enquête.pdf', icon: ICON_APP_PDF, defaultWidth: 820, defaultHeight: 680},
    {id: 'pdfviewer2', name: "Rapport d'Autopsie", icon: ICON_APP_PDF, defaultWidth: 820, defaultHeight: 680},
    {id: 'terminal', name: 'Windows PowerShell', icon: ICON_APP_TERMINAL, defaultWidth: 780, defaultHeight: 480},
    {id: 'paint', name: 'Paint', icon: ICON_APP_PAINT, defaultWidth: 900, defaultHeight: 620},
    {id: 'powerpoint', name: 'workshop.pdf', icon: ICON_APP_POWERPOINT, defaultWidth: 960, defaultHeight: 640},
    {id: 'audioplayer', name: 'Groove Musique', icon: ICON_APP_MUSIC, defaultWidth: 860, defaultHeight: 600},
]

// Module-level singleton state
const windows = ref<WinInstance[]>([])
const isBsodActive = ref(false)
const isGlobalGlitch = ref(false)
let _z = 100

export function useWindows() {
    function triggerBsod() {
        isBsodActive.value = true
    }

    function stopBsod() {
        isBsodActive.value = false
    }

    function triggerGlobalGlitch(duration = 4500, delay = 1000) {
        setTimeout(() => {
            isGlobalGlitch.value = true
            setTimeout(() => isGlobalGlitch.value = false, duration)
        }, delay)
    }
    function focusWindow(id: string) {
        const w = windows.value.find(w => w.id === id)
        if (w) {
            _z++;
            w.zIndex = _z
        }
    }

    function openApp(appId: string, initialUrl?: string) {
        const app = APPS.find(a => a.id === appId)
        if (!app) return

        const minimized = windows.value.find(w => w.appId === appId && w.minimized)
        if (minimized) {
            minimized.minimized = false
            if (initialUrl) minimized.initialUrl = initialUrl
            focusWindow(minimized.id)
            return
        }

        const existing = windows.value.find(w => w.appId === appId && !w.minimized)
        if (existing) {
            if (initialUrl) existing.initialUrl = initialUrl
            focusWindow(existing.id)
            return
        }

        const offset = windows.value.length * 24
        _z++
        const id = `w-${Date.now()}`
        windows.value.push({
            id, appId,
            title: app.name,
            x: 80 + offset, y: 50 + offset,
            width: app.defaultWidth, height: app.defaultHeight,
            minimized: false, maximized: false,
            zIndex: _z,
            initialUrl,
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
        isBsodActive,
        isGlobalGlitch,
        triggerBsod,
        stopBsod,
        triggerGlobalGlitch,
        openApp,
        closeWindow,
        minimizeWindow,
        toggleMaximize,
        focusWindow,
        moveWindow,
        resizeWindow,
    }
}
