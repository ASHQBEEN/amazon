import { cart, updateCartItemQuantity, removeFromCart, saveToStorage, updateDeliveryOption } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDiliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

let oldQuantityValue;

function calculateDeliveryDate(deliveryOption){
  let result = dayjs().add(deliveryOption.deliveryDays, 'days');;
  //console.log(result.format('dddd'));
  /*
  while(result.format('dddd')==='Sunday'||result.format('dddd')==='Saturday'){
    result.add(1, 'days');
  }
  */
  return result.format('dddd, MMMM D');
}

function isWeekend(date){
  return date.format('dddd') === 'Sunday' || date.format('dddd') === 'Saturday';
}

export function renderOrderSummary(){
  let html='';
  cart.forEach(cartItem => {
    const productId = cartItem.productId;
    const product = getProduct(productId);
    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption = getDiliveryOption(cartItem.deliveryOptionId);

    html+=`
    <div class="cart-item-container js-cart-item-container js-cart-item-container-${product.id}">
    <div class="delivery-date">
      Delivery date: ${calculateDeliveryDate(deliveryOption)}
    </div>
    
    <div class="cart-item-details-grid">
      <img class="product-image"
        src=${product.image}>
    
      <div class="cart-item-details">
        <div class="product-name js-product-name-${product.id}">
          ${product.name}
        </div>
        <div class="product-price js-product-price">
          $${formatCurrency(product.priceCents)}
        </div>
        <div class="product-quantity js-product-quantity-${product.id}">
          <span>
            Quantity: <span class="quantity-label js-quantity-label-${productId}">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary js-update-link js-update-quantity-link-${product.id}"
          data-product-id="${product.id}">
            Update
          </span>
          <input class="quantity-input js-quantity-input-${product.id}" placeholder="">
          <span class="save-quantity-link link-primary js-save-quantity-link js-save-quantity-link-${product.id}" data-product-id="${product.id}">
            Save
          </span>
          <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${product.id}" data-product-id="${product.id}">
            Delete
          </span>
        </div>
      </div>
    
      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${deliveryOptionsHTML(product, deliveryOptionId)}
      </div>
    </div>
    </div>
    `;
  });

  document.querySelector('.js-order-summary').innerHTML = html;

  //map delete links
  document.querySelectorAll('.js-delete-link').
    forEach((deleteLink)=>{
    deleteLink.addEventListener('click', ()=>{
      const productId = deleteLink.dataset.productId;
      removeFromCart(productId);
      renderOrderSummary();
      renderPaymentSummary();
      renderCheckoutHeader();
    });
  });

  //map update links
  document.querySelectorAll('.js-update-link').
    forEach((updateLink)=>{
    updateLink.addEventListener('click', ()=>{
      const productId = updateLink.dataset.productId;
      document.querySelector(`.js-quantity-input-${productId}`).classList.add('is-editing-quantity');
      document.querySelector(`.js-update-quantity-link-${productId}`).classList.add('update-quantity-link-is-editing');
      document.querySelector(`.js-save-quantity-link-${productId}`).classList.add('save-quantity-link-is-editing');

      document.querySelector(`.js-quantity-input-${productId}`).addEventListener('keydown', (e)=>{
        if(e.key === 'Enter'){
          saveProductQuantity(productId);
        }
      });

      const productQuantityElement = document.querySelector(`.js-quantity-label-${productId}`);
      document.querySelector(`.js-quantity-input-${productId}`).value = productQuantityElement.innerHTML;
      //старое значение количества продуктов
      oldQuantityValue = productQuantityElement.innerHTML;
      productQuantityElement.innerHTML = '';

      document.querySelector(`.js-quantity-input-${productId}`).focus();
    });
  });

  //map save liks
  document.querySelectorAll('.js-save-quantity-link').
    forEach((saveLink)=>{
    saveLink.addEventListener('click', ()=>{
      const productId = saveLink.dataset.productId;
      saveProductQuantity(productId);
    });
  });

  //markup delivery options
  function deliveryOptionsHTML(product, deliveryOptionId){
    let html = '';
    deliveryOptions.forEach((deliveryOption)=>{
      let isChecked = deliveryOption.id === deliveryOptionId;
      html+=`
          <div class="delivery-option js-delivery-option" 
          data-product-id="${product.id}"
          data-delivery-option-id="${deliveryOption.id}">
            <input type="radio"
            ${isChecked ? 'checked' : ''}
              class="delivery-option-input"
              name="delivery-option-${product.id}">
            <div>
              <div class="delivery-option-date">
                ${calculateDeliveryDate(deliveryOption)}
              </div>
              <div class="delivery-option-price">
                ${
                  deliveryOption.priceCents === 0 ? 'FREE': `$${formatCurrency(deliveryOption.priceCents)}`
                } - Shipping
              </div>
            </div>
          </div>`
    });
    return html;
  }

  document.querySelectorAll('.js-delivery-option').forEach((option)=>{
    option.addEventListener('click', ()=>{
      let {productId, deliveryOptionId} = option.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}

function saveProductQuantity(productId){
  const newQuantity = document.querySelector(`.js-quantity-input-${productId}`).value;
  document.querySelector(`.js-quantity-input-${productId}`).classList.remove('is-editing-quantity');
  document.querySelector(`.js-update-quantity-link-${productId}`).classList.remove('update-quantity-link-is-editing');
  document.querySelector(`.js-save-quantity-link-${productId}`).classList.remove('save-quantity-link-is-editing');
  if(updateCartItemQuantity(productId, newQuantity)){

    document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;
    saveToStorage();
    renderCheckoutHeader();
    renderPaymentSummary();
  }
  else
    document.querySelector(`.js-quantity-label-${productId}`).innerHTML = oldQuantityValue;
}

