import { APP_CONFIG } from '../../config/app.config'

const SETTING_LABELS = {
  outdoor: '🌆 Esterne',
  cortile: '🏛 Cortili',
}

const sectionLabel = {
  fontSize: '10px',
  fontWeight: 700,
  fontFamily: 'Montserrat, sans-serif',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
  lineHeight: 1,
}

export default function FilterBar({ filters, onChange }) {
  const { zone, setting, search, highlightOnly } = filters
  const hasActiveFilters = !!(zone || setting || highlightOnly)

  function resetFilters() {
    onChange({ ...filters, zone: undefined, setting: undefined, highlightOnly: false })
  }

  function chip(label, isActive, onClick, accentColor) {
    return (
      <button
        key={label}
        onClick={onClick}
        style={{
          flexShrink: 0,
          padding: '5px 13px',
          borderRadius: '999px',
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: 'Montserrat, sans-serif',
          letterSpacing: '0.03em',
          cursor: 'pointer',
          border: isActive ? 'none' : '1px solid var(--border)',
          backgroundColor: isActive ? (accentColor || 'var(--cyan)') : 'transparent',
          color: isActive ? '#fff' : 'var(--text-secondary)',
          transition: 'all 0.15s',
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>

      {/* Search bar */}
      <div style={{ padding: '10px 12px 10px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '8px 12px',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Cerca installazione o artista…"
            value={search || ''}
            onChange={e => onChange({ ...filters, search: e.target.value || undefined })}
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'Montserrat, sans-serif' }}
          />
          {search && (
            <button onClick={() => onChange({ ...filters, search: undefined })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0, lineHeight: 1 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Zone row */}
      <div style={{ padding: '0 12px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={sectionLabel}>Zona</span>
          {hasActiveFilters && (
            <button onClick={resetFilters} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', color: 'var(--cyan)', padding: 0 }}>
              Azzera filtri
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {APP_CONFIG.zones.map(z =>
            chip(z, zone === z, () => onChange({ ...filters, zone: zone === z ? undefined : z }))
          )}
        </div>
      </div>

      {/* Ambientazione + highlight */}
      <div style={{ padding: '0 12px 10px' }}>
        <div style={{ marginBottom: '6px' }}>
          <span style={sectionLabel}>Ambientazione</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {APP_CONFIG.settings.map(s =>
            chip(SETTING_LABELS[s], setting === s, () => onChange({ ...filters, setting: setting === s ? undefined : s }))
          )}
          <span style={{ flexShrink: 0, alignSelf: 'center', width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'var(--border)', margin: '0 2px' }} />
          <button
            onClick={() => onChange({ ...filters, highlightOnly: !highlightOnly })}
            style={{
              flexShrink: 0, padding: '5px 13px', borderRadius: '999px',
              fontSize: '11px', fontWeight: 700, fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '0.03em', cursor: 'pointer',
              border: highlightOnly ? 'none' : '1px solid var(--border)',
              backgroundColor: highlightOnly ? '#FF006E' : 'transparent',
              color: highlightOnly ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}
          >
            ★ Da non perdere
          </button>
        </div>
      </div>
    </div>
  )
}
