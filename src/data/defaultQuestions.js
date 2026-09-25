export const DEFAULT_QUESTIONS = [
  {
    id: 1,
    question: "HTML qisqartmasining to'liq ma'nosi nima?",
    options: [
      "HyperText Markup Language",
      "HyperTech Modern Language",
      "HighText Machine Language",
      "Home Tool Markup Language"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "HTML sahifasida eng yuqori darajadagi (eng katta) sarlavha qaysi teg orqali yaratiladi?",
    options: ["<heading>", "<h6>", "<h1>", "<head>"],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "HTML da boshqa sahifaga giperhavola (link) yaratish uchun qaysi teg ishlatiladi?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "HTML sahifasiga rasm qo'shish uchun qaysi teg ishlatiladi?",
    options: ["<image>", "<img>", "<pic>", "<src>"],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "<img> tegida rasm manzilini belgilash uchun qaysi atribut ishlatiladi?",
    options: ["url", "href", "src", "link"],
    correctAnswer: 2
  },
  {
    id: 6,
    question: "Tartibsiz (nuqtali) ro'yxat tuzish uchun qaysi teg ishlatiladi?",
    options: ["<ol>", "<ul>", "<li>", "<list>"],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "Tartiblangan (raqamli) ro'yxat tuzish uchun qaysi teg ishlatiladi?",
    options: ["<ol>", "<ul>", "<dl>", "<li>"],
    correctAnswer: 0
  },
  {
    id: 8,
    question: "Ro'yxatning har bir elementini ko'rsatish uchun qaysi teg ishlatiladi?",
    options: ["<item>", "<li>", "<elem>", "<list>"],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "Matnni qalin (bold) va muhim ko'rinishda chiqarish uchun qaysi teg ishlatiladi?",
    options: ["<strong>", "<i>", "<big>", "<mark>"],
    correctAnswer: 0
  },
  {
    id: 10,
    question: "Matnni og'ma (kursiv) ko'rinishda chiqarish uchun qaysi teg ishlatiladi?",
    options: ["<b>", "<em>", "<small>", "<sub>"],
    correctAnswer: 1
  },
  {
    id: 11,
    question: "Matnda yangi qatordan boshlash (line break) uchun qaysi teg ishlatiladi?",
    options: ["<break>", "<lb>", "<br>", "<p>"],
    correctAnswer: 2
  },
  {
    id: 12,
    question: "Sahifada gorizontal ajratuvchi chiziq tortish uchun qaysi teg ishlatiladi?",
    options: ["<line>", "<hr>", "<border>", "<divider>"],
    correctAnswer: 1
  },
  {
    id: 13,
    question: "HTML da jadval yaratish uchun eng asosiy o'rovchi teg qaysi?",
    options: ["<table>", "<grid>", "<tab>", "<tr>"],
    correctAnswer: 0
  },
  {
    id: 14,
    question: "Jadvalning har bir qatori (row) qaysi teg bilan aniqlanadi?",
    options: ["<td>", "<th>", "<tr>", "<row>"],
    correctAnswer: 2
  },
  {
    id: 15,
    question: "Jadvalning oddiy katakchasi (data cell) uchun qaysi teg ishlatiladi?",
    options: ["<td>", "<tr>", "<th>", "<cell>"],
    correctAnswer: 0
  },
  {
    id: 16,
    question: "Jadvalning sarlavha katakchasi (header cell) uchun qaysi teg ishlatiladi?",
    options: ["<td>", "<th>", "<head>", "<caption>"],
    correctAnswer: 1
  },
  {
    id: 17,
    question: "HTML5 hujjatining turi va versiyasini brauzerga bildirish uchun qaysi kod sahifa boshida yoziladi?",
    options: ["<html version=\"5\">", "<!DOCTYPE html>", "<DOCTYPE html5>", "<?xml version=\"1.0\"?>"],
    correctAnswer: 1
  },
  {
    id: 18,
    question: "Brauzer oynasida ko'rinmaydigan, sahifa sarlavhasi va meta-ma'lumotlari joylashadigan teg qaysi?",
    options: ["<body>", "<head>", "<meta>", "<header>"],
    correctAnswer: 1
  },
  {
    id: 19,
    question: "Foydalanuvchiga ko'rinadigan barcha kontentlar (matn, rasm, tugmalar) qaysi teg ichida yoziladi?",
    options: ["<head>", "<body>", "<main>", "<content>"],
    correctAnswer: 1
  },
  {
    id: 20,
    question: "Foydalanuvchidan ma'lumot yig'ish forma yaratish uchun qaysi teg ishlatiladi?",
    options: ["<form>", "<input>", "<select>", "<field>"],
    correctAnswer: 0
  },
  {
    id: 21,
    question: "Foydalanuvchi matn yoki ma'lumot kiritishi uchun ishlatiladigan universal teg qaysi?",
    options: ["<form>", "<input>", "<textbox>", "<entry>"],
    correctAnswer: 1
  },
  {
    id: 22,
    question: "Sahifada bosiladigan tugma yaratish uchun qaysi teg ishlatiladi?",
    options: ["<click>", "<button>", "<submit>", "<press>"],
    correctAnswer: 1
  },
  {
    id: 23,
    question: "Foydalanuvchiga ko'p qatorli matn kiritish imkonini beruvchi teg qaysi?",
    options: ["<input type=\"text\">", "<textarea>", "<multiline>", "<text>"],
    correctAnswer: 1
  },
  {
    id: 24,
    question: "HTML kodida izoh (kommentariya) qanday yoziladi?",
    options: ["// Bu izoh", "<!-- Bu izoh -->", "/* Bu izoh */", "# Bu izoh"],
    correctAnswer: 1
  },
  {
    id: 25,
    question: "HTML5 da video fayllarni joylashtirish uchun qaysi teg kiritilgan?",
    options: ["<media>", "<video>", "<movie>", "<player>"],
    correctAnswer: 1
  },
  {
    id: 26,
    question: "HTML5 da audio/ovoz fayllarini ijro etish uchun qaysi teg ishlatiladi?",
    options: ["<sound>", "<audio>", "<music>", "<voice>"],
    correctAnswer: 1
  },
  {
    id: 27,
    question: "Brauzer sarlavhasi (tab) matnini belgilovchi teg qaysi?",
    options: ["<head>", "<title>", "<caption>", "<header>"],
    correctAnswer: 1
  },
  {
    id: 28,
    question: "Giperhavola chiquvchi sahifani yangi oynada ochish uchun qaysi atribut beriladi?",
    options: ["target=\"_blank\"", "target=\"_self\"", "open=\"new\"", "window=\"new\""],
    correctAnswer: 0
  },
  {
    id: 29,
    question: "Elementlarni guruhlash uchun ishlatiladigan blok (block-level) konteyner teg qaysi?",
    options: ["<span>", "<div>", "<section>", "<group>"],
    correctAnswer: 1
  },
  {
    id: 30,
    question: "Qator ichidagi (inline) matnlarni va elementlarni guruhlash uchun qaysi teg ishlatiladi?",
    options: ["<div>", "<span>", "<p>", "<inline>"],
    correctAnswer: 1
  }
];

export const DEFAULT_SETTINGS = {
  timeLimitMinutes: 30,
  examTitle: "HTML Bo'yicha Bilimni Sinash Imtihoni",
  adminPassword: "admin",
  enableAntiCheating: true,
  maxViolationsAllowed: 3,
  forceFullscreen: true
};
