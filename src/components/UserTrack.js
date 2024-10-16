// src/components/UserTrack.js
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase'; // Ensure this points to your Firebase config
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import './UserTrack.css'; // Optional: your styles

const containerStyle = {
  width: '100%',
  height: '500px',
};

// Polyline style (blue path line)
const polylineOptions = {
  strokeColor: '#0000FF',
  strokeOpacity: 1.0,
  strokeWeight: 3,
};

const UserTrack = () => {
  const [location, setLocation] = useState(null);
  const [shareId, setShareId] = useState('');
  const [path, setPath] = useState([]); // Store the path of the driver's route

  const handleTrack = (e) => {
    e.preventDefault();
    if (!shareId) {
      alert('Please enter a Share ID to track.');
      return;
    }

    const locationRef = ref(database, `drivers/${shareId}/location`);

    // Listen for real-time changes to the driver's location
    onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newLocation = { lat: data.latitude, lng: data.longitude };
        setLocation(newLocation);
        setPath((prevPath) => [...prevPath, newLocation]); // Add new location to the path
      } else {
        alert('No location data found for this Share ID.');
      }
    });
  };

  useEffect(() => {
    if (location) {
      console.log('Driver location:', location);
    }
  }, [location]);

  return (
    <div className="user-track-container">
      <h2>Track Driver's Location</h2>
      <form onSubmit={handleTrack} className="track-form">
        <input
          type="text"
          placeholder="Enter Share ID"
          value={shareId}
          onChange={(e) => setShareId(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="track-button">Track Location</button>
      </form>

      {location && (
        <LoadScript googleMapsApiKey="AIzaSyBDSaeTqPiQlBFyxBN5se3HUry_GKCmbs4">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={15}
          >
            {/* Marker for the driver's real-time location */}
            <Marker position={location} label="Driver" />

            {/* Polyline to display the path of the driver */}
            {path.length > 1 && (
              <Polyline path={path} options={polylineOptions} />
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
};

export default UserTrack;
