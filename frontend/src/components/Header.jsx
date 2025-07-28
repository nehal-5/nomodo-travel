import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaUser, FaUserPlus, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import '../styles/Header.css';

export const Header = ({ userInfo, setUserInfo }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null); // Update parent state
    navigate('/login');
  };

  return (
    <header>
      <Navbar
        expand="lg"
        variant="dark"
        className="custom-navbar"
        sticky="top"
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="fw-bold brand-text">Nomodo</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              {userInfo && (
                <LinkContainer to="/planner">
                  <Nav.Link><i className="fas fa-map-signs"></i> Trip Planner</Nav.Link>
                </LinkContainer>
              )}
              {userInfo ? (
                <NavDropdown
                  title={
                    <>
                      <FaUserCircle className="me-2" />
                      {userInfo.user.username}
                    </>
                  }
                  id="username"
                  className="dropdown-custom"
                >

                  <LinkContainer to="/ai">
                    <NavDropdown.Item>AI Assistant</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={logoutHandler}>
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link className="nav-link-custom">
                      <FaUser className="me-2" />
                      Sign In
                    </Nav.Link>
                  </LinkContainer>

                  <LinkContainer to="/register">
                    <Nav.Link className="nav-link-custom">
                      <FaUserPlus className="me-2" />
                      Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};