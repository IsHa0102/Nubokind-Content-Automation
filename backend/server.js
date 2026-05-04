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

// Middleware — order matters: cors + json BEFORE static
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ===== IN-MEMORY HISTORY =====
const history = [];

// ===== HELPER: Select blog prompt =====
function selectBlogPrompt(topic, keywords, blogType, description) {
  if (blogType === "general") {
    return blogGeneralPrompt(topic, keywords, description);
  } else if (blogType === "scientific") {
    return blogScientificPrompt(topic, keywords, description);
  } else {
    return blogSalesPrompt(topic, keywords, "https://nubokind.com", description);
  }
}

// ===== HELPER: Select medium prompt =====
function selectMediumPrompt(topic, keywords, mediumType, description) {
  if (mediumType === "story") {
    return mediumStoryPrompt(topic, description);
  } else if (mediumType === "science") {
    return mediumSciencePrompt(topic, keywords, description);
  } else {
    return mediumSoftSalesPrompt(topic, description);
  }
}

// ===== HELPER: Call Claude =====
async function callClaude(prompt) {
  // Cache-busting note to avoid stale responses
  const fullPrompt = prompt + "\n\n<!-- System Note: Generate full length, format v2.1 -->";
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 8000,
    messages: [{ role: "user", content: fullPrompt }]
  });
  if (response.stop_reason !== "end_turn") {
    console.warn("Response may be incomplete. Stop reason:", response.stop_reason);
  }
  return response.content[0].text;
}

// ===== HELPER: Clean blog HTML =====
// Post-processes Claude's blog output to fix CSS bleedthrough into Shopify theme.
// Runs every time regardless of what Claude generated — reliable, not prompt-dependent.
function cleanBlogHtml(html) {
  // 1. Remove border-bottom from h1 rules → prevents the thick line under the title
  html = html.replace(/(h1[^{]*\{[^}]*)border-bottom\s*:[^;]+;?\s*/g, "$1");
  html = html.replace(/(h1[^{]*\{[^}]*)padding-bottom\s*:[^;]+;?\s*/g, "$1");

  // 2. Scope bare `a { }` selectors to `article a { }` → prevents navbar underlines.
  // Only matches when `a` is the only/leading selector on the line (not `.card a {`).
  html = html.replace(/^(\s*)a(\s*\{)/gm, "$1article a$2");

  return html;
}

// ===== GET /history =====
app.get("/history", (req, res) => {
  // Return history newest-first, without full content (just metadata) for list
  const summary = history.map(item => ({
    id: item.id,
    timestamp: item.timestamp,
    topic: item.topic,
    category: item.category,
    blogType: item.blogType,
    mediumType: item.mediumType,
    description: item.description,
    hasBlog: !!item.blog,
    hasArticle: !!item.article
  }));
  res.json(summary.slice().reverse());
});

// ===== GET /history/:id =====
app.get("/history/:id", (req, res) => {
  const item = history.find(h => h.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

// ===== POST /generate-blog =====
app.post("/generate-blog", async (req, res) => {
  try {
    const { topic, category, blogType, description } = req.body;
    const keywords = keywordMap[category] || [];

    const blogPrompt = selectBlogPrompt(topic, keywords, blogType || "general", description);
    const blogText = cleanBlogHtml(await callClaude(blogPrompt));

    console.log("BLOG generated for:", topic);

    // Save to history
    history.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      topic,
      category,
      blogType: blogType || "general",
      mediumType: null,
      description: description || "",
      blog: blogText,
      article: null
    });

    res.json({ blog: blogText });
  } catch (error) {
    console.error("ERROR /generate-blog:", error);
    res.status(500).json({ error: "Something went wrong generating the blog" });
  }
});

// ===== POST /generate-article =====
app.post("/generate-article", async (req, res) => {
  try {
    const { topic, category, mediumType, description } = req.body;
    const keywords = keywordMap[category] || [];

    const mediumPrompt = selectMediumPrompt(topic, keywords, mediumType || "story", description);
    const articleText = await callClaude(mediumPrompt);

    console.log("ARTICLE generated for:", topic);

    // Save to history
    history.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      topic,
      category,
      blogType: null,
      mediumType: mediumType || "story",
      description: description || "",
      blog: null,
      article: articleText
    });

    res.json({ article: articleText });
  } catch (error) {
    console.error("ERROR /generate-article:", error);
    res.status(500).json({ error: "Something went wrong generating the article" });
  }
});

// ===== POST /generate (legacy — generates both) =====
app.post("/generate", async (req, res) => {
  try {
    const { topic, category, blogType, mediumType, description } = req.body;
    const keywords = keywordMap[category] || [];

    const blogPrompt = selectBlogPrompt(topic, keywords, blogType || "general", description);
    const mediumPrompt = selectMediumPrompt(topic, keywords, mediumType || "story", description);

    const [blogText, articleText] = await Promise.all([
      callClaude(blogPrompt).then(cleanBlogHtml),
      callClaude(mediumPrompt)
    ]);

    console.log("BLOG+ARTICLE generated for:", topic);

    // Save to history
    history.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      topic,
      category,
      blogType: blogType || "general",
      mediumType: mediumType || "story",
      description: description || "",
      blog: blogText,
      article: articleText
    });

    res.json({ blog: blogText, medium: articleText });
  } catch (error) {
    console.error("ERROR /generate:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ===== GLOBAL ERROR HANDLER (always returns JSON, never HTML) =====
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});