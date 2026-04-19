import { useState } from 'react'
import { APP_CONFIG } from '../../config/app.config'

export default function PositionPicker({ simPos, onSelect }) {
  const [open, setOpen] = useState(false)
  const isSimulated = simPos !== null

  const activeLabel = isSimulated
    ? Object.entries(APP_CONFIG.zoneCoords).find(([, coords]) =>
        coords.lat === simPos.lat && coords.lng === simPos.lng
      )?.[0] ?? 'Personalizzato'
    : 'GPS reale'

  function handleSelect(coords) {
    onSelect(coords)
    setOpen(false)
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '5px 10px', borderRadius: '999px',
          border: `1px solid ${isSimulated ? 'rgba(255,0,110,0.4)' : 'var(--border)'}`,
          backgroundColor: isSimulated ? 'rgba(255,0,110,0.08)' : 'transparent',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '11px' }}>📍</span>
        <span style={{
          fontSize: '11px', fontWeight: 600,
          fontFamily: 'Montserrat, sans-serif',
          color: isSimulated ? '#FF006E' : 'var(--text-secondary)',
          maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {activeLabel}
        </span>
      </button>

      {/* Bottom sheet overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'flex-end',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '480px', margin: '0 auto',
              backgroundColor: 'var(--surface)',
              borderRadius: '20px 20px 0 0',
              padding: '0 0 32px',
              maxHeight: '70vh', overflowY: 'auto',
            }}
          >
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--border)' }} />
            </div>

            {/* Title */}
            <p style={{
              fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)',
              margin: '0 0 4px', padding: '0 16px',
            }}>
              Simula posizione
            </p>
            <p style={{
              fontSize: '11px', color: 'var(--text-secondary)',
              margin: '0 0 12px', padding: '0 16px', lineHeight: 1.4,
            }}>
              Scegli una zona di Milano per testare le rotte dinamiche.
            </p>

            {/* GPS reale option */}
            <button
              onClick={() => handleSelect(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                width: '100%', padding: '12px 16px',
                background: !isSimulated ? 'rgba(0,128,201,0.08)' : 'none',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: '20px' }}>📡</span>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--cyan)', margin: 0 }}>GPS reale</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '1px 0 0' }}>Usa la posizione del dispositivo</p>
              </div>
              {!isSimulated && (
                <span style={{ marginLeft: 'auto', fontSize: '14px', color: 'var(--cyan)' }}>✓</span>
              )}
            </button>

            {/* Zone list */}
            {Object.entries(APP_CONFIG.zoneCoords).map(([zoneName, coords]) => {
              const isActive = isSimulated && simPos?.lat === coords.lat && simPos?.lng === coords.lng
              return (
                <button
                  key={zoneName}
                  onClick={() => handleSelect(coords)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    width: '100%', padding: '12px 16px',
                    background: isActive ? 'rgba(255,0,110,0.06)' : 'none',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>📍</span>
                  <p style={{
                    fontSize: '13px', fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#FF006E' : 'var(--text-primary)',
                    margin: 0,
                  }}>
                    {zoneName}
                  </p>
                  {isActive && (
                    <span style={{ marginLeft: 'auto', fontSize: '14px', color: '#FF006E' }}>✓</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
