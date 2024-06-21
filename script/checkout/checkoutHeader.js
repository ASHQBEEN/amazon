import { getCartQuantity } from "../../data/cart.js";

export function renderCheckoutHeader(){
  document.querySelector('.js-checkout-items-count').innerHTML = getCartQuantity() + ' items';
}