import React from 'react';
import './App.css';
import MentalMathApp from './components/mental-math-trainer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ErrorBoundary from './components/error-boundary';
const theme = createTheme(); // You can customize the theme here if needed

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <div className="App">
          <MentalMathApp />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;