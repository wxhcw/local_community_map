import type { LocationItem } from '../data/locations'
import { haversineDistance } from '../utils/distance'


interface LocationListProps {
  locations: LocationItem[]
  activeId: number | null
  onSelect: (id: number) => void
  userPos?: [number, number] | null
}

export default function LocationList({ locations, activeId, onSelect, userPos = null }: LocationListProps) {
  return (
    <div className="list">
      {locations.map(loc => (
        <div
          key={loc.id}
          onClick={() => onSelect(loc.id)}
          className={"list-item" + (loc.id === activeId ? ' active' : '')}
        >
          {userPos && (
            <div className="meta">
              {haversineDistance(
                userPos[0],
                userPos[1],
                loc.lat,
                loc.lng
              ).toFixed(2)} km away
            </div>
          )}

          <div className="top-row">
            <div className="title">{loc.name}</div>
            {userPos && (
              <div className="meta">
                {haversineDistance(userPos[0], userPos[1], loc.lat, loc.lng).toFixed(2)} km
              </div>
            )}
          </div>
          <div className="meta">{loc.category}</div>
        </div>
      ))}
    </div>
  )
}
