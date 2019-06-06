const getProductData = require('../../models/product/all_products_model');
const getProductByCategory = require('../../models/product/category_products_model');

function pagination(pageCurrent, allDatas) {
  let totalDatas = allDatas.length;
  let perPage = 4;
  const totalPage = Math.ceil(totalDatas / perPage);

  if (pageCurrent > totalPage) {
    pageCurrent = totalPage;
  }
  let maxIndex = pageCurrent * perPage;
  const minIndex = maxIndex - perPage;

  if (maxIndex > totalDatas) {
    maxIndex = totalDatas;
  }

  return {
    totalPage,
    pageCurrent,
    maxIndex,
    minIndex,
    hasPre: pageCurrent > 1,
    hasNext: pageCurrent < totalPage
  }
}

module.exports = class GetProducts {
  defaultPage(req, res) {
    getProductData.then(snap => {
      const page = req.query.page || 1;
      let dataArray = [];
      snap.forEach(item => {
        dataArray.push(item.val());
      });

      const pageInfo = pagination(page, dataArray);

      res.render('product', {
        data: dataArray.slice(pageInfo.minIndex, pageInfo.maxIndex),
        pageInfo,
        category: 'all'
      });
    });
  };
  CategoryPage(req, res) {
    getProductByCategory(req.params.category).then(snap => {
      const page = req.query.page || 1;
      let dataArray = [];
      snap.forEach(item => {
        dataArray.push(item.val());
      });

      const pageInfo = pagination(page, dataArray);

      res.render('product', {
        data: dataArray.slice(pageInfo.minIndex, pageInfo.maxIndex),
        pageInfo,
        category: req.params.category
      });
    });
  };
}