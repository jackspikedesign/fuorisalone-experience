import { useState } from 'react'
import { useInstallations } from '../../hooks/useInstallations'
import FilterBar from './FilterBar'
import InstallationCard from './InstallationCard'

export default function ListView({ onSelect }) {
  const [filters, setFilters] = useState({})
  const { installations, loading } = useInstallations(filters)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <FilterBar filters={filters} onChange={setFilters} />

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {/* Result count */}
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          margin: 0,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {installations.length} installazion{installations.length === 1 ? 'e' : 'i'}
        </p>

        {loading && (
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Caricamento…</p>
        )}

        {!loading && installations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: 14 }}>Nessun risultato</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Prova a modificare i filtri</p>
          </div>
        )}

        {installations.map(installation => (
          <InstallationCard
            key={installation.id}
            installation={installation}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
