// src/components/UserTrack.js
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase'; // Ensure this points to your Firebase config
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import './UserTrack.css';

// Map container style
const containerStyle = {
  width: '100%',
  height: '500px',
};

// Polyline style (red route line)
const polylineOptions = {
  strokeColor: '#FF0000',
  strokeOpacity: 1.0,
  strokeWeight: 3,
};

// Destination coordinates (example: National Engineering College, Kovilpatti)
const destination = {
  lat: 9.1467,
  lng: 77.83215,
};

const UserTrack = () => {
  const [shareId, setShareId] = useState('');
  const [sharePass, setSharePass] = useState('');
  const [location, setLocation] = useState(null);
  const [path, setPath] = useState([]); // Array to store path of bus locations

  const handleTrack = (e) => {
    e.preventDefault();
    const locationRef = ref(database, `locations/${shareId}`);

    // Listen for location updates in real-time from Firebase
    onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.sharePass === sharePass) {
        const newLocation = { lat: data.latitude, lng: data.longitude };
        setLocation(newLocation);
        setPath((prevPath) => [...prevPath, newLocation]); // Append new location to the path array
      } else {
        alert('Invalid ID or Password');
      }
    });
  };

  return (
    <div className="user-track-container">
      <h2>Track Bus Location</h2>
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
          type="password"
          placeholder="Enter Share Password"
          value={sharePass}
          onChange={(e) => setSharePass(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="track-button">Track</button>
      </form>

      {location && (
        <LoadScript googleMapsApiKey="AIzaSyBDSaeTqPiQlBFyxBN5se3HUry_GKCmbs4">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={15}
          >
            {/* Polyline for route */}
            <Polyline path={path} options={polylineOptions} />

            {/* Marker for the bus's real-time location */}
            <Marker position={location} label="Bus" />

            {/* Marker for the destination */}
            <Marker position={destination} label="Destination" />
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
};

export default UserTrack;
