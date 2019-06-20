const csrf = require('csurf');
const area_data = require('../../models/area_data');
const allProducts = require('../../models/product/all_products_model');
const orderRef = require('../../models/user/orders_model');
const usersDb = require('../../models/user/get_userinfo_model');

module.exports = class order {
  checkout(req, res) {
    try {
      const selection = JSON.parse(req.cookies.shopcart);
      const positiveInt = new RegExp(/^[1-9]+[0-9]*]*$/);
      if (selection.length > 0) {
        selection.forEach(item => {
          if (!item.qty.toString().match(positiveInt)) {
            throw (new Error('購物車物品數量錯誤'));
          }
          if(item.qty > 100) {
            throw (new Error('單項商品數量不可超過100件'));
          }
        });

        allProducts.then(snap => {
          let shoppingList = [];
          let totalPrice = 0;
          snap.forEach(item => {
            let findCommodity = selection.find(data => {
              return data.id === item.val().id;
            });
            if (findCommodity) {
              const commodity = {
                id: item.val().id,
                name: item.val().name,
                price: item.val().price,
                qty: findCommodity.qty,
              }
              totalPrice += commodity.price * findCommodity.qty;
              shoppingList.push(commodity);
            }
          });
          req.session.shopcart = shoppingList;         
          res.render('checkout',{
            shoppingList, 
            totalPrice,
            csrfToken: req.csrfToken()
          });
        }).catch(err => {
          res.render('error', {
            msg: '系統發生錯誤，請稍後再試'
          })
        })
      } else {
        res.render('error', {
          msg: '購物車是空的'
        })
      }
    } catch (e) {
      res.render('error', {
        msg: e.message
      })
    }
  }

  details(req, res) {
    let total = 0;
    const uid = req.session.uid;
    const shoppingList = req.session.shopcart;
    const orderPush = orderRef.child(uid).push();
    const orderTime = Date.now();
    let orderInfo = {};

    usersDb(uid).then(snap => {
      shoppingList.forEach(item => {
        total += item.qty * item.price
      });

      orderInfo = {
        orderId: orderPush.key,
        email: snap.val().email,
        customerName: req.body.lastname.substring(0, 20) + req.body.firstname.substring(0, 20),
        customerUid: uid,
        phone: snap.val().phone,
        address: req.body.city + req.body.state + req.body.address.substring(0, 50),
        freight: '貨到付款',
        status: '處理中',
        freightPrice: 60,
        order_time: orderTime,
        shoppingList: shoppingList,
        totalPrice: total
      }
      
      return orderPush.set(orderInfo);      
    }).then(() => {
      res.clearCookie('shopcart');
      res.render('confirm', {
        orderInfo,
        shoppingList,
        total
      });
    }).catch(err => {
      render('error', {
        msg: '系統發生錯誤請稍後再試'
      })
    });   
  }

  getAreaInfo(req, res) {
    const city = req.params.city;
    const citydecode = decodeURI(Buffer.from(city, 'base64').toString('utf8'));
    res.send({
      sccuess: true,
      data: area_data[citydecode],
    });
    res.end();
  }
}