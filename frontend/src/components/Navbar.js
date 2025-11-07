import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaGlobe, FaShieldAlt, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';

const CustomNavbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar 
      expand="lg" 
      className="custom-navbar shadow-sm" 
      fixed="top"
      expanded={expanded}
      onToggle={setExpanded}
      style={{
        background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-orange) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="d-flex align-items-center text-white fw-bold"
          onClick={handleNavClick}
          style={{ fontSize: '1.5rem' }}
        >
          <FaGlobe className="me-2" style={{ fontSize: '1.8rem' }} />
          <span className="d-none d-sm-inline">International Payment System</span>
          <span className="d-sm-none">IPS</span>
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="basic-navbar-nav"
          className="border-0 text-white"
          style={{ boxShadow: 'none' }}
        >
          <FaBars />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            {!isAuthenticated ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/" 
                  className="text-white fw-medium px-3 py-2 rounded transition-all"
                  onClick={handleNavClick}
                  style={{ 
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Home
                </Nav.Link>
                
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className="text-white fw-medium px-3 py-2 rounded transition-all"
                  onClick={handleNavClick}
                  style={{ 
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <FaShieldAlt className="me-1" />
                  Login
                </Nav.Link>

                <Button
                  as={Link}
                  to="/register"
                  variant="outline-light"
                  className="ms-2 fw-medium px-4 py-2"
                  onClick={handleNavClick}
                  style={{
                    borderRadius: '25px',
                    border: '2px solid white',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.color = 'var(--primary-orange)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/dashboard" 
                  className="text-white fw-medium px-3 py-2 rounded transition-all"
                  onClick={handleNavClick}
                  style={{ 
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Dashboard
                </Nav.Link>

                <div className="d-flex align-items-center text-white ms-3 me-3">
                  <FaUser className="me-2" />
                  <span className="fw-medium">
                    {user?.name || 'User'}
                  </span>
                </div>

                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                  className="d-flex align-items-center fw-medium px-3 py-2"
                  style={{
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  }}
                >
                  <FaSignOutAlt className="me-1" />
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
