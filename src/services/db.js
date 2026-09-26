import { DEFAULT_QUESTIONS, DEFAULT_SETTINGS } from '../data/defaultQuestions';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

const headers = () => ({
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Prefer': 'return=representation'
});

// Helper for Supabase REST API
async function supabaseFetch(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers(),
      ...options.headers
    }
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase API error: ${response.status} - ${errorText}`);
  }
  if (response.status === 204) return null;
  return await response.json();
}

// === QUESTIONS ===
export async function fetchQuestions() {
  if (isSupabaseConfigured) {
    try {
      const data = await supabaseFetch('questions?select=*&order=id.asc');
      if (Array.isArray(data) && data.length > 0) {
        return data.map(q => ({
          ...q,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
        }));
      }
    } catch (err) {
      console.warn('Supabase fetchQuestions error:', err);
    }
  }

  // Fallback to Express backend or localStorage
  try {
    const res = await fetch('/api/questions');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (_) {}

  const saved = localStorage.getItem('exam_questions');
  return saved ? JSON.parse(saved) : DEFAULT_QUESTIONS;
}

export async function saveQuestions(newQuestions) {
  if (isSupabaseConfigured) {
    try {
      // Clear existing questions
      await fetch(`${SUPABASE_URL}/rest/v1/questions?id=neq.0`, {
        method: 'DELETE',
        headers: headers()
      });
      // Insert new questions
      await supabaseFetch('questions', {
        method: 'POST',
        body: JSON.stringify(newQuestions)
      });
      return true;
    } catch (err) {
      console.error('Supabase saveQuestions error:', err);
    }
  }

  try {
    await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuestions)
    });
  } catch (_) {}

  localStorage.setItem('exam_questions', JSON.stringify(newQuestions));
}

export async function restoreDefaultQuestions() {
  return await saveQuestions(DEFAULT_QUESTIONS);
}

// === RESULTS ===
export async function fetchResults() {
  if (isSupabaseConfigured) {
    try {
      const data = await supabaseFetch('results?select=*&order=id.desc');
      if (Array.isArray(data)) {
        return data.map(r => ({
          dbId: r.id,
          studentInfo: {
            fullName: r.studentName,
            group: r.studentGroup
          },
          correctCount: r.correctCount,
          totalCount: r.totalCount,
          scorePercentage: r.scorePercentage,
          timeSpentSeconds: r.timeSpentSeconds,
          submittedAt: r.submittedAt,
          violationsCount: r.violationsCount || 0,
          isAutoSubmitted: Boolean(r.isAutoSubmitted),
          details: typeof r.details === 'string' ? JSON.parse(r.details) : (r.details || [])
        }));
      }
    } catch (err) {
      console.warn('Supabase fetchResults error:', err);
    }
  }

  try {
    const res = await fetch('/api/results');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (_) {}

  const saved = localStorage.getItem('exam_results');
  return saved ? JSON.parse(saved) : [];
}

export async function saveResult(submissionData) {
  if (isSupabaseConfigured) {
    try {
      const row = {
        studentName: submissionData.studentInfo.fullName,
        studentGroup: submissionData.studentInfo.group || "Guruh ko'rsatilmagan",
        correctCount: submissionData.correctCount,
        totalCount: submissionData.totalCount,
        scorePercentage: submissionData.scorePercentage,
        timeSpentSeconds: submissionData.timeSpentSeconds,
        submittedAt: submissionData.submittedAt,
        details: submissionData.details || [],
        violationsCount: submissionData.violationsCount || 0,
        isAutoSubmitted: Boolean(submissionData.isAutoSubmitted)
      };
      const result = await supabaseFetch('results', {
        method: 'POST',
        body: JSON.stringify(row)
      });
      if (Array.isArray(result) && result[0]) {
        return result[0].id;
      }
    } catch (err) {
      console.error('Supabase saveResult error:', err);
    }
  }

  try {
    const res = await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData)
    });
    if (res.ok) {
      const data = await res.json();
      return data.dbId;
    }
  } catch (_) {}

  return Date.now();
}

export async function deleteStudentResult(dbId) {
  if (isSupabaseConfigured && dbId) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/results?id=eq.${dbId}`, {
        method: 'DELETE',
        headers: headers()
      });
      return true;
    } catch (err) {
      console.error('Supabase deleteStudentResult error:', err);
    }
  }

  if (dbId) {
    try {
      await fetch(`/api/results/${dbId}`, { method: 'DELETE' });
    } catch (_) {}
  }
}

export async function clearAllResults() {
  if (isSupabaseConfigured) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/results?id=neq.0`, {
        method: 'DELETE',
        headers: headers()
      });
      return true;
    } catch (err) {
      console.error('Supabase clearAllResults error:', err);
    }
  }

  try {
    await fetch('/api/results', { method: 'DELETE' });
  } catch (_) {}
  localStorage.removeItem('exam_results');
}

// === SETTINGS ===
export async function fetchSettings() {
  if (isSupabaseConfigured) {
    try {
      const data = await supabaseFetch('settings?select=*');
      if (Array.isArray(data) && data.length > 0) {
        const obj = {};
        data.forEach(r => {
          if (r.key === 'timeLimitMinutes') obj[r.key] = Number(r.value);
          else if (r.key === 'maxViolationsAllowed') obj[r.key] = Number(r.value);
          else if (r.key === 'enableAntiCheating') obj[r.key] = r.value === 'true';
          else obj[r.key] = r.value;
        });
        return obj;
      }
    } catch (err) {
      console.warn('Supabase fetchSettings error:', err);
    }
  }

  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data && data.timeLimitMinutes) return data;
    }
  } catch (_) {}

  const saved = localStorage.getItem('exam_settings');
  return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
}

export async function saveSettings(newSettings) {
  if (isSupabaseConfigured) {
    try {
      const rows = [
        { key: 'timeLimitMinutes', value: String(newSettings.timeLimitMinutes) },
        { key: 'examTitle', value: newSettings.examTitle },
        { key: 'adminPassword', value: newSettings.adminPassword },
        { key: 'enableAntiCheating', value: String(newSettings.enableAntiCheating) },
        { key: 'maxViolationsAllowed', value: String(newSettings.maxViolationsAllowed) }
      ];
      await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
        method: 'POST',
        headers: {
          ...headers(),
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(rows)
      });
      return true;
    } catch (err) {
      console.error('Supabase saveSettings error:', err);
    }
  }

  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
  } catch (_) {}

  localStorage.setItem('exam_settings', JSON.stringify(newSettings));
}
