<template>
  <div v-if="isMobile" class="mobile-guard">
    <div class="content">
      <div class="icon">
        <Icon name="fluent:laptop-24-regular"/>
      </div>
      <h1>Expérience optimisée pour ordinateur</h1>
      <p>
        Ce portfolio interactif est conçu pour être exploré sur un écran d'ordinateur.
        Pour profiter de l'expérience complète (simulation Windows 10), veuillez l'ouvrir sur un bureau.
      </p>
      <div class="footer">
        35mm — Hugo Pinchemel
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const isMobile = ref(false)

const checkWidth = () => {
  isMobile.value = window.innerWidth < 1024
}

onMounted(() => {
  checkWidth()
  window.addEventListener('resize', checkWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkWidth)
})
</script>

<style lang="scss" scoped>
.mobile-guard {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #0d1b2e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  .content {
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .icon {
    font-size: 64px;
    color: #0078d4;
    margin-bottom: 10px;
  }

  h1 {
    font-size: 24px;
    font-weight: 300;
    margin: 0;
  }

  p {
    font-size: 16px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }

  .footer {
    margin-top: 20px;
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.4);
  }
}
</style>