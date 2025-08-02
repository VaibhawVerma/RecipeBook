const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();
const app = express();

const allowedOrigins = ['https://recipe-book-6q6u3ywm-vaibhaw-vermas-projects.vercel.app'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.options('*', cors());

app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/users', require('./routes/users'));
app.use('/api/external-recipes', require('./routes/externalRecipes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));