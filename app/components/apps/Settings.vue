<template>
  <div class="settings">
    <!-- Sidebar -->
    <div class="settings-nav">
      <div class="settings-header">
        <div class="settings-avatar">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"/></svg>
        </div>
        <div>
          <div class="settings-username">Utilisateur</div>
          <div class="settings-account">Compte local</div>
        </div>
      </div>
      <div class="settings-search">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="#666"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input placeholder="Paramètres de recherche" />
      </div>
      <nav class="settings-menu">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="settings-nav-item"
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          <img v-if="cat.icon.startsWith('/')" :src="cat.icon" width="16" height="16" class="nav-icon-img" alt="" />
          <Icon v-else :name="cat.icon" class="nav-icon" />
          <span>{{ cat.name }}</span>
        </button>
      </nav>
    </div>

    <!-- Content -->
    <div class="settings-content">
      <!-- System -->
      <div v-if="activeCategory === 'system'" class="content-panel">
        <h1>Système</h1>
        <div class="settings-section">
          <h2>Affichage</h2>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-name">Luminosité</div>
              <div class="setting-desc">Régler la luminosité intégrée</div>
            </div>
            <input type="range" min="0" max="100" v-model="brightness" class="setting-slider" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-name">Résolution d'affichage</div>
              <div class="setting-desc">1920 × 1080 (Recommandé)</div>
            </div>
            <select class="setting-select">
              <option>1920 × 1080 (Recommandé)</option>
              <option>2560 × 1440</option>
              <option>1280 × 720</option>
            </select>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-name">Fréquence de rafraîchissement</div>
              <div class="setting-desc">144 Hz</div>
            </div>
            <select class="setting-select">
              <option>144 Hz</option>
              <option>60 Hz</option>
            </select>
          </div>
        </div>

        <div class="settings-section">
          <h2>Son</h2>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-name">Volume principal</div>
            </div>
            <input type="range" min="0" max="100" v-model="volume" class="setting-slider" />
          </div>
        </div>

        <div class="settings-section">
          <h2>Alimentation et mise en veille</h2>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-name">Mettre l'écran en veille après</div>
            </div>
            <select class="setting-select">
              <option>5 minutes</option>
              <option>10 minutes</option>
              <option>15 minutes</option>
              <option>Jamais</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Personalization -->
      <div v-else-if="activeCategory === 'personalization'" class="content-panel">
        <h1>Personnalisation</h1>
        <div class="settings-section">
          <h2>Arrière-plan</h2>
          <div class="bg-options">
            <div
              v-for="bg in backgrounds"
              :key="bg.name"
              class="bg-thumb"
              :class="{ selected: selectedBg === bg.name }"
              :style="{ background: bg.css }"
              @click="selectedBg = bg.name; $emit('changeBg', bg.css)"
            >
              <svg v-if="selectedBg === bg.name" viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
          </div>
          <div class="setting-row" style="margin-top:12px">
            <div class="setting-name">Ajustement de l'image</div>
            <select class="setting-select">
              <option>Remplir</option>
              <option>Ajuster</option>
              <option>Étirer</option>
              <option>Centrer</option>
              <option>Mosaïque</option>
            </select>
          </div>
        </div>
        <div class="settings-section">
          <h2>Couleurs</h2>
          <div class="color-options">
            <div
              v-for="color in accentColors"
              :key="color"
              class="color-swatch"
              :style="{ background: color }"
              :class="{ selected: accentColor === color }"
              @click="accentColor = color"
            />
          </div>
          <div class="setting-row" style="margin-top:12px">
            <div class="setting-info">
              <div class="setting-name">Mode sombre</div>
              <div class="setting-desc">Appliquer le mode sombre aux applications Windows</div>
            </div>
            <div class="toggle" :class="{ on: darkMode }" @click="darkMode = !darkMode">
              <div class="toggle-knob" />
            </div>
          </div>
        </div>
      </div>

      <!-- Apps -->
      <div v-else-if="activeCategory === 'apps'" class="content-panel">
        <h1>Applications</h1>
        <div class="settings-section">
          <h2>Applications et fonctionnalités</h2>
          <div class="app-list">
            <div class="app-row" v-for="app in installedApps" :key="app.name">
              <img v-if="app.icon.startsWith('/')" :src="app.icon" width="24" height="24" class="app-row-icon-img" alt="" />
              <Icon v-else :name="app.icon" class="app-row-icon" />
              <div class="app-row-info">
                <div class="app-row-name">{{ app.name }}</div>
                <div class="app-row-size">{{ app.size }} · {{ app.date }}</div>
              </div>
              <button class="btn-uninstall">Désinstaller</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Generic -->
      <div v-else class="content-panel">
        <h1>{{ categories.find(c => c.id === activeCategory)?.name }}</h1>
        <div class="settings-section">
          <p style="color:#666;margin-top:16px">Cette section est en cours de développement.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ changeBg: [css: string] }>()

const activeCategory = ref('system')
const brightness = ref(80)
const volume = ref(65)
const selectedBg = ref('default')
const darkMode = ref(false)
const accentColor = ref('#0078d4')

const categories = [
  { id: 'system', icon: '/icons/user-desktop-symbolic.svg', name: 'Système' },
  { id: 'devices', icon: '/icons/keyboard-brightness-symbolic.svg', name: 'Périphériques' },
  { id: 'phone', icon: '/icons/network-cellular-connected-symbolic.svg', name: 'Téléphone' },
  { id: 'network', icon: '/icons/network-idle-symbolic.svg', name: 'Réseau et Internet' },
  { id: 'personalization', icon: '/icons/preferences-desktop-wallpaper-symbolic.svg', name: 'Personnalisation' },
  { id: 'apps', icon: '/icons/application-certificate-symbolic.svg', name: 'Applications' },
  { id: 'accounts', icon: '/icons/avatar-default-symbolic.svg', name: 'Comptes' },
  { id: 'time', icon: '/icons/preferences-system-time-symbolic.svg', name: 'Heure et langue' },
  { id: 'gaming', icon: '/icons/audio-volume-high-symbolic.svg', name: 'Jeux' },
  { id: 'ease', icon: '/icons/preferences-desktop-accessibility-symbolic.svg', name: 'Facilité d\'accès' },
  { id: 'privacy', icon: '/icons/dialog-password-symbolic.svg', name: 'Confidentialité' },
  { id: 'update', icon: '/icons/software-update-available-symbolic.svg', name: 'Mise à jour et sécurité' },
]

const backgrounds = [
  { name: 'default', css: 'linear-gradient(135deg, #1a2744 0%, #0d1f3c 50%, #1a1030 100%)' },
  { name: 'blue', css: 'linear-gradient(135deg, #0078d4, #005a9e)' },
  { name: 'purple', css: 'linear-gradient(135deg, #6b35c0, #9b59b6)' },
  { name: 'teal', css: 'linear-gradient(135deg, #008080, #00b4b4)' },
  { name: 'dark', css: 'linear-gradient(135deg, #1a1a1a, #333)' },
  { name: 'sunset', css: 'linear-gradient(135deg, #ff6b35, #f7c59f, #efefd0)' },
]

const accentColors = [
  '#0078d4', '#8a1b86', '#c50f1f', '#ca5010',
  '#038387', '#498205', '#004e8c', '#881798',
]

const installedApps = [
  { icon: '/icons/web-browser-symbolic.svg', name: 'Microsoft Edge', size: '120 Mo', date: '01/04/2026' },
  { icon: '/icons/text-editor-symbolic.svg', name: 'Bloc-notes', size: '2,3 Mo', date: '01/04/2026' },
  { icon: '/icons/accessories-calculator-symbolic.svg', name: 'Calculatrice', size: '15 Mo', date: '01/04/2026' },
  { icon: '/icons/folder-pictures-symbolic.svg', name: 'Photos', size: '80 Mo', date: '01/04/2026' },
  { icon: '/icons/system-file-manager-symbolic.svg', name: 'Explorateur de fichiers', size: '45 Mo', date: '01/04/2026' },
  { icon: '/icons/gnome-power-manager-symbolic.svg', name: 'Paramètres', size: '18 Mo', date: '01/04/2026' },
]
</script>

<style scoped>
.settings {
  display: flex;
  height: 100%;
  background: #f3f3f3;
  overflow: hidden;
}

.settings-nav {
  width: 260px;
  background: #f0f0f0;
  border-right: 1px solid #d8d8d8;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px 12px;
}

.settings-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.settings-username { font-size: 14px; font-weight: 600; }
.settings-account { font-size: 11px; color: #666; }

.settings-search {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 12px 12px;
  padding: 7px 10px;
  background: white;
  border: 1px solid #d0d0d0;
  border-radius: 2px;

  input {
    border: none;
    outline: none;
    font-size: 12px;
    flex: 1;
    background: transparent;
    &::placeholder { color: #999; }
  }
}

.settings-menu { padding: 0 0 16px; }

.settings-nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 16px;
  font-size: 13px;
  color: #333;
  text-align: left;
  transition: background 0.1s;

  &:hover { background: rgba(0,0,0,0.05); }
  &.active { background: white; color: var(--accent); font-weight: 500; border-right: 2px solid var(--accent); }
}

.nav-icon { font-size: 16px; width: 20px; text-align: center; }

.settings-content {
  flex: 1;
  overflow-y: auto;
}

.content-panel {
  padding: 28px 40px;
  max-width: 720px;

  h1 {
    font-size: 24px;
    font-weight: 300;
    margin-bottom: 24px;
    color: #1a1a1a;
  }
}

.settings-section {
  margin-bottom: 32px;

  h2 {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #d8d8d8;
  }
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.setting-name { font-size: 13px; font-weight: 500; color: #1a1a1a; }
.setting-desc { font-size: 11px; color: #666; margin-top: 2px; }

.setting-slider {
  width: 200px;
  accent-color: var(--accent);
}

.setting-select {
  border: 1px solid #c0c0c0;
  border-radius: 2px;
  padding: 5px 8px;
  font-size: 12px;
  background: white;
  outline: none;
  min-width: 160px;

  &:focus { border-color: var(--accent); }
}

.bg-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.bg-thumb {
  width: 100px;
  height: 64px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;

  &.selected { border-color: var(--accent); }
  &:hover { opacity: 0.85; }
}

.color-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 2px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.15s;

  &.selected { border-color: #1a1a1a; }
}

.toggle {
  width: 46px;
  height: 24px;
  border-radius: 12px;
  background: #c0c0c0;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;

  &.on { background: var(--accent); }
}

.toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  transition: transform 0.2s;

  .toggle.on & { transform: translateX(22px); }
}

.app-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.app-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

.app-row-icon { font-size: 24px; flex-shrink: 0; }
.app-row-info { flex: 1; }
.app-row-name { font-size: 13px; font-weight: 500; }
.app-row-size { font-size: 11px; color: #666; }

.btn-uninstall {
  padding: 5px 12px;
  border: 1px solid #c0c0c0;
  border-radius: 2px;
  font-size: 12px;
  color: #333;
  background: white;
  transition: background 0.1s;

  &:hover { background: #f0f0f0; }
}
</style>
