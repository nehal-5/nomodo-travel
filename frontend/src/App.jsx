import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Container } from "react-bootstrap";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import SuggestionCreatePage from "./pages/SuggestionCreatePage";
import AiPage from "./pages/AiPage";
import PlannerPage from "./pages/PlannerPage";
import Need from "./components/Need";

const App = () => {
  const [userInfo, setUserInfo] = useState(null);

  // Use useEffect to initialize state from localStorage
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (error) {
        console.error('Error parsing stored user info:', error);
        localStorage.removeItem('userInfo'); // Clean up corrupted data
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  // Custom setUserInfo that also updates localStorage
  const updateUserInfo = (userData) => {
    if (userData) {
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUserInfo(userData);
    } else {
      localStorage.removeItem('userInfo');
      setUserInfo(null);
    }
  };
  return (
    <Router>
      <Header userInfo={userInfo} setUserInfo={setUserInfo} />
      {userInfo && <Need />}
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomePage userInfo={userInfo} />} />
            <Route path="/login" element={<LoginPage setUserInfo={updateUserInfo} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<SuggestionCreatePage />} />
            <Route path="/search/:keyword" element={<HomePage userInfo={userInfo} />} />
            <Route path="/ai" element={<AiPage />} />
            <Route path="/planner" element={<PlannerPage />} />
          </Routes>
        </Container>
      </main>
      <footer className="modern-footer mt-4">
        <Container>
          <p className="footer-text">
            &copy; {new Date().getFullYear()} Nomodo. All rights reserved.
          </p>
        </Container>
      </footer>
    </Router>
  );
};

export default App;
