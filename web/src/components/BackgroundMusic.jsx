import { useEffect, useRef, useState } from 'react'

const MUSIC_SRC = '/audio/background-music.mp3'

function BackgroundMusic() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)

  const stopMusic = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    setIsPlaying(false)
  }

  const startMusic = async () => {
    const audio = audioRef.current
    if (!audio || !isAvailable) return

    audio.volume = 0.42

    try {
      await audio.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusic()
    } else {
      startMusic()
    }
  }

  useEffect(() => stopMusic, [])

  return (
    <>
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        loop
        preload="none"
        onError={() => {
          setIsAvailable(false)
          setIsPlaying(false)
        }}
      />
      <button
        type="button"
        className={`music-toggle ${isPlaying ? 'is-playing' : ''} ${!isAvailable ? 'is-missing' : ''}`}
        onClick={toggleMusic}
        disabled={!isAvailable}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? '关闭背景音乐' : '播放背景音乐'}
        title={isAvailable ? '背景音乐' : '未找到 /audio/background-music.mp3'}
      >
        <span className="music-bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{isAvailable ? (isPlaying ? '音乐开' : '音乐关') : '待放音乐'}</span>
      </button>
    </>
  )
}

export default BackgroundMusic
