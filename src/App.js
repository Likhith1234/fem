import './App.css';
import React from 'react';
import Home from "./pages/Home"; 
import Solve from './pages/Solve';
import Results from './pages/Results';
import Help from "./pages/Help"; 
import { Route, Routes } from 'react-router';

function App() {
  return (
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/solve' element={<Solve />} />
          <Route path='/results' element={<Results />} />
          <Route path='/help' element={<Help />} />
        </Routes>
      </div>
  )
}

export default App;
