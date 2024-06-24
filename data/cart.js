export let cart;

loadFromStorage();

export function loadFromStorage(){
  cart = JSON.parse(localStorage.getItem('cart')) ||
[
  {
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
    deliveryOptionId: '1'
  },
  {
    productId:'15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1,
    deliveryOptionId: '3'
  }
];
}


export function addToCart(productId){
  let matchingItem;
  cart.forEach(cartItem =>{
    if(productId === cartItem.productId){
      matchingItem = cartItem;
    }
  });

  if(matchingItem) 
    matchingItem.quantity++;
  else
   cart.push({productId, quantity: 1, deliveryOptionId: '1'});

   saveToStorage();
}

export function removeFromCart(productId){
  const newCart = [];

  cart.forEach((cartItem)=>{
    if(cartItem.productId !== productId){
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveToStorage();
}

export function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function updateCartItemQuantity(productId, quantity){
  const product = cart.find((element) => element.productId === productId);
  if(quantity > 0 && quantity <= 1000){
    product.quantity = Number(quantity);
    return true;
  }
  else
    return false;
}

export function getCartQuantity(){
  let cartQuantity = 0;
  cart.forEach((cartItem)=>{
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

export function updateDeliveryOption(productId, deliveryOptionId){
  let product = cart.find((cartItem)=>cartItem.productId===productId);
  product.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

export function loadCart(func){
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', ()=>{
    func();
  });
  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}