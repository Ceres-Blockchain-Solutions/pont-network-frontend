import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NavigationBar from './Navbar';
import TrackData from './TrackData';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <Routes>
          <Route exact path="/"/>
          <Route path="/track-data" element={<TrackData />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;