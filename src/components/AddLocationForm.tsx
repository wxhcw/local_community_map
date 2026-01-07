import { useState } from 'react'
import { CATEGORIES } from '../data/categories'
import type { LocationItem } from '../data/locations'

interface Props {
  initial?: { lat: number; lng: number } | null
  onAdd: (loc: Omit<LocationItem, 'id'>) => void
  onCancel: () => void
}

export default function AddLocationForm({ initial = null, onAdd, onCancel }: Props) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [lat, setLat] = useState(initial?.lat ?? 0)
  const [lng, setLng] = useState(initial?.lng ?? 0)

  // Keep inputs in sync if initial changes
  // (parent will remount/replace initial when user clicks map again)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return alert('Please enter a name')
    onAdd({ name, category, description, lat: Number(lat), lng: Number(lng) })
  }

  return (
    <form className="card" onSubmit={submit}>
      <strong>Add a place</strong>
      <div style={{ height: 8 }} />

      <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Name</label>
      <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 8 }} />

      <label style={{ display: 'block', fontSize: 13, marginTop: 8, marginBottom: 6 }}>Category</label>
      <select value={category} onChange={e => setCategory(e.target.value as any)} style={{ width: '100%', padding: 8 }}>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <label style={{ display: 'block', fontSize: 13, marginTop: 8, marginBottom: 6 }}>Description</label>
      <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: 8 }} rows={3} />

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#888' }}>Lat</label>
          <input value={lat} onChange={e => setLat(e.target.value as unknown as number)} style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#888' }}>Lng</label>
          <input value={lng} onChange={e => setLng(e.target.value as unknown as number)} style={{ width: '100%', padding: 8 }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="submit" className="btn">Add place</button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
