<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useWindows} from '~/composables/useWindows'

const {stopBsod} = useWindows()
const percentage = ref(0)

onMounted(() => {
  const interval = setInterval(() => {
    percentage.value += Math.floor(Math.random() * 15) + 5
    if (percentage.value >= 100) {
      percentage.value = 100
      clearInterval(interval)
      setTimeout(() => {
        stopBsod()
      }, 1000)
    }
  }, 400)
})
</script>

<template>
  <div class="bsod-fullscreen">
    <div class="bsod-content">
      <div class="bsod-icon">:(</div>
      <h1>Your PC ran into a problem and needs to restart.</h1>
      <p>We're just collecting some error info, and then we'll restart for you.</p>
      <p class="percentage">{{ percentage }}% complete</p>
      <div class="bsod-footer">
        <p>For more information about this issue and possible fixes, visit https://www.windows.com/stopcode</p>
        <p>If you call a support person, give them this info:</p>
        <p>Stop code: CRITICAL_PROCESS_DIED</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bsod-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #0078d7;
  color: white;
  z-index: 999999;
  padding: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  .bsod-content {
    max-width: 800px;
    width: 100%;
  }

  .bsod-icon {
    font-size: 120px;
    margin-bottom: 20px;
  }

  h1 {
    font-size: 32px;
    font-weight: 300;
    margin-bottom: 20px;
    line-height: 1.2;
  }

  p {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .percentage {
    font-size: 24px;
    margin: 40px 0;
  }

  .bsod-footer {
    margin-top: 40px;

    p {
      font-size: 14px;
      opacity: 0.8;
      margin-bottom: 4px;
    }
  }
}
</style>
