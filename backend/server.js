import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { fileURLToPath } from "url";
import keywordMap from "./keywordMap.js";

import {
  blogGeneralPrompt,
  blogScientificPrompt,
  blogSalesPrompt,
  mediumStoryPrompt,
  mediumSciencePrompt,
  mediumSoftSalesPrompt,
  buildThumbnailPrompt,
  buildInfographicPrompt
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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
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

// ===== HELPER: Parse metadata block from Claude's blog output =====
// Claude appends a <!--METADATA_START--> ... <!--METADATA_END--> block after the HTML.
// This function extracts it, returning { htmlContent, title, metaTitle, metaDescription, excerpt }.
function parseBlogOutput(rawText) {
  // Split on the metadata delimiter
  const metaStartTag = "<!--METADATA_START-->";
  const metaEndTag = "<!--METADATA_END-->";

  const metaStart = rawText.indexOf(metaStartTag);
  const metaEnd = rawText.indexOf(metaEndTag);

  let htmlContent = rawText;
  let metaTitle = "";
  let metaDescription = "";
  let excerpt = "";

  if (metaStart !== -1 && metaEnd !== -1) {
    // Everything before the metadata block is the HTML content
    htmlContent = rawText.slice(0, metaStart).trim();

    const metaBlock = rawText.slice(metaStart + metaStartTag.length, metaEnd).trim();

    // Parse each field from the metadata block
    const extractField = (fieldName) => {
      const regex = new RegExp(`^${fieldName}:\\s*(.+)$`, "m");
      const match = metaBlock.match(regex);
      return match ? match[1].trim() : "";
    };

    metaTitle = extractField("META_TITLE");
    metaDescription = extractField("META_DESCRIPTION");
    excerpt = extractField("EXCERPT");
  } else {
    // Fallback: Claude didn't emit the block — log a warning, continue gracefully
    console.warn("METADATA block not found in Claude output. Fields will be empty.");
  }

  // Extract the page <title> from the HTML for the top-level `title` field
  const titleMatch = htmlContent.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";

  // Enforce character limits (trim silently if Claude over-ran)
  if (metaTitle.length > 70) metaTitle = metaTitle.slice(0, 70).trimEnd();
  if (metaDescription.length > 160) metaDescription = metaDescription.slice(0, 160).trimEnd();

  return { htmlContent, title, metaTitle, metaDescription, excerpt };
}

// ===== HELPER: Generate thumbnail via OpenAI DALL-E =====
// Returns an image URL string, or null on failure (non-fatal — blog still returns).
// category drives which Nubokind product scene is used — see buildThumbnailPrompt in promptTemplates.js.
async function generateThumbnail(topic, category, keywords) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY not set — skipping thumbnail generation.");
    return null;
  }

  // Build a category-aware, product-grounded realistic image prompt
  const imagePrompt = buildThumbnailPrompt(topic, category, keywords);

  console.log("[Thumbnail] Prompt length:", imagePrompt.length, "chars | category:", category);

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1792x1024",   // 16:9 landscape — ideal for blog thumbnails
      quality: "standard"
    });

    return response.data[0]?.url ?? null;
  } catch (err) {
    console.error("Thumbnail generation failed (non-fatal):", err.message);
    return null;
  }
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
// Response shape:
// { title, metaTitle, metaDescription, excerpt, content, thumbnailUrl }
app.post("/generate-blog", async (req, res) => {
  try {
    const { topic, category, blogType, description } = req.body;
    const keywords = keywordMap[category] || [];

    const blogPrompt = selectBlogPrompt(topic, keywords, blogType || "general", description);

    // Run Claude + thumbnail generation in parallel for speed
    const [rawBlogText, thumbnailUrl] = await Promise.all([
      callClaude(blogPrompt),
      generateThumbnail(topic, category, keywords)
    ]);

    // Parse structured fields out of Claude's response
    const { htmlContent, title, metaTitle, metaDescription, excerpt } =
      parseBlogOutput(rawBlogText);

    // Clean the HTML portion for Shopify compatibility
    const content = cleanBlogHtml(htmlContent);

    console.log("BLOG generated for:", topic, "| metaTitle:", metaTitle || "(empty)");

    // Save to history (store enriched fields for future retrieval)
    history.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      topic,
      category,
      blogType: blogType || "general",
      mediumType: null,
      description: description || "",
      blog: content,
      article: null,
      // New enriched fields
      title,
      metaTitle,
      metaDescription,
      excerpt,
      thumbnailUrl: thumbnailUrl || ""
    });

    res.json({
      title,
      metaTitle,
      metaDescription,
      excerpt,
      content,
      thumbnailUrl: thumbnailUrl || ""
    });
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

    const [rawBlogText, articleText] = await Promise.all([
      callClaude(blogPrompt),
      callClaude(mediumPrompt)
    ]);

    const { htmlContent } = parseBlogOutput(rawBlogText);
    const blogText = cleanBlogHtml(htmlContent);

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

// ===== POST /generate-infographic =====
// Generates a WhatsApp-ready infographic image via OpenAI DALL-E.
// Response shape: { image_url: "..." }
app.post("/generate-infographic", async (req, res) => {
  try {
    const { topic, format } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "topic is required" });
    }

    const validFormats = ["FACT", "MYTH", "THIS vs THAT", "IF YOUR BABY", "DO THIS, NOT THAT"];
    const resolvedFormat = validFormats.includes(format) ? format : "FACT";

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
    }

    const imagePrompt = buildInfographicPrompt(topic, resolvedFormat);

    console.log(
      "[Infographic] Format:", resolvedFormat,
      "| Topic:", topic,
      "| Prompt length:", imagePrompt.length, "chars"
    );

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",   // 1:1 square — WhatsApp infographic format
      quality: "standard"
    });

    const image_url = response.data[0]?.url ?? null;

    if (!image_url) {
      return res.status(500).json({ error: "Image generation returned no URL" });
    }

    console.log("[Infographic] Generated successfully for:", topic);
    res.json({ image_url });
  } catch (error) {
    console.error("ERROR /generate-infographic:", error);
    res.status(500).json({ error: "Something went wrong generating the infographic" });
  }
});

// ===== GLOBAL ERROR HANDLER (always returns JSON, never HTML) =====
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});