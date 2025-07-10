// File: /src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BachecaBimbi from './pages/BachecaBimbi';
import AreaGenitori from './pages/AreaGenitori';

const App = () => {
  return (
    <Router>
      <nav style={{ padding: '1em', background: '#eee', marginBottom: '1em' }}>
        <Link to="/" style={{ marginRight: '1em' }}>Homepage</Link>
        <Link to="/bacheca" style={{ marginRight: '1em' }}>Bacheca Bimbi</Link>
        <Link to="/genitori">Area Genitori</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bacheca" element={<BachecaBimbi />} />
        <Route path="/genitori" element={<AreaGenitori />} />
      </Routes>
    </Router>
  );
};

export default App;
