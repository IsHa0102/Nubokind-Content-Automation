// ============================================================
// Nubokind Content Generator — frontend/script.js
// ============================================================

const BASE_URL = window.location.origin;
const API = BASE_URL;

// ─────────────────────────────────────────────
// Safe fetch — always reads text first, then parses JSON
// Prevents "Unexpected token '<'" when server returns HTML
// ─────────────────────────────────────────────
async function safeFetch(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  } catch (parseErr) {
    // Server returned non-JSON (HTML error page, etc.)
    throw new Error(`Server error (${res.status}): ${text.substring(0, 120)}`);
  }
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getInputs() {
  return {
    topic: document.getElementById("topic").value.trim(),
    description: document.getElementById("description").value.trim(),
    category: document.getElementById("category").value,
    blogType: document.getElementById("blogType").value,
    mediumType: document.getElementById("mediumType").value
  };
}

function setLoading(active, message = "Generating content, please wait…") {
  const btns = ["btnBlog", "btnArticle", "btnBoth"];
  const indicator = document.getElementById("loadingIndicator");
  document.getElementById("loadingText").textContent = message;
  btns.forEach(id => document.getElementById(id).disabled = active);
  indicator.classList.toggle("active", active);
}

function setOutput(field, text) {
  document.getElementById(field).value = text || "";
}

// ─────────────────────────────────────────────
// Copy to clipboard
// ─────────────────────────────────────────────
async function copyOutput(outputId, btnId) {
  const text = document.getElementById(outputId).value;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById(btnId);
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = outputId === "blogOutput" ? "Copy Blog" : "Copy Article";
      btn.classList.remove("copied");
    }, 2000);
  } catch (err) {
    alert("Could not copy — please select and copy manually.");
  }
}

// ─────────────────────────────────────────────
// Generate Blog only → POST /generate-blog
// ─────────────────────────────────────────────
async function generateBlog() {
  const { topic, description, category, blogType } = getInputs();
  if (!topic) { alert("Please enter a topic."); return; }

  setLoading(true, "Generating Shopify blog…");
  setOutput("blogOutput", "");

  try {
    const data = await safeFetch(`${API}/generate-blog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, description, category, blogType })
    });
    setOutput("blogOutput", data.blog);
    await refreshHistory();
  } catch (err) {
    console.error(err);
    setOutput("blogOutput", "Error: " + err.message);
  } finally {
    setLoading(false);
  }
}

// ─────────────────────────────────────────────
// Generate Article only → POST /generate-article
// ─────────────────────────────────────────────
async function generateArticle() {
  const { topic, description, category, mediumType } = getInputs();
  if (!topic) { alert("Please enter a topic."); return; }

  setLoading(true, "Generating Medium article…");
  setOutput("mediumOutput", "");

  try {
    const data = await safeFetch(`${API}/generate-article`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, description, category, mediumType })
    });
    setOutput("mediumOutput", data.article);
    await refreshHistory();
  } catch (err) {
    console.error(err);
    setOutput("mediumOutput", "Error: " + err.message);
  } finally {
    setLoading(false);
  }
}

// ─────────────────────────────────────────────
// Generate Both → POST /generate
// ─────────────────────────────────────────────
async function generateBoth() {
  const { topic, description, category, blogType, mediumType } = getInputs();
  if (!topic) { alert("Please enter a topic."); return; }

  setLoading(true, "Generating blog + article (this takes ~30s)…");
  setOutput("blogOutput", "");
  setOutput("mediumOutput", "");

  try {
    const data = await safeFetch(`${API}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, description, category, blogType, mediumType })
    });
    setOutput("blogOutput", data.blog);
    setOutput("mediumOutput", data.medium);
    await refreshHistory();
  } catch (err) {
    console.error(err);
    setOutput("blogOutput", "Error: " + err.message);
  } finally {
    setLoading(false);
  }
}

// ─────────────────────────────────────────────
// History
// ─────────────────────────────────────────────
let historyOpen = false;

function toggleHistory() {
  historyOpen = !historyOpen;
  document.getElementById("historyList").classList.toggle("open", historyOpen);
  document.getElementById("historyChevron").textContent = historyOpen ? "▲" : "▼";
  if (historyOpen) refreshHistory();
}

async function refreshHistory() {
  try {
    const res = await fetch(`${API}/history`);
    const items = await res.json();
    renderHistory(items);
  } catch (err) {
    console.error("Could not load history:", err);
  }
}

function renderHistory(items) {
  const list = document.getElementById("historyList");
  const empty = document.getElementById("historyEmpty");

  // Remove old items (keep empty message)
  list.querySelectorAll(".history-item").forEach(el => el.remove());

  if (!items || items.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  items.forEach(item => {
    const el = document.createElement("div");
    el.className = "history-item";

    const date = new Date(item.timestamp).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });

    const badges = [];
    if (item.hasBlog) badges.push(`<span class="badge badge-blog">${item.blogType || "blog"}</span>`);
    if (item.hasArticle) badges.push(`<span class="badge badge-article">${item.mediumType || "article"}</span>`);
    if (item.description) badges.push(`<span class="badge badge-desc">has description</span>`);

    el.innerHTML = `
      <div class="h-topic">${escapeHtml(item.topic)}</div>
      <div class="h-meta">${date} · ${item.category}</div>
      <div class="h-badges">${badges.join("")}</div>
    `;

    // Click to load full content
    el.addEventListener("click", () => loadHistoryItem(item.id));
    list.appendChild(el);
  });
}

async function loadHistoryItem(id) {
  try {
    const res = await fetch(`${API}/history/${id}`);
    const item = await res.json();
    if (item.blog) setOutput("blogOutput", item.blog);
    if (item.article) setOutput("mediumOutput", item.article);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error("Could not load history item:", err);
  }
}

function escapeHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────
// Pre-load history silently on page load
window.addEventListener("DOMContentLoaded", () => {
  refreshHistory();
});