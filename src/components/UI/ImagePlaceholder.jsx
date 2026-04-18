import { APP_CONFIG } from '../../config/app.config'

export default function ImagePlaceholder({ name, brand, highlight }) {
  const color = highlight ? APP_CONFIG.colors.fucsia : APP_CONFIG.colors.cyan
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: `linear-gradient(135deg, #111 0%, #1a1a1a 100%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '16px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: color,
        opacity: 0.25,
      }} />
      <p style={{
        fontSize: '11px',
        fontWeight: 700,
        color: '#fff',
        opacity: 0.5,
        margin: 0,
        textAlign: 'center',
        letterSpacing: '0.02em',
        lineHeight: 1.3,
      }}>
        {name}
      </p>
      {brand && (
        <p style={{
          fontSize: '10px',
          fontWeight: 500,
          color: color,
          opacity: 0.7,
          margin: 0,
          textAlign: 'center',
        }}>
          {brand}
        </p>
      )}
    </div>
  )
}
