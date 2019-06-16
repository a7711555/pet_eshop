const fireDb = require('../../services/firebase_admin');
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
};
