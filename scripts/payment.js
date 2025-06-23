import { cart } from "../Lists/cart.js";
import { products } from "../Lists/products.js";
import { delivery } from "../Lists/delivery.js";

export function renderPayment() {
  let totalProductPrice = 0;
  let totalDeliveryPrice = 0;

  cart.forEach((item) => {
    let matchedItem;
    products.forEach((product) => {
      if (product.id === item.productId) {
        matchedItem = product;
      }
    });

    if (matchedItem && matchedItem.priceINR) {
      const priceString = matchedItem.priceINR.replace(/[₹,]/g, "");
      const priceNumber = Number(priceString);

      if (!isNaN(priceNumber)) {
        totalProductPrice += priceNumber * item.quantity;
      }
    }

    let selectedDelivery;

    delivery.forEach((option) => {
      if (option.id === item.deliveryId) {
        selectedDelivery = option;
      }
    });

    if (selectedDelivery) {
      totalDeliveryPrice += selectedDelivery.price;
    }
  });
  const beforeGST = totalProductPrice + totalDeliveryPrice;
  const gstAmount = Number((beforeGST * 0.18).toFixed(2));
  const totalPrice = Math.ceil(beforeGST + gstAmount);

  const paymentHTML = `
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items:</div>
            <div class="payment-summary-money">₹${totalProductPrice}</div>
          </div>

          <div class="payment-summary-row">
            <div>Delivery charges:</div>
            <div class="payment-summary-money">₹${totalDeliveryPrice}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">₹${beforeGST}</div>
          </div>

          <div class="payment-summary-row">
            <div>GST (18%):</div>
            <div class="payment-summary-money">₹${gstAmount}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">₹${totalPrice}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
  `;

  document.querySelector(".payment-summary").innerHTML = paymentHTML;
}
