import { type Category, CATEGORIES } from '../data/categories'

interface Props {
  selected: Category[]
  onChange: (next: Category[]) => void
}

export default function CategoryFilter({ selected, onChange }: Props) {
  const toggle = (cat: Category) => {
    onChange(
      selected.includes(cat) ? selected.filter(c => c !== cat) : [...selected, cat]
    )
  }

  const selectSingle = (cat: Category | 'All') => {
    if (cat === 'All') return onChange([...CATEGORIES])
    onChange([cat])
  }

  return (
    <div className="category-filter">
      <strong>Categories</strong>

      {/* Tabs for quick single selection */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 8 }}>
        <button
          className={'btn' + (selected.length === CATEGORIES.length ? ' active' : '')}
          onClick={() => selectSingle('All')}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={'btn' + (selected.length === 1 && selected[0] === cat ? ' active' : '')}
            onClick={() => selectSingle(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checkboxes for multi-select */}
      <div style={{ marginTop: 4 }}>
        {CATEGORIES.map(cat => (
          <div key={cat} className="category">
            <label>
              <input
                type="checkbox"
                checked={selected.includes(cat)}
                onChange={() => toggle(cat)}
              />
              <span style={{ marginLeft: 8 }}>{cat}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
