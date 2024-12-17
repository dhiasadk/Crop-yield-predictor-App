import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Header from "./components/header";
import "./App.css";

const App = () => {
  return (
    <Router>
      <MainContent />
    </Router>
  );
};

const MainContent = () => {
  const location = useLocation(); // Hook to get current route

  // Check if the current route is "/dashboard"
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="app">
      {/* Render Header only if not on Dashboard */}
      {!isDashboard && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

const Home = () => {
  return (
    <div className="home">
      {/* <h1>Bienvenue sur Crop Yield Predictor</h1>
      <a href="/dashboard">
        <button>Voir le Dashboard</button>
      </a> */}
    </div>
  );
};

export default App;
