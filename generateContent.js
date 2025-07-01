// services/bookSuggestionService.js
import { genAI } from "./constant.js"; // ✅ Make sure genAI is configured correctly

export const generateBookSuggestions = async (title, author) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Suggest 3 books similar to "${title}" by ${author}. 
Return ONLY in JSON format with "title" and "author" fields.
Example:
[
  { "title": "Book 1", "author": "Author A" },
  { "title": "Book 2", "author": "Author B" },
  { "title": "Book 3", "author": "Author C" }
]
`;

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const raw = await result.response.text();

    // 🧼 Extract JSON (in case Gemini wraps it in markdown)
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) || raw.match(/```([\s\S]*?)```/);
    const rawJson = jsonMatch ? jsonMatch[1].trim() : raw;

    const cleaned = rawJson
      .replace(/[“”]/g, '"') // smart quotes
      .replace(/[‘’]/g, "'")
      .replace(/,\s*([}\]])/g, '$1'); // trailing commas

    const suggestions = JSON.parse(cleaned);

    return suggestions;
  } catch (error) {
    console.error("Book suggestion error:", error.message);
    throw new Error("Failed to generate book suggestions.");
  }
};

export default generateBookSuggestions;
