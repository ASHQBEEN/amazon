import {renderOrderSummary} from '../../script/checkout/orderSummary.js';
import {cart, loadFromStorage} from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../../script/utils/money.js';
import { loadProducts } from '../../data/products.js';

describe('test suite: renderOrderSummary', ()=>{

  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  beforeEach((done)=>{
    document.querySelector('.js-test-container').innerHTML = `
    <div class="js-order-summary"></div>
    <div class="js-payment-summary"></div>
    <div class="js-checkout-items-count"></div>
  `;
    spyOn(Storage.prototype, 'getItem').and.callFake(() => {
      return JSON.stringify([
        {
          productId: `${productId1}`,
          quantity: 2,
          deliveryOptionId: '1'
        },
        {
          productId:`${productId2}`,
          quantity: 1,
          deliveryOptionId: '3'
        }
      ]);
    });
    loadFromStorage();
    loadProducts(()=>{
      renderOrderSummary();
      done();
    });

    
  });

  it('displays the cart', ()=>{
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);
    expect(document.querySelector(`.js-product-quantity-${productId1}`).innerText).toContain('Quantity: 2');
    expect(document.querySelector(`.js-product-quantity-${productId2}`).innerText).toContain('Quantity: 1');
    expect(document.querySelector(`.js-product-name-${productId1}`).innerText).toEqual(getProduct(productId1).name);
    expect(document.querySelector(`.js-product-name-${productId2}`).innerText).toEqual(getProduct(productId2).name);
  });

  it('removes a product', ()=>{
    spyOn(Storage.prototype, 'setItem').and.callFake(()=>{});

    document.querySelector(`.js-delete-link-${productId1}`).click();
    
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(1);
    expect(document.querySelector(`.js-cart-item-container-${productId1}`)).toEqual(null);
    expect(document.querySelector(`.js-cart-item-container-${productId2}`)).not.toEqual(null);
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId2);
    expect(document.querySelector(`.js-product-name-${productId2}`).innerText).toEqual(getProduct(productId2).name);
  });

  it('displays product prices correctly', ()=>{
    let prices = document.querySelectorAll('.js-product-price');
    prices.forEach((price, index)=>{
      expect(price.innerText).toContain(formatCurrency(getProduct(cart[index].productId).priceCents));
      expect(price.innerText).toContain('$');
    });
  });

  afterEach(()=>{
    /*
    document.querySelector('.js-test-container').innerHTML = `
    <div class="js-order-summary"></div>
  `;
  */
  });
});