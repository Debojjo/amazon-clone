import { products, getProducts } from "/Lists/products.js";
import { orders } from "/scripts/orders.js";
import { delivery } from "/Lists/delivery.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

async function initTracking() {
  await getProducts();

  const productId = localStorage.getItem("trackingProductId");
  if (!productId) {
    document.querySelector(".order-tracking").innerHTML = "<p>No product selected for tracking.</p>";
    return;
  }

  let foundProduct = null;
  let foundOrder = null;
  let foundCartItem = null;

  for (const order of orders) {
    if (!order.cart) continue;
    const cartItem = order.cart.find(item => item.productId === productId);
    if (cartItem) {
      foundOrder = order;
      foundCartItem = cartItem;
      break;
    }
  }

  if (!foundCartItem) {
    document.querySelector(".order-tracking").innerHTML = "<p>Order item not found.</p>";
    return;
  }

  foundProduct = products.find(p => p.id === productId);
  if (!foundProduct) {
    document.querySelector(".order-tracking").innerHTML = "<p>Product not found.</p>";
    return;
  }

  const orderCreatedDate = dayjs(foundOrder.createdAt);
  const deliveryOption = delivery.find(d => d.id === foundCartItem.deliveryId);

  if (!deliveryOption) {
    document.querySelector(".order-tracking").innerHTML = "<p>Delivery option not found.</p>";
    return;
  }

  const deliveryDate = orderCreatedDate.add(deliveryOption.deliveryTime, "day");
  const deliveryDateFormatted = deliveryDate.format("dddd, MMMM D");

  document.querySelector(".delivery-date").textContent = `Arriving on ${deliveryDateFormatted}`;
  document.querySelector(".product-info").textContent = foundProduct.name;
  document.querySelector(".product-info + .product-info").textContent = `Quantity: ${foundCartItem.quantity || 1}`;
  document.querySelector(".product-image").src = foundProduct.image;
  document.querySelector(".product-image").alt = foundProduct.name;

  const today = dayjs();

  let progressStatus = "Preparing";
  if (today.isBefore(orderCreatedDate.add(1, "day"))) {
    progressStatus = "Preparing";
  } else if (today.isBefore(deliveryDate)) {
    progressStatus = "Shipped";
  } else if (today.isAfter(deliveryDate) || today.isSame(deliveryDate, "day")) {
    progressStatus = "Delivered";
  }

  document.querySelectorAll(".progress-label").forEach(label => {
    if (label.textContent.trim() === progressStatus) {
      label.classList.add("current-status");
    } else {
      label.classList.remove("current-status");
    }
  });

  const progressBar = document.querySelector(".progress-bar");
  switch(progressStatus) {
    case "Preparing":
      progressBar.style.width = "33%";
      break;
    case "Shipped":
      progressBar.style.width = "66%";
      break;
    case "Delivered":
      progressBar.style.width = "100%";
      break;
    default:
      progressBar.style.width = "0%";
  }
}

document.addEventListener("DOMContentLoaded", initTracking);

