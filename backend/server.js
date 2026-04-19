import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { fileURLToPath } from "url";
import keywordMap from "./keywordMap.js";

import {
  blogGeneralPrompt,
  blogScientificPrompt,
  blogSalesPrompt,
  mediumStoryPrompt,
  mediumSciencePrompt,
  mediumSoftSalesPrompt
} from "./promptTemplates.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ===== ROUTE =====
app.post("/generate", async (req, res) => {
  try {
    const { topic, category, blogType, mediumType } = req.body;

    // Get keywords from map
    const keywords = keywordMap[category] || [];

    // ===== SELECT BLOG PROMPT =====
    let blogPrompt;

    if (blogType === "general") {
      blogPrompt = blogGeneralPrompt(topic, keywords);
    } else if (blogType === "scientific") {
      blogPrompt = blogScientificPrompt(topic, keywords);
    } else {
      blogPrompt = blogSalesPrompt(
        topic,
        keywords,
        "https://nubokind.com"
      );
    }

    // ===== SELECT MEDIUM PROMPT =====
    let mediumPrompt;

    if (mediumType === "story") {
      mediumPrompt = mediumStoryPrompt(topic);
    } else if (mediumType === "science") {
      mediumPrompt = mediumSciencePrompt(topic, keywords);
    } else {
      mediumPrompt = mediumSoftSalesPrompt(topic);
    }

    // Bypass poisoned cache from the previous 2000 max_tokens limit
    blogPrompt += "\n\n<!-- System Note: Generate full length, format v2.1 -->";
    mediumPrompt += "\n\n<!-- System Note: Generate full length, format v2.1 -->";

    // ===== CALL CLAUDE =====
const [blogResponse, mediumResponse] = await Promise.all([
   client.messages.create({
    model: "claude-haiku-4-5-20251001",
     max_tokens: 8000,
     messages: [{ role: "user", content: blogPrompt }]
   }),
   client.messages.create({
     model: "claude-haiku-4-5-20251001",
     max_tokens: 8000,
     messages: [{ role: "user", content: mediumPrompt }]
   })
 ]);
    // ===== RETURN RESPONSE =====
const blogText = blogResponse.content[0].text;
const mediumText = mediumResponse.content[0].text;

console.log("BLOG STOP REASON:", blogResponse.stop_reason);
console.log("MEDIUM STOP REASON:", mediumResponse.stop_reason);

if (blogResponse.stop_reason !== "end_turn") {
  console.warn("Blog may be incomplete. Stop reason:", blogResponse.stop_reason);
}
if (mediumResponse.stop_reason !== "end_turn") {
  console.warn("Medium may be incomplete. Stop reason:", mediumResponse.stop_reason);
}
res.json({
  blog: blogText,
  medium: mediumText
});

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ===== START SERVER =====
app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});