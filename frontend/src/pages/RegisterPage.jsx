import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { Message } from "../components/Message";
import "../styles/Register.css"; 
import RegisterImage from "../assets/images/Register.png";

export const RegisterPage = () => {
  // State for form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for feedback
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // The URL for our backend registration endpoint
      const registerUrl = "http://localhost:5000/api/users/register";

      const { data } = await axios.post(
        registerUrl,
        { username, email, password },
        config
      );

      setLoading(false);
      setMessage(data.message); // "User registered successfully! Now"

      // Optionally clear form fields after successful registration
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setLoading(false);
      // Set error message from backend response if it exists, otherwise a generic one
      setError(
        err.response && err.response.data.msg
          ? err.response.data.msg
          : "An unexpected error occurred."
      );
    }
  };

  return (
    <Container className="register-container d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 align-items-center">
        <Col md={6} className="d-none d-md-block">
          <img
            src={RegisterImage}
            alt="Register Illustration"
            className="img-fluid register-image"
          />
        </Col>
        <Col xs={12} md={6}>
          <Card className="register-card p-4 shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4 fw-bold">Create Account</h2>

              {message && <Message variant="success">{message}</Message>}
              {error && <Message variant="danger">{error}</Message>}
              {loading && <Loader />}

              <Form onSubmit={submitHandler}>
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-input"
                  />
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-input"
                  />
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-input"
                  />
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-input"
                  />
                </Form.Group>

                <Button type="submit" className="w-100 register-btn mt-3">
                  Sign Up
                </Button>
              </Form>

              <Row className="py-3">
                <Col className="text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="login-link">
                    Sign In
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
    </Container>
  );
};
