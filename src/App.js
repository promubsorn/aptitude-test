// import React from 'react';
// import { BrowserRouter } from "react-router-dom";
// import MentalMathApp from './components/mental-math-trainer';

// function App() {
//   return (
//     <BrowserRouter basename="/mental-math">
//       <MentalMathApp />
//     </BrowserRouter>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MentalMathApp from './components/mental-math-trainer';
import ScanningApp from './components/scanning-app'; 
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
function Home() {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#e3f2fd"
      p={2}
    >
      <Paper elevation={6} sx={{ p: 5, maxWidth: 500, width: "100%", textAlign: "center" }}>
        <AirplaneTicketIcon sx={{ fontSize: 60, color: "#1976d2", mb: 1 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Aptitude Tests for Pilots
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Choose a test to practice your skills.
        </Typography>
        <Stack spacing={2}>
          <Button
            component={Link}
            to="/mental-math"
            variant="outlined"
            size="large"
            fullWidth
          >
            ✏️ Mental Math
          </Button>
          <Button
            component={Link}
            to="/scanning-test"
            variant="outlined"
            size="large"
            fullWidth
          >
            👀 Scanning Test
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}


function App() {
  return (
    <BrowserRouter basename="/aptitude-test">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mental-math" element={<MentalMathApp />} />
        <Route path="/scanning-test" element={<ScanningApp />} />
        {/* Add more routes for other tests */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
