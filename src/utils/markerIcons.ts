import L from 'leaflet'
import type { Category } from '../data/categories'

function svgDataUrl(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function getCategoryIcon(category: Category, active = false) {
  // Colors per category
  const colorMap: Record<Category, string> = {
    Cafe: '#d35400',
    Library: '#2e86de',
    Study: '#27ae60'
  }
  const color = colorMap[category] ?? '#666'

  const stroke = active ? '#ffd166' : 'white'
  const strokeWidth = active ? 4 : 2
  const shadowOpacity = active ? 0.5 : 0.35
  const sz: [number, number] = active ? [46, 64] : [40, 56]
  const anchor: [number, number] = active ? [23, 64] : [20, 56]

  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${sz[0]}' height='${sz[1]}' viewBox='0 0 ${sz[0]} ${sz[1]}'>
      <defs>
        <filter id='f' x='-50%' y='-50%' width='200%' height='200%'>
          <feDropShadow dx='0' dy='3' stdDeviation='3' flood-color='#000' flood-opacity='${shadowOpacity}'/>
        </filter>
      </defs>
      <!-- pin body with contrasting outline for visibility -->
      <path d='M${sz[0]/2} 0 C${sz[0]/2 - 8} 0 ${sz[0]/2 - 14} 6 ${sz[0]/2 - 14} 14 C${sz[0]/2 - 14} 26 ${sz[0]/2} 42 ${sz[0]/2} 42 C${sz[0]/2} 42 ${sz[0]/2 + 14} 26 ${sz[0]/2 + 14} 14 C${sz[0]/2 + 14} 6 ${sz[0]/2 + 8} 0 ${sz[0]/2} 0 Z' fill='${color}' stroke='${stroke}' stroke-width='${strokeWidth}' filter='url(#f)' />
      <!-- interior circle -->
      <circle cx='${sz[0]/2}' cy='14' r='6' fill='white' opacity='0.95' />
    </svg>`

  return L.icon({
    iconUrl: svgDataUrl(svg),
    iconSize: sz,
    iconAnchor: anchor,
    popupAnchor: [0, -sz[1]],
    className: 'custom-marker' + (active ? ' active' : '')
  })
}

export function getUserIcon() {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>
      <defs>
        <radialGradient id='g' cx='50%' cy='40%' r='70%'>
          <stop offset='0%' stop-color='#66b2ff' stop-opacity='1'/>
          <stop offset='100%' stop-color='#66b2ff' stop-opacity='0.2'/>
        </radialGradient>
      </defs>
      <!-- outer halo -->
      <circle cx='20' cy='16' r='14' fill='url(#g)' />
      <!-- white ring for contrast -->
      <circle cx='20' cy='16' r='10' fill='white' />
      <!-- inner dot -->
      <circle cx='20' cy='16' r='6' fill='#2b9cff' />
    </svg>`

  return L.divIcon({
    html: `<div class='user-marker'>${svg}</div>`,
    className: 'user-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  })
}

