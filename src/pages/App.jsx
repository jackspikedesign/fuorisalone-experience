import { useState, lazy, Suspense } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import { useFavorites } from '../hooks/useFavorites'
import TabBar from '../components/UI/TabBar'
import ThemeToggle from '../components/UI/ThemeToggle'
import DetailSheet from '../components/Detail/DetailSheet'
import { APP_CONFIG } from '../config/app.config'

const HomeView      = lazy(() => import('../components/Home/HomeView'))
const MapView       = lazy(() => import('../components/Map/MapView'))
const ListView      = lazy(() => import('../components/List/ListView'))
const ItineraryView = lazy(() => import('../components/Itinerary/ItineraryView'))
const FavoritesView = lazy(() => import('../components/Favorites/FavoritesView'))

function ViewLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--cyan)', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [selectedInstallation, setSelectedInstallation] = useState(null)
  const [selectedRoute, setSelectedRoute] = useState('full')
  const { theme, toggle } = useTheme()
  const { user, loading: authLoading, sendMagicLink, signOut } = useAuth()
  const { favorites, toggle: toggleFavorite, isFavorite } = useFavorites(user)

  function handleSelectRoute(routeId) {
    setSelectedRoute(routeId)
    setActiveTab('itinerary')
  }

  const sharedProps = {
    onSelect: setSelectedInstallation,
    selected: selectedInstallation,
    favorites,
    onToggleFavorite: toggleFavorite,
    user,
    sendMagicLink,
    signOut,
    theme,
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      backgroundColor: 'var(--bg)',
      maxWidth: '480px',
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        zIndex: 100,
      }}>
        <div>
          <h1 style={{
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            {APP_CONFIG.name}
          </h1>
          <p style={{
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--cyan)',
            margin: 0,
            marginTop: '1px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            Milano Design Week 2026
          </p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggle} />
      </header>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Suspense fallback={<ViewLoader />}>
          {activeTab === 'home'      && <HomeView {...sharedProps} onSelectRoute={handleSelectRoute} />}
          {activeTab === 'map'       && <MapView {...sharedProps} />}
          {activeTab === 'list'      && <ListView {...sharedProps} />}
          {activeTab === 'itinerary' && <ItineraryView {...sharedProps} selectedRoute={selectedRoute} onSelectRoute={setSelectedRoute} />}
          {activeTab === 'favorites' && <FavoritesView {...sharedProps} />}
        </Suspense>
      </main>

      {/* Tab bar */}
      <TabBar active={activeTab} onChange={setActiveTab} />

      {/* Detail bottom sheet */}
      <DetailSheet
        installation={selectedInstallation}
        onClose={() => setSelectedInstallation(null)}
        onToggleFavorite={user ? toggleFavorite : () => setActiveTab('favorites')}
        isFavorite={selectedInstallation ? isFavorite(selectedInstallation.id) : false}
      />
    </div>
  )
}
