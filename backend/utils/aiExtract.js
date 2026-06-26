const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function extractWithAI(scrubbedText) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'user',
        content: `You are a resume parser. Extract the following from this resume text and return ONLY valid JSON with no markdown, no backticks, no explanation.

For years_experience: ADD UP all the years from each job listed. For example if someone worked 4 years at one job and 3 years at another, years_experience = 7. Look for date ranges like (2019-2024) and calculate the difference.

{
  "name": "Full Name",
  "skills": ["array", "of", "skills"],
  "years_experience": 7,
  "most_recent_title": "Software Engineer",
  "location": "City, Country"
}

If you cannot determine a value, use null. Return ONLY the JSON object, nothing else.

Resume:
${scrubbedText.slice(0, 3000)}`
      }
    ],
    temperature: 0.1,
    max_tokens: 500,
  });

  const responseText = completion.choices[0].message.content;
  const cleaned = responseText.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  
  // Ensure years_experience is a number
  if (parsed.years_experience) {
    parsed.years_experience = parseFloat(parsed.years_experience);
  }
  
  return parsed;
}

module.exports = { extractWithAI };