// src/components/DriverShare.js
import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../firebase';
import './DriverShare.css';

const DriverShare = () => {
  const [shareId, setShareId] = useState('');
  const [sharePass, setSharePass] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    let watchId;
    if (isSharing) {
      // Start watching the position in real-time
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Update location in Firebase every second
          const locationRef = ref(database, 'locations/' + shareId);
          set(locationRef, {
            latitude,
            longitude,
            sharePass
          });
        },
        (error) => {
          console.error('Error getting location: ', error);
          alert('Error getting location: ' + error.message);
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
      );
    }

    // Cleanup: stop watching when component is unmounted or sharing stops
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isSharing, shareId, sharePass]);

  const handleStartShare = (e) => {
    e.preventDefault();

    if (!shareId || !sharePass || !secretKey) {
      alert('Please enter Share ID, Share Password, and Secret Key.');
      return;
    }

    // Verify secret key
    const correctSecretKey = 'nec@61';
    if (secretKey !== correctSecretKey) {
      alert('Invalid Secret Key. Please try again.');
      return;
    }

    // Start sharing location
    setIsSharing(true);
    alert('Location sharing started!');
  };

  return (
    <div className="driver-share-container">
      <h2>Share Your Location</h2>
      <form onSubmit={handleStartShare} className="share-form">
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
        <button type="submit" className="submit-button">Start Sharing</button>
      </form>
    </div>
  );
};

export default DriverShare;
