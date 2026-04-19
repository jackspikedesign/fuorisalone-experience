import { useState } from 'react'
import { useInstallations } from '../../hooks/useInstallations'
import { APP_CONFIG } from '../../config/app.config'
import { isOpenNow } from '../../lib/time'

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function RouteCard({ route, onSelect }) {
  const isNight = route.id === 'notte'
  return (
    <button
      onClick={() => onSelect(route.id)}
      style={{
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '4px',
        padding: '12px 14px',
        borderRadius: '12px',
        border: `1.5px solid ${isNight ? 'rgba(255,0,110,0.3)' : 'rgba(0,128,201,0.25)'}`,
        backgroundColor: isNight ? 'rgba(255,0,110,0.07)' : 'rgba(0,128,201,0.07)',
        cursor: 'pointer',
        textAlign: 'left',
        minWidth: '120px',
        transition: 'all 0.15s',
      }}
    >
      <span style={{ fontSize: '20px', lineHeight: 1 }}>{route.emoji}</span>
      <span style={{
        fontSize: '12px',
        fontWeight: 700,
        fontFamily: 'Montserrat, sans-serif',
        color: isNight ? 'var(--fucsia)' : 'var(--cyan)',
        lineHeight: 1.2,
      }}>
        {route.label}
      </span>
      <span style={{
        fontSize: '10px',
        fontWeight: 400,
        fontFamily: 'Montserrat, sans-serif',
        color: 'var(--text-secondary)',
        lineHeight: 1.3,
      }}>
        {route.description}
      </span>
    </button>
  )
}

function HighlightCard({ installation, onSelect }) {
  const [imgError, setImgError] = useState(false)
  const open = isOpenNow(installation.hours)

  return (
    <button
      onClick={() => onSelect(installation)}
      style={{
        flex: '0 0 220px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        cursor: 'pointer',
        textAlign: 'left',
        position: 'relative',
      }}
    >
      {/* Image */}
      <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
        {imgError ? (
          <div style={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, #141414 0%, #1e1e1e 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '28px' }}>{installation.setting === 'outdoor' ? '🌆' : '🏛'}</span>
          </div>
        ) : (
          <img
            src={installation.image}
            alt={installation.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setImgError(true)}
          />
        )}
        {/* Open badge */}
        <div style={{
          position: 'absolute', bottom: '6px', left: '8px',
          display: 'flex', alignItems: 'center', gap: '4px',
          backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '999px', padding: '3px 8px',
        }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: open ? '#22c55e' : '#888' }} />
          <span style={{ fontSize: '9px', fontWeight: 600, color: '#fff' }}>{open ? 'Aperto' : 'Chiuso'}</span>
        </div>
      </div>
      {/* Text */}
      <div style={{ padding: '8px 10px' }}>
        <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px', lineHeight: 1.3 }}>
          {installation.name}
        </p>
        <p style={{ fontSize: '10px', fontWeight: 500, color: 'var(--cyan)', margin: 0 }}>
          {installation.artist_studio}
        </p>
        {installation.night_note && (
          <p style={{ fontSize: '9px', color: 'var(--fucsia)', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '3px' }}>
            🌙 <span>Fantastica di notte</span>
          </p>
        )}
      </div>
    </button>
  )
}

function NearbyRow({ installation, distance, onSelect }) {
  const open = isOpenNow(installation.hours)
  return (
    <button
      onClick={() => onSelect(installation)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        textAlign: 'left',
        background: 'none',
        border: 'none',
        padding: '10px 0',
        cursor: 'pointer',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
        backgroundColor: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px',
      }}>
        {installation.setting === 'outdoor' ? '🌆' : '🏛'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {installation.name}
        </p>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
          {installation.zone}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--cyan)' }}>
          {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}
        </span>
        <span style={{ fontSize: '10px', color: open ? '#22c55e' : 'var(--text-secondary)' }}>
          {open ? 'Aperto' : 'Chiuso'}
        </span>
      </div>
    </button>
  )
}

export default function HomeView({ onSelect, onSelectRoute, userPos }) {
  const { installations, highlights } = useInstallations()

  const nearby = userPos
    ? installations
        .map(i => ({ ...i, _dist: haversineKm(userPos.lat, userPos.lng, i.lat, i.lng) }))
        .sort((a, b) => a._dist - b._dist)
        .slice(0, 3)
    : []

  const today = new Date()
  const hour = today.getHours()
  const isNightTime = hour >= 19 || hour < 6

  return (
    <div style={{ height: '100%', overflowY: 'auto', backgroundColor: 'var(--bg)' }}>

      {/* Hero banner */}
      <div style={{
        margin: '16px 16px 0',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0080C9 0%, #005fa3 50%, #003d6b 100%)',
        padding: '20px 20px 18px',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '140px', height: '100%',
          background: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', margin: '0 0 4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Milano Design Week 2026
        </p>
        <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: '0 0 6px', lineHeight: 1.2, fontFamily: 'Montserrat, sans-serif' }}>
          Arte gratuita<br />in tutta Milano
        </p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.5 }}>
          {installations.length} installazioni esterne e cortili aperti · 20–26 aprile
        </p>
        {isNightTime && (
          <div style={{
            marginTop: '10px',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            backgroundColor: 'rgba(255,0,110,0.2)', borderRadius: '999px',
            padding: '4px 10px', border: '1px solid rgba(255,0,110,0.4)',
          }}>
            <span style={{ fontSize: '12px' }}>🌙</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#FF006E' }}>
              Stasera è perfetto per il percorso notturno
            </span>
          </div>
        )}
      </div>

      {/* Percorsi section */}
      <div style={{ padding: '20px 16px 0' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 12px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Quanto tempo hai?
        </p>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
          {APP_CONFIG.routes.map(route => (
            <RouteCard key={route.id} route={route} onSelect={onSelectRoute} />
          ))}
        </div>
      </div>

      {/* Highlights section */}
      {highlights.length > 0 && (
        <div style={{ padding: '20px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', margin: 0, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              ★ Da non perdere
            </p>
            <span style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 600 }}>
              {highlights.length} installazioni
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', scrollbarWidth: 'none', padding: '0 16px 4px' }}>
            {highlights.map(inst => (
              <HighlightCard key={inst.id} installation={inst} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}

      {/* Nearby section */}
      {nearby.length > 0 && (
        <div style={{ padding: '20px 16px 0' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 4px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            📍 Vicino a te
          </p>
          <div>
            {nearby.map(inst => (
              <NearbyRow key={inst.id} installation={inst} distance={inst._dist} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}

      {/* Bottom padding for tab bar */}
      <div style={{ height: '80px' }} />
    </div>
  )
}
