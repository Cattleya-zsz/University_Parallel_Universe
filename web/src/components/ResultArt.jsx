import { useEffect, useState } from 'react'
import { getResultArtAsset, RESULT_ART_TYPES } from '../data/resultArtAssets.js'

function ResultArt({ major, profile }) {
  const typeKey = profile?.dominantKey || 'study'
  const artAsset = getResultArtAsset(major?.id, typeKey)
  const typeMeta = RESULT_ART_TYPES.find((type) => type.key === typeKey) || RESULT_ART_TYPES[0]
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [artAsset.src])

  return (
    <section className="result-art-card" style={{ '--major-color': major?.color || '#6366f1' }}>
      <div className="result-art-copy">
        <span className="result-art-kicker">{major?.name || '专业'} · {typeMeta.label}</span>
        <h2 className="result-art-title">{profile?.title || '你的专业画像'}</h2>
        <p className="result-art-description">{profile?.description || typeMeta.description}</p>
        {profile?.advice && (
          <p className="result-art-advice">{profile.advice}</p>
        )}
      </div>

      <div className={`result-art-frame ${imageFailed ? 'is-empty' : ''}`}>
        {!imageFailed && (
          <img
            src={artAsset.src}
            alt={artAsset.alt}
            className="result-art-image"
            onError={() => setImageFailed(true)}
          />
        )}
        {imageFailed && (
          <div className="result-art-placeholder">
            <span>{typeMeta.label}</span>
            <small>{artAsset.src}</small>
          </div>
        )}
      </div>
    </section>
  )
}

export default ResultArt
