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

  loadProducts();
  loadSuppliers();
  loadOrders();

  document.getElementById("addProductBtn").addEventListener("click", () => {
    document.getElementById("productForm").style.display = "block";
    document.getElementById("addProductForm").reset();
    document.getElementById("editIndex").value = "";
  });

  document.getElementById("addSupplierBtn").addEventListener("click", () => {
    document.getElementById("supplierForm").style.display = "block";
    document.getElementById("addSupplierForm").reset();
    document.getElementById("editSupplierIndex").value = "";
  });

  document
    .getElementById("addProductForm")
    .addEventListener("submit", saveProduct);
  document
    .getElementById("addSupplierForm")
    .addEventListener("submit", saveSupplier);

  document
    .getElementById("deleteProductBtn")
    .addEventListener("click", deleteSelectedProduct);
  document
    .getElementById("deleteSupplierBtn")
    .addEventListener("click", deleteSelectedSupplier);
});

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "../../login/login.html";
}

// ======= ТОВАРЫ =======
function loadProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach((product, index) => {
    const item = document.createElement("div");
    item.classList.add("product-item");
    item.innerHTML = `
      <strong>${product.name}</strong> — ${product.brand}, ${product.price} ₽, ${product.stock} шт.
      <button onclick="editProduct(${index})">Редактировать</button>
    `;
    list.appendChild(item);
  });
}

function saveProduct(event) {
  event.preventDefault();
  const name = document.getElementById("productName").value;
  const brand = document.getElementById("productBrand").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const stock = parseInt(document.getElementById("productStock").value);
  const index = document.getElementById("editIndex").value;

  let products = JSON.parse(localStorage.getItem("products")) || [];

  if (index) {
    products[index] = { name, brand, price, stock };
  } else {
    products.push({ name, brand, price, stock });
  }

  localStorage.setItem("products", JSON.stringify(products));
  loadProducts();
  document.getElementById("productForm").style.display = "none";
}

function editProduct(index) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products[index];

  document.getElementById("productName").value = product.name;
  document.getElementById("productBrand").value = product.brand;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productStock").value = product.stock;
  document.getElementById("editIndex").value = index;
  document.getElementById("productForm").style.display = "block";
}

function deleteSelectedProduct() {
  const index = document.getElementById("editIndex").value;
  if (index === "") return;

  let products = JSON.parse(localStorage.getItem("products")) || [];
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  loadProducts();
  document.getElementById("productForm").style.display = "none";
}

// ======= ПОСТАВЩИКИ =======
function loadSuppliers() {
  const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
  const list = document.getElementById("supplierList");
  list.innerHTML = "";

  suppliers.forEach((supplier, index) => {
    const item = document.createElement("div");
    item.classList.add("supplier-item");
    item.innerHTML = `
      <strong>${supplier.name}</strong> — ${supplier.contact}
      <button onclick="editSupplier(${index})">Редактировать</button>
    `;
    list.appendChild(item);
  });
}

function saveSupplier(event) {
  event.preventDefault();
  const name = document.getElementById("supplierName").value;
  const contact = document.getElementById("supplierContact").value;
  const index = document.getElementById("editSupplierIndex").value;

  let suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];

  if (index) {
    suppliers[index] = { name, contact };
  } else {
    suppliers.push({ name, contact });
  }

  localStorage.setItem("suppliers", JSON.stringify(suppliers));
  loadSuppliers();
  document.getElementById("supplierForm").style.display = "none";
}

function editSupplier(index) {
  const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
  const supplier = suppliers[index];

  document.getElementById("supplierName").value = supplier.name;
  document.getElementById("supplierContact").value = supplier.contact;
  document.getElementById("editSupplierIndex").value = index;
  document.getElementById("supplierForm").style.display = "block";
}

function deleteSelectedSupplier() {
  const index = document.getElementById("editSupplierIndex").value;
  if (index === "") return;

  let suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
  suppliers.splice(index, 1);
  localStorage.setItem("suppliers", JSON.stringify(suppliers));
  loadSuppliers();
  document.getElementById("supplierForm").style.display = "none";
}

// ======= ЗАКАЗЫ =======
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
