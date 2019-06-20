const fireDb = require('../../services/firebase_admin');
const fireAuth = require('../../models/user/fire_auth_models');

module.exports = class register {
  registerPage(req,res) {
    res.render('register', {
      msg: req.flash('error'),
    });
  }

  poster(req, res) {
    const user = req.body;
    
    if (user.username.length > 6 || user.username.length < 1) {
      req.flash('error', '您的暱稱輸入有誤');
      res.redirect('/register');
    }

    const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    if(!user.email.match(emailRule)) {
      req.flash('error', '電子郵件格式錯誤');
      res.redirect('/register');
    }

    const pwdRule = /^(?=.*\d)(?=.*[a-zA-Z]).{8,12}$/;
    if (!user.userpwd.match(pwdRule)) {
      req.flash('error', '密碼格式錯誤');
      res.redirect('/register');
    }

    if (user.userpwd !== user.pwdconfirm) {
      req.flash('error', '確認密碼須與密碼一致');
      res.redirect('/register');
    }

    if (!user.phone.match(/^09[\d]{8}$/)) {
      req.flash('error', '手機號碼格式錯誤');
      res.redirect('/register');
    }

    fireAuth.createUserWithEmailAndPassword(user.email, user.userpwd).then(info => {
      const userInfo = {
        uid: info.user.uid,
        username: user.username,
        email: user.email,
        phone: user.phone,
      }

      // store user info
      fireDb.ref('/users/' + info.user.uid).set(userInfo);
      
      return fireAuth.signInWithEmailAndPassword(user.email, user.userpwd);
    }).then(user => {
      req.session.uid = user.user.uid;
      return fireDb.ref('/users').child(user.user.uid).once('value');
    }).then(snap => {
      req.session.username = snap.val().username;
      res.redirect('/user');
    }).catch(err => {
      if (err.code === 'auth/email-already-in-use') {
        req.flash('error', '這個信箱已經被註冊過囉');
      } else {
        req.flash('error', '系統發生錯誤請稍後再試');
      }
      res.redirect('/register');
    });
  }
}