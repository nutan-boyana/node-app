const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/getAllUsers', adminController.getAllUsers);

router.get('/getUserById/:id', adminController.getUserById);

router.get('/manage-users', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  res.render('pages/manage-users', {
    user: req.session.user   
  });
});

router.post('/create-user', adminController.createUser);

router.put('/update-user/:id', adminController.updateUser);

router.put('/toggle-user-status/:id', adminController.toggleUserStatus);

router.delete('/delete-user/:id', adminController.deleteUser);

router.get('/create-user', adminController.createPage);

router.get('/editUser/:id', adminController.editUserPage);

router.get('/settings', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  res.render('pages/settings', {
    user: req.session.user   
  });
});

router.get('/departments', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  res.render('pages/departments', {
    user: req.session.user   
  });
});

router.post('/create-department', adminController.createDepartment);

router.put('/toggle-department-status/:id', adminController.toggleDepartmentStatus);

router.delete('/delete-department/:id', adminController.deleteDepartment);

router.get('/create-department', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  res.render('pages/create-department', {
    user: req.session.user   
  });
});

router.get('/getAllDepartments', adminController.getAllDepartments);

module.exports = router;