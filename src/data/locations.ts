export interface LocationItem {
  id: number
  name: string
  category: string
  lat: number
  lng: number
  description: string
}

export const locations: LocationItem[] = [
  {
    id: 1,
    name: 'Tante Sara Cafe',
    category: 'Cafe',
    lat: -54.8065,
    lng: -68.3029,
    description: 'Cozy cafe in downtown Ushuaia, famous for coffee and pastries.'
  },
  {
    id: 2,
    name: 'Biblioteca Popular Ushuaia',
    category: 'Library',
    lat: -54.8080,
    lng: -68.3100,
    description: 'Public library with a collection of books on Patagonia and Tierra del Fuego.'
  },
  {
    id: 3,
    name: 'Centro de Estudios Antárticos',
    category: 'Study',
    lat: -54.8090,
    lng: -68.3035,
    description: 'Study center focused on Antarctic research and environmental studies.'
  },
  {
    id: 4,
    name: 'Puerto Café del Faro',
    category: 'Cafe',
    lat: -54.8078,
    lng: -68.3055,
    description: 'Bright seaside cafe with a view of the harbor and light snacks.'
  },
  {
    id: 5,
    name: 'Biblioteca Universitaria Ushuaia',
    category: 'Library',
    lat: -54.8075,
    lng: -68.3090,
    description: 'University library with academic resources and study rooms.'
  },
  {
    id: 6,
    name: 'Centro de Investigación Marino',
    category: 'Study',
    lat: -54.8072,
    lng: -68.3030,
    description: 'Marine research center focused on local ecosystems and conservation.'
  },
  {
    id: 7,
    name: 'Café de la Plaza',
    category: 'Cafe',
    lat: -54.8089,
    lng: -68.3078,
    description: 'Popular plaza cafe with open seating and light pastries.'
  },
  {
    id: 8,
    name: 'Sala de Estudio Patagonia',
    category: 'Study',
    lat: -54.8072,
    lng: -68.3010,
    description: 'Community study space offering workshops and events.'
  }
]
