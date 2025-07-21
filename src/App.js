import React from 'react';
import { BrowserRouter } from "react-router-dom";
import MentalMathApp from './components/mental-math-trainer';

function App() {
  return (
    <BrowserRouter basename="/mental-math">
      <MentalMathApp />
    </BrowserRouter>
  );
}

export default App;