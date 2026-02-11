# CLAUDE.md — AI Agent Instructions

## Project overview

Monorepo for `@rn-number-input/core`, a React Native-compatible number input component. See `README.md` for usage and architecture.

## Common commands

```bash
npm install                # install dependencies
npm run dev:web            # start Vite dev server (web playground)
npm run dev:docs           # start VitePress docs (localhost)
npm run build:docs         # build docs for GitHub Pages
npm run deploy:docs        # deploy docs to gh-pages branch
npx expo start             # start Expo dev server (apps/expo)
npm run lint               # lint (from packages/core)
npm test                   # run tests
```

## iOS Simulator accessibility testing

AI agents (Claude Code, Cursor, etc.) can read and interact with the running iOS Simulator app using macOS Accessibility APIs. This enables programmatic verification of UI state — reading input values, labels, and element roles — without relying solely on screenshots.

### One-time setup (human developer)

1. **Xcode command line tools** must be installed (`xcode-select --install`).

2. **Grant Accessibility permission** to whichever app runs the AI agent:
   - Open **System Settings > Privacy & Security > Accessibility**
   - Click **+** and add the relevant app:
     - **Claude Code (via Claude Desktop):** Add `Claude.app`. You may also need to add the `claude` CLI binary — press Cmd+Shift+G and navigate to `~/Library/Application Support/Claude/claude-code/<version>/claude`. It may appear merged with the Claude.app entry rather than as a separate item; that is fine.
     - **Terminal / iTerm2:** Add your terminal app.
     - **VS Code / Cursor:** Add the editor app.
   - Toggle the permission **on**.
   - You can verify it worked by running: `swift scripts/sim-ax-tree.swift`

3. **Boot a Simulator** with the Expo dev build running.

### Agent usage

#### Reading the accessibility tree

```bash
# Dump the full accessibility tree of the Simulator app
swift scripts/sim-ax-tree.swift

# Limit tree depth (e.g. depth 4)
swift scripts/sim-ax-tree.swift 4
```

This outputs every element with its role, title, value, and accessibility description. Example:

```
[AXGroup]
  [AXStaticText] desc="No rounding"
  [AXTextField] value="123.48"
  [AXStaticText] desc="Value: 123.48"
```

#### Taking screenshots

```bash
xcrun simctl io booted screenshot /tmp/sim_screenshot.png
```

Then read the screenshot file to visually inspect the UI.

#### Interacting with the Simulator

```bash
# Tap at coordinates (x, y) on the simulator screen
xcrun simctl io booted tap <x> <y>

# Send keyboard input to the focused element
xcrun simctl io booted input text "12345"

# Open a deep link / URL in the simulator
xcrun simctl openurl booted "exp://127.0.0.1:8081"

# List booted devices
xcrun simctl list devices booted
```

#### Workflow for testing changes

1. Make code changes to `packages/core/src/`.
2. The Expo dev server hot-reloads automatically.
3. Run `swift scripts/sim-ax-tree.swift` to read the updated accessibility tree.
4. Take a screenshot with `xcrun simctl io booted screenshot /tmp/sim_screenshot.png` for visual verification.
5. Compare accessibility values against expected results.

### Troubleshooting

- **`AXIsProcessTrusted()` returns `false`:** The running process does not have Accessibility permission. See "One-time setup" above.
- **`No booted iOS Simulator found`:** Launch a simulator with `xcrun simctl boot <device-id>` or open Simulator.app.
- **Tree shows Simulator chrome but no app content:** The app may not be running or may still be loading. Wait for hot-reload or relaunch the app.
- **Permission changes don't take effect:** You may need to restart the AI agent / terminal after granting Accessibility permission.
