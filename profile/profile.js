document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user || user.role !== "customer") {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("userName").textContent = user.fullName;
  document.getElementById("userEmail").textContent = user.email;
  document.getElementById("userPhone").textContent = user.phone;

  loadOrderHistory(user.email);
});

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "../../login/login.html";
}

function goBack() {
  window.location.href = "../catalog/catalog.html";
}

function loadOrderHistory(userEmail) {
  const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
  const userOrders = allOrders.filter((order) => order.email === userEmail);

  const container = document.getElementById("orderHistory");

  if (userOrders.length === 0) {
    container.innerHTML = "<p>У вас пока нет заказов.</p>";
    return;
  }

  userOrders.forEach((order, index) => {
    const total = order.items.reduce((sum, item) => sum + item.price, 0);

    const div = document.createElement("div");
    div.className = "order-item";
    div.innerHTML = `
        <p><strong>Дата:</strong> ${order.date}</p>
        <p><strong>Получатель:</strong> ${order.receiver}</p>
        <p><strong>Адрес:</strong> ${order.address}</p>
        <p><strong>Товары:</strong> ${order.items
          .map((item) => item.name)
          .join(", ")}</p>
        <p><strong>Стоимость:</strong> ${total} ₽</p>
        <button class="edit-btn" data-index="${index}">Изменить заказ</button>
      `;
    container.appendChild(div);
  });

  // Заглушка для будущей логики "Изменить заказ"
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const orderIndex = e.target.dataset.index;
      alert(
        "Функция редактирования заказа будет доступна позже.\nНомер заказа: " +
          orderIndex
      );
      // Здесь позже можно будет реализовать переход на страницу редактирования
    });
  });
}
