function extractPII(text) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(\+?\d[\d\s\-().]{7,}\d)/g;
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9\-_%]+/gi;
  const githubRegex = /github\.com\/[a-zA-Z0-9\-_]+/gi;

  // Get first non-empty line under 50 chars as name
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const name = lines.find(l => l.length < 50 && !l.includes('@') && !l.includes('http')) || 'Unknown';

  return {
    name,
    email: (text.match(emailRegex) || [])[0] || null,
    phone: (text.match(phoneRegex) || [])[0] || null,
    linkedin_url: (text.match(linkedinRegex) || [])[0] || null,
    github_url: (text.match(githubRegex) || [])[0] || null,
  };
}

module.exports = { extractPII };