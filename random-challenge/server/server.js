const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Імпорт маршрутів
const categoriesRoutes = require('./routes/categories');
const challengesRoutes = require('./routes/challenges');

// Конфігурація
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://randome-challange.netlify.app',
    'https://random-challenge.netlify.app',
    process.env.CORS_ORIGIN
  ].filter(Boolean), // Видаляє undefined значення
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Логування для перевірки змінних середовища (тільки в development)
if (process.env.NODE_ENV === 'development') {
  console.log('Спроба підключення до MongoDB з URI:', 
    process.env.MONGODB_URI?.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://user:****@'));
}

// Підключення до MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Atlas підключено успішно'))
  .catch(err => {
    console.error('Помилка підключення до MongoDB Atlas:', err);
    // Не завершуємо процес при помилці, дозволяємо серверу продовжувати роботу
});

// Маршрути API
app.use('/api/categories', categoriesRoutes);
app.use('/api/challenges', challengesRoutes);

// Базовий маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'API для додатку "Випадковий виклик" успішно працює',
    version: '1.0.0',
    status: 'online'
  });
});

// Health check маршрут
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Перевірка статусу підключення до MongoDB
app.get('/api/status', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStateText = {
    0: 'Відключено',
    1: 'Підключено',
    2: 'Підключення',
    3: 'Відключення'
  };
  
  res.json({
    server: 'Працює',
    database: dbStateText[dbState] || 'Невідомий стан',
    dbState: dbState,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Обробка 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Маршрут не знайдено',
    path: req.originalUrl
  });
});

// Обробка помилок
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ 
    message: 'Щось пішло не так на сервері!',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM отримано. Graceful shutdown...');
  mongoose.connection.close(() => {
    console.log('MongoDB з\'єднання закрито.');
    process.exit(0);
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порту ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
