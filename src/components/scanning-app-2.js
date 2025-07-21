import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@mui/material";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate table and pick two different letters from the table
function generateTableWithTwoLetters() {
    const rows = getRandomInt(2, 15);
    const cols = getRandomInt(2, 15);

    const table = Array.from({ length: rows }, () =>
        Array.from(
            { length: cols },
            () => ALPHABETS.charAt(Math.floor(Math.random() * ALPHABETS.length))
        )
    );

    const flatLetters = table.flat();

    // Pick first letter randomly
    const letter1 = flatLetters[Math.floor(Math.random() * flatLetters.length)];

    // Pick second letter different from first
    let letter2;
    do {
        letter2 = flatLetters[Math.floor(Math.random() * flatLetters.length)];
    } while (letter2 === letter1);

    // Count occurrences
    const count1 = flatLetters.filter((l) => l === letter1).length;
    const count2 = flatLetters.filter((l) => l === letter2).length;

    return { table, rows, cols, letter1, letter2, count1, count2 };
}

export default function ScanningAppLevel2() {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [result, setResult] = useState(null);

    const newQuestion = () => {
        const data = generateTableWithTwoLetters();
        setTableData(data);
        setUserAnswer("");
        setResult(null);
    };

    useEffect(() => {
        newQuestion();
    }, []);

    const handleSubmit = () => {
        if (!tableData) return;

        // Parse user input expecting two numbers separated by space or comma
        const parts = userAnswer
            .split(/[\s,]+/)
            .map((p) => parseInt(p, 10))
            .filter((n) => !isNaN(n));

        if (parts.length !== 2) {
            setResult({
                correct: false,
                message: "Please enter two numbers separated by space or comma.",
            });
            return;
        }

        const [ans1, ans2] = parts;
        const correct =
            ans1 === tableData.count1 && ans2 === tableData.count2;

        setResult({
            correct,
            message: correct
                ? `✅ Correct! There are ${tableData.count1} ${tableData.letter1}'s and ${tableData.count2} ${tableData.letter2}'s.`
                : `❌ Incorrect. Correct answer is ${tableData.count1} ${tableData.letter1}'s and ${tableData.count2} ${tableData.letter2}'s.`,
        });
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
                    Scanning Test Level 2
                </Typography>

                <Typography variant="h6" mb={3}>
                    How many <strong>{tableData.letter1}</strong> and <strong>{tableData.letter2}</strong> letters are in the table below? <br />
                    (Enter two numbers separated by space or comma, e.g. "4 3")
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

                <Box mt={3} maxWidth={350} mx="auto">
                    <TextField
                        label={`Enter counts for ${tableData.letter1} and ${tableData.letter2}`}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="e.g. 4 3 or 4,3"
                        fullWidth
                        sx={{ mt: 2 }}
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
