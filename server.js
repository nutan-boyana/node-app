const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true
}));

// Static (your assets folder)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use(authRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use(adminRoutes);

// Server
// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});