import { orders } from "/scripts/orders.js";
import { products, getProducts } from "/Lists/products.js";
import { delivery } from "/Lists/delivery.js";

function formatDate(dateString) {
  if (!dateString) return "";
  const options = { month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
}

async function renderOrders() {
  await getProducts();

  const ordersGrid = document.querySelector(".orders-grid");
  ordersGrid.innerHTML = "";

  if (orders.length === 0) {
    ordersGrid.innerHTML = "<p>No orders found.</p>";
    return;
  }

  orders.forEach((order) => {
    const orderDate = formatDate(order.createdAt || new Date());
    const orderId = order.id || "N/A";

    let totalProductPrice = 0;
    let totalDeliveryPrice = 0;
    let productsHTML = "";

    (order.cart || []).forEach((cartItem) => {
      const product = products.find((p) => p.id === cartItem.productId);
      if (!product) return;

      const quantity = cartItem.quantity || 1;
      const priceNumber = Number(product.priceINR.replace(/[₹,]/g, "")) || 0;
      totalProductPrice += priceNumber * quantity;

      const deliveryOption = delivery.find((d) => d.id === cartItem.deliveryId);
      if (deliveryOption) {
        totalDeliveryPrice += deliveryOption.price;
      }

      const deliveryDate = "August 15";

      productsHTML += `
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}">
        </div>

        <div class="product-details">
          <div class="product-name">${product.name}</div>
          <div class="product-delivery-date">Arriving on: ${deliveryDate}</div>
          <div class="product-quantity">Quantity: ${quantity}</div>
          <button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="images/icons/buy-again.png" alt="Buy Again">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html">
            <button class="track-package-button button-secondary">Track package</button>
          </a>
        </div>
      `;
    });

    const beforeGST = totalProductPrice + totalDeliveryPrice;
    const gstAmount = Number((beforeGST * 0.18).toFixed(2));
    const orderTotal = Math.ceil(beforeGST + gstAmount);

    const orderHTML = `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>₹${orderTotal.toFixed(2)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${orderId}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${productsHTML}
        </div>
      </div>
    `;

    ordersGrid.insertAdjacentHTML("beforeend", orderHTML);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderOrders();
});
