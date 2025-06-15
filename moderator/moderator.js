const API_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user || (user.role !== "moderator" && user.role !== "admin")) {
    window.location.href = "../../login/login.html";
    return;
  }

  document.getElementById(
    "moderatorGreeting"
  ).textContent = `Здравствуйте, ${user.fullName}!`;
  document.getElementById("logoutBtn").addEventListener("click", logout);

  document
    .querySelectorAll(".tab-button")
    .forEach((btn) =>
      btn.addEventListener("click", (e) => openTab(e, btn.dataset.tab))
    );

  document.getElementById("addProductBtn").addEventListener("click", () => {
    document.getElementById("productForm").reset();
    document.getElementById("editProductId").value = "";
    document.getElementById("addProductForm").style.display = "flex";
  });

  document
    .getElementById("productForm")
    .addEventListener("submit", saveProduct);
  document.getElementById("deleteProductBtn").addEventListener("click", () => {
    const id = document.getElementById("editProductId").value;
    if (confirm("Удалить товар?")) deleteProduct(id);
  });

  document.getElementById("addSupplierBtn").addEventListener("click", () => {
    document.getElementById("supplierForm").reset();
    document.getElementById("editSupplierId").value = "";
    document.getElementById("addSupplierForm").style.display = "flex";
  });

  document
    .getElementById("supplierForm")
    .addEventListener("submit", saveSupplier);
  document.getElementById("deleteSupplierBtn").addEventListener("click", () => {
    const id = document.getElementById("editSupplierId").value;
    if (confirm("Удалить поставщика?")) deleteSupplier(id);
  });

  loadSuppliers(); // для селекта
  loadProducts(); // для таблицы
  loadSupplierList(); // таблица поставщиков
  loadOrders(); // локальные заказы
});

function openTab(evt, tabName) {
  document
    .querySelectorAll(".tab-content")
    .forEach((tab) => tab.classList.add("hidden"));
  document
    .querySelectorAll(".tab-button")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(tabName).classList.remove("hidden");
  evt.currentTarget.classList.add("active");
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "../../login/login.html";
}

// ===================== ТОВАРЫ =====================

function loadProducts() {
  fetch(`${API_URL}/part/getAll`)
    .then((res) => res.json())
    .then((products) => {
      const list = document.getElementById("productList");
      list.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Артикул</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Количество</th>
              <th>Поставщик</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (p) => `
              <tr>
                <td>${p.id}</td> <!-- Отображение Id товара -->
                <td>${p.article}</td>
                <td>${p.name}</td>
                <td>${p.price} ₽</td>
                <td>${p.quantity}</td>
                <td>${p.supplierId || ""}</td>
                <td>
                  <button onclick='editProduct(${JSON.stringify(p)})'>✏</button>
                  <button onclick='deleteProduct(${p.id})'>🗑</button>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;
    });
}

function saveProduct(event) {
  event.preventDefault();
  const id = document.getElementById("editProductId").value;
  const article = parseInt(document.getElementById("productArticle").value);
  const name = document.getElementById("productName").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const quantity = parseInt(document.getElementById("productQuantity").value);
  const supplierId = parseInt(document.getElementById("productSupplier").value);

  const product = { id, article, name, price, quantity, supplierId };
  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/part/update` : `${API_URL}/part/add`;

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  })
    .then((res) => res.json())
    .then(() => {
      loadProducts();
      closeProductForm();
    });
}

function editProduct(p) {
  document.getElementById("editProductId").value = p.id;
  document.getElementById("productArticle").value = p.article;
  document.getElementById("productName").value = p.name;
  document.getElementById("productPrice").value = p.price;
  document.getElementById("productQuantity").value = p.quantity;
  document.getElementById("productSupplier").value = p.supplierId;
  document.getElementById("addProductForm").style.display = "flex";
}

function deleteProduct(id) {
  fetch(`${API_URL}/part/delete/${id}`, { method: "DELETE" }).then(() =>
    loadProducts()
  );
}

function closeProductForm() {
  document.getElementById("addProductForm").style.display = "none";
}

// ===================== ПОСТАВЩИКИ =====================

function loadSuppliers() {
  fetch(`${API_URL}/supplier/getAll`)
    .then((res) => res.json())
    .then((suppliers) => {
      const select = document.getElementById("productSupplier");
      if (select) {
        select.innerHTML = suppliers
          .map((s) => `<option value="${s.id}">${s.name}</option>`)
          .join("");
      }
    });
}

function loadSupplierList() {
  fetch(`${API_URL}/supplier/getAll`)
    .then((res) => res.json())
    .then((suppliers) => {
      const list = document.getElementById("supplierList");
      list.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            ${suppliers
              .map(
                (s) => `
              <tr>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${s.phone}</td>
                <td>
                  <button onclick='editSupplier(${JSON.stringify(
                    s
                  )})'>✏</button>
                  <button onclick='deleteSupplier(${s.id})'>🗑</button>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;
    });
}

function saveSupplier(event) {
  event.preventDefault();
  const id = document.getElementById("editSupplierId").value;
  const name = document.getElementById("supplierName").value;
  const email = document.getElementById("supplierEmail").value;
  const phone = document.getElementById("supplierPhone").value;

  const supplier = { id, name, email, phone };
  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/supplier/update` : `${API_URL}/supplier/add`;

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(supplier),
  })
    .then((res) => res.json())
    .then(() => {
      loadSupplierList();
      loadSuppliers();
      closeSupplierForm();
    });
}

function editSupplier(s) {
  document.getElementById("editSupplierId").value = s.id;
  document.getElementById("supplierName").value = s.name;
  document.getElementById("supplierEmail").value = s.email;
  document.getElementById("supplierPhone").value = s.phone;
  document.getElementById("addSupplierForm").style.display = "flex";
}

function deleteSupplier(id) {
  fetch(`${API_URL}/supplier/delete/${id}`, { method: "DELETE" }).then(() => {
    loadSupplierList();
    loadSuppliers();
  });
}

function closeSupplierForm() {
  document.getElementById("addSupplierForm").style.display = "none";
}

// ===================== ЗАКАЗЫ =====================

function loadOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const list = document.getElementById("orderList");
  list.innerHTML = "";

  orders.forEach((order, index) => {
    const item = document.createElement("div");
    item.classList.add("order-item");
    item.innerHTML = `
      <p><strong>Заказ от:</strong> ${order.customerName}</p>
      <p><strong>Товары:</strong> ${order.products
        .map((p) => p.name)
        .join(", ")}</p>
      <p><strong>Статус:</strong> ${order.status}</p>
      <button onclick="confirmOrder(${index})">Подтвердить</button>
      <button onclick="rejectOrder(${index})">Отклонить</button>
    `;
    list.appendChild(item);
  });
}

function confirmOrder(index) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders[index].status = "Подтвержден";
  localStorage.setItem("orders", JSON.stringify(orders));
  loadOrders();
}

function rejectOrder(index) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders[index].status = "Отклонен";
  localStorage.setItem("orders", JSON.stringify(orders));
  loadOrders();
}
