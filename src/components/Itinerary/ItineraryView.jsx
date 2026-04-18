import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import { useInstallations } from '../../hooks/useInstallations'
import { APP_CONFIG } from '../../config/app.config'
import { isOpenNow, todayKey } from '../../lib/time'
import { divIcon } from 'leaflet'
import UserLocation from '../Map/UserLocation'

const TILE_DARK  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function walkTime(dist) {
  const mins = Math.round(dist / 4 * 60)
  return mins < 60 ? `~${mins} min` : `~${Math.round(mins / 60 * 10) / 10}h`
}

function createNumberIcon(n, isNight) {
  const bg = isNight ? '#FF006E' : APP_CONFIG.colors.cyan
  return divIcon({
    html: `<div style="width:26px;height:26px;border-radius:50%;background:${bg};color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:Montserrat,sans-serif;border:2.5px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.4)">${n}</div>`,
    className: '',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

function LocateButton() {
  const map = useMap()
  const [locating, setLocating] = useState(false)
  function handleLocate() {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { map.setView([coords.latitude, coords.longitude], 16, { animate: true }); setLocating(false) },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }
  return (
    <button onClick={handleLocate} style={{ position: 'absolute', bottom: '16px', right: '16px', width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.3)', color: locating ? 'var(--cyan)' : 'var(--text-secondary)' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </svg>
    </button>
  )
}

function MapTab({ stops, theme, isNight }) {
  const polylinePoints = stops.map(i => [i.lat, i.lng])
  const tileUrl = theme === 'light' ? TILE_LIGHT : TILE_DARK
  const lineColor = isNight ? '#FF006E' : APP_CONFIG.colors.cyan

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <MapContainer center={[APP_CONFIG.centerMap.lat, APP_CONFIG.centerMap.lng]} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
        <TileLayer key={tileUrl} url={tileUrl} attribution='&copy; <a href="https://carto.com/">CARTO</a>' maxZoom={19} />
        {polylinePoints.length > 1 && (
          <Polyline positions={polylinePoints} pathOptions={{ color: lineColor, weight: 2.5, opacity: 0.7, dashArray: '6 4' }} />
        )}
        <UserLocation />
        {stops.map((inst, idx) => (
          <Marker key={inst.id} position={[inst.lat, inst.lng]} icon={createNumberIcon(idx + 1, isNight)} />
        ))}
        <LocateButton />
      </MapContainer>
    </div>
  )
}

function ListTab({ stops, onSelect, isNight }) {
  const today = todayKey()

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
      {stops.map((inst, idx) => {
        const open = isOpenNow(inst.hours)
        const todaySlot = inst.hours?.[today]
        const distToNext = idx < stops.length - 1
          ? haversineKm(inst.lat, inst.lng, stops[idx + 1].lat, stops[idx + 1].lng)
          : null

        return (
          <div key={inst.id}>
            <button
              onClick={() => onSelect(inst)}
              style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              {/* Number */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '2px' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  backgroundColor: isNight ? '#FF006E' : 'var(--cyan)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', flexShrink: 0,
                }}>
                  {idx + 1}
                </div>
              </div>

              {/* Card */}
              <div style={{ flex: 1, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 12px', marginBottom: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px 0', lineHeight: 1.3 }}>
                      {inst.name}
                    </p>
                    <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--cyan)', margin: '0 0 3px 0' }}>
                      {inst.artist_studio}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                      {inst.zone}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: open ? '#22c55e' : '#888', flexShrink: 0 }} />
                      <span style={{ fontSize: '10px', fontWeight: 600, color: open ? '#22c55e' : 'var(--text-secondary)' }}>
                        {open ? 'Aperto' : 'Chiuso'}
                      </span>
                    </div>
                    {todaySlot && todaySlot !== 'chiuso' && (
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                        {todaySlot === '00:00-23:59' ? '24h' : todaySlot}
                      </span>
                    )}
                    {inst.night_note && (
                      <span style={{ fontSize: '9px', color: '#FF006E', fontWeight: 600 }}>🌙 Notte</span>
                    )}
                    {inst.highlight && (
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#FF006E' }}>★ TOP</span>
                    )}
                  </div>
                </div>
              </div>
            </button>

            {/* Walk time between stops */}
            {distToNext !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0 4px 40px' }}>
                <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--border)', marginLeft: '14px' }} />
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  🚶 {walkTime(distToNext)} a piedi
                </span>
              </div>
            )}
          </div>
        )
      })}
      <div style={{ height: '20px' }} />
    </div>
  )
}

export default function ItineraryView({ onSelect, theme, selectedRoute, onSelectRoute }) {
  const [view, setView] = useState('list')
  const { getRoute } = useInstallations()

  const activeRoute = APP_CONFIG.routes.find(r => r.id === selectedRoute) || APP_CONFIG.routes[3]
  const stops = getRoute(activeRoute.id)
  const isNight = activeRoute.id === 'notte'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px 0', backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>

        {/* Route selector — horizontal scroll */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '10px' }}>
          {APP_CONFIG.routes.map(route => {
            const isActive = route.id === activeRoute.id
            const isNightRoute = route.id === 'notte'
            return (
              <button
                key={route.id}
                onClick={() => onSelectRoute(route.id)}
                style={{
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '999px',
                  fontSize: '12px', fontWeight: 700,
                  fontFamily: 'Montserrat, sans-serif',
                  border: isActive ? 'none' : '1.5px solid var(--border)',
                  backgroundColor: isActive
                    ? (isNightRoute ? '#FF006E' : 'var(--cyan)')
                    : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <span>{route.emoji}</span>
                <span>{route.label}</span>
              </button>
            )
          })}
        </div>

        {/* Route info row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {activeRoute.label}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              {stops.length} tappe · {activeRoute.description}
            </p>
          </div>
          {/* Lista / Mappa toggle */}
          <div style={{ display: 'flex', backgroundColor: 'var(--bg)', borderRadius: '8px', padding: '3px', gap: '2px' }}>
            {[{ id: 'list', label: 'Lista' }, { id: 'map', label: 'Mappa' }].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                style={{
                  padding: '5px 12px', borderRadius: '6px',
                  fontSize: '11px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif',
                  border: 'none', cursor: 'pointer',
                  backgroundColor: view === tab.id ? 'var(--surface)' : 'transparent',
                  color: view === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {stops.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '32px' }}>{activeRoute.emoji}</span>
          <p style={{ fontSize: '13px', margin: 0 }}>Nessuna tappa per questo percorso</p>
        </div>
      ) : view === 'list'
        ? <ListTab stops={stops} onSelect={onSelect} isNight={isNight} />
        : <MapTab stops={stops} theme={theme} isNight={isNight} />
      }
    </div>
  )
}
