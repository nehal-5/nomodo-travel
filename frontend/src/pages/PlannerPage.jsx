import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Planner.css';
import { Message } from '../components/Message';
import Loader from '../components/Loader';

const TripPlanDisplay = ({ plan, onReset }) => (
  <div className="trip-card">
    <h2 className="trip-title">{plan.placeName}</h2>
    <div className="trip-body">
      <h3 className="trip-location">{plan.location}</h3>
      <p className="trip-subtitle">Best time to visit: <strong>{plan.bestTimeToVisit}</strong></p>
      <p><strong>Why this is a great choice for you:</strong> {plan.whyThisPlace}</p>
      <hr />
      <h3>Your 2-Day Itinerary</h3>
      {plan.itinerary.map(dayPlan => (
        <div key={dayPlan.day} className="itinerary-day">
          <h4>Day {dayPlan.day}: {dayPlan.title}</h4>
          <ul className="activity-list">
            {dayPlan.activities
              .split(/\. ?/)
              .filter(item => item.trim() !== '')
              .map((item, idx) => (
                <li key={idx}>{item.trim()}.</li>
              ))}
          </ul>
        </div>
      ))}
      <button className="btn-secondary" onClick={onReset}>Plan Another Trip</button>
    </div>
  </div>
);


const PlannerPage = () => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({ travelStyle: '', month: '', locationType: '' });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelect = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
    if (step === 3) {
      generatePlan({ ...preferences, [field]: value });
    } else {
      setStep(prev => prev + 1);
    }
  };

  const generatePlan = async (finalPreferences) => {
    setLoading(true);
    setError(null);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': userInfo?.token || ''
        }
      };
      const { data } = await axios.post('http://localhost:5000/api/planner/generate-plan', finalPreferences, config);
      setPlan(data);
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const resetPlanner = () => {
    setStep(1);
    setPreferences({ travelStyle: '', month: '', locationType: '' });
    setPlan(null);
    setError(null);
  };

  const renderOptions = (field, title, options) => (
    <>
      <h2 className="step-title">{title}</h2>
      <div className="option-grid">
        {options.map(option => (
          <button
            key={option}
            className="btn-option"
            onClick={() => handleSelect(field, option)}
          >
            {option}
          </button>
        ))}
      </div>
    </>
  );

  const renderStep = () => {
    if (loading) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;
    if (plan) return <TripPlanDisplay plan={plan} onReset={resetPlanner} />;

    switch (step) {
      case 1:
        return renderOptions('travelStyle', 'How would you like to travel?', ['Solo', 'With a Partner', 'With Family']);
      case 2:
        return renderOptions('month', 'Which month would you like to travel?', ['January', 'April', 'August', 'December']);
      case 3:
        return renderOptions('locationType', 'Which location interests you?', ['Beach', 'Historical Site', 'Hill Station']);
      default:
        return null;
    }
  };

  return (
    <div className="planner-container">
      <div className="planner-card">
        {renderStep()}
      </div>
    </div>
  );
};

export default PlannerPage;
