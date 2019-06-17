const fireDb = require('../../services/firebase_admin');
const firebase = require('../../services/firebase');
const usersDb = require('../../models/user/get_userinfo_model');
const moment = require('moment');

module.exports = class user {
  userPage(req, res) {
    const uid = req.session.uid;
    let shoppingHistory = [];

    fireDb.ref('orders').child(uid).once('value').then(snap => {
      snap.forEach(item => {
        shoppingHistory.push(item.val());
      });
      return usersDb(uid);
    }).then(snap => {
      res.render('user', {
        shoppingHistory,
        moment,
        userInfo: snap.val()
      });
    }).catch(err => {

    });
  }

  getOrderInfo(req, res) {
    const uid = req.session.uid;
    const orderId = req.params.orderId;

    fireDb.ref('orders').child(uid).child(orderId).child('shoppingList').once('value').then(snap => {
      res.send({
        status: true,
        data: snap.val(),
        msg: 'request succeeded'
      });
      res.end()
    }).catch(err => {
      res.send({
        status: false,
        data: [],
        msg: ''
      });
      res.end();
    });
  }

  updatePassword(req, res) {
    try {
      const user = firebase.auth().currentUser;
      const oldPassword = req.query.oldpwd || '';
      const newPassword = req.query.newpwd || '';
      const pwdConfirm = req.query.pwdconfirm || '';

      if(oldPassword.length === 0 || newPassword.length === 0 || pwdConfirm === 0) {
        res.send({
          status: false,
          msg: "欄位不可為空"
        });
        res.end();
        return;
      }

      if (newPassword !== pwdConfirm) {
        res.send({
          status: false,
          msg: "確認密碼須與密碼一致"
        });
        res.end();
        return;
      }

      const pwdRule = /^(?=.*\d)(?=.*[a-zA-Z]).{8,12}$/;
      if (!newPassword.match(pwdRule)) {
        res.send({
          status: false,
          msg: "密碼格式錯誤"
        });
        res.end();
        return;
      }

      user.updatePassword(newPassword).then(() => {
        req.session.destroy();
        res.send({
          status: true,
          msg: '密碼修改完成'
        });
      }).catch(err => {
        res.send({
          status: false,
          msg: "密碼修改失敗"
        });
        res.end();
      });
    } catch(err) {
      console.log(err);
    }
  }
};
