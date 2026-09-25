import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Default 30 HTML Questions
const DEFAULT_QUESTIONS = [
  { id: 1, question: "HTML qisqartmasining to'liq ma'nosi nima?", options: ["HyperText Markup Language", "HyperTech Modern Language", "HighText Machine Language", "Home Tool Markup Language"], correctAnswer: 0 },
  { id: 2, question: "HTML sahifasida eng yuqori darajadagi (eng katta) sarlavha qaysi teg orqali yaratiladi?", options: ["<heading>", "<h6>", "<h1>", "<head>"], correctAnswer: 2 },
  { id: 3, question: "HTML da boshqa sahifaga giperhavola (link) yaratish uchun qaysi teg ishlatiladi?", options: ["<link>", "<a>", "<href>", "<url>"], correctAnswer: 1 },
  { id: 4, question: "HTML sahifasiga rasm qo'shish uchun qaysi teg ishlatiladi?", options: ["<image>", "<img>", "<pic>", "<src>"], correctAnswer: 1 },
  { id: 5, question: "<img> tegida rasm manzilini belgilash uchun qaysi atribut ishlatiladi?", options: ["url", "href", "src", "link"], correctAnswer: 2 },
  { id: 6, question: "Tartibsiz (nuqtali) ro'yxat tuzish uchun qaysi teg ishlatiladi?", options: ["<ol>", "<ul>", "<li>", "<list>"], correctAnswer: 1 },
  { id: 7, question: "Tartiblangan (raqamli) ro'yxat tuzish uchun qaysi teg ishlatiladi?", options: ["<ol>", "<ul>", "<dl>", "<li>"], correctAnswer: 0 },
  { id: 8, question: "Ro'yxatning har bir elementini ko'rsatish uchun qaysi teg ishlatiladi?", options: ["<item>", "<li>", "<elem>", "<list>"], correctAnswer: 1 },
  { id: 9, question: "Matnni qalin (bold) va muhim ko'rinishda chiqarish uchun qaysi teg ishlatiladi?", options: ["<strong>", "<i>", "<big>", "<mark>"], correctAnswer: 0 },
  { id: 10, question: "Matnni og'ma (kursiv) ko'rinishda chiqarish uchun qaysi teg ishlatiladi?", options: ["<b>", "<em>", "<small>", "<sub>"], correctAnswer: 1 },
  { id: 11, question: "Matnda yangi qatordan boshlash (line break) uchun qaysi teg ishlatiladi?", options: ["<break>", "<lb>", "<br>", "<p>"], correctAnswer: 2 },
  { id: 12, question: "Sahifada gorizontal ajratuvchi chiziq tortish uchun qaysi teg ishlatiladi?", options: ["<line>", "<hr>", "<border>", "<divider>"], correctAnswer: 1 },
  { id: 13, question: "HTML da jadval yaratish uchun eng asosiy o'rovchi teg qaysi?", options: ["<table>", "<grid>", "<tab>", "<tr>"], correctAnswer: 0 },
  { id: 14, question: "Jadvalning har bir qatori (row) qaysi teg bilan aniqlanadi?", options: ["<td>", "<th>", "<tr>", "<row>"], correctAnswer: 2 },
  { id: 15, question: "Jadvalning oddiy katakchasi (data cell) uchun qaysi teg ishlatiladi?", options: ["<td>", "<tr>", "<th>", "<cell>"], correctAnswer: 0 },
  { id: 16, question: "Jadvalning sarlavha katakchasi (header cell) uchun qaysi teg ishlatiladi?", options: ["<td>", "<th>", "<head>", "<caption>"], correctAnswer: 1 },
  { id: 17, question: "HTML5 hujjatining turi va versiyasini brauzerga bildirish uchun qaysi kod sahifa boshida yoziladi?", options: ["<html version=\"5\">", "<!DOCTYPE html>", "<DOCTYPE html5>", "<?xml version=\"1.0\"?>"], correctAnswer: 1 },
  { id: 18, question: "Brauzer oynasida ko'rinmaydigan, sahifa sarlavhasi va meta-ma'lumotlari joylashadigan teg qaysi?", options: ["<body>", "<head>", "<meta>", "<header>"], correctAnswer: 1 },
  { id: 19, question: "Foydalanuvchiga ko'rinadigan barcha kontentlar (matn, rasm, tugmalar) qaysi teg ichida yoziladi?", options: ["<head>", "<body>", "<main>", "<content>"], correctAnswer: 1 },
  { id: 20, question: "Foydalanuvchidan ma'lumot yig'ish forma yaratish uchun qaysi teg ishlatiladi?", options: ["<form>", "<input>", "<select>", "<field>"], correctAnswer: 0 },
  { id: 21, question: "Foydalanuvchi matn yoki ma'lumot kiritishi uchun ishlatiladigan universal teg qaysi?", options: ["<form>", "<input>", "<textbox>", "<entry>"], correctAnswer: 1 },
  { id: 22, question: "Sahifada bosiladigan tugma yaratish uchun qaysi teg ishlatiladi?", options: ["<click>", "<button>", "<submit>", "<press>"], correctAnswer: 1 },
  { id: 23, question: "Foydalanuvchiga ko'p qatorli matn kiritish imkonini beruvchi teg qaysi?", options: ["<input type=\"text\">", "<textarea>", "<multiline>", "<text>"], correctAnswer: 1 },
  { id: 24, question: "HTML kodida izoh (kommentariya) qanday yoziladi?", options: ["// Bu izoh", "<!-- Bu izoh -->", "/* Bu izoh */", "# Bu izoh"], correctAnswer: 1 },
  { id: 25, question: "HTML5 da video fayllarni joylashtirish uchun qaysi teg kiritilgan?", options: ["<media>", "<video>", "<movie>", "<player>"], correctAnswer: 1 },
  { id: 26, question: "HTML5 da audio/ovoz fayllarini ijro etish uchun qaysi teg ishlatiladi?", options: ["<sound>", "<audio>", "<music>", "<voice>"], correctAnswer: 1 },
  { id: 27, question: "Brauzer sarlavhasi (tab) matnini belgilovchi teg qaysi?", options: ["<head>", "<title>", "<caption>", "<header>"], correctAnswer: 1 },
  { id: 28, question: "Giperhavola chiquvchi sahifani yangi oynada ochish uchun qaysi atribut beriladi?", options: ["target=\"_blank\"", "target=\"_self\"", "open=\"new\"", "window=\"new\""], correctAnswer: 0 },
  { id: 29, question: "Elementlarni guruhlash uchun ishlatiladigan blok (block-level) konteyner teg qaysi?", options: ["<span>", "<div>", "<section>", "<group>"], correctAnswer: 1 },
  { id: 30, question: "Qator ichidagi (inline) matnlarni va elementlarni guruhlash uchun qaysi teg ishlatiladi?", options: ["<div>", "<span>", "<p>", "<inline>"], correctAnswer: 1 }
];

let db = null;
let memoryQuestions = [...DEFAULT_QUESTIONS];
let memoryResults = [];
let memorySettings = {
  timeLimitMinutes: 30,
  examTitle: "HTML Bo'yicha Bilimni Sinash Imtihoni",
  adminPassword: "admin",
  enableAntiCheating: true,
  maxViolationsAllowed: 3
};

// Safe Database Connection
try {
  const dbPath = path.join(__dirname, 'exam_database.sqlite');
  db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      correctAnswer INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentName TEXT NOT NULL,
      studentGroup TEXT NOT NULL,
      correctCount INTEGER NOT NULL,
      totalCount INTEGER NOT NULL,
      scorePercentage INTEGER NOT NULL,
      timeSpentSeconds INTEGER NOT NULL,
      submittedAt TEXT NOT NULL,
      details TEXT NOT NULL,
      violationsCount INTEGER DEFAULT 0,
      isAutoSubmitted INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  try { db.exec("ALTER TABLE results ADD COLUMN violationsCount INTEGER DEFAULT 0;"); } catch (_) {}
  try { db.exec("ALTER TABLE results ADD COLUMN isAutoSubmitted INTEGER DEFAULT 0;"); } catch (_) {}

  // Seed Questions if empty
  const countStmt = db.prepare('SELECT count(*) as count FROM questions').get();
  if (countStmt.count === 0) {
    const insertStmt = db.prepare('INSERT INTO questions (id, question, options, correctAnswer) VALUES (?, ?, ?, ?)');
    const insertMany = db.transaction((qs) => {
      for (const q of qs) {
        insertStmt.run(q.id, q.question, JSON.stringify(q.options), q.correctAnswer);
      }
    });
    insertMany(DEFAULT_QUESTIONS);
  }

  // Seed Settings if empty
  const settingsCount = db.prepare('SELECT count(*) as count FROM settings').get();
  if (settingsCount.count === 0) {
    const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    insertSetting.run('timeLimitMinutes', '30');
    insertSetting.run('examTitle', 'HTML Bo\'yicha Bilimni Sinash Imtihoni');
    insertSetting.run('adminPassword', 'admin');
    insertSetting.run('enableAntiCheating', 'true');
    insertSetting.run('maxViolationsAllowed', '3');
  }

  console.log("SQLite Database connected successfully.");
} catch (err) {
  console.warn("SQLite Database failed to initialize, using in-memory store fallback:", err.message);
  db = null;
}

// --- API ROUTES ---

// 1. GET Questions
app.get('/api/questions', (req, res) => {
  try {
    if (db) {
      const rows = db.prepare('SELECT * FROM questions ORDER BY id ASC').all();
      const questions = rows.map(r => ({
        id: r.id,
        question: r.question,
        options: JSON.parse(r.options),
        correctAnswer: r.correctAnswer
      }));
      return res.json(questions);
    }
    res.json(memoryQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Save/Update All Questions
app.post('/api/questions', (req, res) => {
  try {
    const newQuestions = req.body;
    memoryQuestions = newQuestions;
    if (db) {
      db.prepare('DELETE FROM questions').run();
      const insertStmt = db.prepare('INSERT INTO questions (id, question, options, correctAnswer) VALUES (?, ?, ?, ?)');
      const insertMany = db.transaction((qs) => {
        for (const q of qs) {
          insertStmt.run(q.id, q.question, JSON.stringify(q.options), q.correctAnswer);
        }
      });
      insertMany(newQuestions);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Restore Default Questions
app.post('/api/questions/restore-defaults', (req, res) => {
  try {
    memoryQuestions = [...DEFAULT_QUESTIONS];
    if (db) {
      db.prepare('DELETE FROM questions').run();
      const insertStmt = db.prepare('INSERT INTO questions (id, question, options, correctAnswer) VALUES (?, ?, ?, ?)');
      const insertMany = db.transaction((qs) => {
        for (const q of qs) {
          insertStmt.run(q.id, q.question, JSON.stringify(q.options), q.correctAnswer);
        }
      });
      insertMany(DEFAULT_QUESTIONS);
    }
    res.json({ success: true, questions: DEFAULT_QUESTIONS });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. GET All Student Results
app.get('/api/results', (req, res) => {
  try {
    if (db) {
      const rows = db.prepare('SELECT * FROM results ORDER BY id DESC').all();
      const results = rows.map(r => ({
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
        details: JSON.parse(r.details)
      }));
      return res.json(results);
    }
    res.json(memoryResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. POST Save New Student Result
app.post('/api/results', (req, res) => {
  try {
    const data = req.body;
    let newDbId = Date.now();
    if (db) {
      const stmt = db.prepare(`
        INSERT INTO results 
        (studentName, studentGroup, correctCount, totalCount, scorePercentage, timeSpentSeconds, submittedAt, details, violationsCount, isAutoSubmitted) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(
        data.studentInfo.fullName,
        data.studentInfo.group || 'Guruh ko\'rsatilmagan',
        data.correctCount,
        data.totalCount,
        data.scorePercentage,
        data.timeSpentSeconds,
        data.submittedAt,
        JSON.stringify(data.details || []),
        data.violationsCount || 0,
        data.isAutoSubmitted ? 1 : 0
      );
      newDbId = info.lastInsertRowid;
    }
    const itemWithId = { ...data, dbId: newDbId };
    memoryResults.unshift(itemWithId);
    res.json({ success: true, dbId: newDbId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. DELETE Specific Student Result
app.delete('/api/results/:id', (req, res) => {
  try {
    const dbId = req.params.id;
    if (db) {
      db.prepare('DELETE FROM results WHERE id = ?').run(dbId);
    }
    memoryResults = memoryResults.filter(r => String(r.dbId) !== String(dbId));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. DELETE All Student Results
app.delete('/api/results', (req, res) => {
  try {
    if (db) {
      db.prepare('DELETE FROM results').run();
    }
    memoryResults = [];
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. GET Settings
app.get('/api/settings', (req, res) => {
  try {
    if (db) {
      const rows = db.prepare('SELECT * FROM settings').all();
      const settings = {};
      rows.forEach(r => {
        if (r.key === 'timeLimitMinutes') settings[r.key] = Number(r.value);
        else if (r.key === 'maxViolationsAllowed') settings[r.key] = Number(r.value);
        else if (r.key === 'enableAntiCheating') settings[r.key] = r.value === 'true';
        else settings[r.key] = r.value;
      });
      return res.json(settings);
    }
    res.json(memorySettings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. POST Update Settings
app.post('/api/settings', (req, res) => {
  try {
    const { timeLimitMinutes, examTitle, adminPassword, enableAntiCheating, maxViolationsAllowed } = req.body;
    if (timeLimitMinutes !== undefined) memorySettings.timeLimitMinutes = Number(timeLimitMinutes);
    if (examTitle !== undefined) memorySettings.examTitle = examTitle;
    if (adminPassword !== undefined) memorySettings.adminPassword = adminPassword;
    if (enableAntiCheating !== undefined) memorySettings.enableAntiCheating = Boolean(enableAntiCheating);
    if (maxViolationsAllowed !== undefined) memorySettings.maxViolationsAllowed = Number(maxViolationsAllowed);

    if (db) {
      const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
      if (timeLimitMinutes !== undefined) stmt.run('timeLimitMinutes', String(timeLimitMinutes));
      if (examTitle !== undefined) stmt.run('examTitle', examTitle);
      if (adminPassword !== undefined) stmt.run('adminPassword', adminPassword);
      if (enableAntiCheating !== undefined) stmt.run('enableAntiCheating', String(enableAntiCheating));
      if (maxViolationsAllowed !== undefined) stmt.run('maxViolationsAllowed', String(maxViolationsAllowed));
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static built frontend files in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing (Express 5 compatible)
app.get('(.*)', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Exam Backend Server running on http://localhost:${PORT}`);
});
