import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';

const generateQuestion = () => {
  const a = Math.floor(Math.random() * 90 + 10); // two-digit number
  const b = Math.floor(Math.random() * 90 + 10);
  const op = ["+", "-", "×"][Math.floor(Math.random() * 3)];
  // const op = ["+", "-", "×", "÷"][Math.floor(Math.random() * 4)];
  let answer;
  switch (op) {
    case "+": answer = a + b; break;
    case "-": answer = a - b; break;
    case "×": answer = a * b; break;
    // case "÷": answer = parseFloat((a / b).toFixed(2)); break;
  }
  return { a, b, op, answer };
};

const speak = (text) => {
  const synth = window.speechSynthesis;
  if (synth.speaking) synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  synth.speak(utter);
};

export default function MentalMathApp() {
  const [question, setQuestion] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(null);

  const startNewQuestion = () => {
    const q = generateQuestion();
    setQuestion(q);
    setShowQuestion(true);
    setResult(null);
    setUserAnswer("");
    setStartTime(Date.now());

    const spokenText = `What is ${q.a} ${q.op === "×" ? "times" : q.op === "÷" ? "divided by" : q.op} ${q.b}?`;
    speak(spokenText);

    setTimeout(() => {
      setShowQuestion(false);
    }, 5000);
  };

  const checkAnswer = () => {
    if (!question) return;
    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    const correct = parseFloat(userAnswer) === question.answer;
    setResult({ correct, timeTaken });
  };

  useEffect(() => {
    startNewQuestion();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Mental Math Trainer</h1>

      {showQuestion && question ? (
        <div className="text-xl font-semibold">
          What is {question.a} {question.op} {question.b} ?
        </div>
      ) : (
        <div className="text-gray-500">Answer the question...</div>
      )}

      {!showQuestion && (
        <div className="space-y-2">
          <input
            type="text"
            className="border p-2 w-full"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your answer"
          />
          <br />
          <Button variant="contained" sx={{ margin: '10px 20px' }}  onClick={checkAnswer}>Submit</Button>
        </div>
      )}

      {result && (
        <div className="mt-4">
          <p>{result.correct ? "✅ Correct!" : `❌ Incorrect. Correct answer was ${question.answer}`}</p>
          <p>⏱ Time taken: {result.timeTaken} seconds</p>
          <Button variant="contained" className="mt-2" onClick={startNewQuestion}>Next Question</Button>
        </div>
      )}
    </div>
  );
}
