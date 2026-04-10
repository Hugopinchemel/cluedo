<template>
  <div class="terminal" @click="focusInput">
    <div class="terminal-output" ref="outputEl">
      <div v-for="(line, i) in lines" :key="i" class="terminal-line" v-html="line"/>
      <div class="terminal-input-line">
        <span class="prompt">C:\Users\Suspect&gt;</span>
        <input
            ref="inputEl"
            v-model="currentInput"
            class="terminal-input"
            spellcheck="false"
            @keydown.enter="executeCommand"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const lines = ref<string[]>([
  '<span class="cyan">Windows PowerShell</span>',
  'Copyright (C) Microsoft Corporation. Tous droits réservés.',
  '',
  '<span class="yellow">Essayez le nouveau PowerShell multiplateforme https://aka.ms/pscore6</span>',
  '',
])

const currentInput = ref('')
const outputEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)

function focusInput() {
  inputEl.value?.focus()
}

onMounted(() => {
  nextTick(() => focusInput())
})

const secretsFound = ref(false)

const commands: Record<string, () => string[]> = {
  'help': () => [
    'Commandes disponibles :',
    '  <span class="cyan">whoami</span>        - Affiche l\'utilisateur actuel',
    '  <span class="cyan">date</span>          - Affiche la date et l\'heure',
    '  <span class="cyan">dir</span>           - Liste les fichiers du répertoire',
    '  <span class="cyan">cls</span>           - Efface l\'écran',
    '  <span class="cyan">ipconfig</span>      - Affiche la configuration réseau',
    '  <span class="cyan">systeminfo</span>    - Informations système',
    '  <span class="cyan">tasklist</span>      - Processus en cours',
    '  <span class="cyan">echo</span>          - Affiche un message',
    '  <span class="cyan">ping</span>          - Teste la connectivité',
    '  <span class="cyan">exit</span>          - Ferme le terminal',
  ],
  'whoami': () => ['DESKTOP-35MM\\Suspect'],
  'date': () => [new Date().toLocaleString('fr-FR')],
  'cls': () => {
    lines.value = []
    return []
  },
  'dir': () => [
    ' Répertoire de C:\\Users\\Suspect',
    '',
    '01/04/2026  10:00    <DIR>          .',
    '01/04/2026  10:00    <DIR>          ..',
    '01/04/2026  09:30    <DIR>          Bureau',
    '01/04/2026  08:15    <DIR>          Documents',
    '01/04/2026  07:00    <DIR>          Téléchargements',
    '31/03/2026  23:47           1 337   .bash_history',
    '01/04/2026  02:13              42   <span class="red">.secret</span>',
    '               2 fichier(s)          1 379 octets',
  ],
  'cat .secret': () => [
    '<span class="red">[ CONFIDENTIEL ]</span>',
    '',
    'Le rendez-vous est fixé au 16 août.',
    'Villa Rose, Mimizan. Ne dis rien à personne.',
    'Supprime ce fichier après lecture.',
    '',
    '<span class="yellow">- M.</span>',
  ],
  'type .secret': () => commands['cat .secret'](),
  'dir /secrets': () => [
    '<span class="red">ACCÈS RESTREINT - FICHIERS CLASSIFIÉS</span>',
    '',
    '01/04/2026  02:13         analyse_toxicologique.pdf',
    '31/03/2026  23:58         temoignage_voisin.txt',
    '31/03/2026  22:30         releve_telephonique_suspect.csv',
    '01/04/2026  01:05         photo_scene_crime_001.jpg',
    '',
    '<span class="yellow">4 fichier(s) classifié(s) - Autorisation niveau 3 requise</span>',
  ],
  'ipconfig': () => [
    'Configuration IP Windows',
    '',
    'Carte Ethernet Ethernet :',
    '   Suffixe DNS propre à la connexion : local.police.fr',
    '   Adresse IPv4. . . . . . . . . . . : 192.168.1.35',
    '   Masque de sous-réseau. . . . . . . : 255.255.255.0',
    '   Passerelle par défaut. . . . . . . : 192.168.1.1',
  ],
  'systeminfo': () => [
    'Nom de l\'hôte :                 DESKTOP-35MM',
    'Nom du système d\'exploitation : Windows 10 Pro',
    'Version du système :             10.0.19045',
    'Fabricant du système :           35mm Studios',
    'Modèle du système :              Cluedo Edition',
    'Type du système :                x64-based PC',
    'Processeur(s) :                  1 processeur(s) installé(s).',
    '                                 [01]: Intel Core i7-13700K',
    'Mémoire physique totale :        16 384 Mo',
    '<span class="yellow">Dernier redémarrage :            01/04/2026, 06:47:12</span>',
  ],
  'tasklist': () => [
    'Nom de l\'image                 PID   Utilisation mémoire',
    '========================= ======== ================',
    'System Idle Process              0            8 Ko',
    'explorer.exe                  4812       85 432 Ko',
    'msedge.exe                    7234      245 120 Ko',
    'notepad.exe                   3456       12 288 Ko',
    'calc.exe                      5678        8 192 Ko',
    '<span class="red">surveillance.exe              6666      128 000 Ko</span>',
    '<span class="red">keylogger_v2.exe             1337       32 768 Ko</span>',
    'powershell.exe                9999       45 056 Ko',
  ],
  'ping': () => [
    'Envoi d\'une requête \'ping\' sur 192.168.1.1 avec 32 octets de données :',
    'Réponse de 192.168.1.1 : octets=32 temps=1 ms TTL=64',
    'Réponse de 192.168.1.1 : octets=32 temps<1 ms TTL=64',
    'Réponse de 192.168.1.1 : octets=32 temps=1 ms TTL=64',
    '',
    'Statistiques Ping pour 192.168.1.1:',
    '    Paquets : envoyés = 3, reçus = 3, perdus = 0',
  ],
}

function executeCommand() {
  const cmd = currentInput.value.trim()
  if (!cmd) return

  lines.value.push(`<span class="prompt-echo">C:\\Users\\Suspect&gt;</span> ${escapeHtml(cmd)}`)

  const lower = cmd.toLowerCase()

  if (lower === 'exit') {
    lines.value.push('Fermeture...')
    currentInput.value = ''
    return
  }

  if (commands[lower]) {
    const output = commands[lower]()
    lines.value.push(...output)
  } else if (lower.startsWith('echo ')) {
    lines.value.push(escapeHtml(cmd.slice(5)))
  } else if (lower === 'sudo rm -rf /') {
    lines.value.push('<span class="red">Bien essayé. Ce n\'est pas Linux.</span>')
  } else if (lower === 'matrix') {
    lines.value.push('<span class="green">Wake up, Neo... The Matrix has you...</span>')
  } else {
    lines.value.push(`Le terme '${escapeHtml(cmd)}' n'est pas reconnu comme nom d'applet de commande.`)
    lines.value.push('Tapez <span class="cyan">help</span> pour la liste des commandes.')
  }

  lines.value.push('')
  currentInput.value = ''

  nextTick(() => {
    if (outputEl.value) {
      outputEl.value.scrollTop = outputEl.value.scrollHeight
    }
  })
}

function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
</script>

<style scoped>
.terminal {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #012456;
  font-family: 'Cascadia Code', 'Consolas', 'Courier New', monospace;
  font-size: 13px;
  color: #cccccc;
  cursor: text;
}

.terminal-output {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.terminal-line {
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.4;
}

.terminal-input-line {
  display: flex;
  align-items: center;
  gap: 0;
  white-space: nowrap;
}

.prompt {
  color: #cccccc;
  flex-shrink: 0;
}

:deep(.prompt-echo) {
  color: #cccccc;
}

:deep(.cyan) {
  color: #3a96dd;
}

:deep(.yellow) {
  color: #c19c00;
}

:deep(.red) {
  color: #e74856;
}

:deep(.green) {
  color: #16c60c;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #cccccc;
  font-family: inherit;
  font-size: inherit;
  caret-color: #cccccc;
}
</style>
