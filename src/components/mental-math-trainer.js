import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Paper } from "@mui/material";
import { useNavigate } from 'react-router-dom';


const generateQuestion = () => {
  const a = Math.floor(Math.random() * 90 + 10);
  const b = Math.floor(Math.random() * 90 + 10);
  const op = ["+", "-", "×"][Math.floor(Math.random() * 3)];
  let answer;
  switch (op) {
    case "+": answer = a + b; break;
    case "-": answer = a - b; break;
    case "×": answer = a * b; break;
  }
  return { a, b, op, answer };
};

const speak = (text, onEnd) => {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.onend = () => {
    if (onEnd) onEnd();
  };
  synth.speak(utter);
};

export default function MentalMathApp() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  const startNewQuestion = () => {
    const q = generateQuestion();
    setQuestion(q);
    setShowQuestion(true);
    setResult(null);
    setUserAnswer("");
    setStartTime(Date.now());

    const opText = q.op === "×" ? "times" : q.op === "-" ? "minus" : q.op;
    const spokenText = `What is ${q.a} ${opText} ${q.b}?`;

    speak(spokenText);

    setTimeout(() => {
      setShowQuestion(false);
    }, 2000);
  };

  const checkAnswer = () => {
    if (!question) return;
    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    const correct = parseFloat(userAnswer) === question.answer;
    setResult({ correct, timeTaken });
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f5f5"
      p={2}
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 500, width: '100%', textAlign: 'center' }}>
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Button size="small" variant="text" onClick={() => navigate("/")}>
            ← Back to Homepage
          </Button>
        </Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          Mental Math Trainer
        </Typography>

        {!hasStarted ? (
          <Button variant="contained" onClick={() => { setHasStarted(true); startNewQuestion(); }}>
            Start Test
          </Button>
        ) : (
          <>
            {showQuestion && question ? (
              <Typography variant="h2" fontWeight="bold" color="text.secondary">
                {question.a} {question.op} {question.b}
              </Typography>
            ) : (
              <Typography variant="h6" color="text.disabled">
                Answer the question below
              </Typography>
            )}

            {!showQuestion && (
              <Box mt={3}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Your answer"
                  inputProps={{ style: { fontSize: 24, textAlign: 'center' } }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={checkAnswer}
                >
                  Submit
                </Button>
              </Box>
            )}

            {result && (
              <Box mt={4}>
                <Typography variant="h5" color={result.correct ? "success.main" : "error"}>
                  {result.correct ? "✅ Correct!" : `❌ Incorrect. The answer was ${question.answer}`}
                </Typography>
                <Typography variant="body1" mt={1}>
                  ⏱ Time taken: {result.timeTaken} seconds
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={startNewQuestion}
                >
                  Next Question
                </Button>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}