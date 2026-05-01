const db = require('../config/connection');
const bcrypt = require('bcryptjs');

exports.login = (req, res) => {
  const { user_name, user_password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [user_name], async (err, results) => {
    if (err) return res.status(500).json({ status: 'error' });

    if (results.length === 0) {
      return res.json({ status: 'Invalid credentials' });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(user_password, user.password);
    if (!isMatch) {
      return res.json({ status: 'Invalid credentials' });
    }

    req.session.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    };

    return res.json({
      status: 'success',
      role: user.role
    });
  });
};