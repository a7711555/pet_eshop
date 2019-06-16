const fireDb = require('../../services/firebase_admin');

module.exports = function(uid) {
  return fireDb.ref('users').child(uid).once('value');
}