import {renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { renderCheckoutHeader } from './checkout/checkoutHeader.js';
import { loadProducts } from '../data/products.js';
import { loadCart } from '../data/cart.js';

Promise.all([
  new Promise((resolve)=>{
    loadProducts(()=>{
      resolve();
    });
  }),
  new Promise((resolve)=>{
    loadCart(()=>{
      resolve();
    })
  })
]).then(()=>{
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
});

/*
const promise = new Promise((resolve)=>{
  loadProducts(()=>{
    resolve();
  });
}).then(()=>{
  return new Promise((resolve)=>{
    loadCart(()=>{
      resolve();
    })
  });
}).then(()=>{
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
});;
*/
