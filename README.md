# Nomodo - Your AI-Powered Travel Companion ✈️

Nomodo is a full-stack MERN application designed to be the ultimate companion for discovering, sharing, and planning your next adventure. It solves the common problem of "where should I go next?" by combining user-generated travel suggestions with the creative power of AI.

This project was built to demonstrate a modern, feature-rich web application using the MERN stack, complete with secure authentication, real-time data handling, and integration with third-party AI services.

## ✨ Key Features

* **Secure Authentication:** Users can sign up and log in securely using a system powered by JSON Web Tokens (JWT). Passwords are encrypted using bcryptjs.
* **Browse & Share Suggestions:** Logged-in users can browse a feed of travel ideas shared by others and create their own suggestions with titles, descriptions, locations, and images.
* **Powerful Search:** A dynamic search bar allows users to instantly filter suggestions by keywords, searching against both titles and locations.
* **AI Travel Assistant:** A dedicated page where users can get instant, unique travel ideas by providing a simple prompt (e.g., "suggest a quiet beach") to a generative AI.
* **AI Trip Planner:** A guided, multi-step form that asks users about their travel style, preferred month, and location type to generate a complete, day-by-day itinerary for a 2-day trip.
* **Protected Routes:** Backend routes are protected to ensure that only authenticated users can create content or access private features.

## 🛠️ Tech Stack

This project is built using the MERN stack and other modern web technologies.

**Frontend:**

* **React.js (with Vite):** For a fast, modern, and efficient user interface.
* **React Router:** For client-side routing and navigation.
* **React-Bootstrap & Bootstrap:** For a responsive and clean design system.
* **Axios:** For making HTTP requests to the backend API.

**Backend:**

* **Node.js:** As the JavaScript runtime environment.
* **Express.js:** As the web server framework.
* **MongoDB:** A NoSQL database for storing user and suggestion data.
* **Mongoose:** As the Object Data Modeling (ODM) library for MongoDB.
* **JSON Web Token (JWT):** For secure user authentication.
* **Bcrypt.js:** For hashing user passwords.

**APIs & Services:**

* **Google Gemini API:** To power the AI Assistant and Trip Planner features.

## 🚀 Live Deployment
[Try out here](https://nomodo-travel.onrender.com/)
