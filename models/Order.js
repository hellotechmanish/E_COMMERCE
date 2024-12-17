const db = require('../config/mongoConfig');

const createOrder = (userId, amount, callback) => {
    const query = 'INSERT INTO orders (user_id, amount) VALUES (?, ?)';
    db.query(query, [userId, amount], callback);
};

module.exports = { createOrder };
