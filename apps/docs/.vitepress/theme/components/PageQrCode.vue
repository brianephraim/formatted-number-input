<script setup lang="ts">
import { onMounted, ref } from 'vue';
import QRCode from 'qrcode';

const qrSvg = ref('');
const pageUrl = ref('');
const hasError = ref(false);

onMounted(async () => {
  pageUrl.value = `${window.location.origin}${window.location.pathname}`;

  try {
    qrSvg.value = await QRCode.toString(pageUrl.value, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 192,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch {
    hasError.value = true;
  }
});
</script>

<template>
  <div class="page-qr-code">
    <div class="page-qr-code__card">
      <div v-if="qrSvg" class="page-qr-code__svg" v-html="qrSvg" />
      <div v-else class="page-qr-code__placeholder">
        {{ hasError ? 'QR unavailable' : 'Generating QR…' }}
      </div>
    </div>

    <div class="page-qr-code__content">
      <p class="page-qr-code__eyebrow">Mobile Test</p>
      <h3 class="page-qr-code__title">Open this demo on your phone</h3>
      <p class="page-qr-code__body">
        Scan this QR code from your desktop screen to open the same GitHub Pages web demo on mobile.
      </p>
      <a v-if="pageUrl" :href="pageUrl">{{ pageUrl }}</a>
    </div>
  </div>
</template>

<style scoped>
.page-qr-code {
  display: grid;
  grid-template-columns: 192px minmax(0, 1fr);
  gap: 20px;
  align-items: center;
  margin: 20px 0 24px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
}

.page-qr-code__card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 192px;
  padding: 12px;
  border-radius: 16px;
  background: #ffffff;
}

.page-qr-code__svg :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
}

.page-qr-code__placeholder {
  color: #475569;
  font-size: 0.95rem;
}

.page-qr-code__eyebrow {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}

.page-qr-code__title {
  margin: 0 0 8px;
  font-size: 1.15rem;
}

.page-qr-code__body {
  margin: 0 0 10px;
  color: var(--vp-c-text-2);
}

.page-qr-code__content a {
  overflow-wrap: anywhere;
  font-size: 0.95rem;
}

@media (max-width: 720px) {
  .page-qr-code {
    grid-template-columns: 1fr;
  }

  .page-qr-code__card {
    max-width: 216px;
  }
}
</style>
