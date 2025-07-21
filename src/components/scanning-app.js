import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Paper, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTable() {
  const rows = getRandomInt(2, 15);
  const cols = getRandomInt(2, 15);

  // create 2D array of random letters
  const table = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ALPHABETS.charAt(Math.floor(Math.random() * ALPHABETS.length)))
  );

  // Pick a random letter from the table to ask about
  const flatLetters = table.flat();
  const letterToFind = flatLetters[Math.floor(Math.random() * flatLetters.length)];

  // Count occurrences of the letter
  const count = flatLetters.filter((l) => l === letterToFind).length;

  return { table, letterToFind, count, rows, cols };
}

export default function ScanningApp() {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(null);

  const newQuestion = () => {
    const newTable = generateTable();
    setTableData(newTable);
    setUserAnswer("");
    setResult(null);
  };

  useEffect(() => {
    newQuestion();
  }, []);

  const handleSubmit = () => {
    if (!tableData) return;
    const userNum = parseInt(userAnswer, 10);
    if (isNaN(userNum)) {
      setResult({ correct: false, message: "Please enter a valid number." });
      return;
    }
    const correct = userNum === tableData.count;
    setResult({ correct, message: correct ? "✅ Correct!" : `❌ Incorrect. The correct answer is ${tableData.count}` });
  };

  if (!tableData) return null;

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f0f4f8"
      p={2}
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 700, width: "100%", textAlign: "center" }}>
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Button size="small" variant="text" onClick={() => navigate("/")}>
            ← Back to Homepage
          </Button>
        </Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          Scanning Test
        </Typography>

        <Typography variant="h6" mb={3}>
          How many <strong>{tableData.letterToFind}</strong> letters are in the table below?
        </Typography>

        <Table
          sx={{
            margin: "0 auto",
            borderCollapse: "collapse",
            userSelect: "none",
            tableLayout: "fixed",
            maxWidth: "100%",
          }}
          size="small"
          aria-label="scanning-table"
        >
          <TableBody>
            {tableData.table.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((letter, colIndex) => (
                  <TableCell
                    key={colIndex}
                    sx={{
                      border: "1px solid #1976d2",
                      padding: "8px",
                      fontWeight: "bold",
                      fontSize: 20,
                      width: 30,
                      height: 30,
                      textAlign: "center",
                    }}
                  >
                    {letter}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box mt={3} maxWidth={300} mx="auto">
          <TextField
            label="Your Answer"
            variant="outlined"
            fullWidth
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*", style: { textAlign: "center", fontSize: 20 } }}
          />
          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
            Submit
          </Button>
        </Box>

        {result && (
          <Typography
            variant="h6"
            color={result.correct ? "success.main" : "error.main"}
            mt={2}
            fontWeight="bold"
          >
            {result.message}
          </Typography>
        )}

        <Button variant="outlined" sx={{ mt: 3 }} onClick={newQuestion}>
          Next Question
        </Button>
      </Paper>
    </Box>
  );
}
