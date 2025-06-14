document.addEventListener("DOMContentLoaded", () => {
  // Получаем текущего пользователя из localStorage
  const user = JSON.parse(localStorage.getItem("currentUser"));

  // Если пользователя нет или его роль не "customer", перенаправляем на страницу входа
  if (!user || user.role !== "customer") {
    window.location.href = "../../login/login.html";
    return;
  }

  // Приветствуем пользователя
  document.getElementById("userGreeting").textContent = `Здравствуйте, ${
    user.fullName || "пользователь"
  }!`;

  // Рендерим список товаров
  renderProducts();

  // Привязываем обработчик для кнопки выхода
  document.getElementById("logoutBtn").addEventListener("click", logout);
});

// Функция для отображения товаров
function renderProducts() {
  const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  // Создаем карточки товаров
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

// Функция для добавления товара в корзину
function addToCart(index) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products[index];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} добавлен в корзину`);
}

// Функция для перехода в корзину
function goToCart() {
  window.location.href = "../catalog/cart/cart.html";
}

// Функция для выхода из аккаунта
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "../../login/login.html";
}
