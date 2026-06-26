function scrubPII(text) {
  let scrubbed = text;
  scrubbed = scrubbed.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]'
  );
  scrubbed = scrubbed.replace(
    /(\+?\d[\d\s\-().]{7,}\d)/g, '[PHONE]'
  );
  scrubbed = scrubbed.replace(
    /linkedin\.com\/in\/[a-zA-Z0-9\-_%]+/gi, '[LINKEDIN]'
  );
  scrubbed = scrubbed.replace(
    /github\.com\/[a-zA-Z0-9\-_]+/gi, '[GITHUB]'
  );
  return scrubbed;
}

module.exports = { scrubPII };