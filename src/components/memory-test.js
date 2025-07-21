import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Paper,
    Grid,
} from "@mui/material";
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const WORD_POOL = [
    "Cockpit",
    "Runway",
    "Altitude",
    "Airspeed",
    "Checklist",
    "Flaps",
    "Rudder",
    "Throttle",
    "Yoke",
    "Turbulence",
    "Navigation",
    "Autopilot",
    "Mayday",
    "Tower",
    "Crosswind",
    "Descent",
    "Climb",
    "Glide",
    "Rotate",
    "Stall",
    "Landing",
    "Taxiway",
    "Clearance",
    "Approach",
    "Departure",
    "Radar",
    "Beacon",
    "Flightplan",
    "Instrument",
    "Checklist"
];

function getRandomWords(count = 4) {
    const shuffled = [...WORD_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function getRandomQuestionType() {
    return ["position", "reorder"][Math.floor(Math.random() * 2)];
}

function SortableItem({ id }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "8px",
        margin: "8px 0",
        border: "1px solid #1976d2",
        borderRadius: "8px",
        backgroundColor: "#e3f2fd",
        fontWeight: "bold",
        textAlign: "center",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {id}
        </div>
    );
}

export default function MemoryTestApp() {
    const navigate = useNavigate();
    const [words, setWords] = useState([]);
    const [displayed, setDisplayed] = useState(true);
    const [questionType, setQuestionType] = useState("position");
    const [question, setQuestion] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [userAnswer, setUserAnswer] = useState("");
    const [options, setOptions] = useState([]);
    const [result, setResult] = useState(null);

    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        generateNewTest();
    }, []);

    const generateNewTest = () => {
        const newWords = getRandomWords();
        const qType = getRandomQuestionType();
        let q = "";
        let correct = "";
        let choices = [];

        if (qType === "position") {
            const index = Math.floor(Math.random() * newWords.length);
            q = `What was the ${index + 1}${["st", "nd", "rd", "th"][index]} word?`;
            correct = newWords[index];
            choices = [...newWords].sort(() => 0.5 - Math.random());
        } else if (qType === "reorder") {
            q = "Rearrange the words in original order.";
            correct = newWords.join(",");
            const shuffled = [...newWords].sort(() => 0.5 - Math.random());
            setOptions(shuffled);
        }

        setWords(newWords);
        setQuestionType(qType);
        setQuestion(q);
        setCorrectAnswer(correct);
        setUserAnswer("");
        setResult(null);
        setDisplayed(true);

        if (qType === "position") {
            setOptions(choices);
        }

        // Automatically hide words after 5 seconds
        setTimeout(() => {
            setDisplayed(false);
        }, 3000);
    };

    const handleChoice = (choice) => {
        setUserAnswer(choice);
        setResult(choice === correctAnswer);
    };

    const handleSubmit = () => {
        const userOrder = options.join(",");
        setResult(userOrder === correctAnswer);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = options.indexOf(active.id);
            const newIndex = options.indexOf(over.id);
            setOptions((items) => arrayMove(items, oldIndex, newIndex));
        }
    };

    return (
        <Box
            minHeight="100vh"
            bgcolor="#f0f4f8"
            display="flex"
            justifyContent="center"
            alignItems="center"
            p={2}
        >
            <Paper elevation={6} sx={{ p: 4, maxWidth: 600, width: "100%", textAlign: "center" }}>
                <Box display="flex" justifyContent="flex-start" mb={2}>
                    <Button size="small" variant="text" onClick={() => navigate("/")}>
                        ← Back to Homepage
                    </Button>
                </Box>
                <Typography variant="h4" gutterBottom>
                    Short-Term Memory Test
                </Typography>

                {displayed ? (
                    <>
                        <Typography variant="h6" mb={2}>
                            Memorize the words:
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" mb={2}>
                            {words.join(" - ")}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Words will disappear in 3 seconds...
                        </Typography>
                    </>
                ) : (
                    <>
                        <Typography variant="h6" gutterBottom>
                            {question}
                        </Typography>

                        {questionType === "position" ? (
                            <Grid container spacing={2} justifyContent="center" mt={1}>
                                {options.map((opt, idx) => (
                                    <Grid item key={idx}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleChoice(opt)}
                                        >
                                            {opt}
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <>
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext items={options} strategy={verticalListSortingStrategy}>
                                        {options.map((word) => (
                                            <SortableItem key={word} id={word} />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                                    Submit
                                </Button>
                            </>
                        )}

                        {result !== null && (
                            <Typography
                                variant="h6"
                                mt={2}
                                color={result ? "success.main" : "error.main"}
                                fontWeight="bold"
                            >
                                {result ? "✅ Correct!" : `❌ Incorrect. Correct answer: ${correctAnswer}`}
                            </Typography>
                        )}

                        <Button
                            variant="outlined"
                            onClick={generateNewTest}
                            sx={{ mt: 2 }}
                            fullWidth
                        >
                            Next Question
                        </Button>
                    </>
                )}
            </Paper>
        </Box>
    );
}
