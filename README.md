# Talent Pool Search

A web app that lets recruiters upload resumes, automatically extract candidate information using AI, and search/filter their talent pool.

## Live URL
http://44.203.158.112/

## GitHub Repo
https://github.com/Prabhas55/talent-pool

## Tech Stack
- **Frontend:** React (Vite) — served via Nginx on AWS EC2
- **Backend:** Node.js + Express — running via PM2 on AWS EC2
- **Database:** Supabase (PostgreSQL)
- **File Storage:** AWS S3 (ap-south-1)
- **AI Model:** Groq — llama-3.1-8b-instant

## How to Run Locally

### Prerequisites
- Node.js v22+
- AWS S3 bucket
- Supabase project
- Groq API key

### Backend
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-south-1
S3_BUCKET=talent-pool-resumes
PORT=3001
```

```bash
node index.js
# Server runs on http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder:
```
VITE_API_URL=http://localhost:3001
```

```bash
npm run dev
# App runs on http://localhost:5173
```

## Supabase Table Setup
Run this in Supabase SQL Editor:
```sql
create table candidates (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  phone text,
  linkedin_url text,
  github_url text,
  skills text[],
  years_experience numeric,
  most_recent_title text,
  location text,
  raw_text text,
  scrubbed_text text,
  filename text,
  education text,
  created_at timestamp default now()
);
```

## How It Works

### Upload Flow
1. Recruiter uploads one or more PDF or Word resumes
2. Files are stored in AWS S3
3. Text is extracted locally from each file
4. PII (email, phone, LinkedIn, GitHub) is extracted using regex on raw text
5. Raw text is scrubbed — PII replaced with [EMAIL], [PHONE], [LINKEDIN], [GITHUB]
6. Scrubbed text is sent to Groq AI to extract skills, title, location, years of experience
7. All data stored in Supabase

### Search Flow
1. All candidates displayed as cards
2. Filter by skill (case insensitive), minimum years experience, location
3. Click any card to see full profile with contact details

## PII Handling
Contact details are extracted locally using regex BEFORE any AI call.
The AI only ever sees scrubbed text with placeholders — never real emails, phones, or URLs.

## AI Model
**Groq llama-3.1-8b-instant** was chosen because:
- Very generous free tier
- Extremely fast responses (under 1 second)
- Reliable structured JSON output for resume parsing

## Project Structure
```
talent-pool/
├── backend/
│   ├── index.js
│   ├── routes/
│   │   ├── upload.js
│   │   └── candidates.js
│   └── utils/
│       ├── extractText.js   # PDF/Word/TXT text extraction
│       ├── extractPII.js    # Regex PII extraction
│       ├── scrubPII.js      # PII replacement with placeholders
│       └── aiExtract.js     # Groq AI integration
├── frontend/
│   └── src/
│       ├── App.jsx
│       └── pages/
│           ├── UploadPage.jsx
│           └── SearchPage.jsx
└── README.md
```
