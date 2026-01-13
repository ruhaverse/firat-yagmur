import React, { useState, useEffect, useRef } from 'react';

const mapStyles = {
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
};

export function CurrentLocation(props) {
  const { lat, lng } = props.initialCenter;
  const [currentLocation, setCurrentLocation] = useState({
    lat: lat,
    lng: lng
  });

  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const recenterMap = () => {
    const map = mapInstance.current;
    const google = props.google;
    const maps = google.maps;

    if (map) {
      const center = new maps.LatLng(currentLocation.lat, currentLocation.lng);
      map.panTo(center);
    }
  };

  const loadMap = () => {
    if (props && props.google) {
      const { google } = props;
      const maps = google.maps;
      const node = mapRef.current;
      const { zoom } = props;
      const { lat, lng } = currentLocation;
      const center = new maps.LatLng(lat, lng);

      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: zoom
        }
      );

      mapInstance.current = new maps.Map(node, mapConfig);
    }
  };

  const renderChildren = () => {
    const { children } = props;

    if (!children) return;

    return React.Children.map(children, c => {
      if (!c) return;

      return React.cloneElement(c, {
        map: mapInstance.current,
        google: props.google,
        mapCenter: currentLocation
      });
    });
  };

  useEffect(() => {
    if (props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const coords = pos.coords;
          setCurrentLocation({
            lat: coords.latitude,
            lng: coords.longitude
          });
        });
      }
    }
    loadMap();
  }, []);

  useEffect(() => {
    recenterMap();
  }, [currentLocation]);

  const style = Object.assign({}, mapStyles.map);

  return (
    <div>
      <div style={style} ref={mapRef}>
        Loading map...
      </div>
      {renderChildren()}
    </div>
  );
}

CurrentLocation.defaultProps = {
  zoom: 14,
  initialCenter: {
    lat: -1.2884,
    lng: 36.8233
  },
  centerAroundCurrentLocation: false,
  visible: true
};

export default CurrentLocation;