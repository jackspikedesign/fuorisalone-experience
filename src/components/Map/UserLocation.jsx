import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import { circle, divIcon, marker } from 'leaflet'

const USER_DOT = divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#2563eb;border:2.5px solid white;box-shadow:0 0 0 3px rgba(37,99,235,0.25)"></div>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

export default function UserLocation({ onReady }) {
  const map = useMap()
  const markerRef = useRef(null)
  const circleRef = useRef(null)
  const watchRef = useRef(null)

  useEffect(() => {
    if (!navigator.geolocation) return

    function updatePosition({ coords }) {
      const { latitude: lat, longitude: lng, accuracy } = coords

      if (!markerRef.current) {
        markerRef.current = marker([lat, lng], { icon: USER_DOT, zIndexOffset: 1000 }).addTo(map)
        circleRef.current = circle([lat, lng], {
          radius: accuracy,
          color: '#2563eb',
          fillColor: '#2563eb',
          fillOpacity: 0.08,
          weight: 1,
          opacity: 0.3,
        }).addTo(map)
        onReady?.({ lat, lng })
      } else {
        markerRef.current.setLatLng([lat, lng])
        circleRef.current.setLatLng([lat, lng])
        circleRef.current.setRadius(accuracy)
      }
    }

    watchRef.current = navigator.geolocation.watchPosition(updatePosition, null, {
      enableHighAccuracy: true,
      maximumAge: 5000,
    })

    return () => {
      if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current)
      markerRef.current?.remove()
      circleRef.current?.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
