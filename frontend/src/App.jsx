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

const App = () => {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  return (
    <Router>
      <Header userInfo={userInfo} setUserInfo={setUserInfo} />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomePage userInfo={userInfo} />} />
            <Route path="/login" element={<LoginPage />} />
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
