import { APP_CONFIG } from '../../config/app.config'

export default function Badge({ children, variant = 'zone' }) {
  const isHighlight = variant === 'highlight'
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '999px',
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      fontFamily: 'Montserrat, sans-serif',
      flexShrink: 0,
      ...(isHighlight
        ? { backgroundColor: APP_CONFIG.colors.fucsia, color: '#fff' }
        : { border: `1px solid ${APP_CONFIG.colors.cyan}`, color: APP_CONFIG.colors.cyan, backgroundColor: 'transparent' }
      ),
    }}>
      {children}
    </span>
  )
}
