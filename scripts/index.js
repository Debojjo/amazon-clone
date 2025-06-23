import { cart,cartUpdation } from "../Lists/cart.js";
import { products } from "../Lists/products.js";

let productsInHTML = "";

products.forEach((product) => {
  productsInHTML += `
    <div class="product-container product-container-${product.id}">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.priceINR}
           </div>

          <div class="product-quantity-container">
            <select class="quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary"
           data-product-id="${product.id}"
           data-product-name="${product.name}">
            Add to Cart
          </button>
        </div>
    `;
});

document.querySelector(".products-grid").innerHTML = productsInHTML;

const scrollToProductId = localStorage.getItem('scrollToProduct');

if(scrollToProductId) {
  const productElement = document.querySelector(`.product-container-${scrollToProductId}`);
  if(productElement) {
    productElement.scrollIntoView({ behavior: 'smooth' });
  }
  localStorage.removeItem('scrollToProduct');
}


cartUpdation();
