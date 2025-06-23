import {
  cart,
  deletionFromCart,
  updateDeliveryOption,
  saveToCart,
} from "../Lists/cart.js";
import { products } from "../Lists/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { delivery } from "../Lists/delivery.js";
import { renderPayment } from "./payment.js";

function renderOrder() {
  let cartHTML = "";

  function checkoutDisplay() {
    let checkoutQuantity = 0;
    cart.forEach((item) => {
      checkoutQuantity += item.quantity;
    });

    const checkoutQuantityElement =
      document.querySelector(".checkout-quantity");
    if (!checkoutQuantityElement) return;

    checkoutQuantityElement.innerHTML =
      checkoutQuantity > 1
        ? `Checkout(${checkoutQuantity} items)`
        : `Checkout(${checkoutQuantity} item)`;
  }
  checkoutDisplay();

  cart.forEach((item) => {
    const productId = item.productId;

    let matchedItem;
    products.forEach((product) => {
      if (product.id === productId) {
        matchedItem = product;
      }
    });

    const deliveryId = item.deliveryId;
    let selectedDelivery;
    delivery.forEach((option) => {
      if (option.id === deliveryId) {
        selectedDelivery = option;
      }
    });

    const deliveryDate = dayjs().add(selectedDelivery.deliveryTime, "days");
    const deliveryInfo = deliveryDate.format("dddd, MMMM D");

    cartHTML += `
    <div class="cart-item-container cart-item-container-${matchedItem.id}">
      <div class="delivery-date">
        Delivery date: ${deliveryInfo}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchedItem.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${item.productName}
          </div>
          <div class="product-price">
            ${matchedItem.priceINR}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${item.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary" data-product-id="${
              matchedItem.id
            }">
              Update
            </span>
            <span class="delete-quantity-link link-primary" data-product-id="${
              matchedItem.id
            }">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option:</div>
          ${deliveryBlock(matchedItem, item)}
        </div>
      </div>
    </div>
  `;
  });

  function deliveryBlock(matchedItem, item) {
    let deliveryHTML = "";

    delivery.forEach((deliveryItem) => {
      const todayDate = dayjs();
      const deliveryDate = todayDate.add(deliveryItem.deliveryTime, "days");
      const deliveryInfo = deliveryDate.format("dddd, MMMM D");
      const price =
        deliveryItem.price === 0 ? "FREE" : `₹${deliveryItem.price}`;

      const isChecked = deliveryItem.id === item.deliveryId;

      deliveryHTML += `
      <div class="delivery-option"
           data-product-id="${matchedItem.id}"
           data-delivery-option-id="${deliveryItem.id}">
        <input type="radio"
               ${isChecked ? "checked" : ""}
               class="delivery-option-input"
               name="delivery-option-${matchedItem.id}">
        <div>
          <div class="delivery-option-date">${deliveryInfo}</div>
          <div class="delivery-option-price">${price}</div>
        </div>
      </div>
    `;
    });

    return deliveryHTML;
  }

  document.querySelector(".order-summary").innerHTML = cartHTML;

  document.querySelectorAll(".delete-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      deletionFromCart(productId);
      renderPayment();

      const delContainer = document.querySelector(
        `.cart-item-container-${productId}`
      );
      delContainer.remove();
      checkoutDisplay();
      renderOrder();
    });
  });

  document.querySelectorAll(".update-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      localStorage.setItem("scrollToProduct", productId);
      window.location.href = "index.html";
    });
  });

  document.querySelectorAll(".delivery-option").forEach((el) => {
    el.addEventListener("click", () => {
      const productId = el.dataset.productId;
      const deliveryOptionId = el.dataset.deliveryOptionId;

      updateDeliveryOption(productId, deliveryOptionId);

      renderOrder();
      renderPayment();
    });
  });
}
renderOrder();
renderPayment();
