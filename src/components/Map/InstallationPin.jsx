import { divIcon } from 'leaflet'
import { APP_CONFIG } from '../../config/app.config'

export function createPinIcon(highlight = false) {
  const color = highlight ? APP_CONFIG.colors.fucsia : APP_CONFIG.colors.cyan
  const size = highlight ? 14 : 11

  const svg = `
    <svg width="${size * 2}" height="${size * 2}" viewBox="0 0 ${size * 2} ${size * 2}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size}" cy="${size}" r="${size - 1}" fill="${color}" stroke="white" stroke-width="1.5"/>
    </svg>
  `

  return divIcon({
    html: svg,
    className: '',
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
    popupAnchor: [0, -size],
  })
}
