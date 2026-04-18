import { useState } from 'react'
import Badge from '../UI/Badge'
import ImagePlaceholder from '../UI/ImagePlaceholder'
import { isOpenNow } from '../../lib/time'

const TYPE_LABELS = {
  installazione: 'Installazione',
  mostra: 'Mostra',
  brand_experience: 'Brand',
  evento: 'Evento',
}

export default function InstallationCard({ installation, onClick }) {
  const [imgError, setImgError] = useState(false)
  const open = isOpenNow(installation.hours)

  return (
    <button
      onClick={() => onClick(installation)}
      style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'block' }}
    >
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'border-color 0.15s',
      }}>
        {/* Image */}
        <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
          {imgError ? (
            <ImagePlaceholder name={installation.name} brand={installation.brand} highlight={installation.highlight} />
          ) : (
            <img
              src={installation.image}
              alt={installation.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImgError(true)}
            />
          )}
          {installation.highlight && (
            <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
              <Badge variant="highlight">Da non perdere</Badge>
            </div>
          )}
          <div style={{
            position: 'absolute', bottom: '8px', left: '8px',
            display: 'flex', alignItems: 'center', gap: '5px',
            backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: '999px', padding: '3px 8px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: open ? '#22c55e' : '#888', flexShrink: 0 }} />
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#fff', letterSpacing: '0.03em' }}>
              {open ? 'Aperto' : 'Chiuso'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '12px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <Badge variant="zone">{installation.zone}</Badge>
            <Badge variant="type">{TYPE_LABELS[installation.type] || installation.type}</Badge>
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px 0', lineHeight: 1.3 }}>
            {installation.name}
          </h3>
          <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--cyan)', margin: '0 0 6px 0' }}>
            {installation.brand}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {installation.description}
          </p>
        </div>
      </div>
    </button>
  )
}
