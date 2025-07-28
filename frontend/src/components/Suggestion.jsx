import React from 'react';
import { Card } from 'react-bootstrap';
import '../styles/Suggestion.css';

export const Suggestion = ({ suggestion }) => {
  return (
    <Card className="modern-suggestion-card my-3 p-3">
      {suggestion.image && (
        <Card.Img src={suggestion.image} variant="top" alt={suggestion.title} />
      )}

      <Card.Body>
        <Card.Title as="div">{suggestion.title}</Card.Title>

        <Card.Subtitle className="mb-2">
          📍 {suggestion.location}
        </Card.Subtitle>

        <Card.Text as="p">
          {suggestion.description}
        </Card.Text>

        <Card.Text as="small">
          Suggested by:{' '}
          <span>{suggestion.user ? suggestion.user.username : 'Anonymous'}</span>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

