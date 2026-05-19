<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import DocsWebDemo from '../../../../web/src/DocsWebDemo';

const host = ref<HTMLElement | null>(null);
let root: Root | null = null;

onMounted(() => {
  if (!host.value) return;

  root = createRoot(host.value);
  root.render(createElement(DocsWebDemo));
});

onBeforeUnmount(() => {
  root?.unmount();
  root = null;
});
</script>

<template>
  <div class="web-demo-mount">
    <div ref="host" />
  </div>
</template>

<style scoped>
.web-demo-mount {
  margin: 20px 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background:
    radial-gradient(circle at top, rgba(34, 197, 94, 0.14), transparent 30%),
    linear-gradient(180deg, #020617 0%, #111827 100%);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
  overflow: hidden;
}
</style>
