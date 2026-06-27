const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { createClient } = require('@supabase/supabase-js');
const { extractText } = require('../utils/extractText');
const { extractPII } = require('../utils/extractPII');
const { scrubPII } = require('../utils/scrubPII');
const { extractWithAI } = require('../utils/aiExtract');

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    cb(null, allowed.includes(file.mimetype));
  }
});

router.post('/', upload.array('resumes', 30), async (req, res) => {
  const results = [];

  for (const file of req.files) {
    try {
      // Check for duplicate filename
      const { data: existingList } = await supabase
        .from('candidates')
        .select('id')
        .eq('filename', file.originalname);

      if (existingList && existingList.length > 0) {
        results.push({
          file: file.originalname,
          status: 'error',
          error: 'Resume already uploaded'
        });
        continue;
      }

      // Upload to S3
      const s3Key = `resumes/${Date.now()}-${file.originalname}`;
      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }));

      const rawText = await extractText(file.buffer, file.mimetype);
      const pii = extractPII(rawText);
      const scrubbed = scrubPII(rawText);
      const aiData = await extractWithAI(scrubbed);

      const { error } = await supabase.from('candidates').insert({
        name: pii.name !== 'Unknown' ? pii.name : aiData.name,
        email: pii.email,
        phone: pii.phone,
        linkedin_url: pii.linkedin_url,
        github_url: pii.github_url,
        skills: aiData.skills,
        years_experience: aiData.years_experience,
        most_recent_title: aiData.most_recent_title,
        location: aiData.location,
        raw_text: rawText,
        scrubbed_text: scrubbed,
        filename: file.originalname,
      });

      if (error) throw error;
      results.push({ file: file.originalname, status: 'success' });

    } catch (err) {
      results.push({
        file: file.originalname,
        status: 'error',
        error: err.message
      });
    }
  }

  res.json({ results });
});

module.exports = router;
