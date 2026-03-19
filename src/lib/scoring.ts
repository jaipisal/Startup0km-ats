/**
 * AI Match Score Calculator
 *
 * Compares a job's description + requirements against a jobseeker's bio.
 * Returns a score from 0 to 100.
 *
 * Algorithm:
 * 1. Extract meaningful keywords from the job
 * 2. Check how many appear in the candidate's bio
 * 3. Weight by relevance (exact > partial match)
 * 4. Normalise to 0-100
 *
 * This is a local, zero-cost implementation.
 * You can replace the body of `calculateMatchScore` with an OpenAI call
 * if you want LLM-powered scoring (see commented section at bottom).
 */

// Common stop-words to ignore when extracting keywords
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at",
  "to", "for", "of", "with", "by", "from", "as", "is", "are",
  "was", "were", "be", "been", "being", "have", "has", "had",
  "do", "does", "did", "will", "would", "should", "could", "may",
  "might", "shall", "can", "need", "we", "you", "our", "their",
  "your", "us", "it", "its", "this", "that", "these", "those",
  "what", "who", "how", "why", "when", "where", "which", "while",
  "if", "than", "into", "more", "very", "also", "about", "up",
  "out", "so", "they", "them", "he", "she", "i", "me", "my", "no",
  "not", "all", "each", "both", "few", "some", "such", "any"
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9#+.\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

function extractKeywords(description: string, requirements: string[]): string[] {
  const reqText = requirements.join(" ");
  const combined = `${description} ${reqText}`;
  const tokens = tokenize(combined);

  // Count frequency
  const freq: Record<string, number> = {};
  for (const t of tokens) {
    freq[t] = (freq[t] ?? 0) + 1;
  }

  // Sort by frequency, return top 30 unique keywords
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word);
}

/**
 * Core scoring function (Async).
 * Automatically detects if a valid OpenAI key is present in .env.
 * - If key found: Uses OpenAI GPT-4o-mini for high-accuracy matching.
 * - If key missing/placeholder: Falls back to smart local keyword matching.
 */
export async function calculateMatchScore(
  jobDescription: string,
  requirements: string[],
  candidateBio: string
): Promise<number> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const isPlaceholder = !apiKey || apiKey === "your-openai-key-here" || apiKey.length < 10;

  if (isPlaceholder) {
    console.log("ℹ️ AI Match: Using Smart Local Algorithm (Fallback)");
    return calculateLocalMatchScore(jobDescription, requirements, candidateBio);
  }

  try {
    console.log("🚀 AI Match: Using OpenAI GPT-4o-mini");
    return await calculateMatchScoreWithAI(jobDescription, requirements, candidateBio, apiKey);
  } catch (error) {
    console.error("❌ AI Match: OpenAI failed, falling back to local algorithm:", error);
    return calculateLocalMatchScore(jobDescription, requirements, candidateBio);
  }
}

/**
 * Smart Local Heuristic Algorithm (Zero Cost)
 */
function calculateLocalMatchScore(
  jobDescription: string,
  requirements: string[],
  candidateBio: string
): number {
  if (!candidateBio || candidateBio.trim().length === 0) {
    return 30; // No bio → default modest score
  }

  const jobKeywords = extractKeywords(jobDescription, requirements);
  if (jobKeywords.length === 0) return 50;

  const bioTokens = new Set(tokenize(candidateBio));

  let exactMatches = 0;
  let partialMatches = 0;

  for (const kw of jobKeywords) {
    if (bioTokens.has(kw)) {
      exactMatches++;
    } else {
      const hasPartial = [...bioTokens].some(
        (bt) => bt.includes(kw) || kw.includes(bt)
      );
      if (hasPartial) partialMatches++;
    }
  }

  const rawScore = (exactMatches + partialMatches * 0.4) / jobKeywords.length;
  const score = Math.round(25 + rawScore * 73);
  return Math.min(98, Math.max(25, score));
}

/**
 * OpenAI GPT-powered matching (Requires API Key)
 */
async function calculateMatchScoreWithAI(
  jobDescription: string,
  requirements: string[],
  candidateBio: string,
  apiKey: string
): Promise<number> {
  const prompt = `
    You are an expert recruiter. Score how well this candidate matches the job from 0 to 100.
    
    Job Description: ${jobDescription}
    Job Requirements: ${requirements.join(', ')}
    
    Candidate Bio: ${candidateBio}
    
    Respond ONLY with a single integer between 0 and 100 representing the match score.
    No explanation, just the number.
  `.trim();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 5,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API responded with ${response.status}`);
  }

  const json = await response.json();
  const text = json.choices?.[0]?.message?.content?.trim() ?? "50";
  const score = parseInt(text);
  
  return isNaN(score) ? 50 : Math.min(100, Math.max(0, score));
}
