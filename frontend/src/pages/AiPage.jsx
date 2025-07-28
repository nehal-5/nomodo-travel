import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card
} from "react-bootstrap";
import axios from "axios";
import { Suggestion } from "../components/Suggestion";
import { Message } from "../components/Message";
import Loader from "../components/Loader";

import '../styles/AIAssistant.css';
const AiPage = () => {
  const [prompt, setPrompt] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : { userInfo: null };

      if (!userInfo || !userInfo.token) {
        setError("You must be logged in to use this feature.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": userInfo.token,
        },
      };

      const { data } = await axios.post(
        "https://nomodo-travel-backend.onrender.com/api/ai/generate-suggestion",
        { prompt },
        config
      );

      setSuggestion(data);
      setLoading(false);
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
    <Container className="mt-5 ai-container">
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <Card className="ai-card">
            <Card.Body>
              <Card.Title as="h1" className="ai-title">
                🧠 AI Travel Assistant
              </Card.Title>
              <Card.Text className="ai-description">
                Describe your ideal trip (e.g., <em>"a quiet beach"</em>,{" "}
                <em>"a historical temple"</em>,{" "}
                <em>"a place for nature lovers"</em>) and let our AI find the
                perfect suggestion!
              </Card.Text>

              <Form onSubmit={submitHandler}>
                <Form.Group controlId="prompt">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Tell me what you're looking for..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="ai-textarea"
                  />
                </Form.Group>

                <div className="d-grid mt-3">
                  <Button
                    type="submit"
                    className="ai-submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "✨ Get Suggestion"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <div className="mt-5">
            {loading && <Loader />}
            {error && <Message variant="danger">{error}</Message>}
            {suggestion && (
              <div className="ai-result">
                <h2 className="ai-result-title">Ahhh! We Got Youuuu 🎉</h2>
                <Suggestion suggestion={suggestion} />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AiPage;
