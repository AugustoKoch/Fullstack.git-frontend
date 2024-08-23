import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LivroList from './components/LivroList';
import UsuarioList from './components/UsuarioList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/livros" element={<LivroList />} />
          <Route path="/usuarios" element={<UsuarioList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
