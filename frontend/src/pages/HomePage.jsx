import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import { Suggestion } from "../components/Suggestion";
import Loader from "../components/Loader";
import { Message } from "../components/Message";
import "../styles/HomePage.css";
import "../styles/Suggestion.css";

export const HomePage = () => {
  const { keyword: urlKeyword } = useParams();
  const navigate = useNavigate();
  const userInfo = useMemo(() => {
    return localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
  }, []);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState(urlKeyword || "");

  // Sync keyword state with urlKeyword when URL changes
  useEffect(() => {
    setKeyword(urlKeyword || "");
  }, [urlKeyword]);

  useEffect(() => {
    if (userInfo) {
      const fetchSuggestions = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(
            `https://nomodo-travel-backend.onrender.com/api/suggestions?keyword=${urlKeyword || ""}`
          );
          setSuggestions(data);
          setLoading(false);
        } catch (err) {
          setError(
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message
          );
          setLoading(false);
        }
      };

      fetchSuggestions();
    }
  }, [userInfo, urlKeyword]);

  const submitSearchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      // Navigate to the search URL, which will trigger the useEffect
      navigate(`/search/${keyword}`);
    } else {
      // Navigate back to the homepage if the search is empty
      navigate("/");
    }
  };

  if (userInfo) {
    // --- LOGGED-IN VIEW ---
    return (
      <Container className="mt-5 suggestions-container">
        {/* --- Search + Create --- */}
        <Row className="align-items-center justify-content-between modern-header gx-3 gy-4">
          {/* Search Bar */}
          <Col xs={12} md={8}>
            <Form
              onSubmit={submitSearchHandler}
              className="d-flex modern-search-form"
            >
              <Form.Control
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                placeholder="Search by title or location..."
                className="modern-search-input me-2"
              />
              <Button type="submit" className="modern-search-btn me-2"> Search
              </Button>
            </Form>
          </Col>
        </Row>

        {/* --- Heading (Separate) --- */}
        <Row className="mt-4 mb-2">
          <Col>
            <h2 className="modern-heading">🌍 Latest Travel Suggestions</h2>
          </Col>
        </Row>

        {/* --- Suggestions List --- */}
        <div className="mt-3">
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Row className="gy-4">
              {suggestions.map((suggestion) => (
                <Col key={suggestion._id} sm={12} md={6} lg={4} xl={3}>
                  <Suggestion suggestion={suggestion} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Container>
    );
  } else {
    // --- LOGGED-OUT VIEW (Your original hero section) ---
    return (
      <div className="homepage-hero">
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <Card className="text-center p-5 homepage-card shadow-lg">
            <Card.Body>
              <Card.Title as="h1" className="mb-4 fw-bold homepage-h1">
                Welcome to Nomodo
              </Card.Title>
              <Card.Text className="mb-4 fs-5 homepage-p">
                Your Ultimate Companion for discovering and sharing travel
                suggestions
              </Card.Text>
              <Button
                variant="primary"
                as={Link}
                to="/register"
                className="homepage-btn"
              >
                Get Started
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }
};
