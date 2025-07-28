import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import "../styles/Suggestion.css";
import { Message } from "../components/Message";
import Loader from "../components/Loader";

const SuggestionCreatePage = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // ...existing code...
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get user info (and token) from localStorage
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;

      if (!userInfo || !userInfo.token) {
        setError("You must be logged in to create a suggestion.");
        setLoading(false);
        return;
      }

      // Set up the request config with the auth token
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": userInfo.token,
        },
      };

      await axios.post(
        "https://nomodo-travel-backend.onrender.com/api/suggestions",
        { title, location, description, image },
        config
      );

      setLoading(false);
      // Redirect to the homepage to see the new suggestion
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
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={8} className="modern-form-container">
          <h1 className="modern-form-heading">Create a New Suggestion</h1>
          {error && <Message variant="danger">{error}</Message>}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="title" className="modern-form-group">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Beach Camping at Rishikonda"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="location" className="modern-form-group">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Visakhapatnam, Andhra Pradesh"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="description" className="modern-form-group">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Describe the experience..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="image" className="modern-form-group">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" className="modern-submit-btn mt-3">
              Submit Suggestion
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SuggestionCreatePage;
