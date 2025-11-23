const KEY = "cartItems";

export function getCart() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

export function setCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(item, qty = 1) {
  const cart = getCart();
  const existed = cart.find((c) => c.id === item.id);

  if (existed) {
    existed.qty += qty;
  } else {
    cart.push({ ...item, qty });
  }

  setCart(cart);
}


export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

export function clearCart() {
  localStorage.removeItem(KEY);
}
