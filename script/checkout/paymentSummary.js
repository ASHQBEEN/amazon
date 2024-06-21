import { cart, getCartQuantity } from "../../data/cart.js";
import { getProduct } from "../../data/products.js"
import { getDiliveryOption } from "../../data/deliveryOptions.js"
import { taxPercentage } from "../../data/tax.js";
import { formatCurrency } from "../utils/money.js";

export function renderPaymentSummary(){
  calculateCosts();
  const html = `
    <div class="payment-summary-title">
      Order Summary
    </div>
    
    <div class="payment-summary-row">
      <div>Items (${getCartQuantity()}):</div>
      <div class="payment-summary-money">$${formatCurrency(itemsCostCents)}</div>
    </div>
    
    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(shippingCostCents)}</div>
    </div>
    
    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>
    
    <div class="payment-summary-row">
      <div>Estimated tax (${taxPercentage}%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>
    
    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>
    
    <button class="place-order-button button-primary">
      Place your order
    </button>
    `;
    document.querySelector('.js-payment-summary').innerHTML = html;
}

let itemsCostCents = 0;
let shippingCostCents = 0;
let totalBeforeTaxCents = 0;
let taxCents = 0;
let totalCents = 0;


function calculateCosts(){

  itemsCostCents = 0;
  shippingCostCents = 0;
  totalBeforeTaxCents = 0;
  taxCents = 0;
  totalCents = 0;

  cart.forEach(cartItem => {
    const product = getProduct(cartItem.productId);
    const matchingDeliveryOption = getDiliveryOption(cartItem.deliveryOptionId);
    itemsCostCents += product.priceCents * cartItem.quantity;
    shippingCostCents += matchingDeliveryOption.priceCents;
  });
  totalBeforeTaxCents = itemsCostCents + shippingCostCents;
  taxCents = totalBeforeTaxCents * taxPercentage/100;
  totalCents = taxCents + totalBeforeTaxCents; 
}
