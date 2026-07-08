require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, sequelize } = require('./config/db');
const User = require('./models/User');

const Item = require('./models/Item');
const signupRoute = require('./routes/Signup');
//require('./models/Item');
//require('./models/User');
connectDB().then(() => sequelize.sync());

const app = express();
//connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', signupRoute);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

//const User = require('./models/User');

//const Item = require('./models/Item');
app.get('/api/debug', async (req, res) => {
  try {
    // raw query - bypasses model/table name issues completely
    const [results] = await sequelize.query('SELECT * FROM "Users"');
    console.log('Raw query results:', results);
    res.json(results);
  } catch (error) {
    console.error('Raw query error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
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
