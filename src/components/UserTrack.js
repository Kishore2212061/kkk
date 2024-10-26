// src/components/UserTrack.js
import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database'; // Add `push` for storing data
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
  const [studentName, setStudentName] = useState('');
  const [registerNo, setRegisterNo] = useState('');
  const [department, setDepartment] = useState('');
  const [feedback, setFeedback] = useState('');
  const [path, setPath] = useState([]); // Store the path of the driver's route
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!shareId || !studentName || !registerNo || !department) {
      alert('Please fill in all fields to track.');
      return;
    }

    setIsTracking(true); // Enable tracking

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

  const handleFeedbackSubmit = () => {
    if (!feedback) {
      alert('Please provide feedback before submitting.');
      return;
    }

    // Define the reference for where you want to store feedback
    const feedbackRef = ref(database, `feedback/${registerNo}`); // Using register number as a unique identifier for feedback

    // Create a new feedback entry
    const newFeedback = {
      studentName,
      registerNo,
      department,
      feedback,
      timestamp: new Date().toISOString(), // Optional: add a timestamp for when the feedback was submitted
    };

    // Push the new feedback to the feedback node
    push(feedbackRef, newFeedback)
      .then(() => {
        alert('Feedback submitted successfully!');
        setFeedback('');
        setIsTracking(false); // Reset tracking state if needed
      })
      .catch((error) => {
        alert('Error submitting feedback: ' + error.message);
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
        <input
          type="text"
          placeholder="Enter Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
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
          placeholder="Enter Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="track-button">Track Location</button>
      </form>

      {isTracking && location && (
        <>
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

          <div className="feedback-section">
            <h3>Submit Feedback</h3>
            <textarea
              placeholder="Enter Feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="input-field"
              rows="3"
            />
            <button onClick={handleFeedbackSubmit} className="submit-feedback-button">
              Submit Feedback
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserTrack;
