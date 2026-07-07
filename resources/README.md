# App icon & splash source assets

`@capacitor/assets` generates every iOS icon/splash size from the source images in this folder.

## Files

- `icon.png` — **1024×1024**, square, no transparency, no rounded corners (iOS applies its own mask). This is the only required file.
- `splash.png` — optional, **2732×2732**, artwork centered (edges get cropped on narrow devices).
- `splash-dark.png` — optional dark-mode splash, same size.

## Regenerate

```sh
npm run assets:generate
```

This writes into `ios/App/App/Assets.xcassets/`. Commit the generated files, then `npm run ios:sync`.
