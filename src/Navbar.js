import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import './Navbar.css';

function NavigationBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="#home" className="mx-3">Pont Network</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mx-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/track-data">Track Data</Nav.Link>
          <Nav.Link as={Link} to="/ship-management">Ship Management</Nav.Link>
          <Nav.Link as={Link} to="/external-observer-request">External Observer Request</Nav.Link>
        </Nav>
        <div className="ml-auto mx-3">
          <WalletMultiButton />
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;