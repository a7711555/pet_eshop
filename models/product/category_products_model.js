const fireDb = require('../../services/firebase_admin');

module.exports = function (category) {
  return fireDb.ref('products').orderByChild('cate').equalTo(category).once('value');  
}