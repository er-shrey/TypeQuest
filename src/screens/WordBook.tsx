import { useEffect } from 'react'
import { letterName, speak } from '../audio/speech'
import { HomeButton, Screen } from '../components/common'
import { displayWord, isKnown, LINES } from '../engine/words'
import type { Profile } from '../storage/store'

/** Every word met on the Word Train, with its picture. Tap to hear it spelled. */
export function WordBook({ profile, onHome }: { profile: Profile; onHome: () => void }) {
  const met = profile.train.words
  const count = Object.keys(met).length
  const known = Object.values(met).filter(isKnown).length

  useEffect(() => {
    speak(count ? `You have ${count} ${count === 1 ? 'word' : 'words'} in your book!` : 'Ride the Word Train to fill your book!')
  }, [count])

  const sayWord = (word: string, say?: string) => speak(`${[...word].map(letterName).join(', ')}. ${say ?? word.toLowerCase()}!`)

  return (
    <Screen className="collection word-book">
      <div className="game-top">
        <HomeButton onClick={onHome} />
      </div>
      <h1 className="title">My Words</h1>
      {count === 0 ? (
        <p className="more-galaxies">Ride the Word Train 🚂 to collect words!</p>
      ) : (
        <p className="word-book-summary">
          {count} {count === 1 ? 'word' : 'words'} · {known} known by heart ⭐
        </p>
      )}
      {LINES.map((line) => {
        const words = line.words.filter((x) => met[x.word])
        if (!words.length) return null
        return (
          <section key={line.id} className="galaxy">
            <h2 className="galaxy-title">{line.name} <small>{words.length} of {line.words.length}</small></h2>
            <div className="word-grid">
              {words.map((x) => (
                <button key={x.word} className={`word-card ${isKnown(met[x.word]) ? 'known' : ''}`} onClick={() => sayWord(x.word, x.say)}>
                  <span className="word-card-emoji" aria-hidden="true">{x.picture}</span>
                  <span className="word-card-word">{displayWord(x.word, profile.progress.caseStage)}</span>
                  {isKnown(met[x.word]) && <span className="word-card-star" aria-label="Known by heart">⭐</span>}
                </button>
              ))}
            </div>
          </section>
        )
      })}
    </Screen>
  )
}
