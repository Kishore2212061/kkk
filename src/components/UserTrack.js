// src/components/UserTrack.js
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import './UserTrack.css'; // Assuming you'll create a separate CSS file for styling

const containerStyle = {
  width: '100%',
  height: '400px',
};

const polylineOptions = {
  strokeColor: '#FF0000', // Red color for the route line
  strokeOpacity: 1.0,
  strokeWeight: 3,
};

const UserTrack = () => {
  const [shareId, setShareId] = useState('');
  const [sharePass, setSharePass] = useState('');
  const [location, setLocation] = useState(null); // Latest location
  const [path, setPath] = useState([]); // Array to store path of locations

  const handleTrack = (e) => {
    e.preventDefault();
    const locationRef = ref(database, 'locations/' + shareId);

    // Start listening for location updates
    onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.sharePass === sharePass) {
        const newLocation = { lat: data.latitude, lng: data.longitude };
        setLocation(newLocation); // Update the latest location
        setPath((prevPath) => [...prevPath, newLocation]); // Add new location to the path
      } else {
        alert('Invalid ID or Password');
      }
    });
  };

  return (
    <div className="user-track-container">
      <h2>Track Driver Location</h2>
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
            {/* Draw the red route using a polyline */}
            <Polyline path={path} options={polylineOptions} />

            {/* Display marker at the current location */}
            <Marker position={location} />
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
};

export default UserTrack;
