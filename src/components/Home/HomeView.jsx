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

const ROUTE_CONFIG = {
  // Blu mattina — brand primario, fresco, immediato
  '30min': {
    bg: 'linear-gradient(145deg, #0089d6 0%, #0068a8 100%)',
    shadow: 'rgba(0,104,168,0.3)',
    label: '#fff',
    desc: 'rgba(255,255,255,0.68)',
    iconStroke: 'rgba(255,255,255,0.9)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  // Verde smeraldo — pausa nel verde, aria aperta, pranzo fuori
  pausa: {
    bg: 'linear-gradient(145deg, #12b886 0%, #099268 100%)',
    shadow: 'rgba(9,146,104,0.3)',
    label: '#fff',
    desc: 'rgba(255,255,255,0.68)',
    iconStroke: 'rgba(255,255,255,0.9)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <polyline points="12 7 12 12 15.5 14"/>
      </svg>
    ),
  },
  // Arancio bruciato — calore del pomeriggio milanese, terracotta, mattoni
  mezza: {
    bg: 'linear-gradient(145deg, #f76707 0%, #d9480f 100%)',
    shadow: 'rgba(217,72,15,0.3)',
    label: '#fff',
    desc: 'rgba(255,255,255,0.68)',
    iconStroke: 'rgba(255,255,255,0.9)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <line x1="12" y1="2" x2="12" y2="5"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
        <line x1="2" y1="12" x2="5" y2="12"/>
        <line x1="19" y1="12" x2="22" y2="12"/>
        <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
        <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
      </svg>
    ),
  },
  // Giallo vivo — design è luce, massima energia, testo scuro per contrasto
  full: {
    bg: 'linear-gradient(145deg, #ffd43b 0%, #fcc419 100%)',
    shadow: 'rgba(252,196,25,0.35)',
    label: '#2c1a00',
    desc: 'rgba(44,26,0,0.58)',
    iconStroke: 'rgba(44,26,0,0.75)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(44,26,0,0.75)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  // Notte: viola profondo + fucsia — ora magica, design è anche buio
  notte: {
    bg: 'linear-gradient(145deg, #1c1028 0%, #2e1250 100%)',
    shadow: 'rgba(255,0,110,0.22)',
    label: '#FF006E',
    desc: 'rgba(255,255,255,0.42)',
    iconStroke: '#FF006E',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(255,0,110,0.2)" stroke="#FF006E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
  },
}

function RouteCard({ route, fullWidth, onSelect }) {
  const cfg = ROUTE_CONFIG[route.id] || ROUTE_CONFIG['full']

  return (
    <button
      onClick={() => onSelect(route.id)}
      style={{
        display: 'flex',
        flexDirection: fullWidth ? 'row' : 'column',
        alignItems: fullWidth ? 'center' : 'flex-start',
        justifyContent: 'space-between',
        gap: fullWidth ? '14px' : '10px',
        padding: fullWidth ? '18px 20px' : '18px 16px',
        borderRadius: '16px',
        background: cfg.bg,
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: `0 4px 18px ${cfg.shadow}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{ flexShrink: 0 }}>{cfg.icon}</div>

      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: fullWidth ? '17px' : '15px',
          fontWeight: 800,
          fontFamily: 'Montserrat, sans-serif',
          color: cfg.label,
          margin: '0 0 3px',
          lineHeight: 1.15,
        }}>
          {route.label}
        </p>
        <p style={{
          fontSize: '11px',
          color: cfg.desc,
          margin: 0,
          lineHeight: 1.4,
          fontFamily: 'Montserrat, sans-serif',
        }}>
          {route.description}
        </p>
      </div>

      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke={cfg.iconStroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0, opacity: 0.7 }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  )
}

function RouteGrid({ onSelectRoute }) {
  const main = APP_CONFIG.routes.filter(r => r.id !== 'notte')
  const night = APP_CONFIG.routes.find(r => r.id === 'notte')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {main.map(route => (
          <RouteCard key={route.id} route={route} fullWidth={false} onSelect={onSelectRoute} />
        ))}
      </div>
      {night && <RouteCard route={night} fullWidth={true} onSelect={onSelectRoute} />}
    </div>
  )
}

function HighlightCard({ installation, onSelect }) {
  const [imgError, setImgError] = useState(false)
  const open = isOpenNow(installation.hours)

  return (
    <button
      onClick={() => onSelect(installation)}
      style={{
        flex: '0 0 200px',
        borderRadius: '14px',
        overflow: 'hidden',
        backgroundColor: 'var(--surface)',
        cursor: 'pointer',
        textAlign: 'left',
        position: 'relative',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ width: '100%', aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
        {imgError ? (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        ) : (
          <img
            src={installation.image}
            alt={installation.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setImgError(true)}
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.65) 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '8px', left: '8px',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: open ? '#22c55e' : '#888', flexShrink: 0 }} />
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#fff', letterSpacing: '0.03em' }}>{open ? 'Aperto' : 'Chiuso'}</span>
        </div>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px', lineHeight: 1.3 }}>
          {installation.name}
        </p>
        <p style={{ fontSize: '10px', fontWeight: 600, color: 'var(--cyan)', margin: 0 }}>
          {installation.artist_studio}
        </p>
        {installation.night_note && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#FF006E">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span style={{ fontSize: '9px', color: 'var(--fucsia)', fontWeight: 600 }}>Fantastica di notte</span>
          </div>
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
        display: 'flex', alignItems: 'center', gap: '12px',
        width: '100%', textAlign: 'left', background: 'none',
        border: 'none', padding: '10px 0', cursor: 'pointer',
      }}
    >
      <div style={{
        width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
        background: 'linear-gradient(135deg, rgba(0,128,201,0.15) 0%, rgba(0,128,201,0.08) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {installation.setting === 'outdoor' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="1.8" strokeLinecap="round">
            <line x1="2" y1="22" x2="22" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>
          </svg>
        )}
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
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--cyan)' }}>
          {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}
        </span>
        <span style={{ fontSize: '10px', fontWeight: 600, color: open ? '#22c55e' : 'var(--text-secondary)' }}>
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

  return (
    <div style={{ height: '100%', overflowY: 'auto', backgroundColor: 'var(--bg)' }}>

      {/* Hero banner */}
      <div style={{
        margin: '12px 16px 0',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #0080C9 0%, #005fa3 50%, #003d6b 100%)',
        padding: '16px 18px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: '0 4px 20px rgba(0,80,150,0.25)',
      }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '100%', background: 'radial-gradient(circle at 80% 30%, rgba(255,255,255,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div>
          <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', margin: '0 0 3px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Milano Design Week 2026
          </p>
          <p style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2, fontFamily: 'Montserrat, sans-serif' }}>
            Arte gratuita<br />in tutta Milano
          </p>
        </div>
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <p style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Montserrat, sans-serif', lineHeight: 1 }}>
            {installations.length}
          </p>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', margin: '3px 0 0', lineHeight: 1.3, fontWeight: 500 }}>
            install.<br />20–26 apr
          </p>
        </div>
      </div>

      {/* Percorsi section */}
      <div style={{ padding: '18px 16px 0' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Quanto tempo hai?
        </p>
        {userPos ? (
          <RouteGrid onSelectRoute={onSelectRoute} />
        ) : (
          <div style={{
            padding: '20px 16px',
            borderRadius: '16px',
            background: 'var(--surface)',
            display: 'flex', alignItems: 'center', gap: '14px',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
              background: 'rgba(0,128,201,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Imposta la tua posizione per scoprire i percorsi vicino a te.
            </p>
          </div>
        )}
      </div>

      {/* Highlights section */}
      {highlights.length > 0 && (
        <div style={{ padding: '24px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Da non perdere
            </p>
            <span style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 700 }}>
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
        <div style={{ padding: '24px 16px 0' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Vicino a te
          </p>
          <div>
            {nearby.map((inst, idx) => (
              <div key={inst.id} style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--border)' }}>
                <NearbyRow installation={inst} distance={inst._dist} onSelect={onSelect} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ height: '80px' }} />
    </div>
  )
}
