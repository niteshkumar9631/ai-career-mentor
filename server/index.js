const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const geminiRoutes = require("./routes/geminiRoutes");

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"], // frontend origins
  credentials: true
}));
app.use(express.json());

app.use("/api/ai", geminiRoutes);

app.get("/", (req, res) => {
  res.send("✅ AI Career Mentor Server is Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
