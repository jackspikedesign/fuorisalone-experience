import { useState } from 'react'

export default function LoginPrompt({ onSend }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    const { error } = await onSend(email.trim())
    setLoading(false)
    if (error) {
      setError('Qualcosa è andato storto. Riprova.')
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>✉️</div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
          Controlla la tua email
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Abbiamo inviato un link magico a <strong style={{ color: 'var(--cyan)' }}>{email}</strong>.
          <br />Clicca il link per accedere.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '32px 24px' }}>
      {/* Heart icon */}
      <div style={{ marginBottom: '24px' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="#FF006E" stroke="#FF006E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px', textAlign: 'center' }}>
        Salva i tuoi preferiti
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 28px', textAlign: 'center', maxWidth: '280px' }}>
        Accedi con la tua email per salvare le installazioni che non vuoi perdere.
      </p>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="email"
          placeholder="La tua email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '13px 16px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontFamily: 'Montserrat, sans-serif',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {error && (
          <p style={{ fontSize: '12px', color: '#FF006E', margin: 0 }}>{error}</p>
        )}
        <button
          type="submit"
          disabled={loading || !email.trim()}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: loading || !email.trim() ? 'var(--border)' : 'var(--cyan)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: 'Montserrat, sans-serif',
            cursor: loading || !email.trim() ? 'default' : 'pointer',
            transition: 'background-color 0.15s',
          }}
        >
          {loading ? 'Invio…' : 'Invia link magico'}
        </button>
      </form>

      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '16px', textAlign: 'center' }}>
        Nessuna password. Solo un link via email.
      </p>
    </div>
  )
}
