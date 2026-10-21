import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'io.github.ershrey.typequest',
  appName: 'TypeQuest',
  webDir: 'dist',
  backgroundColor: '#0b1033',
  android: {
    // Physical keyboards are the whole point; never let the WebView pop up the on-screen one.
    captureInput: false,
  },
}

export default config
