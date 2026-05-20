import { useMemo } from 'react';

type SnackFile =
  | {
      type: 'CODE' | 'ASSET';
      contents?: string;
      url?: string;
      publicPath?: string;
    }
  | Record<string, unknown>;

function withPublicUrls(files: Record<string, SnackFile>) {
  const next: Record<string, unknown> = {};

  for (const [filename, fileDef] of Object.entries(files)) {
    if (
      fileDef &&
      typeof fileDef === 'object' &&
      'publicPath' in fileDef &&
      typeof fileDef.publicPath === 'string'
    ) {
      next[filename] = {
        ...fileDef,
        url: `${window.location.origin}${import.meta.env.BASE_URL}${fileDef.publicPath.replace(/^\//, '')}`,
      };
      delete (next[filename] as { publicPath?: string }).publicPath;
      continue;
    }

    next[filename] = fileDef;
  }

  return next;
}

export default function SnackEmbed({
  code = '',
  dependencies = '',
  description = '',
  files = {},
  height = '720px',
  name = 'formatted-number-input demo',
  platform = 'web',
  sdkVersion = '54.0.0',
  supportedPlatforms = 'mydevice,ios,android,web',
  theme = 'light',
}: {
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
}) {
  const embeddedUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (Object.keys(files).length > 0) {
      params.set('files', JSON.stringify(withPublicUrls(files)));
    } else if (code) {
      params.set('code', code);
    }

    if (dependencies) params.set('dependencies', dependencies);
    if (description) params.set('description', description);

    params.set('name', name);
    params.set('platform', platform);
    params.set('preview', 'true');
    params.set('sdkVersion', sdkVersion);
    params.set('supportedPlatforms', supportedPlatforms);
    params.set('theme', theme);
    params.set('hideQueryParams', 'true');

    return `https://snack.expo.dev/embedded?${params.toString()}`;
  }, [
    code,
    dependencies,
    description,
    files,
    name,
    platform,
    sdkVersion,
    supportedPlatforms,
    theme,
  ]);

  const snackUrl = embeddedUrl.replace('/embedded?', '?');

  return (
    <div className="snack-embed">
      <iframe
        src={embeddedUrl}
        title={name}
        className="snack-embed__frame"
        style={{ height }}
        allow="clipboard-read; clipboard-write; geolocation; camera; microphone; screen-wake-lock"
        loading="lazy"
      />

      <div className="snack-embed__footer">
        <a href={snackUrl} target="_blank" rel="noreferrer">
          Open full Snack
        </a>
        <span>Powered by Expo Snack</span>
      </div>
    </div>
  );
}
