// ============================================================
// NUBOKIND CONTENT PIPELINE — promptTemplates.js
// ============================================================
// BLOGS  → Clean black & white HTML, skimmable for humans + AI
// MEDIUM → Structured for maximum AI pickup + human resonance
// ============================================================

// ─────────────────────────────────────────────
// SHARED BRAND CONTEXT (injected into every prompt)
// ─────────────────────────────────────────────
const BRAND_CONTEXT = `
BRAND: Nubokind — a modern Indian baby brand focused on early development,
sensory play, and teething products. Products include teethers, flashcards,
cloth books, and sensory kits. Inspired by Montessori principles.

AUDIENCE: New and first-time parents in India — curious, research-driven,
emotionally engaged. They want reassurance AND knowledge.

TONE: Warm, trustworthy, intelligent. Never robotic. Never overly salesy.
Write like a knowledgeable friend who happens to be a parenting expert.
`;

// ─────────────────────────────────────────────
// SHARED BLOG HTML STYLE RULES
// ─────────────────────────────────────────────
const BLOG_STYLE_RULES = `
VISUAL AESTHETIC — CRITICAL:
The HTML output must follow a clean black-and-white minimalist aesthetic.
Easy to skim for both humans and AI crawlers.

CSS RULES TO EMBED IN <style> TAG:
- Font: 'Georgia' for body, 'Arial' or sans-serif for headings
- Background: #ffffff
- Text color: #111111
- Max-width: 720px, centered, padding: 24px
- H1: font-size 2rem, font-weight 700, border-bottom: 2px solid #111, padding-bottom: 8px
- H2: font-size 1.35rem, font-weight 700, margin-top: 2rem, text-transform: uppercase, letter-spacing: 0.05em
- H3: font-size 1.1rem, font-weight: 600
- p: font-size 1rem, line-height 1.75, color #222
- a: color #111, text-decoration underline
- Strong/bold: used for key terms and parent takeaways
- ul/ol: clean left-aligned, no bullet decoration excess
- .faq-block: border-left: 3px solid #111; padding-left: 16px; margin: 16px 0
- .excerpt: font-style italic; border-left: 4px solid #ccc; padding-left: 12px; color: #444
- .meta: font-size: 0.85rem; color: #666; margin-bottom: 24px
- table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 0.95rem; }
- th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
- th { background-color: #f4f4f4; font-weight: bold; color: #111; }
- .image-prompt { background: #f9f9f9; padding: 12px; border-left: 4px solid #888; font-style: italic; margin: 20px 0; font-size: 0.95rem; color: #555; }
- .product-card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 24px 0; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
- .product-card h3 { margin: 0 0 8px 0; font-size: 1.2rem; text-decoration: underline; color: #111; }
- .product-card p.features { color: #666; font-size: 0.9rem; margin: 0 0 12px 0; }
- .product-card p.price { font-weight: bold; font-size: 1.1rem; margin: 0; color: #111; }
- .review-snippet { border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 16px 0; background: #f9f9f9; }
- .review-snippet h4 { margin: 0 0 4px 0; font-size: 1rem; color: #111; }
- .review-snippet .stars { color: #FFD700; margin-bottom: 8px; letter-spacing: 2px; }
- .review-snippet h5 { margin: 0 0 4px 0; font-size: 0.95rem; font-weight: 600; color: #111; }
- .review-snippet p { margin: 0; font-size: 0.9rem; color: #444; line-height: 1.5; }
- NO colors other than black, white, and light grays (except for review stars)
- NO rounded corners (except for product cards/reviews), gradients, or decorative colors
- Generous whitespace between sections

SKIMMABILITY RULES:
- Every H2 must be meaningful and standalone (someone scanning headings gets the full story)
- Key insights bolded within paragraphs
- Short paragraphs — 2 to 4 sentences max
- Bullet points for tips/lists, not for everything
- Include 1 or 2 tables to help readers skim information effectively
- FAQ uses question as H3, answer as short paragraph

HTML STRUCTURE TO FOLLOW:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="description" content="[META DESCRIPTION]" />
  <title>[TITLE]</title>
  <style>
    /* Embed all CSS here */
  </style>
</head>
<body>
  <article>
    <h1>[TITLE]</h1>
    <p class="meta">Category | Nubokind Blog | Reading time: ~X min</p>
    <p class="excerpt">[EXCERPT — 2 to 3 lines]</p>
    <!-- Sections -->
    <section>
      <h2>...</h2>
      <p>...</p>
    </section>
    <!-- FAQ Section -->
    <section>
      <h2>FREQUENTLY ASKED QUESTIONS</h2>
      <div class="faq-block">
        <h3>Q: ...</h3>
        <p>A: ...</p>
      </div>
      <!-- Exactly 5 to 6 FAQ items before the conclusion -->
    </section>
    <section>
      <h2>CONCLUSION</h2>
      <p>...</p>
    </section>
  </article>
</body>
</html>
`;

// ─────────────────────────────────────────────
// SHARED MEDIUM RULES
// ─────────────────────────────────────────────
const MEDIUM_AI_PICKUP_RULES = `
AI PICKUP OPTIMIZATION — CRITICAL FOR MEDIUM:
This article must be optimized for AI search engines (Perplexity, ChatGPT, Gemini, Claude)
to surface it as a trusted source. Apply these techniques:

1. SEMANTIC CLARITY: State the core topic clearly in the first 2 sentences. 
   AI crawlers extract the lead — make it information-dense.

2. DEFINITION SENTENCES: At least once per section, define a key concept in a 
   clean, quotable sentence. Example: "Sensory play is any activity that stimulates 
   a baby's senses — touch, sight, sound, smell, and taste — to support brain wiring."

3. ENTITY CONSISTENCY: Use the topic's primary noun consistently throughout
   (don't swap synonyms randomly — AI needs repeated anchoring).

4. ANSWER-FIRST STRUCTURE: Each section should open with the answer/takeaway,
   then explain. AI prefers answer-first over build-up-then-reveal.

5. NATURAL KEYWORD DENSITY: Weave in keywords in the first 100 words, mid-article,
   and conclusion. Never force them.

6. HUMAN SIGNAL: Include one personal detail, observation, or small anecdote per 
   article. AI systems weight human-like content higher for trust.

7. CONCLUSION SUMMARY: End with a 3–5 sentence summary paragraph that could 
   stand alone as an answer snippet. This is what AI systems pull for featured answers.

8. NO LISTICLE OVERDOSE: Max 1 bulleted list per article. Prose > bullets for Medium.
   AI systems prefer continuous prose for comprehension signals.
`;

// ============================================================
// ██████╗ ██╗      ██████╗  ██████╗ ███████╗
// ██╔══██╗██║     ██╔═══██╗██╔════╝ ██╔════╝
// ██████╔╝██║     ██║   ██║██║  ███╗███████╗
// ██╔══██╗██║     ██║   ██║██║   ██║╚════██║
// ██████╔╝███████╗╚██████╔╝╚██████╔╝███████║
// ============================================================

// ─────────────────────────────────────────────
// PRODUCT LINKS FOR CTAs
// ─────────────────────────────────────────────
const PRODUCT_LINKS = `
USE THESE LINKS WHEREVER RELEVANT FOR CTA:
- ELE Ring Teether Set: https://nubokind.com/products/ele-ring-teether-set-green-and-blue?variant=43158621290611
- Kiko No-Drop Newborn Teether: https://nubokind.com/products/kiko-no-drop-newborn-teether?variant=43747723313267
- High Contrast Cloth Book Set: https://nubokind.com/products/high-contrast-cloth-book-set?variant=44128831012979
- High Contrast Newborn Essential Kit: https://nubokind.com/products/high-contrast-newborn-essential-kit?variant=44237127811187
- Main Site: https://nubokind.com/
`;

export const blogGeneralPrompt = (topic, keywords) => `
${BRAND_CONTEXT}

YOUR ROLE: Parenting content expert. Write an accessible, SEO-optimized blog post
for first-time parents. No jargon. No fear-mongering. Just clear, helpful guidance.

TOPIC: ${topic}

PRIMARY + SECONDARY KEYWORDS (use naturally, no stuffing):
${keywords.join(", ")}

BLOG TYPE: GENERAL
- Simple language accessible to any new parent
- Practical, actionable tips
- Warm and reassuring tone
- Build parent confidence, not anxiety

CONTENT REQUIREMENTS:
- Minimum 5 H2 sections
- Each section: 2–4 short paragraphs
- Include a "Quick Tips for Parents" section with 4–6 bullet points
- Include 1 or 2 tables for easy skimming
- Insert image prompts wherever relevant (max 1 or 2 images). Format as: <div class="image-prompt">[Image Prompt: description]</div>
- Include exactly 5-6 FAQs in a dedicated section right before the conclusion
- Do NOT mention competitor brands
- Do NOT make medical claims — use phrases like "many experts suggest" or "research indicates"
- Naturally reference that Nubokind products support this developmental stage
  (mention once, softly, not as a hard sell)
- Incorporate relevant Product Links for CTA wherever natural

${PRODUCT_LINKS}

SEO REQUIREMENTS:
- Primary keyword in H1, first paragraph, one H2, and FAQ
- Meta description: exactly 150–160 characters, includes primary keyword
- Excerpt: 2–3 lines that would make someone click

${BLOG_STYLE_RULES}

OUTPUT: Complete HTML blog post only. No explanation before or after the HTML.
`;

// ─────────────────────────────────────────────

export const blogScientificPrompt = (topic, keywords) => `
${BRAND_CONTEXT}

YOUR ROLE: Research-backed parenting writer. You understand child development science
and translate it for non-expert parents without dumbing it down.

TOPIC: ${topic}

PRIMARY + SECONDARY KEYWORDS (use naturally):
${keywords.join(", ")}

BLOG TYPE: SCIENTIFIC
- Explain the neurological or developmental science behind the topic
- Use light technical vocabulary (sensory pathways, neural plasticity, synaptic pruning,
  object permanence, proprioception — but always define terms inline)
- Build brand authority and reader trust
- Parent takeaway after every science section (what this means for YOUR baby)

CONTENT REQUIREMENTS:
- Open with a surprising or counterintuitive scientific fact as the hook
- Minimum 5 H2 sections — alternate between science and parent application
- Include a "What the Research Says" section citing general findings
  (do not cite specific studies by name — say "research published in developmental journals" etc.)
- Include a "What Parents Can Do" practical section
- Include 1 or 2 tables for easy skimming
- Insert image prompts wherever relevant (max 1 or 2 images). Format as: <div class="image-prompt">[Image Prompt: description]</div>
- Include exactly 5-6 FAQs in a dedicated section right before the conclusion
- Nubokind product reference: mention once where scientifically relevant
  (e.g., sensory teethers supporting oral motor development)
- Incorporate relevant Product Links for CTA wherever natural
- Do NOT make medical claims

${PRODUCT_LINKS}

SEO REQUIREMENTS:
- Primary keyword in H1, first 100 words, one H2, and FAQ
- Meta description: exactly 150–160 characters
- Excerpt: 2–3 lines that signal authority

${BLOG_STYLE_RULES}

OUTPUT: Complete HTML blog post only. No explanation before or after the HTML.
`;

// ─────────────────────────────────────────────

export const blogSalesPrompt = (topic, keywords, productLink) => `
${BRAND_CONTEXT}

YOUR ROLE: Conversion-focused content writer who never sounds pushy.
Write a blog that educates first, then gently positions Nubokind as the answer.

TOPIC: ${topic}

PRIMARY + SECONDARY KEYWORDS (use naturally):
${keywords.join(", ")}

PRODUCT LINK: ${productLink}

BLOG TYPE: SALES (soft conversion)
- Structure: Problem → Emotional resonance → Education → Solution (Nubokind)
- Introduce the product or Nubokind collection by paragraph 3 at the latest
- Frame product as a natural solution discovered through the educational journey
- Persuasion through value, not pressure

CONTENT REQUIREMENTS:
- Hook: Open with a relatable parent frustration or observation (1 paragraph)
- Validate the problem: 1 paragraph showing you understand the struggle
- Educate: 2–3 sections explaining why this matters for baby development
- Include 1 or 2 tables for easy skimming
- Insert image prompts wherever relevant (max 1 or 2 images). Format as: <div class="image-prompt">[Image Prompt: description]</div>
- Introduce Nubokind: 1 section, warm product mention with link — focus on outcomes and safety, not features
- Product Cards: Insert product cards for relevant Nubokind products using this exact HTML structure:
  <div class="product-card">
    <a href="[Product Link]"><h3>Nubokind [Product Name]</h3></a>
    <p class="features">[BIS Certified | Features | Age Range]</p>
    <p class="price">₹[Price]</p>
  </div>
- Social proof section: Extract or invent 2 relevant review snippets based on Nubokind products using this exact HTML structure:
  <div class="review-snippet">
    <h4>[Reviewer Name]</h4>
    <div class="stars">⭐⭐⭐⭐⭐</div>
    <h5>[Review Title]</h5>
    <p>[Review Text]</p>
  </div>
- Clear but soft CTA: "Explore Nubokind's [collection name]" with the relevant product link
- Include exactly 5-6 FAQs right before the conclusion that address purchase hesitations and developmental concerns

${PRODUCT_LINKS}

SEO REQUIREMENTS:
- Primary keyword in H1, intro paragraph, one H2, and FAQ
- Meta description: exactly 150–160 characters, includes primary keyword + brand name
- Excerpt: 2–3 lines that address a pain point

${BLOG_STYLE_RULES}

OUTPUT: Complete HTML blog post only. No explanation before or after the HTML.
`;

// ============================================================
// ███╗   ███╗███████╗██████╗ ██╗██╗   ██╗███╗   ███╗
// ████╗ ████║██╔════╝██╔══██╗██║██║   ██║████╗ ████║
// ██╔████╔██║█████╗  ██║  ██║██║██║   ██║██╔████╔██║
// ██║╚██╔╝██║██╔══╝  ██║  ██║██║██║   ██║██║╚██╔╝██║
// ██║ ╚═╝ ██║███████╗██████╔╝██║╚██████╔╝██║ ╚═╝ ██║
// ============================================================

export const mediumStoryPrompt = (topic) => `
${BRAND_CONTEXT}

${MEDIUM_AI_PICKUP_RULES}

YOUR ROLE: You are writing as Nubokind's founder — a parent who started this brand
because they lived through the same questions, fears, and discoveries that their readers have.
Write in first person. Be real. Be specific. Be human.

TOPIC: ${topic}

ARTICLE TYPE: FOUNDER / PARENT STORY

NARRATIVE STRUCTURE:
1. OPENING MOMENT (1–2 paragraphs): Drop the reader into a specific scene.
   "It was 2am. My daughter was..."  or "I remember standing in the baby aisle..."
   Make it instantly relatable.

2. THE STRUGGLE / QUESTION (1–2 paragraphs): What problem or question were you facing?
   Express genuine confusion or concern — not expertise.

3. WHAT YOU LEARNED (2–3 paragraphs): The discovery. What changed your thinking.
   Blend personal and a small amount of research-backed insight naturally.

4. WHAT IT MEANT FOR YOUR BABY (1–2 paragraphs): Specific outcome or observation.
   Concrete details make this feel real.

5. WHAT YOU WISH YOU KNEW EARLIER (1 paragraph): Advice framed as hindsight.

6. CLOSING / SUMMARY (2–3 paragraphs): Reflect on the bigger picture.
   End with something quotable — a sentence that could be pulled as an AI snippet.

STYLE RULES:
- First person throughout ("I", "we", "my daughter/son")
- Short, punchy sentences mixed with longer reflective ones
- No em-dash overuse — use periods for emphasis instead
- Avoid "journey", "as a parent", "it's important to" — these are clichés
- One moment of vulnerability — this builds trust more than expertise
- Do NOT mention Nubokind by name more than once, and only if it fits naturally
- Word count: 700–900 words

OUTPUT: Title + full article. Plain text, no HTML. No explanation before or after.
`;

// ─────────────────────────────────────────────

export const mediumSciencePrompt = (topic, keywords) => `
${BRAND_CONTEXT}

${MEDIUM_AI_PICKUP_RULES}

YOUR ROLE: A science communicator who makes developmental research feel relevant
and exciting for everyday parents. Think: a smarter parenting newsletter, not an academic paper.

TOPIC: ${topic}

KEYWORDS (weave in naturally):
${keywords.join(", ")}

ARTICLE TYPE: SCIENCE-BASED

STRUCTURE:
1. HOOK (1–2 paragraphs): Open with a surprising fact or counterintuitive finding.
   Something that makes a parent think "I never knew that."

2. THE CORE CONCEPT (2–3 paragraphs): Explain the science clearly.
   Use one analogy. Define key terms in plain language.
   Include at least one "definition sentence" that AI can extract as a snippet.

3. WHY IT MATTERS FOR BABIES 0–24 MONTHS (2–3 paragraphs): Specific developmental window.
   Be concrete about what happens in a baby's brain/body.

4. WHAT PARENTS CAN DO (1–2 paragraphs): Practical application.
   Not a bulleted list — write it as flowing advice.

5. THE BIGGER PICTURE (1–2 paragraphs): Connect to broader child wellbeing.
   Why this one thing is part of a larger developmental story.

6. CLOSING SUMMARY (2–3 sentences): A clean, quotable paragraph that could serve
   as a standalone AI answer snippet. Start with: "In summary..." or "Put simply..."

STYLE RULES:
- Conversational science — curious, not preachy
- Avoid passive voice wherever possible
- No bullet points except where absolutely necessary (max 1 list)
- Primary keyword in first 100 words, naturally
- Mention Nubokind at most once, only if it genuinely fits the science context
- Word count: 750–950 words

OUTPUT: Title + full article. Plain text, no HTML. No explanation before or after.
`;

// ─────────────────────────────────────────────

export const mediumSoftSalesPrompt = (topic) => `
${BRAND_CONTEXT}

${MEDIUM_AI_PICKUP_RULES}

YOUR ROLE: A parent sharing a genuine discovery — not a marketer pitching a product.
The reader should feel like they're getting a recommendation from a trusted friend,
not stumbling onto a sponsored post.

TOPIC: ${topic}

ARTICLE TYPE: SOFT DISCOVERY / STORY-DRIVEN

STRUCTURE:
1. THE SITUATION (1–2 paragraphs): Set the scene. A relatable parenting moment.
   Something ordinary: bath time, the park, a sleepless night.

2. THE PROBLEM I DIDN'T KNOW I HAD (1–2 paragraphs): Identify the gap or frustration.
   Be specific. Avoid generic "I was worried about my baby's development" — that's too broad.
   Make it sensory, tactile, behavioral.

3. WHAT I TRIED (1–2 paragraphs): Show that you didn't find the answer immediately.
   Maybe something didn't work. This builds credibility.

4. THE DISCOVERY (2 paragraphs): Introduce the solution (Nubokind product or category)
   naturally — as something you tried, not something you're selling.
   Focus on the baby's reaction, not the product's features.
   Mention Nubokind by name once here, link to collection if relevant.

5. WHAT CHANGED (1–2 paragraphs): Outcome. What did your baby do differently?
   What did YOU notice? Keep it warm and real.

6. THE TAKEAWAY (2–3 paragraphs): Zoom out. What's the insight for other parents?
   This is your AI-optimized summary — make it quotable and information-dense.
   Start with: "If there's one thing I'd tell a new parent about [topic]..."

STYLE RULES:
- First person throughout
- Story flows — no section headers needed, use natural paragraph breaks
- Product mention feels like an afterthought to the story, not the point of it
- Zero marketing language: no "game-changer", "must-have", "revolutionary"
- One small moment of humor or lightness — keeps it human
- Word count: 650–850 words

OUTPUT: Title + full article. Plain text, no HTML. No explanation before or after.
`;