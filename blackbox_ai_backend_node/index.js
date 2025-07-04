import express from "express"; // Change
import cors from "cors"; // Change
import scanner from "./codescanner.js"; // Change - add .js extension
import { GoogleGenerativeAI } from "@google/generative-ai"; // Change
import 'dotenv/config'; // Change: Load dotenv early and correctly for ES Modules

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", scanner);

// --- ADD THIS NEW ROUTE HERE ---
app.get("/", (req, res) => {
  res.send("Welcome to the Blackbox AI Backend API!");
});
// -------------------------------

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🧠 Code Generation
app.post("/api/generate-code", async (req, res) => {
  try {
    const { prompt } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    res.json({ result: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🐛 Bug Fixing
app.post("/api/debug", async (req, res) => {
  try {
    const { code } = req.body;
    const prompt = `The following code has a bug. Fix it and explain the fix:\n\n\n\`\`\`\n${code}\n\`\`\``;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    res.json({ result: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📖 Code Explanation
app.post("/api/explain", async (req, res) => {
  try {
    const { code } = req.body;
    const prompt = `Explain the following code line by line:\n\n\`\`\`\n${code}\n\`\`\``;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    res.json({ result: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔄 Code Conversion
app.post("/api/convert-code", async (req, res) => {
  try {
    const { code, source = "Python", target = "JavaScript" } = req.body;
    const prompt = `Convert the following code from ${source} to ${target}:\n\n\`\`\`${source.toLowerCase()}\n${code}\n\`\`\``;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    res.json({ result: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});