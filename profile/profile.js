let currentEditOrder = null;

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user || user.role !== "customer") {
    window.location.href = "../../login/login.html";
    return;
  }

  document.getElementById("userName").textContent = user.fullName;
  document.getElementById("userEmail").textContent = user.email;
  document.getElementById("userPhone").textContent = user.phone;

  loadOrderHistory(user.id); // Используем user.id для поиска заказов
});

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "../../login/login.html";
}

function goBack() {
  window.location.href = "../catalog/catalog.html";
}

async function loadOrderHistory(userId) {
  const response = await fetch(
    `http://localhost:8080/application_order/getByUserId/${userId}`
  );
  const allOrders = await response.json();

  const userOrders = allOrders.filter((order) => order.userId === userId);
  const container = document.getElementById("orderHistory");
  container.innerHTML = "";

  if (userOrders.length === 0) {
    container.innerHTML = "<p>У вас пока нет заказов.</p>";
    return;
  }

  userOrders.forEach((order) => {
    const total = order.totalAmount; // Используем totalAmount для общей стоимости
    const div = document.createElement("div");
    div.className = "order-item";
    div.innerHTML = `
      <p><strong>Дата:</strong> ${order.createdAt}</p>
      <p><strong>Получатель:</strong> ${order.receiver}</p>
      <p><strong>Адрес:</strong> ${order.address}</p>
      <p><strong>Стоимость:</strong> ${total} ₽</p>
      <button onclick='openEditModal(${JSON.stringify(
        order
      )})'>Изменить заказ</button>
    `;
    container.appendChild(div);
  });
}

async function openEditModal(order) {
  currentEditOrder = order;
  document.getElementById("editReceiver").value = order.receiver;
  document.getElementById("editAddress").value = order.address;
  document.getElementById("editOrderModal").style.display = "flex";

  // Загружаем товары для этого заказа, только если их еще нет
  if (!currentEditOrder.items) {
    const response = await fetch(
      `http://localhost:8080/orderItem/getById/${order.id}`
    );
    const orderItems = await response.json();
    currentEditOrder.items = orderItems;
  }

  renderOrderItems(); // рисуем таблицу товаров

  const form = document.getElementById("editOrderForm");
  form.onsubmit = async function (e) {
    e.preventDefault();
    currentEditOrder.receiver = document
      .getElementById("editReceiver")
      .value.trim();
    currentEditOrder.address = document
      .getElementById("editAddress")
      .value.trim();
    currentEditOrder.status = "pending";

    // Сохраняем изменения заказа
    await fetch("http://localhost:8080/application_order/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentEditOrder),
    });

    closeEditModal();
    loadOrderHistory(currentEditOrder.userId); // Обновление заказов
  };
}

function renderOrderItems() {
  const table = document.getElementById("orderItemsTable");
  table.innerHTML = "";

  if (!currentEditOrder.items || currentEditOrder.items.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = "<td colspan='3'>Нет товаров в заказе</td>";
    table.appendChild(row);
    return;
  }

  currentEditOrder.items.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price} ₽</td>
      <td><button type="button" onclick="removeItem(${index})">Удалить</button></td>
    `;
    table.appendChild(row);
  });
}

function removeItem(index) {
  if (!currentEditOrder || !currentEditOrder.items) return;

  currentEditOrder.items.splice(index, 1);
  renderOrderItems(); // обновляем таблицу
}

function closeEditModal() {
  document.getElementById("editOrderModal").style.display = "none";
}

async function openCatalog() {
  try {
    const response = await fetch("http://localhost:8080/part/getAll");
    if (!response.ok) throw new Error("Ошибка при загрузке каталога");
    const catalogItems = await response.json();

    const catalogList = document.getElementById("catalogItemsList");
    catalogList.innerHTML = "";

    catalogItems.forEach((item, index) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p>${item.name} - ${item.price} ₽</p>
        <button type="button" data-item='${JSON.stringify(item).replace(
          /'/g,
          "&apos;"
        )}' onclick="addItemFromButton(this)">Добавить в заказ</button>
      `;
      catalogList.appendChild(div);
    });

    document.getElementById("catalogModal").style.display = "flex";
  } catch (error) {
    console.error("Ошибка загрузки товаров:", error);
  }
}

function addItemFromButton(button) {
  const itemJson = button.getAttribute("data-item").replace(/&apos;/g, "'");
  const item = JSON.parse(itemJson);
  addItemToOrder(item);
}

function addItemToOrder(item) {
  if (!currentEditOrder || !item) return;

  if (!currentEditOrder.items) {
    currentEditOrder.items = [];
  }

  currentEditOrder.items.push(item);
  currentEditOrder.status = "pending";

  renderOrderItems(); // перерисовываем таблицу
}

function closeCatalogModal() {
  document.getElementById("catalogModal").style.display = "none";
}
