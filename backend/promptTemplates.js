// ============================================================
// NUBOKIND CONTENT PIPELINE — promptTemplates.js
// ============================================================
// BLOGS  → Clean HTML, skimmable for humans + AI
// MEDIUM → Structured for maximum AI pickup + human resonance
// ============================================================

import products from "./productData.js";

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
// PRODUCT DATA BLOCK
// Exact prices and URLs from productData.js — no hallucination allowed.
// ─────────────────────────────────────────────
const PRODUCT_DATA_BLOCK = `
PRODUCT DATA — USE EXACT VALUES BELOW. DO NOT INVENT PRICES OR URLS:
${products.map(p => `
  Product: ${p.name}
  Price:   ${p.price}
  URL:     ${p.url}
  Image:   ${p.image}
`).join("---")}

PRODUCT CARD HTML TEMPLATE (use for sales blogs — pick only relevant products):
<div class="product-card">
  <img src="[EXACT Image URL from above]" alt="[Product Name]" style="width:80px;height:auto;border-radius:4px;float:left;margin-right:14px;margin-bottom:4px;" />
  <a href="[EXACT URL from above]"><h3>[Product Name]</h3></a>
  <p class="features">[BIS Certified | key features | Age range]</p>
  <p class="price">[EXACT Price from above]</p>
  <div style="clear:both;"></div>
</div>

PRODUCT LINKS FOR CTAs (use the exact URLs above in anchor tags wherever natural):
- ELE Ring Teether Set: ${products[0].url}
- Kiko No-Drop Newborn Teether: ${products[1].url}
- High Contrast Cloth Book Set: ${products[2].url}
- High Contrast Newborn Essential Kit: ${products[3].url}
- Main Site: https://nubokind.com/
`;

// ─────────────────────────────────────────────
// SHARED BLOG HTML STYLE RULES
// IMPORTANT: No font-family set — Shopify theme font must inherit.
// ─────────────────────────────────────────────
const BLOG_STYLE_RULES = `
VISUAL AESTHETIC — CRITICAL:
The HTML output must follow a clean black-and-white minimalist aesthetic.
Easy to skim for both humans and AI crawlers.

CSS RULES TO EMBED IN <style> TAG:
- DO NOT set font-family on body, p, or any element — Shopify's theme font must inherit
- Background: #ffffff
- Text color: #111111
- Max-width: 720px, centered, padding: 24px
- H1: font-size 2rem, font-weight 700, margin-bottom: 12px
- H2: font-size 1.35rem, font-weight 700, margin-top: 2rem, text-transform: uppercase, letter-spacing: 0.05em
- H3: font-size 1.1rem, font-weight: 600
- p: font-size 1rem, line-height 1.75, color #222
- article a: color #111, text-decoration underline
- article a:hover: text-decoration none
- Strong/bold: used for key terms and parent takeaways
- ul/ol: clean left-aligned, no bullet decoration excess
- .faq-block: border-left: 3px solid #111; padding-left: 16px; margin: 16px 0
- .excerpt: font-style italic; border-left: 4px solid #ccc; padding-left: 12px; color: #444
- .meta: font-size: 0.85rem; color: #666; margin-bottom: 24px
- table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 0.95rem; }
- th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
- th { background-color: #f4f4f4; font-weight: bold; color: #111; }
- .image-prompt { background: #f9f9f9; padding: 12px; border-left: 4px solid #888; font-style: italic; margin: 20px 0; font-size: 0.95rem; color: #555; }
- .product-card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 24px 0; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.05); overflow: hidden; }
- .product-card h3 { margin: 0 0 8px 0; font-size: 1.2rem; text-decoration: underline; color: #111; }
- .product-card p.features { color: #666; font-size: 0.9rem; margin: 0 0 12px 0; }
- .product-card p.price { font-weight: bold; font-size: 1.1rem; margin: 0; color: #111; }
- .product-card img { width: 80px; height: auto; border-radius: 4px; float: left; margin-right: 14px; margin-bottom: 4px; }
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
    /* Embed all CSS here — NO font-family rules */
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
// STRUCTURED OUTPUT BLOCK
// Appended to every blog prompt so Claude returns
// meta fields separately — parsed by server.js.
// ─────────────────────────────────────────────
const STRUCTURED_OUTPUT_RULES = `
STRUCTURED OUTPUT — MANDATORY:
After the closing </html> tag, output a METADATA block EXACTLY as shown below.
Fill in every field. Do NOT omit or rename any field.

<!--METADATA_START-->
META_TITLE: [60–70 characters. SEO + AEO optimized. Include primary keyword + brand name.]
META_DESCRIPTION: [140–160 characters. Conversational, answer-first, includes primary keyword. Optimized for AI snippet pickup.]
EXCERPT: [2–3 lines. Hook the reader. Address a parent pain point or curiosity. No HTML tags.]
<!--METADATA_END-->

Rules for each field:
- META_TITLE: Must be ≤70 characters. Include the primary keyword near the front. Do not use pipes or dashes excessively.
- META_DESCRIPTION: Must be ≤160 characters. Write as if answering a question a parent would Google or ask an AI assistant.
- EXCERPT: Plain text only. 2–3 punchy sentences. No HTML. Should make a parent want to keep reading.
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

// ─────────────────────────────────────────────
// DESCRIPTION HELPER
// ─────────────────────────────────────────────
function descriptionBlock(description) {
   if (!description || !description.trim()) return "";
   return `
ADDITIONAL CONTEXT / TONE GUIDE (from editor):
${description.trim()}
Use this to inform the tone, angle, or focus of the content.
`;
}

// ============================================================
// BLOG PROMPTS
// ============================================================

export const blogGeneralPrompt = (topic, keywords, description = "") => `
${BRAND_CONTEXT}
${descriptionBlock(description)}

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

${PRODUCT_DATA_BLOCK}

SEO REQUIREMENTS:
- Primary keyword in H1, first paragraph, one H2, and FAQ
- Meta description: exactly 150–160 characters, includes primary keyword
- Excerpt: 2–3 lines that would make someone click

${BLOG_STYLE_RULES}

${STRUCTURED_OUTPUT_RULES}

OUTPUT: Complete HTML blog post, then the METADATA block. No explanation before or after.
`;

// ─────────────────────────────────────────────

export const blogScientificPrompt = (topic, keywords, description = "") => `
${BRAND_CONTEXT}
${descriptionBlock(description)}

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

${PRODUCT_DATA_BLOCK}

SEO REQUIREMENTS:
- Primary keyword in H1, first 100 words, one H2, and FAQ
- Meta description: exactly 150–160 characters
- Excerpt: 2–3 lines that signal authority

${BLOG_STYLE_RULES}

${STRUCTURED_OUTPUT_RULES}

OUTPUT: Complete HTML blog post, then the METADATA block. No explanation before or after.
`;

// ─────────────────────────────────────────────

export const blogSalesPrompt = (topic, keywords, productLink, description = "") => `
${BRAND_CONTEXT}
${descriptionBlock(description)}

YOUR ROLE: Conversion-focused content writer who never sounds pushy.
Write a blog that educates first, then gently positions Nubokind as the answer.

TOPIC: ${topic}

PRIMARY + SECONDARY KEYWORDS (use naturally):
${keywords.join(", ")}

PRODUCT LINK: ${productLink}

BLOG TYPE: SALES (soft conversion)
- Structure: Hook → Product Cards (above the fold) → Problem + Emotional resonance → Education → Social Proof → CTA
- CRITICAL: Product cards MUST appear in the FIRST or SECOND section — before the reader scrolls.
  This is the most important conversion rule. Do not bury them after paragraphs of education.
- Frame product as a natural, trusted solution — not a hard sell
- Persuasion through value and social proof, not pressure

CONTENT REQUIREMENTS:

SECTION 1 — HOOK + IMMEDIATE PRODUCT INTRODUCTION (ABOVE THE FOLD):
- Open with 1 short relatable parent moment (2–3 sentences max)
- Immediately follow with 1–2 product cards using the PRODUCT CARD HTML TEMPLATE
- A one-line bridge like: "Here's what actually helped us — and thousands of Indian parents."
- This section must appear BEFORE any long educational paragraphs

SECTION 2 — WHY THIS MATTERS (Education, 2–3 paragraphs):
- Validate the problem and explain why it matters for baby development
- Keep it warm and research-lite — no heavy science here

SECTION 3 — WHAT TO LOOK FOR (2–3 paragraphs or a table):
- Help parents make a smart decision
- Include 1 table comparing what good vs. poor quality products look like
- Naturally weave in how Nubokind's products meet these criteria

SECTION 4 — SOCIAL PROOF:
- Write 2 realistic review snippets from Indian parents using this exact HTML:
  <div class="review-snippet">
    <h4>[Indian Reviewer Name]</h4>
    <div class="stars">⭐⭐⭐⭐⭐</div>
    <h5>[Review Title]</h5>
    <p>[Review Text — warm, specific, real-feeling. 2–3 sentences.]</p>
  </div>

SECTION 5 — QUICK TIPS / BUYING GUIDE:
- 4–6 bullet points helping parents choose or use the product category

SECTION 6 — FAQ (exactly 5–6 questions):
- Address purchase hesitations and developmental concerns
- End each answer with a soft nudge back to the product

SECTION 7 — CONCLUSION + CTA:
- Warm summary (2–3 sentences)
- Clear but soft CTA: "Explore Nubokind's [collection name]" with the relevant product link

${PRODUCT_DATA_BLOCK}

SEO REQUIREMENTS:
- Primary keyword in H1, intro paragraph, one H2, and FAQ
- Meta description: exactly 150–160 characters, includes primary keyword + brand name
- Excerpt: 2–3 lines that address a pain point

${BLOG_STYLE_RULES}

${STRUCTURED_OUTPUT_RULES}

OUTPUT: Complete HTML blog post, then the METADATA block. No explanation before or after.
`;

// ============================================================
// MEDIUM PROMPTS
// ============================================================

export const mediumStoryPrompt = (topic, description = "") => `
${BRAND_CONTEXT}
${descriptionBlock(description)}

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

export const mediumSciencePrompt = (topic, keywords, description = "") => `
${BRAND_CONTEXT}
${descriptionBlock(description)}

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

// ============================================================
// THUMBNAIL IMAGE PROMPT BUILDER
// ============================================================
// Generates a highly realistic, candid-style image prompt for
// OpenAI DALL-E based on topic, category, and keywords.
// Category drives which Nubokind product appears in the scene.
// ============================================================

// ─────────────────────────────────────────────
// PRODUCT VISUAL GROUNDING
// Exact descriptions derived from product reference images.
// Used to prevent hallucinated toy shapes/colors.
// ─────────────────────────────────────────────
const PRODUCT_VISUALS = {
   teethers: {
      products: [
         {
            name: "Ele Ring Teether",
            description:
               "a ring-shaped silicone teether with a soft elephant head attached — pastel blue and beige colors, gentle rounded elephant ears, smooth circular ring body, about palm-sized"
         },
         {
            name: "Kiko No-Drop Teether",
            description:
               "a small green silicone teether shaped like a gentle cartoon character with a wide flat grip — bright leaf-green color, small enough to fit in a newborn's fist, smooth rounded edges, no sharp angles"
         }
      ],
      scene:
         "An Indian baby (3–8 months old) lying on a soft cotton mat on the floor, chewing or mouthing the teether with both hands wrapped around it. The baby is wearing a simple cotton onesie. One parent (Indian mother or father) is sitting nearby cross-legged, gently watching. Late morning, natural window light. A plant or simple home corner visible softly out of focus in the background."
   },

   books_kit: {
      products: [
         {
            name: "High Contrast Cloth Book",
            description:
               "a small square soft cloth book with bold black and white high-contrast patterns — simple geometric shapes and animal outlines printed on white fabric pages, about the size of a hand"
         },
         {
            name: "Newborn Gift Kit",
            description:
               "a set of soft black and white Montessori developmental toys — includes a small cloth book and a couple of high contrast sensory cards, laid out gently on a mat"
         }
      ],
      scene:
         "An Indian newborn (0–4 months) during tummy time on a soft play mat. The cloth book is open and propped in front of the baby at eye level. An Indian parent (mother or father) is lying on their stomach at the same level, pointing to the high-contrast pages with one finger, smiling softly. The setting is a home living room floor — light wooden floor or a simple carpet. Natural daylight from a nearby window. The scene feels unhurried and tender."
   },

   all_products: {
      products: [
         {
            name: "Ele Ring Teether and Cloth Book",
            description:
               "a pastel blue ring-shaped elephant silicone teether placed next to a small square black-and-white cloth book with geometric patterns — both visible on a play mat"
         }
      ],
      scene:
         "An Indian baby (4–9 months) sitting upright with support on a soft cotton play mat, exploring a teether in one hand and reaching toward a cloth book spread open nearby. An Indian parent is seated close behind, gently supporting the baby's back while watching with quiet delight. Home environment — a simple living room with warm neutral walls, afternoon light coming through sheer curtains. The atmosphere is calm, everyday, and real."
   }
};

// Normalize incoming category keys to match PRODUCT_VISUALS keys
function resolveCategory(category) {
   if (!category) return "all_products";
   const c = category.toLowerCase();
   if (c.includes("teether")) return "teethers";
   if (c.includes("book") || c.includes("kit")) return "books_kit";
   return "all_products";
}

/**
 * Builds a final DALL-E image prompt string for a Nubokind Shopify blog thumbnail.
 *
 * @param {string} topic      - Blog topic (e.g. "when do babies start teething")
 * @param {string} category   - Category key from keywordMap (teethers / books_kit / all_products)
 * @param {string[]} keywords - Keyword array (used for scene mood hints)
 * @returns {string}          - Final prompt string ready to pass to OpenAI images.generate()
 */
export function buildThumbnailPrompt(topic, category, keywords = []) {
   const resolved = resolveCategory(category);
   const visual = PRODUCT_VISUALS[resolved];

   // Pick the primary product for this category
   const primaryProduct = visual.products[0];

   // Pull 1–2 relevant keywords as mood hints (avoid stuffing)
   const moodHint =
      Array.isArray(keywords) && keywords.length
         ? keywords.slice(0, 2).join(" and ")
         : "";

   return [
      // Scene & subject
      visual.scene,

      // Product grounding — the most critical realism constraint
      `The product visible in the scene is the ${primaryProduct.name}: ${primaryProduct.description}.`,
      "The product MUST match this description exactly — do NOT invent a different toy shape, color, or design.",

      // Mood / topic tie-in
      moodHint
         ? `The scene visually conveys the feeling of: ${moodHint}.`
         : "",

      // Photography realism rules
      "Photography style: candid lifestyle documentary. Shot on a mirrorless camera with a 50mm or 35mm lens.",
      "Exposure: slightly soft, naturally lit. Color grading: warm but NOT filtered — realistic skin tones for South Asian complexions.",
      "Depth of field: background gently out of focus but recognizable as a real home. No studio backdrop. No fake bokeh.",

      // Strict anti-cinematic / anti-AI-look constraints
      "NO dramatic cinematic lighting. NO rim lights. NO artificial fill lights. NO lens flares.",
      "NO stock-photo perfection. Slight shadow under the baby, minor fabric wrinkle, natural hair — all fine and preferred.",
      "NO text, watermarks, logos, or overlays anywhere in the image.",
      "NO toys, objects, or colors that were not described above — strict product accuracy required.",

      // Output spec
      "Aspect ratio: 16:9 landscape. Composition: close-to-mid shot. Focus on baby and product interaction.",
      "The image must look like a real photograph from a real Indian home — warm, loving, everyday."
   ]
      .filter(Boolean)
      .join(" ");
}

// ─────────────────────────────────────────────

export const mediumSoftSalesPrompt = (topic, description = "") => `
${BRAND_CONTEXT}
${descriptionBlock(description)}

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

// ─────────────────────────────────────────────
// INFOGRAPHIC PROMPT BUILDER
// Generates a structured DALL-E prompt for WhatsApp-ready infographic images.
// Format-specific color themes, layouts, and content structures.
// ─────────────────────────────────────────────

const INFOGRAPHIC_FORMATS = {
   FACT: {
      colorTheme: "soft lavender (#c9b8f0) background with white card, deep purple (#4a3080) text accents, calm expert tone",
      headlinePrefix: "Did You Know?",
      badgeLabel: "FACT",
      badgeColor: "lavender (#b09ee0) badge with white text",
      illustrationStyle: "a calm, knowledgeable Indian baby in a relaxed pose, soft lavender lighting"
   },
   MYTH: {
      colorTheme: "soft amber (#fff0b3) background with white card, warm orange (#c87020) text accents, attention-grabbing tone",
      headlinePrefix: "Myth Busted:",
      badgeLabel: "MYTH",
      badgeColor: "amber (#f0c040) badge with dark text",
      illustrationStyle: "a curious Indian baby with a slightly surprised expression, warm golden lighting"
   },
   "THIS vs THAT": {
      colorTheme: "split dual-color layout — left half soft blue (#b8d8f0), right half soft peach (#f0d8c0), with a clean white divider line in the center",
      headlinePrefix: "THIS vs THAT:",
      badgeLabel: "COMPARISON",
      badgeColor: "split blue-peach badge with white text",
      illustrationStyle: "two side-by-side cute Indian baby illustrations — one on each color panel — showing contrasting actions"
   },
   "IF YOUR BABY": {
      colorTheme: "soft sky blue (#d0eaf8) background with white card, calm teal (#2a7a9a) text accents, reassuring supportive tone",
      headlinePrefix: "If Your Baby…",
      badgeLabel: "BABY GUIDE",
      badgeColor: "soft blue (#7abcd0) badge with white text",
      illustrationStyle: "a sweet, calm Indian baby doing an everyday activity, soft blue ambient lighting, very reassuring"
   },
   "DO THIS, NOT THAT": {
      colorTheme: "mint green (#c8f0d8) background with white card, forest green (#1a6a3a) text accents, actionable instructive tone",
      headlinePrefix: "Do This, Not That:",
      badgeLabel: "ACTION GUIDE",
      badgeColor: "mint green (#60b880) badge with white text",
      illustrationStyle: "an active Indian baby performing a positive action, bright mint-green lighting, energetic yet gentle"
   }
};

const FORMAT_GUIDES = {
   "FACT": "Present a surprising or little-known pediatric fact. Points: Key Finding, Why It Matters, At Home tip, Expert Tip.",
   "MYTH": "Bust a common parenting myth with science. Points: The Myth, The Truth, Why It Matters, What To Do.",
   "THIS vs THAT": "Compare two approaches. Use 2 THIS points (recommended) and 2 THAT points (what to avoid).",
   "IF YOUR BABY": "Guide parents on a specific baby behavior. Points: What It Means, Why It Happens, What Helps, When To Check.",
   "DO THIS, NOT THAT": "Action guide with best practices. Use 2 Do This points and 2 Not That points."
};

/**
 * Returns a GPT prompt that generates factually accurate infographic content + correct sources.
 * The response should be parsed as JSON before passing to buildInfographicPrompt.
 *
 * @param {string} topic  - The infographic topic
 * @param {string} format - One of the 5 infographic formats
 * @returns {string}      - GPT chat prompt string
 */
export function buildInfographicContentPrompt(topic, format) {
   return `You are a pediatric content expert creating a WhatsApp infographic for Indian parents.

Format: ${format}
Topic: ${topic}
Format guide: ${FORMAT_GUIDES[format] || FORMAT_GUIDES["FACT"]}

Generate factually accurate, concise content. Return ONLY valid JSON — no markdown, no explanation.

{
  "headline": "<max 8 words, punchy and specific to the topic>",
  "subtext": "<1 short tagline, 6-10 words>",
  "points": [
    { "title": "<bold label, 2-4 words>", "detail": "<1 specific factual sentence>" },
    { "title": "<bold label, 2-4 words>", "detail": "<1 specific factual sentence>" },
    { "title": "<bold label, 2-4 words>", "detail": "<1 specific factual sentence>" },
    { "title": "<bold label, 2-4 words>", "detail": "<1 specific factual sentence>" }
  ],
  "sources": "<citation string as it appears in the infographic — e.g. 'AAP (American Academy of Pediatrics)' or 'WHO | IAP | CDC'. Only cite organizations that genuinely publish guidance on this specific topic. Never fabricate a source.>"
}

Source selection rules:
- Indian traditional practices (kajal, ghutti, mustard oil, oil massage, herbal remedies) → always include IAP (Indian Academy of Pediatrics)
- Breastfeeding, nutrition, complementary feeding, growth → WHO, IAP
- Sleep, nap schedules, sleep training → AAP (American Academy of Pediatrics)
- Child development, milestones, vaccines, attachment → AAP
- Safety (SIDS, car seat, choking hazards) → CDC or AAP
- Symptoms, rash, fever, allergies, reflux → Mayo Clinic or AAP
- Food comparisons, dietary guidelines → WHO, Harvard School of Public Health, or AAP
- When multiple sources genuinely apply, join them with " | "`;
}

/**
 * Generates a DALL-E image prompt for a WhatsApp infographic.
 * Pass pre-generated content from buildInfographicContentPrompt for accurate sources.
 *
 * @param {string} topic   - The infographic topic
 * @param {string} format  - One of: FACT | MYTH | THIS vs THAT | IF YOUR BABY | DO THIS, NOT THAT
 * @param {object} content - Pre-generated content: { headline, subtext, points, sources }
 * @returns {string}       - Final DALL-E prompt string
 */
export function buildInfographicPrompt(topic, format, content = {}) {
   const fmt = INFOGRAPHIC_FORMATS[format] || INFOGRAPHIC_FORMATS["FACT"];

   const headline = content.headline || `${fmt.headlinePrefix} ${topic}`;
   const subtext = content.subtext || "A quick, evidence-backed fact every parent should know";
   const source = content.sources || "AAP (American Academy of Pediatrics)";
   const points = content.points || [
      { title: "Key Finding", detail: "The core research-backed insight about this topic" },
      { title: "Why It Matters", detail: "How this directly impacts your baby's development" },
      { title: "At Home", detail: "One simple thing you can do today based on this fact" },
      { title: "Expert Tip", detail: "A nuanced detail most parents overlook" }
   ];

   // ── Build the DALL-E image generation prompt ─────────────────────────────────
   const pointsText = points
      .map((p, i) => `Point ${i + 1} — Title: "${p.title}" | Detail: "${p.detail}"`)
      .join("; ");

   return [
      // Core format
      "Create a square (1:1) WhatsApp-ready infographic image. Clean, minimal, modern design.",
      "Layout: left 55% is text content area on a white card, right 45% is illustration area.",

      // Color theme
      `Color theme: ${fmt.colorTheme}.`,

      // Badge / format label
      `Top-left corner: a small rounded ${fmt.badgeColor} pill label that reads "${fmt.badgeLabel}".`,

      // Headline
      `Main headline text (large, bold, max 8 words): "${headline}". Place at the top of the text area.`,

      // Subtext
      `Subtext below headline (small, muted, 1 line): "${subtext}".`,

      // Action points
      `Below subtext, display exactly 4 action points in a vertical list with rounded icon bullets. ${pointsText}.`,
      "Each point: small bold title on one line, one short detail sentence below it. Clean spacing.",

      // Source
      `At the very bottom of the text area, in tiny muted text: "Source: ${source}".`,

      // Illustration
      `Right side illustration (45% of image): ${fmt.illustrationStyle}.`,
      "Illustration style: cute, minimal, flat-ish illustration — NOT photorealistic. Soft, warm, friendly. Indian baby.",
      "Baby looks South Asian / Indian — warm skin tone, dark hair, expressive eyes.",

      // Nubo logo
      "Bottom-right corner: small, clean text logo that reads 'nubo' in lowercase rounded sans-serif font, in a muted color matching the theme. Keep it subtle and professional.",

      // Global design rules
      "Typography: clean sans-serif throughout. Adequate white space. No clutter.",
      "No long paragraphs anywhere. All text is short and scannable.",
      "Overall feel: premium, parent-friendly, trustworthy. Like a professional health brand's social post.",
      "DO NOT add any borders, frames, or shadows that look cheap. Keep it elegant.",
      "Image must look complete, polished, and ready to share on WhatsApp."
   ]
      .filter(Boolean)
      .join(" ");
}
