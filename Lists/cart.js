export let cart = JSON.parse(localStorage.getItem("cart"));

if (!cart) {
  cart = [
    {
      productId: "xyz",
      productName: "product name",
      quantity: 0,
      deliveryId: "3",
    },
    {
      productId: "xyz",
      productName: "product name",
      quantity: 0,
      deliveryId: "3",
    },
  ];
}

export function saveToCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function showQuantity() {
  let totalQuantity = 0;
  cart.forEach((item) => {
    totalQuantity += item.quantity;
  });

  const cartQuantityElement = document.querySelector(".cart-quantity");
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = totalQuantity;
  }
}
showQuantity();

export function cartUpdation() {
  document.querySelectorAll(".add-to-cart-button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const productName = button.dataset.productName;

      const quantitySelector = document.querySelector(
        `.quantity-selector-${productId}`
      );
      const selectedQuantity = Number(quantitySelector.value);

      let matchedItem;
      cart.forEach((item) => {
        if (productName === item.productName) matchedItem = item;
      });

      if (matchedItem) {
        matchedItem.quantity += 1;
      } else {
        cart.push({
          productId: productId,
          productName: productName,
          quantity: selectedQuantity,
          deliveryId: "1",
        });
      }

      saveToCart();
      showQuantity();
    });
  });
}

export function deletionFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  saveToCart();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  const matchedItem = cart.find((item) => item.productId === productId);
  if (matchedItem) {
    matchedItem.deliveryId = deliveryOptionId;
    saveToCart();
  }
}
