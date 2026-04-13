const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/login', authController.login);

router.get('/login', (req, res) => {
  res.render('login'); 
});

router.get('/admin/dashboard', (req, res) => {
  res.send('Admin Dashboard');
});

router.get('/user/home', (req, res) => {
  res.send('User Home');
});

router.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('dashboard', {
    user: req.session.user
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;