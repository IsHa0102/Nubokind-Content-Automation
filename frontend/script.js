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
    if (!res.ok) throw new Error(data.detail || data.error || `HTTP ${res.status}`);
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
  const btns = ["btnBlog", "btnArticle", "btnBoth", "btnInfographic"];
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

  setLoading(true, "Generating Shopify blog + thumbnail…");
  setOutput("blogOutput", "");
  clearSeoPanel();

  try {
    const data = await safeFetch(`${API}/generate-blog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, description, category, blogType })
    });
    // New response shape: { title, metaTitle, metaDescription, excerpt, content, thumbnailUrl }
    setOutput("blogOutput", data.content || data.blog || "");
    renderSeoPanel(data);
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
    if (item.blog) {
      setOutput("blogOutput", item.blog);
      // Restore SEO fields if they were saved with this history entry
      renderSeoPanel({
        metaTitle: item.metaTitle || "",
        metaDescription: item.metaDescription || "",
        excerpt: item.excerpt || "",
        thumbnailUrl: item.thumbnailUrl || ""
      });
    }
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
// SEO Panel helpers
// ─────────────────────────────────────────────

// Clears the SEO panel back to its empty/hidden state
function clearSeoPanel() {
  document.getElementById("seoPanelBlog").classList.remove("visible");
  setSeoField("metaTitleValue", "", "metaTitleCount", 70);
  setSeoField("metaDescValue", "", "metaDescCount", 160);
  setSeoField("excerptValue", "");
  const thumbField = document.getElementById("seoThumbnailField");
  thumbField.style.display = "none";
  const img = document.getElementById("thumbnailPreview");
  img.classList.remove("visible");
  img.src = "";
}

// Populates the SEO panel with data from the API response
function renderSeoPanel(data) {
  const { metaTitle = "", metaDescription = "", excerpt = "", thumbnailUrl = "" } = data;

  // Show the panel if we have at least one field
  const hasContent = metaTitle || metaDescription || excerpt || thumbnailUrl;
  if (!hasContent) return;
  document.getElementById("seoPanelBlog").classList.add("visible");

  setSeoField("metaTitleValue", metaTitle, "metaTitleCount", 70);
  setSeoField("metaDescValue", metaDescription, "metaDescCount", 160);
  setSeoField("excerptValue", excerpt);

  // Thumbnail
  if (thumbnailUrl) {
    const thumbField = document.getElementById("seoThumbnailField");
    thumbField.style.display = "block";
    const img = document.getElementById("thumbnailPreview");
    const link = document.getElementById("thumbnailLink");
    img.src = thumbnailUrl;
    link.href = thumbnailUrl;
    img.classList.add("visible");
  }
}

// Sets a seo-value div's text, toggles 'empty' style, and optionally updates char counter
function setSeoField(valueId, text, countId, limit) {
  const el = document.getElementById(valueId);
  if (!el) return;
  if (text) {
    el.textContent = text;
    el.classList.remove("empty");
  } else {
    el.textContent = "\u2014"; // em-dash placeholder
    el.classList.add("empty");
  }
  if (countId && limit) {
    const countEl = document.getElementById(countId);
    if (!countEl) return;
    const len = (text || "").length;
    countEl.textContent = `${len} / ${limit}`;
    countEl.className = "seo-char-count" + (len === 0 ? "" : len <= limit ? " ok" : " warn");
  }
}

// Copy a seo-value div's text content to clipboard
async function copySeoField(valueId, btnId) {
  const text = document.getElementById(valueId)?.textContent?.trim();
  if (!text || text === "\u2014") return;
  try {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById(btnId);
    const orig = btn.textContent;
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => { btn.textContent = orig; btn.classList.remove("copied"); }, 2000);
  } catch {
    alert("Could not copy — please select and copy manually.");
  }
}

// ─────────────────────────────────────────────
// Generate Infographic → POST /generate-infographic
// ─────────────────────────────────────────────
async function generateInfographic() {
  const topic = document.getElementById("topic").value.trim();
  const format = document.getElementById("infographicFormat").value;

  if (!topic) { alert("Please enter a topic."); return; }

  setLoading(true, "Generating infographic image (this takes ~20s)…");
  clearInfographicPanel();

  try {
    const data = await safeFetch(`${API}/generate-infographic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, format })
    });

    if (data.image_url) {
      renderInfographic(data.image_url, format);
    } else {
      showInfographicError("No image URL returned.");
    }
  } catch (err) {
    console.error(err);
    showInfographicError("Error: " + err.message);
  } finally {
    setLoading(false);
  }
}

function renderInfographic(imageUrl, format) {
  const wrap = document.getElementById("infographicWrap");
  const img = document.getElementById("infographicImg");
  const dl = document.getElementById("infographicDownload");
  const empty = document.getElementById("infographicEmpty");
  const badge = document.getElementById("infographicFormatBadge");

  img.src = imageUrl;
  dl.href = imageUrl;
  badge.textContent = format;
  wrap.classList.add("visible");
  empty.style.display = "none";

  // Scroll infographic into view
  document.getElementById("infographicCard").scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearInfographicPanel() {
  const wrap = document.getElementById("infographicWrap");
  const img = document.getElementById("infographicImg");
  const empty = document.getElementById("infographicEmpty");
  const badge = document.getElementById("infographicFormatBadge");

  wrap.classList.remove("visible");
  img.src = "";
  badge.textContent = "";
  empty.style.display = "block";
  empty.textContent = "Generating…";
}

function showInfographicError(msg) {
  const empty = document.getElementById("infographicEmpty");
  empty.style.display = "block";
  empty.textContent = msg;
  empty.style.color = "#cc6655";
}

// ─────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────
// Pre-load history silently on page load
window.addEventListener("DOMContentLoaded", () => {
  refreshHistory();
});