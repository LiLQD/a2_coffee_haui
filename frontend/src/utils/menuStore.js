const KEY = "menuItems";

export function getItems() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

export function setItems(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addMany(newItems) {
  const existing = getItems();
  setItems([...existing, ...newItems]);
}

export function updateItem(id, patch) {
  const items = getItems().map(it => it.id === id ? { ...it, ...patch } : it);
  setItems(items);
  return items;
}

export function removeItem(id) {
  const items = getItems().filter(it => it.id !== id);
  setItems(items);
  return items;
}

export function clearItems() {
  localStorage.removeItem(KEY);
}