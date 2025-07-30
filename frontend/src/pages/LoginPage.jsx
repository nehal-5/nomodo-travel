import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { Message } from "../components/Message";
import "../styles/Login.css";
import LoginImage from "../assets/images/Login.png"; 
export const LoginPage = () => {
  // State for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for feedback
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Hook for navigation
  const navigate = useNavigate();

  // We'll get userInfo from localStorage later to redirect if already logged in
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  useEffect(() => {
    // If user is already logged in, redirect them to the homepage
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const loginUrl = "https://nomodo-travel-backend.onrender.com/api/users/login";

      const { data } = await axios.post(loginUrl, { email, password }, config);

      // On success, save user data (including token) to localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));

      setUserInfo(data);
      setLoading(false);
      // Redirect to homepage on successful login
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError(
        err.response && err.response.data.msg
          ? err.response.data.msg
          : "An unexpected error occurred."
      );
    }
  };

  return (
    <Container className="login-container d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} className="d-none d-md-block">
          <img
            src={LoginImage}
            alt="Register Illustration"
            className="img-fluid register-image"
          />
        </Col>
        <Col xs={12} md={6}>
          <Card className="login-card p-4 shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4 fw-bold">Welcome Back</h2>

              {error && <Message variant="danger">{error}</Message>}
              {loading && <Loader />}

              <Form onSubmit={submitHandler}>
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

                <Button type="submit" className="w-100 login-btn mt-3">
                  Sign In
                </Button>
              </Form>

              <Row className="py-3">
                <Col className="text-center">
                  New user?{" "}
                  <Link to="/register" className="signup-link">
                    Sign Up
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
