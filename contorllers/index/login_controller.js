const fireDb = require('../../services/firebase_admin');
const firebase = require('../../services/firebase');
const fireAuth = firebase.auth();


module.exports = function(req, res) {
  fireAuth.signInWithEmailAndPassword(req.body.email, req.body.password).then(user => {
    req.session.uid = user.user.uid;
    return fireDb.ref('/users').child(user.user.uid).once('value');
  }).then(snap => {
    req.session.username = snap.val().username;
    res.redirect('/');
  }).catch(err => {
    switch(err.code) {
      case 'auth/invalid-email':
      case 'auth/user-not-found':
        req.flash('error', '電子郵件輸入錯誤');
        break;
      case 'auth/user-disabled':
        req.flash('error', '帳號已停用');
        break;
      case 'auth/wrong-password':
        req.flash('error', '密碼錯誤');
        break;
      default: 
        req.flash('error', '系統發生錯誤請稍後再試，謝謝');
        break;
    }
    res.redirect('/login');
  });
}