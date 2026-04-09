<template>
  <div class="pdf-viewer">
    <div class="pdf-toolbar">
      <div class="toolbar-left">
        <Icon class="pdf-icon" name="fluent:document-pdf-24-filled"/>
        <span aria-live="polite" class="file-name">Dossier_d'Enquête.pdf</span>
      </div>
      <div class="toolbar-right">
        <button class="tb-btn" title="Imprimer">
          <Icon name="fluent:print-24-regular"/>
        </button>
        <button class="tb-btn" title="Télécharger">
          <Icon name="fluent:save-24-regular"/>
        </button>
      </div>
    </div>
    <div class="pdf-content">
      <iframe
          class="pdf-iframe"
          frameborder="0"
          src="/doc/Dossier_interne.pdf"
      ></iframe>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Basic PDF Viewer using native browser capabilities
</script>

<style scoped>
.pdf-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #525659;
}

.pdf-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  background: #323639;
  padding: 0 16px;
  color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pdf-icon {
  font-size: 20px;
  color: #ff4d4d;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.tb-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #ccc;
  transition: background 0.1s, color 0.1s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
}

.pdf-content {
  flex: 1;
  overflow: hidden;
  background: #525659;
  display: flex;
  justify-content: center;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
