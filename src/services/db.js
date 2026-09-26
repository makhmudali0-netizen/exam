import { createClient } from '@supabase/supabase-js';
import { DEFAULT_QUESTIONS, DEFAULT_SETTINGS } from '../data/defaultQuestions';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// === QUESTIONS ===
export async function fetchQuestions() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('id', { ascending: true });

      if (error) console.error('Supabase fetchQuestions error:', error);
      if (data && data.length > 0) {
        return data.map(q => ({
          ...q,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
        }));
      }
    } catch (err) {
      console.warn('Supabase fetchQuestions exception:', err);
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
  if (supabase) {
    try {
      await supabase.from('questions').delete().neq('id', 0);
      const { error } = await supabase.from('questions').insert(newQuestions);
      if (error) console.error('Supabase saveQuestions error:', error);
      return true;
    } catch (err) {
      console.error('Supabase saveQuestions exception:', err);
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
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .order('id', { ascending: false });

      if (error) console.error('Supabase fetchResults error:', error);
      if (data) {
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
      console.warn('Supabase fetchResults exception:', err);
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
  if (supabase) {
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
      const { data, error } = await supabase
        .from('results')
        .insert([row])
        .select();

      if (error) console.error('Supabase saveResult error:', error);
      if (data && data[0]) {
        return data[0].id;
      }
    } catch (err) {
      console.error('Supabase saveResult exception:', err);
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
  if (supabase && dbId) {
    try {
      const { error } = await supabase.from('results').delete().eq('id', dbId);
      if (error) console.error('Supabase deleteStudentResult error:', error);
      return true;
    } catch (err) {
      console.error('Supabase deleteStudentResult exception:', err);
    }
  }

  if (dbId) {
    try {
      await fetch(`/api/results/${dbId}`, { method: 'DELETE' });
    } catch (_) {}
  }
}

export async function clearAllResults() {
  if (supabase) {
    try {
      const { error } = await supabase.from('results').delete().neq('id', 0);
      if (error) console.error('Supabase clearAllResults error:', error);
      return true;
    } catch (err) {
      console.error('Supabase clearAllResults exception:', err);
    }
  }

  try {
    await fetch('/api/results');
  } catch (_) {}
  localStorage.removeItem('exam_results');
}

// === SETTINGS ===
export async function fetchSettings() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) console.error('Supabase fetchSettings error:', error);
      if (data && data.length > 0) {
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
      console.warn('Supabase fetchSettings exception:', err);
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
  if (supabase) {
    try {
      const rows = [
        { key: 'timeLimitMinutes', value: String(newSettings.timeLimitMinutes) },
        { key: 'examTitle', value: newSettings.examTitle },
        { key: 'adminPassword', value: newSettings.adminPassword },
        { key: 'enableAntiCheating', value: String(newSettings.enableAntiCheating) },
        { key: 'maxViolationsAllowed', value: String(newSettings.maxViolationsAllowed) }
      ];
      const { error } = await supabase.from('settings').upsert(rows);
      if (error) console.error('Supabase saveSettings error:', error);
      return true;
    } catch (err) {
      console.error('Supabase saveSettings exception:', err);
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
