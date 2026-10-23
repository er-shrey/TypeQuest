import { App as NativeApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

/** True where a Quit button can actually close TypeQuest: the Android app or an installed web app. */
export function canCloseApp(): boolean {
  if (Capacitor.isNativePlatform()) return true
  return typeof window !== 'undefined' && window.matchMedia?.('(display-mode: fullscreen), (display-mode: standalone)').matches
}

/**
 * Closes TypeQuest. Resolves false when the browser refused, which happens in an
 * ordinary tab: pages can only close windows they opened.
 */
export async function closeApp(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    await NativeApp.exitApp()
    return true
  }
  window.close()
  await new Promise((r) => setTimeout(r, 300))
  return window.closed
}
