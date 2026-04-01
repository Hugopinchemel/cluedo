<template>
  <div class="login-screen">
    <div class="login-bg" />
    <div class="login-box">
      <div class="avatar">
        <svg viewBox="0 0 24 24" width="60" height="60" fill="white"><path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"/></svg>
      </div>
      <div class="username">{{ username }}</div>
      <div class="password-row">
        <input
          v-model="password"
          :type="showPwd ? 'text' : 'password'"
          placeholder="Mot de passe"
          class="password-input"
          @keydown.enter="login"
          autofocus
        />
        <button class="reveal-btn" @click="showPwd = !showPwd" tabindex="-1">
          <svg v-if="!showPwd" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
          <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
        </button>
        <button class="submit-btn" @click="login">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
        </button>
      </div>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <div class="login-options">
        <button @click="$emit('back')">← Retour</button>
        <span>·</span>
        <button>Options de connexion</button>
      </div>
    </div>
    <div class="bottom-actions">
      <button class="bottom-btn" title="Réseau">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
      </button>
      <button class="bottom-btn" title="Facilité d'accès">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><circle cx="12" cy="4" r="2"/><path d="M15.97 8.03L14 10h-4L8.03 8.03A1 1 0 007 9v5h2v6h6v-6h2V9a1 1 0 00-1.03-0.97z"/></svg>
      </button>
      <button class="bottom-btn" title="Arrêter">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ login: []; back: [] }>()

const username = 'Utilisateur'
const password = ref('')
const showPwd = ref(false)
const error = ref('')

function login() {
  error.value = ''
  // Accept any password (demo)
  emit('login')
}
</script>

<style scoped>
.login-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.login-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 60% at 25% 60%, rgba(74, 144, 217, 0.25) 0%, transparent 65%),
    radial-gradient(ellipse 50% 70% at 75% 30%, rgba(83, 52, 131, 0.3) 0%, transparent 65%),
    linear-gradient(160deg, #0d1b2e 0%, #112244 40%, #1a0d2e 70%, #0a1520 100%);
  filter: blur(2px);
}

.login-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: white;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  border: 2px solid rgba(255,255,255,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.username {
  font-size: 20px;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.password-row {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 2px;
  overflow: hidden;
  width: 260px;
  backdrop-filter: blur(8px);
}

.password-input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  padding: 10px 12px;
  outline: none;
  font-size: 14px;

  &::placeholder { color: rgba(255,255,255,0.6); }
}

.reveal-btn, .submit-btn {
  padding: 0 12px;
  height: 40px;
  color: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  transition: background 0.15s;

  &:hover { background: rgba(255,255,255,0.1); }
}

.submit-btn {
  background: var(--accent);
  color: white;
  padding: 0 14px;

  &:hover { background: var(--accent-dark); }
}

.error-msg {
  font-size: 12px;
  color: #ff9f9f;
  background: rgba(255,0,0,0.15);
  padding: 6px 12px;
  border-radius: 2px;
  width: 260px;
  text-align: center;
}

.login-options {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  margin-top: 4px;

  button {
    color: rgba(255,255,255,0.8);
    text-decoration: underline;
    font-size: 12px;
    &:hover { color: white; }
  }
}

.bottom-actions {
  position: absolute;
  bottom: 20px;
  right: 24px;
  display: flex;
  gap: 4px;
}

.bottom-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  opacity: 0.8;
  transition: background 0.15s, opacity 0.15s;

  &:hover {
    background: rgba(255,255,255,0.1);
    opacity: 1;
  }
}
</style>
