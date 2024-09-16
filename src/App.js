import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NavigationBar from './Navbar';
import TrackData from './TrackData';
import DataDetails from './DataDetails'; // Import the new component
import process from 'process';
import ExternalObserverRequest from "./ExternalObserverRequest"
import ShipAccounts from './ShipAccounts';


function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <Routes>
          <Route exact path="/" />
          <Route path="/track-data" element={<TrackData />} />
          <Route path="/external-observer-request" element={<ExternalObserverRequest />} />
          <Route path="/data-details/:index" element={<DataDetails />} />
          <Route path="/ship-accounts" element={<ShipAccounts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;