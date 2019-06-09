const shopCartData = getCookie('shopcart');
$(document).ready(function () {
  generateCartContent(shopCartData);

  // add item into shop cart
  $('.cart-btn').on('click', function (e) {
    e.preventDefault();
    const self = $(this);
    const product = {
      id: self.data('id'),
      name: self.data('name'),
      price: self.data('price'),
      img: self.data('img'),
      qty: 1
    };

    if (shopCartData.length === 0) {
      shopCartData.push(product);
    } else {
      let counter = 0;
      while (counter < shopCartData.length) {
        if (shopCartData[counter].id === product.id) {
          shopCartData[counter].qty++;
          break;
        }
        counter++
      }

      if (counter === shopCartData.length) {
        shopCartData.push(product);    
      }
    }    
    document.cookie = "shopcart=" + JSON.stringify(shopCartData) + ';path=/';
    generateCartContent(shopCartData);
  });

  // remove shopcart item
  $('.table').on('click','.remove-shopcart', function(e) {
    e.preventDefault();
    const productId = $(this).data('id');
    for (let i = 0; i < shopCartData.length; i++) {
      if (shopCartData[i].id === productId) {
        shopCartData.splice(i, 1);
        break;
      }
    }
    document.cookie = "shopcart=" + JSON.stringify(shopCartData) + ';path=/';
    generateCartContent(shopCartData);
  });
});

// get certain data from cookie
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    return JSON.parse(arr[2]);
  }
  else {
    return [];
  }
}

// Header cart content html generator
function generateCartContent(cartArr) {
  let cartTotal = 0;
  let cartHtml = '<h5 class="text-center my-4">尚未選購商品</h5>';
  if (cartArr.length !== 0) {
    cartHtml = '';
    cartArr.forEach(data => {
      cartTotal += data.qty;
      cartHtml += `
        <tr>
          <td class="align-middle text-center">
            <a href="#" class="text-muted remove-shopcart" data-id="${data.id}">
              <i class="fas fa-trash-alt"></i>
            </a>
          </td>
          <td class="align-middle">${data.name}</td>
          <td class="align-middle">${data.qty}</td>
          <td class="align-middle text-right">$${data.qty * data.price}</td>
        </tr>
        `;
    });
  }
  $('#shopcart-qty').html(cartTotal);
  $('#header-shopcart').html(cartHtml);
}