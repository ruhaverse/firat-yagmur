import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';
import Popup from 'reactjs-popup';



const containerStyle = {
  width: '300px',
  height: '500px'
};

const center = {
  lat: 37.7749, // Default to San Francisco, update as needed
  lng: -122.4194
};

function LocationComponent() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCUqRf-EB8vo-P_BYx0dRES5A3h78u1Xzc'
  });
  const [selected, setSelected] = useState(null);

  const handleMarkerClick = useCallback(() => {
    setSelected({ name: 'Current Location' });
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelected(null);
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={containerStyle}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        <Marker position={center} onClick={handleMarkerClick} />
        {selected && (
          <InfoWindow position={center} onCloseClick={handleInfoWindowClose}>
            <div>
              <h4>{selected.name}</h4>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default LocationComponent;