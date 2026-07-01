require('dotenv').config();
const { sequelize } = require('./config/db');
const Item = require('./models/Item');
const User = require('./models/User');

// Dummy Users for Example
const sampleUsers = [
  { username: 'Alice', email: 'alice@example.com', age: 33 },
  { username: 'Bob', email: 'bob@example.com', age: 35 },
  { username: 'Charlie', email: 'charlie@example.com', age: 38 },
];

const sampleItems = [
  { name: 'First Item', description: 'First item in our collection' },
  { name: 'Second Item', description: 'Second item in our collection' },
  { name: 'Third Item', description: 'Third item in our collection' },
];

(async () => {
  try {
    await sequelize.sync({ force: true });
    await Item.bulkCreate(sampleItems);
    await User.bulkCreate(sampleUsers);
    console.log('Database seeded successfully');
    await sequelize.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
})();
