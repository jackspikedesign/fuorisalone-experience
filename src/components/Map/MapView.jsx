import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { useInstallations } from '../../hooks/useInstallations'
import { createPinIcon } from './InstallationPin'
import UserLocation from './UserLocation'
import { APP_CONFIG } from '../../config/app.config'

const TILE_DARK  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

function RecenterOnFilter({ installations }) {
  const map = useMap()
  useEffect(() => {
    if (installations.length === 1) {
      map.setView([installations[0].lat, installations[0].lng], 16, { animate: true })
    } else if (installations.length > 1 && installations.length < 44) {
      const lats = installations.map(i => i.lat)
      const lngs = installations.map(i => i.lng)
      map.fitBounds(
        [[Math.min(...lats), Math.min(...lngs)], [Math.max(...lats), Math.max(...lngs)]],
        { padding: [40, 40], animate: true, maxZoom: 15 }
      )
    } else {
      map.setView([APP_CONFIG.centerMap.lat, APP_CONFIG.centerMap.lng], APP_CONFIG.zoomDefault, { animate: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installations])
  return null
}

function LocateButton() {
  const map = useMap()
  const [locating, setLocating] = useState(false)

  function handleLocate() {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        map.setView([coords.latitude, coords.longitude], 16, { animate: true })
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  return (
    <button
      onClick={handleLocate}
      style={{
        position: 'absolute',
        bottom: '60px',
        right: '16px',
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        color: locating ? 'var(--cyan)' : 'var(--text-secondary)',
        transition: 'color 0.2s',
      }}
      title="Mostra la mia posizione"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        <circle cx="12" cy="12" r="9" strokeOpacity="0.3" />
      </svg>
    </button>
  )
}

export default function MapView({ onSelect, theme }) {
  const [activeZone, setActiveZone] = useState(null)
  const filters = activeZone ? { zone: activeZone } : {}
  const { installations } = useInstallations(filters)
  const tileUrl = theme === 'light' ? TILE_LIGHT : TILE_DARK

  const zones = ['Tutti', ...APP_CONFIG.zones]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Filter chips */}
      <div style={{
        display: 'flex',
        gap: '6px',
        padding: '10px 12px',
        overflowX: 'auto',
        flexShrink: 0,
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        scrollbarWidth: 'none',
      }}>
        {zones.map(zone => {
          const isActive = zone === 'Tutti' ? !activeZone : activeZone === zone
          return (
            <button
              key={zone}
              onClick={() => setActiveZone(zone === 'Tutti' ? null : zone)}
              style={{
                flexShrink: 0,
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '0.03em',
                cursor: 'pointer',
                border: isActive ? 'none' : '1px solid var(--border)',
                backgroundColor: isActive ? 'var(--cyan)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}
            >
              {zone}
            </button>
          )
        })}
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={[APP_CONFIG.centerMap.lat, APP_CONFIG.centerMap.lng]}
          zoom={APP_CONFIG.zoomDefault}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            key={tileUrl}
            url={tileUrl}
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            maxZoom={19}
          />
          <RecenterOnFilter installations={installations} />
          <UserLocation />
          {installations.map(installation => (
            <Marker
              key={installation.id}
              position={[installation.lat, installation.lng]}
              icon={createPinIcon(installation.highlight)}
              eventHandlers={{ click: () => onSelect(installation) }}
            />
          ))}
          <LocateButton />
        </MapContainer>

        {/* Counter badge */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '999px',
          padding: '5px 12px',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          zIndex: 1000,
          pointerEvents: 'none',
        }}>
          {installations.length} installazioni
        </div>
      </div>
    </div>
  )
}
