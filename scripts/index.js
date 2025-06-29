import { cart, cartUpdation } from "/Lists/cart.js";
import { products, getProducts } from "/Lists/products.js";

function renderProducts(productList) {
  let productsInHTML = "";

  if (productList.length === 0) {
    document.querySelector(".products-grid").innerHTML =
      "<p>No products found.</p>";
    return;
  }

  productList.forEach((product) => {
    productsInHTML += `
      <div class="product-container product-container-${product.id}">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}">
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

        ${
          product.sizes
            ? `
          <div class="product-quantity-container">
          Size: 
            <select id="size-select-${product.id}" class="size-select">
              ${
                product.sizes.includes("S")
                  ? `
                <option selected value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              `
                  : `
                <option selected value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              `
              }
            </select>
          </div>
        `
            : ""
        }

        <div class="product-quantity-container">
        Quantity: 
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
          <img src="images/icons/checkmark.png"> Added
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

  cartUpdation();
}

async function initApp() {
  await getProducts();
  renderProducts(products);

  const scrollToProduct = localStorage.getItem("scrollToProduct");
  const updateQuantity = localStorage.getItem("updateQuantity");
  const updateSize = localStorage.getItem("updateSize");

  if (scrollToProduct) {
    const productContainer = document.querySelector(
      `.product-container-${scrollToProduct}`
    );

    if (productContainer) {
      productContainer.scrollIntoView({ behavior: "smooth", block: "center" });

      const quantitySelector = productContainer.querySelector(
        `.quantity-selector-${scrollToProduct}`
      );
      if (quantitySelector && updateQuantity) {
        quantitySelector.value = updateQuantity;
      }

      const sizeSelector = document.getElementById(
        `size-select-${scrollToProduct}`
      );
      if (sizeSelector && updateSize) {
        sizeSelector.value = updateSize;
      }
    }

    localStorage.removeItem("scrollToProduct");
    localStorage.removeItem("updateQuantity");
    localStorage.removeItem("updateSize");
  }

  document.querySelector(".search-bar").addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();

    const filteredProducts = products.filter((product) => {
      return product.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm)
      );
    });

    renderProducts(filteredProducts);
  });

  function searchAndRender() {
    const searchInput = document
      .querySelector(".search-bar")
      .value.toLowerCase();

    const filteredProducts = products.filter((product) =>
      product.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchInput)
      )
    );

    renderProducts(filteredProducts);
  }

  document.querySelector(".search-button").addEventListener("click", () => {
    searchAndRender();
  });

  document.querySelector(".search-bar").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchAndRender();
    }
  });
}

initApp();
