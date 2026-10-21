// Builds the signed release APK and copies it to release/TypeQuest-<version>.apk.
//
//   npm run android:release

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const { version } = JSON.parse(readFileSync(`${ROOT}package.json`, 'utf8'))
const run = (cmd, args, cwd = ROOT) => execFileSync(cmd, args, { cwd, stdio: 'inherit' })

run('npm', ['run', 'build'])
run('npx', ['cap', 'sync', 'android'])
run('./gradlew', ['assembleRelease', '--console=plain'], `${ROOT}android`)

const built = `${ROOT}android/app/build/outputs/apk/release/app-release.apk`
const out = `${ROOT}release/TypeQuest-${version}.apk`
mkdirSync(`${ROOT}release`, { recursive: true })
copyFileSync(built, out)

const sha256 = createHash('sha256').update(readFileSync(out)).digest('hex')
console.log(`\nrelease/TypeQuest-${version}.apk\nSHA-256 ${sha256}`)
