import React from "react";
import { Link } from "react-router-dom";
import "../styles/Need.css";

const cards = [
  {
    title: "Create a suggestion",
    link: "/create",
    description: "Share your ideas or feedback with everyone.",
  },
  {
    title: "Plan a trip",
    link: "/planner",
    description: "Organize your next adventure easily.",
  },
  {
    title: "AI Assistant",
    link: "/ai",
    description: "Get help from our smart assistant.",
  },
  {
    title: "Search suggestions",
    link: "/",
    description: "Find suggestions based on your interests.",
  }
];

const Need = () => (
  <div className="need-container">
    <h2 className="need-heading">💭 What's on your Mind?</h2>
    <div className="card-list">
      {cards.map((card) => (
        <Link to={card.link} className="need-card" key={card.title}>
          <h3 className="card-title">{card.title}</h3>
          <p className="card-desc">{card.description}</p>
        </Link>
      ))}
    </div>
  </div>
);

export default Need;
