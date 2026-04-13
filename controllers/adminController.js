const db = require('../config/connection');

exports.getAllUsers = (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ status: 'forbidden' });
  }

  const sql = 'SELECT id, name, email, role FROM users';

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ status: 'error' });
    }

    res.json({
      status: 'success',
      users: results
    });
  });
};

exports.getUserById = (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ status: 'forbidden' });
  }
  const sql = 'SELECT id, name, email, role FROM users WHERE id = ?';

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ status: 'error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ status: 'User not found' });
    }
    res.json({
      status: 'success',
      users: results
    });
  });
};

exports.createUser = (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ status: 'forbidden' });
  }

  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';

  db.query(sql, [req.body.name, req.body.email, req.body.password, req.body.role], (err, results) => {
    if (err) {
      return res.status(500).json({ status: 'error' });
    }

    res.json({
      status: 'success',
      users: results
    });
  });
};

exports.updateUser = (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ status: 'forbidden' });
  }

  const sql = 'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?';

  db.query(sql, [req.body.name, req.body.email, req.body.password, req.body.role, req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ status: 'error' });
    }

    res.json({
      status: 'success',
      users: results
    });
  });
};

// exports.deleteUser = (req, res) => {
//   if (!req.session.user || req.session.user.role !== 'admin') {
//     return res.status(403).json({ status: 'forbidden' });
//   }

//   const sql = 'DELETE FROM users WHERE id = ?';

//   db.query(sql, [req.params.id], (err, results) => {
//     if (err) {
//       return res.status(500).json({ status: 'error' });
//     }

//     res.json({
//       status: 'success',
//       users: results
//     });
//   });
// };
exports.deleteUser = (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ status: 'forbidden' });
  }

  const sql = 'DELETE FROM users WHERE id = ?';

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'not_found' });
    }

    return res.json({
      status: 'success',
      message: 'User deleted successfully'
    });
  });
};

// create page
// exports.createPage = (req, res) => {
//   res.render('create-user');
// };
exports.createPage = (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('create-user', {
    user: req.session.user 
  });
};

// edit page
// exports.editPage = (req, res) => {
//   const id = req.params.id;

//   db.query("SELECT * FROM users WHERE id=?", [id], (err, result) => {
//     res.render('edit-user', { user: result[0] });
//   });
// };

exports.editUserPage = (req, res) => {
  const id = req.params.id;

  const sql = 'SELECT * FROM users WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err || result.length === 0) {
      return res.redirect('/manage-users');
    }

    res.render('edit-user', {
      user: result[0]
    });
  });
};

// settings page
exports.settingsPage = (req, res) => {
  res.render('settings');
};

