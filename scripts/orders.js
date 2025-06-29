export const orders = JSON.parse(localStorage.getItem("orders")) || [];

export function addOrder(order) {
  orders.push(order);
  saveToOrders();
}

function saveToOrders() {
  localStorage.setItem("orders", JSON.stringify(orders));
}
