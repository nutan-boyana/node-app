const db = require('../config/connection');
const bcrypt = require('bcryptjs');

exports.getAllUsers = (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ status: 'forbidden' });
  }

  const sql = 'SELECT u.id, u.name, u.email, u.role, u.delete_status, u.department_id, d.department_name FROM users u LEFT JOIN departments d ON u.department_id = d.department_id';

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

exports.createUser = async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ status: 'forbidden' });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const sql = 'INSERT INTO users (name, email, password, role, department_id) VALUES (?, ?, ?, ?, ?)';

    db.query(sql, [req.body.name, req.body.email, hashedPassword, req.body.role, req.body.department_id || null], (err, results) => {
      if (err) {
        return res.status(500).json({ status: 'error' });
      }

      res.json({
        status: 'success',
        users: results
      });
    });
  } catch (err) {
    return res.status(500).json({ status: 'error' });
  }
};

exports.updateUser = async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ status: 'forbidden' });
  }

  try {
    let sql, params;
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      sql = 'UPDATE users SET name = ?, email = ?, password = ?, role = ?, department_id = ? WHERE id = ?';
      params = [req.body.name, req.body.email, hashedPassword, req.body.role, req.body.department_id || null, req.params.id];
    } else {
      sql = 'UPDATE users SET name = ?, email = ?, role = ?, department_id = ? WHERE id = ?';
      params = [req.body.name, req.body.email, req.body.role, req.body.department_id || null, req.params.id];
    }

    db.query(sql, params, (err, results) => {
      if (err) {
        return res.status(500).json({ status: 'error' });
      }

      res.json({
        status: 'success',
        users: results
      });
    });
  } catch (err) {
    return res.status(500).json({ status: 'error' });
  }
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

  const sql = 'UPDATE users SET delete_status = 1 WHERE id = ?';

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

exports.toggleUserStatus = (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ status: 'forbidden' });
  }

  const sql = 'UPDATE users SET delete_status = ? WHERE id = ?';
  db.query(sql, [req.body.delete_status, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
    return res.json({ status: 'success' });
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

  const sql = 'SELECT department_id, department_name FROM departments WHERE delete_status = 0 OR delete_status IS NULL';
  db.query(sql, (err, departments) => {
    res.render('pages/create-user', {
      user: req.session.user,
      departments: departments || []
    });
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

  const sqlUser = 'SELECT * FROM users WHERE id = ?';
  const sqlDepts = 'SELECT department_id, department_name FROM departments WHERE delete_status = 0 OR delete_status IS NULL';

  db.query(sqlUser, [id], (err, userResult) => {
    if (err || userResult.length === 0) {
      return res.redirect('/manage-users');
    }

    db.query(sqlDepts, (err, deptResult) => {
      res.render('pages/edit-user', {
        user: userResult[0],
        departments: deptResult || []
      });
    });
  });
};

// settings page
exports.settingsPage = (req, res) => {
  res.render('settings');
};

exports.createDepartment = async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ status: 'forbidden' });
  }

  try {
    const sql = 'INSERT INTO departments (department_name) VALUES (?)';

    db.query(sql, [req.body.department_name], (err, results) => {
      if (err) {
        return res.status(500).json({ status: 'error' });
      }

      res.json({
        status: 'success',
        departments: results
      });
    });
  } catch (err) {
    return res.status(500).json({ status: 'error' });
  }
};

exports.getAllDepartments = (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ status: 'forbidden' });
  }

  const sql = 'SELECT department_id, department_name, delete_status FROM departments';

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ status: 'error' });
    }

    res.json({
      status: 'success',
      departments: results
    });
  });
};

exports.toggleDepartmentStatus = (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ status: 'forbidden' });
  }

  const sql = 'UPDATE departments SET delete_status = ? WHERE department_id = ?';
  db.query(sql, [req.body.delete_status, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
    return res.json({ status: 'success' });
  });
};

exports.deleteDepartment = (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ status: 'forbidden' });
  }

  const sql = 'UPDATE departments SET delete_status = 1 WHERE department_id = ?';

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'not_found' });
    }

    return res.json({
      status: 'success',
      message: 'Department deleted successfully'
    });
  });
};
