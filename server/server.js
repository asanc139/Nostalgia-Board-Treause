require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, sequelize } = require('./config/db');
const User = require('./models/User');

const signupRoute = require('./routes/Signup');
const loginRoute = require('./routes/Login');
const meRoute = require('./routes/me');
const feedRoute = require('./routes/feed');
const savedItemsRoute = require('./routes/savedItems');
const interestsRoute = require('./routes/interests');

connectDB().then(() => sequelize.sync());

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://nostalgia-board-treasure-client.onrender.com',
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS: ' + origin));
      }
    },
  }),
);
app.use(express.json());

app.use('/api', signupRoute);
app.use('/api', loginRoute);
app.use('/api', meRoute);
app.use('/api', feedRoute);
app.use('/api', savedItemsRoute);
app.use('/api', interestsRoute);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.get('/api/debug', async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT * FROM "Users"');
    res.json(results);
  } catch (error) {
    console.error('Raw query error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.log('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
