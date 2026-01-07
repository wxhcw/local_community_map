import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useRef } from "react";
import type { LocationItem } from "../data/locations";
import { getCategoryIcon, getUserIcon } from "../utils/markerIcons";
import type L from "leaflet";

interface MapViewProps {
  locations: LocationItem[];
  activeId: number | null;
  userPos?: [number, number] | null;
  onMapClick?: (latlng: [number, number]) => void;
  onSelect?: (id: number) => void;
  newPlacePos?: { lat: number; lng: number } | null;
  /** If true, fly map to active marker when selected. Default: false */
  centerOnActive?: boolean;
}

function ClickHandler({
  onMapClick,
}: {
  onMapClick?: (latlng: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function ActiveManager({
  activeId,
  centerOnActive,
  markerRefs,
}: {
  activeId: number | null;
  centerOnActive?: boolean;
  markerRefs: React.MutableRefObject<Record<number, L.Marker>>;
}) {
  const map = useMap();
  useEffect(() => {
    if (!activeId) return;
    const marker = markerRefs.current[activeId];
    if (!marker) return;

    // always open popup
    marker.openPopup();

    // optionally fly to marker
    if (centerOnActive) {
      map.flyTo(marker.getLatLng(), 15, { duration: 1.2 });
    }
  }, [activeId, centerOnActive, map, markerRefs]);

  return null;
}

export default function MapView({
  locations,
  activeId,
  userPos = null,
  onMapClick,
  onSelect,
  newPlacePos = null,
  onNewPlaceMove,
  centerOnActive = false,
}: MapViewProps & { onNewPlaceMove?: (latlng: [number, number]) => void }) {
  const markerRefs = useRef<Record<number, L.Marker>>({});

  return (
    <MapContainer
      center={[-54.808, -68.3029]} // 乌斯怀亚中心
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      {/* Use CartoDB Voyager for a richer, more colorful basemap */}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors &amp; CartoDB"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <ClickHandler onMapClick={onMapClick} />

      <ActiveManager
        activeId={activeId}
        centerOnActive={centerOnActive}
        markerRefs={markerRefs}
      />

      {userPos && (
        <Marker position={[userPos[0], userPos[1]]} icon={getUserIcon()}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {newPlacePos && (
        <Marker
          position={[newPlacePos.lat, newPlacePos.lng]}
          draggable={true}
          eventHandlers={{
            dragend(e) {
              const p = (e.target as any).getLatLng();
              onNewPlaceMove && onNewPlaceMove([p.lat, p.lng]);
            },
          }}
        >
          <Popup>New place (click "Add place")</Popup>
        </Marker>
      )}

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={getCategoryIcon(
            location.category as any,
            location.id === activeId
          )}
          zIndexOffset={location.id === activeId ? 1000 : 0}
          ref={(m: any) => {
            if (m) (markerRefs.current as any)[location.id] = m;
            else delete (markerRefs.current as any)[location.id];
          }}
          eventHandlers={{
            click() {
              onSelect && onSelect(location.id);
            },
          }}
        >
          <Popup>
            <strong>{location.name}</strong>
            <br />
            {location.category}
            <br />
            {location.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
