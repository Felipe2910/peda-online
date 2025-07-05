import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import Rules from './pages/Rules';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/rules" element={<Rules />} />
        {/* Más rutas */}
      </Routes>
    </Router>
  );
}

export default App;
