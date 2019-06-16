const fireDb = require('../../services/firebase_admin');

const db = fireDb.ref('orders');
module.exports = db;