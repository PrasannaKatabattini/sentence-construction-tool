const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());

// Load questions from JSON file
let questions = [];
try {
  const rawData = fs.readFileSync("./sample.json", "utf8");
  const parsedData = JSON.parse(rawData);
  if (parsedData.status === "SUCCESS" && parsedData.data?.questions?.length > 0) {
    questions = parsedData.data.questions.map((q, idx) => ({
      id: idx + 1,
      sentence: q.question,
      options: q.options,
      correctAnswers: q.correctAnswer,
    }));
  } else {
    throw new Error("Invalid data format in sample.json");
  }
} catch (err) {
  console.error("Error loading questions:", err.message);
}

// Serve a question by index
app.get("/api/question/:index", (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (isNaN(index) || index < 0 || index >= questions.length) {
    return res.status(400).json({
      success: false,
      message: "Invalid question index",
    });
  }

  res.json({
    success: true,
    data: questions[index],
    index,
    total: questions.length,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
