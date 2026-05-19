<script setup>
import { formattedNumberInputSnackFiles } from '../.vitepress/theme/snackFiles';
</script>

# Expo Snack

This page embeds a live [Expo Snack](https://snack.expo.dev/) demo of `formatted-number-input`.

The embedded Snack loads its demo app and library source files from this GitHub Pages site under `/formatted-number-input/snack-src/`. That keeps the Snack aligned with the deployed site without requiring an npm publish.

<SnackEmbed
  :files="formattedNumberInputSnackFiles"
  description="Live Expo Snack demo for formatted-number-input, built from local source files."
  height="760px"
  name="formatted-number-input"
  platform="web"
  sdk-version="54.0.0"
  supported-platforms="mydevice,ios,android,web"
/>

## Notes

- The default preview opens on `web` so the demo renders immediately inside the docs page.
- Inside Snack, you can switch to `iOS`, `Android`, or `My Device`.
- The deployed docs host the source files that Snack fetches at runtime from the same GitHub Pages domain.
