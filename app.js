const products = document.querySelectorAll(".product-card");

products.forEach((product) => {
  product.addEventListener("click", () => {
    alert("Product details coming soon.");
  });
});

const exploreButton = document.querySelector(".welcome button");

if (exploreButton) {
  exploreButton.addEventListener("click", () => {
    document.querySelector(".products").scrollIntoView({
      behavior: "smooth"
    });
  });
}
