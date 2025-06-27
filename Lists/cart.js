let storedCart = JSON.parse(localStorage.getItem("cart"));

if (!storedCart) {
  storedCart = [
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

export let cart = storedCart;


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

      const sizeSelector = document.getElementById(`size-select-${productId}`);
      const selectedSize = sizeSelector ? sizeSelector.value : null;

      const updateOriginalSize = localStorage.getItem("updateSize");

      let updated = false;

      if (updateOriginalSize !== null) {
        for (let i = 0; i < cart.length; i++) {
          const item = cart[i];
          if (
            item.productId === productId &&
            item.selectedSize === updateOriginalSize
          ) {
            item.quantity = selectedQuantity;
            item.selectedSize = selectedSize;
            updated = true;
            break;
          }
        }
      }

      if (!updated) {
        // Check if same item with same size already exists in cart
        let found = false;
        for (let i = 0; i < cart.length; i++) {
          const item = cart[i];
          if (
            item.productId === productId &&
            item.selectedSize === selectedSize
          ) {
            item.quantity += selectedQuantity;
            found = true;
            break;
          }
        }

        if (!found) {
          cart.push({
            productId: productId,
            productName: productName,
            quantity: selectedQuantity,
            selectedSize: selectedSize,
            deliveryId: "1",
          });
        }
      }

      localStorage.removeItem("updateQuantity");
      localStorage.removeItem("updateSize");
      localStorage.removeItem("scrollToProduct");

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
