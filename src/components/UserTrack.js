// src/components/UserTrack.js
import React, { useState } from 'react';
import { ref, onValue, set } from 'firebase/database'; 
import { database } from '../firebase'; 
import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import './UserTrack.css';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const polylineOptions = {
  strokeColor: '#0000FF',
  strokeOpacity: 1.0,
  strokeWeight: 3,
};

const UserTrack = () => {
  const [location, setLocation] = useState(null);
  const [shareId, setShareId] = useState('');
  const [registerNo, setRegisterNo] = useState('');
  const [yourStop, setYourStop] = useState('');
  const [path, setPath] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!shareId || !registerNo || !yourStop) {
      alert('Please fill in all fields to track.');
      return;
    }

    const userRef = ref(database, `users/${shareId}`);
    set(userRef, {
      registerNo: registerNo,
      yourStop: yourStop,
    });

    if (!isRegistered) {
      setIsRegistered(true);
    }

    setIsTracking(true);

    const locationRef = ref(database, `drivers/${shareId}/location`);

    onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newLocation = { lat: data.latitude, lng: data.longitude };
        setLocation(newLocation);
        setPath((prevPath) => [...prevPath, newLocation]);
      } else {
        alert('No location data found for this Share ID.');
      }
    });
  };

  const renderMarker = (map) => {
    if (location && map) {
      const AdvancedMarkerElement = window.google?.maps?.marker?.AdvancedMarkerElement;
      const marker = AdvancedMarkerElement
        ? new AdvancedMarkerElement({
            map: map,
            position: location,
            title: "Driver's Location",
          })
        : new window.google.maps.Marker({
            map: map,
            position: location,
            title: "Driver's Location",
          });
    }
  };

  return (
    <div className="user-track-container">
      <h2>Track Driver's Location</h2>
      {!isRegistered ? (
        <form onSubmit={handleTrack} className="track-form">
          <input
            type="text"
            placeholder="Enter Share ID"
            value={shareId}
            onChange={(e) => setShareId(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="text"
            placeholder="Enter Register No"
            value={registerNo}
            onChange={(e) => setRegisterNo(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="text"
            placeholder="Enter Your Stop"
            value={yourStop}
            onChange={(e) => setYourStop(e.target.value)}
            required
            className="input-field"
          />
          <button type="submit" className="track-button">Track Location</button>
        </form>
      ) : (
        <div>
          <p>Tracking Driver with Share ID: {shareId}</p>
          <p>Register No: {registerNo}</p>
          <p>Your Stop: {yourStop}</p>
        </div>
      )}

      {isTracking && location && (
        <LoadScript
          googleMapsApiKey="AIzaSyBDSaeTqPiQlBFyxBN5se3HUry_GKCmbs4"
          onLoad={() => setIsLoaded(true)}
          onError={() => console.error('Google Maps API failed to load')}
        >
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={location}
              zoom={15}
              onLoad={renderMarker}
            >
              {path.length > 1 && <Polyline path={path} options={polylineOptions} />}
            </GoogleMap>
          ) : (
            <div>Loading Map...</div>
          )}
        </LoadScript>
      )}
    </div>
  );
};

export default UserTrack;
