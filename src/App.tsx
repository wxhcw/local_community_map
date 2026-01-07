import { useState, useRef } from "react";
import type { Category } from "./data/categories";
import { CATEGORIES } from "./data/categories";
import MapView from "./components/MapView";
import LocationList from "./components/LocationList";
import AddLocationForm from "./components/AddLocationForm";
import { locations } from "./data/locations";
import "./utils/fixLeafletIcon";
import CategoryFilter from "./components/CategoryFilter";
import { haversineDistance } from './utils/distance';
import type { LocationItem } from './data/locations';

export default function App() {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    () => [...CATEGORIES]
  );
  const [activeId, setActiveId] = useState<number | null>(null);

  const [allLocations, setAllLocations] = useState<LocationItem[]>(() => [...locations])
  const [sortByDistance, setSortByDistance] = useState(false)

  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  // for adding new location
  const [newPlacePos, setNewPlacePos] = useState<{ lat: number; lng: number } | null>(null)

  const [addMode, setAddMode] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [justClosed, setJustClosed] = useState(false)

  const download = (filename: string, content: string, mime = 'text/plain') => {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportGeoJSON = () => {
    const geo = {
      type: 'FeatureCollection',
      features: allLocations.map(l => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [l.lng, l.lat] },
        properties: { id: l.id, name: l.name, category: l.category, description: l.description }
      }))
    }
    download(`locations_${Date.now()}.geojson`, JSON.stringify(geo, null, 2), 'application/geo+json')
  }

  const escapeCsv = (v: string) => {
    if (v == null) return ''
    const s = String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }

  const exportCSV = () => {
    const headers = ['id', 'name', 'category', 'lat', 'lng', 'description']
    const rows = allLocations.map(l => [l.id, l.name, l.category, l.lat, l.lng, l.description].map(v => escapeCsv(String(v))).join(','))
    const csv = headers.join(',') + '\n' + rows.join('\n')
    download(`locations_${Date.now()}.csv`, csv, 'text/csv')
  }

  const triggerImport = () => {
    fileInputRef.current?.click()
  }

  const handleImportFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const text = await f.text()

    let parsedCount = 0
    let handled = false

    // try JSON -> GeoJSON
    try {
      const obj = JSON.parse(text)
      if (obj && obj.type === 'FeatureCollection' && Array.isArray(obj.features)) {
        const nextBase = Math.max(0, ...allLocations.map(l => l.id)) + 1
        let nextId = nextBase
        const items = obj.features.map((feat: any) => {
          const coords = feat.geometry && feat.geometry.coordinates
          const props = feat.properties || {}
          if (!coords || coords.length < 2) return null
          parsedCount++
          return {
            id: nextId++,
            name: props.name || `Imported ${nextId}`,
            category: props.category || 'Study',
            lat: coords[1],
            lng: coords[0],
            description: props.description || ''
          }
        }).filter(Boolean) as LocationItem[]
        if (items.length) {
          setAllLocations(prev => [...items, ...prev])
          alert(`Imported ${items.length} features from GeoJSON`)
          handled = true
        }
        e.currentTarget.value = ''
        if (handled) return
      }
    } catch (err) {
      // fall through to CSV
    }

    if (handled) return

    // parse CSV (simple parser)
    const lines = text.split(/\r?\n/).filter(Boolean)
    if (lines.length > 0) {
      const header = lines[0].split(',').map(h => h.trim().toLowerCase())
      const idx = (key: string) => header.indexOf(key)
      const nameIdx = idx('name')
      const catIdx = idx('category')
      const latIdx = idx('lat')
      const lngIdx = idx('lng')
      const descIdx = idx('description')

      const nextBase = Math.max(0, ...allLocations.map(l => l.id)) + 1
      let nextId = nextBase
      const items: LocationItem[] = []
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]
        // naive CSV split - supports simple cases
        const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, '').replace(/""/g, '"'))
        if (parts.length < 4) continue
        const lat = Number(parts[latIdx])
        const lng = Number(parts[lngIdx])
        if (Number.isNaN(lat) || Number.isNaN(lng)) continue
        const item: LocationItem = {
          id: nextId++,
          name: parts[nameIdx] || `Imported ${i}`,
          category: parts[catIdx] || 'Study',
          lat,
          lng,
          description: parts[descIdx] || ''
        }
        items.push(item)
        parsedCount++
      }
      if (items.length) {
        setAllLocations(prev => [...items, ...prev])
        alert(`Imported ${items.length} rows from CSV`)
      } else {
        alert('No valid rows found in file')
      }
      e.currentTarget.value = ''
      return
    }

    alert('Unable to parse file as GeoJSON or CSV')
    e.currentTarget.value = ''
  }

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
      },
      () => alert("Location access denied")
    );
  };

  const handleMapClick = (latlng: [number, number]) => {
    if (!addMode) return // only place pin when explicitly in add mode
    setNewPlacePos({ lat: latlng[0], lng: latlng[1] })
  }

  const handleAddLocation = (data: Omit<LocationItem, 'id'>) => {
    const id = Math.max(0, ...allLocations.map(l => l.id)) + 1
    const item: LocationItem = { id, ...data }
    setAllLocations(prev => [item, ...prev])
    setNewPlacePos(null)
    setActiveId(id)
    setAddMode(false)
  }

  const cancelAdd = () => {
    setNewPlacePos(null)
    setAddMode(false)
  }

  // Filter and sort
  const filtered = allLocations.filter((loc) =>
    selectedCategories.includes(loc.category as Category)
  )

  const filteredLocations = (() => {
    if (sortByDistance && userPos) {
      return [...filtered].sort((a, b) =>
        haversineDistance(userPos[0], userPos[1], a.lat, a.lng) - haversineDistance(userPos[0], userPos[1], b.lat, b.lng)
      )
    }
    return filtered
  })()

  return (
    <div className="app">
      <header className="header">
        <h1>Local Community Map</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={getUserLocation}>Get My Location</button>
          <button
            className="btn"
            onClick={() => setSortByDistance(s => !s)}
            title="Sort by distance (requires location)"
            disabled={!userPos}
          >
            {sortByDistance ? 'Sorted: Distance' : 'Sort by distance'}
          </button>

          <div
            className={"export-dropdown" + (exportOpen ? ' open' : '') + (justClosed ? ' just-closed' : '')}
            tabIndex={0}
            aria-label="Export options"
            onFocus={() => setExportOpen(true)}
            onBlur={() => setExportOpen(false)}
            onKeyDown={(e) => { if (e.key === 'Escape') setExportOpen(false) }}
          >
            <button className="btn export-btn" aria-haspopup="true" onClick={() => setExportOpen(s => !s)}>Export ▾</button>

            <div className="export-menu" role="menu" aria-label="Export formats">
              <button className="btn" role="menuitem" onClick={() => { exportCSV(); setExportOpen(false); setJustClosed(true); setTimeout(() => setJustClosed(false), 250); }}>.csv</button>
              <button className="btn" role="menuitem" onClick={() => { exportGeoJSON(); setExportOpen(false); setJustClosed(true); setTimeout(() => setJustClosed(false), 250); }}>.json</button>
            </div>
          </div>

          <button className="btn" onClick={triggerImport} title="Import locations from GeoJSON or CSV">Import</button>
          <input ref={fileInputRef} onChange={handleImportFile} type="file" accept=".geojson,application/geo+json,.json,.csv" style={{ display: 'none' }} />

          <button
            className={"btn" + (addMode ? ' active' : '')}
            onClick={() => {
              // toggling add mode
              setAddMode(a => {
                const next = !a
                if (!next) setNewPlacePos(null)
                return next
              })
            }}
            title="Toggle add-place mode"
          >
            {addMode ? 'Cancel adding' : 'Add place'}
          </button>
        </div>
      </header>

      <main className="main">
        <aside className="sidebar">
          {newPlacePos ? (
            <AddLocationForm initial={newPlacePos} onAdd={handleAddLocation} onCancel={cancelAdd} />
          ) : (
            <div className="card filter">
              <CategoryFilter
                selected={selectedCategories}
                onChange={setSelectedCategories}
              />
              <div style={{ height: 8 }} />
            </div>
          )}

          <div className="card list">
            <LocationList
              locations={filteredLocations}
              activeId={activeId}
              onSelect={setActiveId}
              userPos={userPos}
            />
          </div>
        </aside>

        <section className="content">
          <div className={"map-wrapper" + (addMode ? ' add-mode' : '')}>
            {addMode && !newPlacePos && (
              <div className="map-instruction card">Click on the map to place a pin for the new place.</div>
            )}

            {addMode && newPlacePos && (
              <div className="map-instruction card">Move the pin if needed, then fill the form to add.</div>
            )}

            <MapView
              locations={filteredLocations}
              activeId={activeId}
              userPos={userPos}
              onMapClick={addMode ? handleMapClick : undefined}
              onSelect={setActiveId}
              newPlacePos={newPlacePos}
              onNewPlaceMove={(latlng) => setNewPlacePos({ lat: latlng[0], lng: latlng[1] })}
              centerOnActive={false}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
