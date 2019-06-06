const fireDb = require('../../services/firebase_admin');

module.exports = fireDb.ref('products').once('value');