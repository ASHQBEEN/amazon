import { cart, getCartQuantity, updateCartItemQuantity } from "../data/cart.js";
import { products as ProductList } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { removeFromCart } from "../data/cart.js";

let html='';
cart.forEach(cartItem => {
  const productId = cartItem.productId;
  const product = ProductList.find((element) => element.id === productId);
  html+=`
  <div class="cart-item-container js-cart-item-container-${product.id}">
  <div class="delivery-date">
    Delivery date: Tuesday, June 21
  </div>
  
  <div class="cart-item-details-grid">
    <img class="product-image"
      src=${product.image}>
  
    <div class="cart-item-details">
      <div class="product-name">
        ${product.name}
      </div>
      <div class="product-price">
        $${formatCurrency(product.priceCents)}
      </div>
      <div class="product-quantity">
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
      <div class="delivery-option">
        <input type="radio" checked
          class="delivery-option-input"
          name="delivery-option-${product.id}">
        <div>
          <div class="delivery-option-date">
            Tuesday, June 21
          </div>
          <div class="delivery-option-price">
            FREE Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio"
          class="delivery-option-input"
          name="delivery-option-${product.id}">
        <div>
          <div class="delivery-option-date">
            Wednesday, June 15
          </div>
          <div class="delivery-option-price">
            $4.99 - Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio"
          class="delivery-option-input"
          name="delivery-option-${product.id}">
        <div>
          <div class="delivery-option-date">
            Monday, June 13
          </div>
          <div class="delivery-option-price">
            $9.99 - Shipping
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  `;
});

document.querySelector('.order-summary').innerHTML = html;

document.querySelectorAll('.js-delete-link').
  forEach((deleteLink)=>{
  deleteLink.addEventListener('click', ()=>{
    const productId = deleteLink.dataset.productId;
    removeFromCart(productId);
    document.querySelector(`.js-cart-item-container-${productId}`).
    remove();
    updateCheckoutQuantity();

  });
});

document.querySelectorAll('.js-update-link').
  forEach((updateLink)=>{
  updateLink.addEventListener('click', ()=>{
    const productId = updateLink.dataset.productId;
    document.querySelector(`.js-quantity-input-${productId}`).classList.add('is-editing-quantity');
    document.querySelector(`.js-update-quantity-link-${productId}`).classList.add('update-quantity-link-is-editing');
    document.querySelector(`.js-save-quantity-link-${productId}`).classList.add('save-quantity-link-is-editing');
    document.querySelector(`.js-quantity-label-${productId}`).innerHTML = '';
    console.log(productId);
  });
});

document.querySelectorAll('.js-save-quantity-link').
  forEach((saveLink)=>{
  saveLink.addEventListener('click', ()=>{
    const productId = saveLink.dataset.productId;
    document.querySelector(`.js-quantity-input-${productId}`).classList.remove('is-editing-quantity');
    document.querySelector(`.js-update-quantity-link-${productId}`).classList.remove('update-quantity-link-is-editing');
    document.querySelector(`.js-save-quantity-link-${productId}`).classList.remove('save-quantity-link-is-editing');
    
    const newQuantity = document.querySelector(`.js-quantity-input-${productId}`).value;
    updateCartItemQuantity(productId, newQuantity);
    document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;
    updateCheckoutQuantity();
  });
});

updateCheckoutQuantity();

function updateCheckoutQuantity(){
  document.querySelector('.js-checkout-items-count').innerHTML = getCartQuantity() + ' items';
}