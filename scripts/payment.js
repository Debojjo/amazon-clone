import { cart, saveToCart, showQuantity } from "/Lists/cart.js";
import { products } from "/Lists/products.js";
import { delivery } from "/Lists/delivery.js";
import { addOrder } from "/scripts/orders.js";

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
            <div class="payment-summary-money">₹${totalProductPrice.toFixed(
              2
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Delivery charges:</div>
            <div class="payment-summary-money">₹${totalDeliveryPrice.toFixed(
              2
            )}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">₹${beforeGST.toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>GST (18%):</div>
            <div class="payment-summary-money">₹${gstAmount.toFixed(2)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">₹${totalPrice.toFixed(2)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
  `;

  document.querySelector(".payment-summary").innerHTML = paymentHTML;

  const btn = document.querySelector(".place-order-button");

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.innerText = "Placing Order...";

    try {
      const response = await fetch(
        "https://68613ac28e74864084454ecf.mockapi.io/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart: cart,
            createdAt: new Date().toISOString(),
            totalAmount: totalPrice,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to place order");

      const order = await response.json();
      addOrder(order);

      cart.length = 0;
      saveToCart();

      showQuantity();

      window.location.href = "orders.html";
    } catch (error) {
      alert("Error placing order, please try again.");
      btn.disabled = false;
      btn.innerText = "Place your order";
      console.error(error);
    }
  });
}
