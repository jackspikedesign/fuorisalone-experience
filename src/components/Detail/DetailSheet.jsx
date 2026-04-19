import { useState, useEffect, useRef } from 'react'
import Badge from '../UI/Badge'
import ImagePlaceholder from '../UI/ImagePlaceholder'
import { isOpenNow, todayKey } from '../../lib/time'

const DAYS_LABELS = { lun: 'Lun', mar: 'Mar', mer: 'Mer', gio: 'Gio', ven: 'Ven', sab: 'Sab', dom: 'Dom' }
const DAYS_ORDER = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom']

const SETTING_LABELS = { outdoor: '🌆 Esterna', cortile: '🏛 Cortile' }

function openMaps(address) {
  const encoded = encodeURIComponent(address)
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${encoded}`, '_blank')
}

async function shareInstallation(installation) {
  const url = `${window.location.origin}/share?id=${installation.id}`
  const text = `${installation.name} — ${installation.artist_studio}\n${installation.address}`
  if (navigator.share) {
    try {
      await navigator.share({ title: installation.name, text, url })
    } catch (_) { /* dismissed */ }
  } else {
    await navigator.clipboard.writeText(url)
    alert('Link copiato negli appunti!')
  }
}

export default function DetailSheet({ installation, onClose, onToggleFavorite, isFavorite }) {
  const sheetRef = useRef(null)
  const dragStartY = useRef(null)
  const currentTranslate = useRef(0)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [installation?.id])

  useEffect(() => {
    if (installation) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [installation])

  function handleTouchStart(e) {
    dragStartY.current = e.touches[0].clientY
    currentTranslate.current = 0
    if (sheetRef.current) sheetRef.current.style.transition = 'none'
  }

  function handleTouchMove(e) {
    const delta = e.touches[0].clientY - dragStartY.current
    if (delta < 0) return
    currentTranslate.current = delta
    if (sheetRef.current) sheetRef.current.style.transform = `translateY(${delta}px)`
  }

  function handleTouchEnd() {
    if (sheetRef.current) sheetRef.current.style.transition = 'transform 0.3s cubic-bezier(0.32,0.72,0,1)'
    if (currentTranslate.current > 120) {
      onClose()
    } else {
      if (sheetRef.current) sheetRef.current.style.transform = 'translateY(0)'
    }
    dragStartY.current = null
    currentTranslate.current = 0
  }

  if (!installation) return null

  const open = isOpenNow(installation.hours)
  const today = todayKey()

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, animation: 'fadeIn 0.2s ease' }} />

      {/* Sheet */}
      <div
        ref={sheetRef}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          maxWidth: '480px', margin: '0 auto',
          backgroundColor: 'var(--surface)',
          borderRadius: '16px 16px 0 0',
          zIndex: 2001, maxHeight: '88dvh',
          display: 'flex', flexDirection: 'column',
          transform: 'translateY(0)',
          animation: 'slideUp 0.3s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {/* Drag handle */}
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} style={{ padding: '12px 0 4px', cursor: 'grab', flexShrink: 0 }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--border)', margin: '0 auto' }} />
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {/* Hero image */}
          <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
            {imgError ? (
              <ImagePlaceholder name={installation.name} brand={installation.artist_studio} highlight={installation.highlight} />
            ) : (
              <img src={installation.image} alt={installation.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgError(true)} />
            )}
            {/* Close button */}
            <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {/* Open status */}
            <div style={{ position: 'absolute', bottom: '10px', left: '12px', display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: '999px', padding: '4px 10px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: open ? '#22c55e' : '#888', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff' }}>{open ? 'Aperto ora' : 'Chiuso ora'}</span>
            </div>
          </div>

          {/* Main content */}
          <div style={{ padding: '16px' }}>
            {/* Badges */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <Badge variant="zone">{installation.zone}</Badge>
              {installation.setting && (
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', padding: '2px 8px', border: '1px solid var(--border)', borderRadius: '999px' }}>
                  {SETTING_LABELS[installation.setting] || installation.setting}
                </span>
              )}
              {installation.highlight && <Badge variant="highlight">Da non perdere</Badge>}
            </div>

            {/* Title */}
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0', lineHeight: 1.25 }}>
              {installation.name}
            </h2>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cyan)', margin: '0 0 12px 0' }}>
              {installation.artist_studio}
            </p>

            {/* Description */}
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', margin: '0 0 14px 0' }}>
              {installation.description}
            </p>

            {/* Night note */}
            {installation.night_note && (
              <div style={{
                display: 'flex', gap: '10px', alignItems: 'flex-start',
                backgroundColor: 'rgba(255,0,110,0.08)',
                border: '1px solid rgba(255,0,110,0.2)',
                borderRadius: '10px', padding: '10px 12px', marginBottom: '14px',
              }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>🌙</span>
                <p style={{ fontSize: '12px', color: '#FF006E', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                  {installation.night_note}
                </p>
              </div>
            )}

            {/* Address */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{installation.address}</span>
            </div>

            {/* Hours */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 8px 0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Orari
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {DAYS_ORDER.map(day => {
                  const slot = installation.hours?.[day]
                  const isToday = day === today
                  return (
                    <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', borderRadius: '6px', backgroundColor: isToday ? 'rgba(0,128,201,0.12)' : 'transparent' }}>
                      <span style={{ fontSize: '12px', fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--cyan)' : 'var(--text-secondary)' }}>
                        {DAYS_LABELS[day]}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: isToday ? 700 : 400, color: !slot || slot === 'chiuso' ? 'var(--text-secondary)' : isToday ? 'var(--cyan)' : 'var(--text-primary)' }}>
                        {slot === '00:00-23:59' ? '24 ore' : slot || 'Chiuso'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '10px', paddingBottom: '16px' }}>
              {/* Naviga */}
              <button
                onClick={() => openMaps(installation.address)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'var(--cyan)', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', cursor: 'pointer' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11l19-9-9 19-2-8-8-2z" />
                </svg>
                Naviga
              </button>
              {/* Condividi */}
              <button
                onClick={() => shareInstallation(installation)}
                style={{ width: '52px', height: '52px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', border: '2px solid var(--border)', borderRadius: '10px', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.15s' }}
                title="Condividi"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
              {/* Preferiti */}
              <button
                onClick={() => onToggleFavorite(installation)}
                style={{ width: '52px', height: '52px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', border: `2px solid ${isFavorite ? '#FF006E' : 'var(--border)'}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? '#FF006E' : 'none'} stroke={isFavorite ? '#FF006E' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
    </>
  )
}
