import { cart, addToCart, loadFromStorage, removeFromCart} from '../../data/cart.js';

describe('test suite: add to cart', ()=>{

  beforeEach(()=>{
    spyOn(Storage.prototype, 'setItem');
  });

  it('changes existing cart item quantity', ()=>{
    const cartString = JSON.stringify([{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 1,
      deliveryOptionId: '1'
    }]);
    spyOn(Storage.prototype, 'getItem').and.callFake(() => {
      return cartString;
    });
    loadFromStorage();
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('cart', JSON.stringify(cart));
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
  });

  it('adds a new cart item', ()=>{
    spyOn(Storage.prototype, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });
    loadFromStorage();
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('cart', JSON.stringify(cart));
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
  });
});

describe('test suite: remove from cart', ()=>{
  it('removes item from cart', ()=>{
    const productId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
    const cartString = JSON.stringify([{
      productId,
      quantity: 1,
      deliveryOptionId: '1'
    }]);
    spyOn(Storage.prototype, 'getItem').and.callFake(() => {
      return cartString;
    });
    spyOn(Storage.prototype, 'setItem').and.callFake(() => {
    });;
    loadFromStorage();
    removeFromCart(productId);
    expect(cart.length).toEqual(0);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });
  it('works with empty cart (does nothing)', ()=>{
    const productId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
    const cartString = JSON.stringify([]);
    spyOn(Storage.prototype, 'getItem').and.callFake(() => {
      return cartString;
    });
    spyOn(Storage.prototype, 'setItem').and.callFake(() => {
    });;
    loadFromStorage();
    removeFromCart(productId);
    expect(cart.length).toEqual(0);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    
  });
});