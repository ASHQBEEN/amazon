import {addToCart, getCartQuantity} from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { loadProducts } from '../data/products.js';

let productHtml = '';

loadProducts(renderProductsGrid);

function renderProductsGrid(){
products.forEach(product=>{
  productHtml += `
  <div class="product-container">
  <div class="product-image-container">
    <img class="product-image"
      src="${product.image}">
  </div>

  <div class="product-name limit-text-to-2-lines">
    ${product.name}
  </div>

  <div class="product-rating-container">
    <img class="product-rating-stars"
      src="${product.getStarsUrl()}">
    <div class="product-rating-count link-primary">
      ${product.rating.count}
    </div>
  </div>

  <div class="product-price">
    ${product.getPrice()}
  </div>

  <div class="product-quantity-container">
    <select>
      <option selected value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
  </div>

  <div>
    ${product.extraInfoHtml()}
  </div>

  <div class="product-spacer"></div>

  <div class="added-to-cart">
    <img src="images/icons/checkmark.png">
    Added
  </div>

  <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
    Add to Cart
  </button>
</div>
  </div>
  `;
});


document.querySelector('.js-products-grid').innerHTML = productHtml;

updateCartQuantity();

document.querySelectorAll('.js-add-to-cart')
  .forEach(buttonElement => {
    buttonElement.addEventListener('click', () => {
      const productId = buttonElement.dataset.productId;
      addToCart(productId);
      updateCartQuantity();
    });
  }
);
}

function updateCartQuantity(){
  document.querySelector('.js-cart-quantity').innerHTML = getCartQuantity();
}