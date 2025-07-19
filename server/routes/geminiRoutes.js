const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/career-path", async (req, res) => {
  const { query, responseType } = req.body;

  // Auto extract skills based on keywords (basic logic)
  let autoSkills = "Basic web development";
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("mern")) {
    autoSkills = "MongoDB, Express.js, React, Node.js";
  } else if (lowerQuery.includes("full stack")) {
    autoSkills = "HTML, CSS, JavaScript, React, Node.js, Express, MongoDB";
  } else if (lowerQuery.includes("ai") || lowerQuery.includes("ml")) {
    autoSkills = "Python, Machine Learning, TensorFlow, PyTorch";
  } else if (lowerQuery.includes("android")) {
    autoSkills = "Java, Kotlin, Android Studio";
  } else if (lowerQuery.includes("frontend")) {
    autoSkills = "HTML, CSS, JavaScript, React, Next.js";
  } else if (lowerQuery.includes("backend")) {
    autoSkills = "Node.js, Express, MongoDB, SQL, Authentication";
  }

  const prompt = `
User Query: ${query}
Detected Skills: ${autoSkills}

${responseType === "short"
    ? "Give a 3-line summary of the best AI career path in bullet points."
  : "Suggest a detailed step-by-step career roadmap with skills, resources, and learning path in bullet points. Use clear headings and avoid long paragraphs."
}`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const roadmap = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No roadmap generated.";
    res.json({ roadmap });

  } catch (error) {
    console.error("Gemini API Error:", JSON.stringify(error.response?.data || error.message, null, 2));
    res.status(500).json({
      message: "AI response failed",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
