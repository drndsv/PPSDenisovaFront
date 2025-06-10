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
  container.innerHTML = "";

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

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      openEditModal(index);
    });
  });
}

function openEditModal(orderIndex) {
  const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userOrders = allOrders.filter((order) => order.email === user.email);
  const order = userOrders[orderIndex];

  currentEditOrder = order;

  document.getElementById("editReceiver").value = order.receiver;
  document.getElementById("editAddress").value = order.address;
  document.getElementById("editOrderModal").style.display = "flex";

  const orderItemsTable = document.getElementById("orderItemsTable");
  orderItemsTable.innerHTML = ""; // Очистка таблицы

  order.items.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price} ₽</td>
      <td><button type="button" onclick="removeItem(${orderIndex}, ${index})">Удалить</button></td>
    `;
    orderItemsTable.appendChild(row);
  });

  const form = document.getElementById("editOrderForm");
  form.onsubmit = function (e) {
    e.preventDefault();

    order.receiver = document.getElementById("editReceiver").value.trim();
    order.address = document.getElementById("editAddress").value.trim();

    // Отправляем заказ на подтверждение модератору
    order.status = "pending";

    // Обновляем заказ в allOrders
    const indexInAll = allOrders.findIndex(
      (o) => o.date === order.date && o.email === order.email
    );
    if (indexInAll !== -1) {
      allOrders[indexInAll] = order;
      localStorage.setItem("orders", JSON.stringify(allOrders));
    }

    closeEditModal();
    loadOrderHistory(user.email);
  };
}

function closeEditModal() {
  document.getElementById("editOrderModal").style.display = "none";
}

function removeItem(orderIndex, itemIndex) {
  const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userOrders = allOrders.filter((order) => order.email === user.email);
  const order = userOrders[orderIndex];

  // Удаляем товар из заказа
  order.items.splice(itemIndex, 1);

  // Обновляем заказ в allOrders
  const indexInAll = allOrders.findIndex(
    (o) => o.date === order.date && o.email === order.email
  );
  if (indexInAll !== -1) {
    allOrders[indexInAll] = order;
    localStorage.setItem("orders", JSON.stringify(allOrders));
  }

  // Перезагружаем историю заказов
  loadOrderHistory(user.email);
}

function openCatalog() {
  const catalogItems = JSON.parse(localStorage.getItem("products")) || [];
  const catalogList = document.getElementById("catalogItemsList");
  catalogList.innerHTML = "";

  catalogItems.forEach((item, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${item.name} - ${item.price} ₽</p>
      <button type="button" onclick="addItemToOrder(${index})">Добавить в заказ</button>
    `;
    catalogList.appendChild(div);
  });

  document.getElementById("catalogModal").style.display = "flex";
}

function addItemToOrder(itemIndex) {
  const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
  const catalogItems = JSON.parse(localStorage.getItem("products")) || [];
  const selectedItem = catalogItems[itemIndex];

  if (!currentEditOrder || !selectedItem) {
    console.error("Invalid order or product");
    return;
  }

  if (!currentEditOrder.items) {
    currentEditOrder.items = [];
  }

  currentEditOrder.items.push(selectedItem);
  currentEditOrder.status = "pending"; // помечаем заказ как изменённый

  // Обновляем заказ в allOrders
  const indexInAll = allOrders.findIndex(
    (o) =>
      o.date === currentEditOrder.date && o.email === currentEditOrder.email
  );

  if (indexInAll !== -1) {
    allOrders[indexInAll] = currentEditOrder;
    localStorage.setItem("orders", JSON.stringify(allOrders));
  }

  closeCatalogModal();
  openEditModal(indexInAll); // обновим модальное окно
}

function closeCatalogModal() {
  document.getElementById("catalogModal").style.display = "none";
}
