const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session')
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(bodyParser.json());
const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins
}));


app.use('/', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});