const getProductData = require('../../models/product/all_products_model');

module.exports = function getIndex(req, res) {
  getProductData.then((snap) => {
    let dataArray = [];
    snap.forEach((item) => {
      dataArray.push(item.val());
    });

    // array shuffle
    let i, j, temp;
    for (i = dataArray.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = dataArray[i];
      dataArray[i] = dataArray[j];
      dataArray[j] = temp;
    }
    res.render('index', {
      indexItem: dataArray.slice(0, 3)
    });
  }).catch(err => {
    
  });
};