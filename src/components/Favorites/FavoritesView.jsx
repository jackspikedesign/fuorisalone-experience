import LoginPrompt from './LoginPrompt'
import InstallationCard from '../List/InstallationCard'
import { useInstallations } from '../../hooks/useInstallations'

export default function FavoritesView({ user, sendMagicLink, signOut, favorites, onToggleFavorite, onSelect }) {
  const { installations } = useInstallations()
  const saved = installations.filter(i => favorites.includes(i.id))

  if (!user) {
    return <LoginPrompt onSend={sendMagicLink} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header utente */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            I tuoi preferiti
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            {user.email}
          </p>
        </div>
        <button
          onClick={signOut}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            fontFamily: 'Montserrat, sans-serif',
            cursor: 'pointer',
          }}
        >
          Esci
        </button>
      </div>

      {/* Lista preferiti */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {saved.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px 24px', textAlign: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 6px' }}>
              Nessun preferito ancora
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Tocca il cuore su un'installazione per salvarla qui.
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {saved.length} salvat{saved.length === 1 ? 'a' : 'e'}
            </p>
            {saved.map(installation => (
              <InstallationCard
                key={installation.id}
                installation={installation}
                onClick={onSelect}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
