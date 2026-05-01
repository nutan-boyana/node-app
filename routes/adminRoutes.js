const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/getAllUsers', adminController.getAllUsers);

router.get('/getUserById/:id', adminController.getUserById);

router.get('/manage-users', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('pages/manage-users', {
    user: req.session.user   
  });
});

router.post('/create-user', adminController.createUser);

router.put('/update-user/:id', adminController.updateUser);

router.delete('/delete-user/:id', adminController.deleteUser);

router.get('/create-user', adminController.createPage);

router.get('/editUser/:id', adminController.editUserPage);

// router.get('/settings', adminController.settingsPage);

router.get('/settings', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('pages/settings', {
    user: req.session.user   
  });
});


module.exports = router;