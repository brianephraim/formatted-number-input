<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

type SnackFile =
  | {
      type: 'CODE' | 'ASSET';
      contents?: string;
      url?: string;
      publicPath?: string;
    }
  | Record<string, unknown>;

const props = withDefaults(
  defineProps<{
    code?: string;
    dependencies?: string;
    description?: string;
    files?: Record<string, SnackFile>;
    height?: string;
    name?: string;
    platform?: string;
    sdkVersion?: string;
    supportedPlatforms?: string;
    theme?: string;
  }>(),
  {
    code: '',
    dependencies: '',
    description: '',
    files: () => ({}),
    height: '720px',
    name: 'formatted-number-input demo',
    platform: 'web',
    sdkVersion: '54.0.0',
    supportedPlatforms: 'mydevice,ios,android,web',
    theme: 'light',
  }
);

const baseUrl = 'https://snack.expo.dev';
const embeddedBaseUrl = `${baseUrl}/embedded`;
const siteOrigin = ref('');

onMounted(() => {
  siteOrigin.value = window.location.origin;
});

const resolvedFiles = computed(() => {
  const next: Record<string, unknown> = {};

  for (const [filename, fileDef] of Object.entries(props.files)) {
    if (
      fileDef &&
      typeof fileDef === 'object' &&
      'publicPath' in fileDef &&
      typeof fileDef.publicPath === 'string'
    ) {
      next[filename] = {
        ...fileDef,
        url: `${siteOrigin.value}${fileDef.publicPath}`,
      };
      delete (next[filename] as { publicPath?: string }).publicPath;
      continue;
    }

    next[filename] = fileDef;
  }

  return next;
});

const searchParams = computed(() => {
  const params = new URLSearchParams();

  if (Object.keys(props.files).length > 0 && siteOrigin.value) {
    params.set('files', JSON.stringify(resolvedFiles.value));
  } else if (props.code) {
    params.set('code', props.code);
  }
  if (props.dependencies) {
    params.set('dependencies', props.dependencies);
  }
  if (props.description) {
    params.set('description', props.description);
  }

  params.set('name', props.name);
  params.set('platform', props.platform);
  params.set('preview', 'true');
  params.set('sdkVersion', props.sdkVersion);
  params.set('supportedPlatforms', props.supportedPlatforms);
  params.set('theme', props.theme);
  params.set('hideQueryParams', 'true');

  return params.toString();
});

const embeddedUrl = computed(() => `${embeddedBaseUrl}?${searchParams.value}`);
const snackUrl = computed(() => `${baseUrl}?${searchParams.value}`);
</script>

<template>
  <div class="snack-embed">
    <iframe
      v-if="siteOrigin || !Object.keys(files).length"
      :src="embeddedUrl"
      :title="name"
      class="snack-embed__frame"
      :style="{ height }"
      allow="clipboard-read; clipboard-write; geolocation; camera; microphone; screen-wake-lock"
      loading="lazy"
    />
    <div v-else class="snack-embed__placeholder" :style="{ height }">
      Loading Snack...
    </div>

    <div class="snack-embed__footer">
      <a :href="snackUrl" target="_blank" rel="noreferrer">Open full Snack</a>
      <span>Powered by Expo Snack</span>
    </div>
  </div>
</template>

<style scoped>
.snack-embed {
  margin: 1.5rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.snack-embed__frame {
  display: block;
  width: 100%;
  border: 0;
  background: #fafafa;
}

.snack-embed__placeholder {
  display: grid;
  place-items: center;
  color: var(--vp-c-text-2);
  background: #fafafa;
}

.snack-embed__footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.snack-embed__footer a {
  font-weight: 600;
}

@media (max-width: 640px) {
  .snack-embed__footer {
    flex-direction: column;
  }
}
</style>
