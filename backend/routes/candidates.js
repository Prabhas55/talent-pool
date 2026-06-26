const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

router.get('/', async (req, res) => {
  const { skill, min_exp, location } = req.query;

  // Get all candidates first
  let query = supabase.from('candidates').select('*');

  if (min_exp) query = query.gte('years_experience', parseFloat(min_exp));
  if (location) query = query.ilike('location', `%${location}%`);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  // Filter by skill in JavaScript (case insensitive)
  let result = data;
  if (skill) {
    const skillLower = skill.toLowerCase();
    result = data.filter(candidate =>
      (candidate.skills || []).some(s =>
        s.toLowerCase().includes(skillLower)
      )
    );
  }

  res.json(result);
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

module.exports = router;
