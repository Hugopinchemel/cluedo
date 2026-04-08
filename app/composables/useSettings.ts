import {ref, watchEffect} from 'vue'

export interface SettingsState {
    wallpaper: string
    accentColor: string
    darkMode: boolean
    brightness: number
    volume: number
    // Accessibility
    textSize: number
    highContrast: boolean
    transparency: boolean
    animations: boolean
}

const DEFAULT_WALLPAPER = 'radial-gradient(ellipse 70% 55% at 20% 65%, rgba(74,144,217,0.25) 0%, transparent 60%), radial-gradient(ellipse 55% 70% at 80% 25%, rgba(83,52,131,0.3) 0%, transparent 60%), linear-gradient(155deg, #0d1b2e 0%, #112244 40%, #1a0d2e 70%, #0a1520 100%)'

const settings = ref<SettingsState>({
    wallpaper: DEFAULT_WALLPAPER,
    accentColor: '#0078d4',
    darkMode: false,
    brightness: 100,
    volume: 80,
    textSize: 100,
    highContrast: false,
    transparency: true,
    animations: true,
})

// Initialize from localStorage if available
if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('win_settings')
    if (saved) {
        try {
            Object.assign(settings.value, JSON.parse(saved))
        } catch (e) {
            console.error('Failed to load settings', e)
        }
    }
}

// Persist changes
watchEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('win_settings', JSON.stringify(settings.value))

        // Apply accent color to CSS variable
        document.documentElement.style.setProperty('--accent', settings.value.accentColor)

        // Apply dark mode class to body or root
        if (settings.value.darkMode) {
            document.documentElement.classList.add('dark-mode')
        } else {
            document.documentElement.classList.remove('dark-mode')
        }
    }
})

export function useSettings() {
    function updateSettings(updates: Partial<SettingsState>) {
        Object.assign(settings.value, updates)
    }

    function resetSettings() {
        settings.value = {
            wallpaper: DEFAULT_WALLPAPER,
            accentColor: '#0078d4',
            darkMode: false,
            brightness: 100,
            volume: 80,
            textSize: 100,
            highContrast: false,
            transparency: true,
            animations: true,
        }
    }

    return {
        settings,
        updateSettings,
        resetSettings,
    }
}
