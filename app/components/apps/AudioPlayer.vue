<template>
  <div class="audio-player" @keydown="handleKeydown" tabindex="0">
    <div class="main-layout">
      <!-- Sidebar -->
      <nav class="sidebar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['nav-btn', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <Icon :name="tab.icon" />
          <span>{{ tab.label }}</span>
        </button>
        <div class="spacer"></div>
        <button class="nav-btn">
          <Icon name="fluent:settings-24-regular" />
          <span>Paramètres</span>
        </button>
      </nav>

      <!-- Content -->
      <div class="content">
        <header class="content-header">
          <h1>{{ activeTabLabel }}</h1>
          <div class="header-actions">
            <button class="play-all-btn" @click="playAll">
              <Icon name="fluent:play-24-filled" />
              Tout lire
            </button>
          </div>
        </header>

        <!-- Track list header -->
        <div class="track-list-header">
          <div class="track-status">#</div>
          <div class="track-info">Titre</div>
          <div class="track-album">Album</div>
          <div class="track-duration">
            <Icon name="fluent:clock-24-regular" />
          </div>
        </div>

        <div class="track-list">
          <div
            v-for="(track, index) in displayedTracks"
            :key="index"
            :class="{ active: currentTrackIndex === index, selected: selectedIndex === index }"
            class="track-row"
            @click="playTrack(index)"
          >
            <div class="track-status">
              <div v-if="currentTrackIndex === index && isPlaying" class="equalizer">
                <span></span><span></span><span></span>
              </div>
              <Icon v-else-if="currentTrackIndex === index && !isPlaying" name="fluent:music-note-2-24-filled" class="paused-icon" />
              <span v-else class="track-num">{{ index + 1 }}</span>
            </div>
            <div class="track-info">
              <div class="track-title">{{ track.title }}</div>
              <div class="track-artist">{{ track.artist }}</div>
            </div>
            <div class="track-album">{{ track.album }}</div>
            <div class="track-duration">{{ track.durationDisplay }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden audio element -->
    <audio
      ref="audioRef"
      :src="currentTrack.src"
      @timeupdate="updateProgress"
      @ended="onEnded"
      @loadedmetadata="onMetadata"
    ></audio>

    <!-- Player Controls -->
    <div class="player-controls">
      <div class="now-playing">
        <div class="album-art" :class="{ spinning: isPlaying }">
          <Icon name="fluent:music-note-2-24-filled" />
        </div>
        <div class="current-info">
          <div class="current-title">{{ currentTrack.title }}</div>
          <div class="current-artist">{{ currentTrack.artist }}</div>
        </div>
      </div>

      <div class="playback-controls">
        <div class="buttons">
          <button
            :class="['p-btn', { 'is-active-mode': shuffleOn }]"
            title="Aléatoire"
            @click="toggleShuffle"
          >
            <Icon name="fluent:arrow-shuffle-24-regular" />
          </button>
          <button class="p-btn" @click="prevTrack" title="Précédent">
            <Icon name="fluent:previous-24-filled" />
          </button>
          <button class="p-btn play-btn" @click="togglePlay" :title="isPlaying ? 'Pause' : 'Lecture'">
            <Icon :name="isPlaying ? 'fluent:pause-24-filled' : 'fluent:play-24-filled'" />
          </button>
          <button class="p-btn" @click="nextTrack" title="Suivant">
            <Icon name="fluent:next-24-filled" />
          </button>
          <button
            :class="['p-btn', { 'is-active-mode': repeatMode !== 'none' }]"
            :title="repeatTitle"
            @click="cycleRepeat"
          >
            <Icon :name="repeatMode === 'one' ? 'fluent:arrow-repeat-1-24-regular' : 'fluent:arrow-repeat-all-24-regular'" />
          </button>
        </div>
        <div class="progress-container">
          <span class="time-label">{{ formatTime(currentTime) }}</span>
          <div
            class="progress-bar"
            ref="progressBarRef"
            @click="seek"
            @mousedown="startSeeking"
          >
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            <div class="progress-thumb" :style="{ left: progress + '%' }"></div>
          </div>
          <span class="time-label">{{ currentTrack.durationDisplay }}</span>
        </div>
      </div>

      <div class="volume-controls">
        <button class="p-btn" @click="toggleMute" :title="isMuted ? 'Réactiver' : 'Muet'">
          <Icon :name="volumeIcon" />
        </button>
        <div
          class="volume-bar"
          ref="volumeBarRef"
          @click="setVolume"
          @mousedown="startVolumeChange"
        >
          <div class="volume-fill" :style="{ width: (isMuted ? 0 : volume) * 100 + '%' }"></div>
          <div class="volume-thumb" :style="{ left: (isMuted ? 0 : volume) * 100 + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Track {
  title: string
  artist: string
  album: string
  duration: string
  durationDisplay: string
  src: string
}

const isPlaying = ref(false)
const currentTrackIndex = ref(0)
const selectedIndex = ref(0)
const progress = ref(0)
const currentTime = ref(0)
const volume = ref(0.7)
const isMuted = ref(false)
const shuffleOn = ref(false)
const repeatMode = ref<'none' | 'all' | 'one'>('none')
const activeTab = ref('music')
const isSeeking = ref(false)
const isChangingVolume = ref(false)

const tabs = [
  { id: 'music', label: 'Ma musique', icon: 'fluent:music-note-2-24-regular' },
  { id: 'playlists', label: 'Listes de lecture', icon: 'fluent:list-24-regular' },
  { id: 'artists', label: 'Artistes', icon: 'fluent:person-24-regular' },
]

const activeTabLabel = computed(() => tabs.find(t => t.id === activeTab.value)?.label ?? 'Ma musique')

const tracks: Track[] = [
  { title: "Témoignage de Mathieux", artist: "Mathieux", album: "Enregistrements", duration: "0:00", durationDisplay: "0:00", src: "/sounds/audio-mathieux.mov" },
  { title: "Témoignage d'Arthur", artist: "Arthur", album: "Enregistrements", duration: "0:00", durationDisplay: "0:00", src: "/sounds/audio-arthur.MOV" },
  { title: "Témoignage de Daphnée", artist: "Daphnée", album: "Enregistrements", duration: "0:00", durationDisplay: "0:00", src: "/sounds/audio-daphnee.MOV" },
  { title: "Témoignage de Clément", artist: "Clément", album: "Enregistrements", duration: "0:00", durationDisplay: "0:00", src: "/sounds/audio-clement.MOV" },
]

// Shuffle order
const shuffleOrder = ref<number[]>([])

const displayedTracks = computed(() => tracks)

const audioRef = ref<HTMLAudioElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)
const volumeBarRef = ref<HTMLElement | null>(null)

const currentTrack = computed((): Track => tracks[currentTrackIndex.value] ?? tracks[0]!)

const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) return 'fluent:speaker-off-24-regular'
  if (volume.value < 0.4) return 'fluent:speaker-0-24-regular'
  if (volume.value < 0.7) return 'fluent:speaker-1-24-regular'
  return 'fluent:speaker-2-24-regular'
})

const repeatTitle = computed(() => {
  if (repeatMode.value === 'none') return 'Répéter'
  if (repeatMode.value === 'all') return 'Répéter tout'
  return 'Répéter une piste'
})

// Apply volume to audio element
watch([volume, isMuted], () => {
  if (!audioRef.value) return
  audioRef.value.volume = isMuted.value ? 0 : volume.value
})

watch(isPlaying, (playing) => {
  if (!audioRef.value) return
  if (playing) {
    audioRef.value.play().catch(e => console.error("Playback failed", e))
  } else {
    audioRef.value.pause()
  }
})

watch(currentTrackIndex, () => {
  nextTick(() => {
    if (!audioRef.value) return
    audioRef.value.load()
    if (isPlaying.value) {
      audioRef.value.play().catch(e => console.error("Playback failed", e))
    }
    progress.value = 0
    currentTime.value = 0
  })
})

function onMetadata() {
  if (!audioRef.value) return
  const dur = audioRef.value.duration
  if (!isNaN(dur)) {
    const t = tracks[currentTrackIndex.value]
    if (t) t.durationDisplay = formatTime(dur)
  }
}

function updateProgress() {
  if (audioRef.value && !isSeeking.value) {
    const dur = audioRef.value.duration
    currentTime.value = audioRef.value.currentTime
    progress.value = isNaN(dur) || dur === 0 ? 0 : (audioRef.value.currentTime / dur) * 100
  }
}

function onEnded() {
  if (repeatMode.value === 'one' && audioRef.value) {
    audioRef.value.currentTime = 0
    audioRef.value.play().catch(() => {})
    return
  }
  if (shuffleOn.value) {
    playShuffleNext()
    return
  }
  const isLast = currentTrackIndex.value === tracks.length - 1
  if (isLast && repeatMode.value === 'none') {
    isPlaying.value = false
    progress.value = 0
    currentTime.value = 0
  } else {
    currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.length
  }
}

function playShuffleNext() {
  if (shuffleOrder.value.length === 0) buildShuffleOrder()
  currentTrackIndex.value = shuffleOrder.value.pop() ?? 0
}

function buildShuffleOrder() {
  const indices = tracks.map((_, i) => i).filter(i => i !== currentTrackIndex.value)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = indices[i]!
    indices[i] = indices[j]!
    indices[j] = tmp
  }
  shuffleOrder.value = indices
}

function seek(e: MouseEvent) {
  if (!audioRef.value || !progressBarRef.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
  const pct = x / rect.width
  audioRef.value.currentTime = pct * audioRef.value.duration
  progress.value = pct * 100
}

function startSeeking(e: MouseEvent) {
  isSeeking.value = true
  seek(e)
  const onMove = (ev: MouseEvent) => seek(ev)
  const onUp = () => {
    isSeeking.value = false
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

function setVolume(e: MouseEvent) {
  if (!volumeBarRef.value) return
  const rect = volumeBarRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
  volume.value = x / rect.width
  if (isMuted.value && volume.value > 0) isMuted.value = false
}

function startVolumeChange(e: MouseEvent) {
  isChangingVolume.value = true
  setVolume(e)
  const onMove = (ev: MouseEvent) => setVolume(ev)
  const onUp = () => {
    isChangingVolume.value = false
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
}

function playTrack(index: number) {
  currentTrackIndex.value = index
  selectedIndex.value = index
  isPlaying.value = true
}

function playAll() {
  currentTrackIndex.value = 0
  selectedIndex.value = 0
  isPlaying.value = true
}

function nextTrack() {
  if (shuffleOn.value) {
    playShuffleNext()
  } else {
    currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.length
  }
  isPlaying.value = true
}

function prevTrack() {
  if (currentTime.value > 3 && audioRef.value) {
    audioRef.value.currentTime = 0
    return
  }
  currentTrackIndex.value = (currentTrackIndex.value - 1 + tracks.length) % tracks.length
  isPlaying.value = true
}

function toggleMute() {
  isMuted.value = !isMuted.value
}

function toggleShuffle() {
  shuffleOn.value = !shuffleOn.value
  if (shuffleOn.value) buildShuffleOrder()
}

function cycleRepeat() {
  const modes: Array<'none' | 'all' | 'one'> = ['none', 'all', 'one']
  const idx = modes.indexOf(repeatMode.value)
  repeatMode.value = modes[(idx + 1) % modes.length] ?? 'none'
}

function handleKeydown(e: KeyboardEvent) {
  if (e.code === 'Space') {
    e.preventDefault()
    togglePlay()
  } else if (e.code === 'ArrowRight') {
    e.preventDefault()
    nextTrack()
  } else if (e.code === 'ArrowLeft') {
    e.preventDefault()
    prevTrack()
  } else if (e.code === 'ArrowUp') {
    e.preventDefault()
    volume.value = Math.min(1, volume.value + 0.05)
    if (isMuted.value) isMuted.value = false
  } else if (e.code === 'ArrowDown') {
    e.preventDefault()
    volume.value = Math.max(0, volume.value - 0.05)
  }
}

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
})
</script>

<style scoped>
.audio-player {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #111;
  color: white;
  font-family: 'Segoe UI', sans-serif;
  user-select: none;
  outline: none;
}

.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 200px;
  background: #181818;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: #ccc;
  transition: background 0.1s, color 0.1s;
  font-size: 13px;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }

  &.active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-left: 4px solid var(--accent);
    padding-left: 12px;
  }
}

.spacer {
  flex: 1;
}

/* Content */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  overflow-y: auto;
}

.content-header {
  margin-bottom: 16px;

  h1 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 16px;
  }
}

.play-all-btn {
  background: var(--accent);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.15s, transform 0.1s;

  &:hover {
    background: var(--accent-dark, #1d6ac4);
    transform: scale(1.03);
  }

  &:active {
    transform: scale(0.98);
  }
}

/* Track list header */
.track-list-header {
  display: flex;
  align-items: center;
  padding: 4px 12px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 4px;
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.track-list {
  display: flex;
  flex-direction: column;
}

.track-row {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  color: #ccc;
  cursor: default;
  transition: background 0.1s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);

    .track-num {
      display: none;
    }

    .track-num::after {
      content: '';
    }
  }

  &.selected {
    background: rgba(255, 255, 255, 0.07);
  }

  &.active {
    color: var(--accent);
    background: rgba(255, 255, 255, 0.08);

    .track-title {
      color: var(--accent);
    }
  }
}

.track-status {
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-size: 12px;
  color: #888;
}

.paused-icon {
  font-size: 14px;
  opacity: 0.6;
}

/* Equalizer animation */
.equalizer {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;

  span {
    width: 3px;
    background: var(--accent);
    border-radius: 1px;
    animation: eq-bar 0.6s ease-in-out infinite alternate;

    &:nth-child(1) { animation-duration: 0.5s; height: 6px; }
    &:nth-child(2) { animation-duration: 0.7s; height: 10px; animation-delay: 0.1s; }
    &:nth-child(3) { animation-duration: 0.4s; height: 8px; animation-delay: 0.2s; }
  }
}

@keyframes eq-bar {
  from { transform: scaleY(0.4); }
  to   { transform: scaleY(1); }
}

.track-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.track-title {
  color: white;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artist {
  font-size: 12px;
  opacity: 0.6;
}

.track-album {
  width: 180px;
  font-size: 12px;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-duration {
  width: 48px;
  text-align: right;
  font-size: 12px;
  color: #888;
}

/* Player Controls */
.player-controls {
  height: 84px;
  background: #202020;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
}

.now-playing {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 220px;
  flex-shrink: 0;
}

.album-art {
  width: 48px;
  height: 48px;
  background: #2a2a2a;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: var(--accent);
  transition: box-shadow 0.3s;
  flex-shrink: 0;

  &.spinning {
    box-shadow: 0 0 12px rgba(var(--accent-rgb, 30, 100, 200), 0.4);
  }
}

.current-info {
  overflow: hidden;
}

.current-title {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.current-artist {
  font-size: 11px;
  opacity: 0.6;
  margin-top: 2px;
}

/* Playback controls */
.playback-controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.p-btn {
  color: #aaa;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  transition: color 0.1s, background 0.1s, transform 0.1s;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.08);
  }

  &:active {
    transform: scale(0.9);
  }

  &.play-btn {
    width: 38px;
    height: 38px;
    background: white;
    color: black;
    font-size: 20px;

    &:hover {
      transform: scale(1.06);
      background: #e0e0e0;
    }

    &:active {
      transform: scale(0.97);
    }
  }

  &.is-active-mode {
    color: var(--accent);

    &:hover {
      color: var(--accent);
    }
  }
}

/* Progress bar */
.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 520px;
}

.time-label {
  font-size: 11px;
  color: #888;
  min-width: 32px;
  text-align: center;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #3a3a3a;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  transition: height 0.15s;

  &:hover {
    height: 6px;

    .progress-thumb {
      opacity: 1;
    }
  }
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: var(--accent);
  border-radius: 2px;
  pointer-events: none;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.15s;
  pointer-events: none;
}

/* Volume controls */
.volume-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 140px;
  flex-shrink: 0;
}

.volume-bar {
  flex: 1;
  height: 4px;
  background: #3a3a3a;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  transition: height 0.15s;

  &:hover {
    height: 6px;

    .volume-thumb {
      opacity: 1;
    }
  }
}

.volume-fill {
  background: #ccc;
  height: 100%;
  border-radius: 2px;
  pointer-events: none;
}

.volume-thumb {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.15s;
  pointer-events: none;
}
</style>
