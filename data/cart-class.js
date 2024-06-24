export class Cart{
  items;
  #localStorageKey;

  constructor(localStorageKey){
    this.localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage(){
    this.items = JSON.parse(localStorage.getItem(this.#localStorageKey)) ||
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
  };
  addToCart(productId){
    let matchingItem;
    this.items.forEach(cartItem =>{
      if(productId === cartItem.productId){
        matchingItem = cartItem;
      }
    });
  
    if(matchingItem) 
      matchingItem.quantity++;
    else
      this.items.push({productId, quantity: 1, deliveryOptionId: '1'});
  
      this.saveToStorage();
  };
  #saveToStorage(){
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.items));
  };
  updateCartItemQuantity(productId, quantity){
    const product = this.items.find((element) => element.productId === productId);
    if(quantity > 0 && quantity <= 1000){
      product.quantity = Number(quantity);
      return true;
    }
    else
      return false;
  };
  removeFromCart(productId){
    const newCart = [];
    this.items.forEach((cartItem)=>{
      if(cartItem.productId !== productId){
        newCart.push(cartItem);
      }
    });
    this.items = newCart;
    this.saveToStorage();
  };
  getCartQuantity(){
    let cartQuantity = 0;
    this.items.forEach((cartItem)=>{
      cartQuantity += cartItem.quantity;
    });
    return cartQuantity;
  };
  updateDeliveryOption(productId, deliveryOptionId){
    let product = this.items.find((cartItem)=>cartItem.productId===productId);
    product.deliveryOptionId = deliveryOptionId;
    this.#saveToStorage();
  };
}


const cart = new Cart('cart-oop');
console.log(cart);
console.log(cart instanceof Cart);