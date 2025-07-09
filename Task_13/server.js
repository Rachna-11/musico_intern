const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));  

const { CohereClient } = require("cohere-ai");
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await cohere.generate({
      model: "command",
      prompt: message,
      max_tokens: 50,
    });

    const reply = response.generations[0]?.text?.trim() || "No reply";
    res.json({ reply });
  } catch (err) {
    console.error("Cohere error:", err);
    res.json({ reply: "AI failed to respond." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
