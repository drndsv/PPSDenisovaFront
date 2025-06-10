function renderProducts() {
  const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  storedProducts.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>Производитель: ${product.brand}</p>
      <p>Цена: ${product.price} ₽</p>
      <button onclick="addToCart(${index})">В корзину</button>
    `;
    productList.appendChild(card);
  });
}

function addToCart(index) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products[index];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} добавлен в корзину`);
}

function goToCart() {
  window.location.href = "../catalog/cart/cart.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const greetingEl = document.getElementById("userGreeting");
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user || user.role !== "customer") {
    window.location.href = "../../login/login.html";
    return;
  }

  greetingEl.textContent = `Здравствуйте, ${user.fullName || "пользователь"}!`;

  renderProducts();
});

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "../../login/login.html";
}
