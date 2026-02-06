import { useState } from 'react'
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './LocationSelector.css'

// Fix Leaflet default icon issue
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

function MapClickHandler({ onMapClick, selectedPosition }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng)
    },
  })

  return selectedPosition ? (
    <Marker position={selectedPosition}>
      <Popup>
        Selected Location<br />
        Lat: {selectedPosition.lat.toFixed(4)}<br />
        Lng: {selectedPosition.lng.toFixed(4)}
      </Popup>
    </Marker>
  ) : null
}

function LocationSelector({ onComplete, onSkip }) {
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [locationName, setLocationName] = useState('')

  const indiaCenter = [20.5937, 78.9629]

  const handleMapClick = (latlng) => {
    setSelectedPosition(latlng)
  }

  const handleContinue = () => {
    if (selectedPosition) {
      onComplete({
        lat: selectedPosition.lat,
        lng: selectedPosition.lng,
        name: locationName || 'Selected Location'
      })
    }
  }

  return (
    <div className="location-selector fade-in">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: '50%' }}></div>
      </div>
      
      <div className="selector-header">
        <h2 className="selector-title">Choose a Location</h2>
        <p className="selector-subtitle">
          Click anywhere on the map, or skip to generate content from anywhere in India
        </p>
      </div>

      <div className="map-card card">
        <MapContainer
          center={indiaCenter}
          zoom={5}
          style={{ height: '500px', width: '100%', borderRadius: '12px' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler 
            onMapClick={handleMapClick} 
            selectedPosition={selectedPosition}
          />
        </MapContainer>

        {selectedPosition && (
          <div className="location-info slide-in">
            <input
              type="text"
              className="input"
              placeholder="Name this location (optional)"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
            <div className="coordinates">
              📍 {selectedPosition.lat.toFixed(4)}, {selectedPosition.lng.toFixed(4)}
            </div>
          </div>
        )}
      </div>

      <div className="selector-actions">
        <button 
          className="button button-secondary"
          onClick={onSkip}
        >
          Skip Location
        </button>
        <button 
          className="button button-primary"
          onClick={handleContinue}
          disabled={!selectedPosition}
        >
          Continue with Location
          <span>→</span>
        </button>
      </div>
    </div>
  )
}

export default LocationSelector
