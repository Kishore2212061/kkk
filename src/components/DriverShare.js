// src/components/DriverShare.js
import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../firebase';
import './DriverShare.css'; // Assuming you create a separate CSS file for styling

const DriverShare = () => {
  const [shareId, setShareId] = useState('');
  const [sharePass, setSharePass] = useState('');
  const [secretKey, setSecretKey] = useState(''); // New state for secret key
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Error getting location: " + error.message);
        }
      );

      // Cleanup function to stop watching position
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleShare = (e) => {
    e.preventDefault();
    
    // Check if shareId, sharePass, and secretKey are provided
    if (!shareId || !sharePass || !secretKey) {
      alert('Please enter Share ID, Share Password, and Secret Key.');
      return;
    }

    // Verify the secret key
    const correctSecretKey = 'nec@61';
    if (secretKey !== correctSecretKey) {
      alert('Invalid Secret Key. Please try again.');
      return;
    }

    const locationRef = ref(database, 'locations/' + shareId);

    set(locationRef, {
      latitude: latitude,
      longitude: longitude,
      sharePass: sharePass,  // Ensure this is not an empty string
    })
      .then(() => {
        alert('Location shared successfully!');
      })
      .catch((error) => {
        console.error("Error sharing location: ", error);
        alert('Error sharing location: ' + error.message);
      });
  };

  return (
    <div className="driver-share-container">
      <h2>Share Your Location</h2>
      <form onSubmit={handleShare} className="share-form">
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
        <input
          type="password"
          placeholder="Enter Secret Key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="submit-button">Share Location</button>
      </form>
      {latitude && longitude && (
        <div className="location-display">
          <p>Your current location: {latitude}, {longitude}</p>
        </div>
      )}
    </div>
  );
};

export default DriverShare;
