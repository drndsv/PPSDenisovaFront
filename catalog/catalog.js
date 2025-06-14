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

  // Привязываем обработчик для перехода в корзину
  document.getElementById("goToCartBtn").addEventListener("click", goToCart);
});

// Функция для отображения товаров
function renderProducts() {
  fetch("http://localhost:8080/part/getAll") // Получаем товары с сервера
    .then((response) => response.json())
    .then((data) => {
      const productList = document.getElementById("productList");
      productList.innerHTML = ""; // Очищаем контейнер перед рендером

      // Создаем карточки товаров
      data.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <h3>${product.name}</h3>
          <p>Цена: ${product.price} ₽</p>
          <button onclick="addToCart(${product.id})">В корзину</button>
        `;
        productList.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Ошибка при загрузке запчастей:", error);
      alert("Не удалось загрузить товары");
    });
}

// Функция для добавления товара в корзину
function addToCart(productId) {
  fetch(`http://localhost:8080/part/getAll`)
    .then((response) => response.json())
    .then((data) => {
      const product = data.find((p) => p.id === productId);
      if (!product) return;

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.name} добавлен в корзину`);
    });
}

// Функция для перехода в корзину
function goToCart() {
  window.location.href = "../cart/cart.html";
}

// Функция для выхода из аккаунта
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "../../login/login.html";
}
