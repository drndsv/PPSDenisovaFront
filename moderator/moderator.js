function openTab(event, tabId) {
  document
    .querySelectorAll(".tab-content")
    .forEach((el) => el.classList.add("hidden"));
  document
    .querySelectorAll(".tab-button")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(tabId).classList.remove("hidden");
  event.target.classList.add("active");
}

// товары
function openProductForm(index = null) {
  const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
  const sel = document.getElementById("productSupplier");
  sel.innerHTML = '<option value="">— без поставщика —</option>';
  suppliers.forEach((s, i) => {
    sel.insertAdjacentHTML(
      "beforeend",
      `<option value="${i}">${s.name}</option>`
    );
  });

  const form = document.getElementById("productForm");
  form.reset();
  document.getElementById("editIndex").value = index !== null ? index : "";

  const products = JSON.parse(localStorage.getItem("products")) || [];

  if (index !== null && products[index]) {
    document.getElementById("productName").value = products[index].name;
    document.getElementById("productBrand").value = products[index].brand;
    document.getElementById("productPrice").value = products[index].price;
    document.getElementById("productStock").value = products[index].stock;
    document.getElementById("productFormTitle").textContent =
      "Редактировать товар";
    document.getElementById("submitProductBtn").textContent = "Сохранить";
    document.getElementById("deleteProductBtn").style.display = "inline-block";
  } else {
    document.getElementById("productFormTitle").textContent = "Добавить товар";
    document.getElementById("submitProductBtn").textContent = "Добавить";
    document.getElementById("deleteProductBtn").style.display = "none";
  }

  document.getElementById("addProductForm").style.display = "flex";
}

function deleteProduct() {
  const index = document.getElementById("editIndex").value;
  if (index === "") return;

  const confirmed = confirm("Вы уверены, что хотите удалить этот товар?");
  if (!confirmed) return;

  const products = JSON.parse(localStorage.getItem("products")) || [];
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  closeProductForm();
  loadProducts();
}

function closeProductForm() {
  document.getElementById("addProductForm").style.display = "none";
}

function openSupplierForm() {
  document.getElementById("addSupplierForm").style.display = "flex";
}

function closeSupplierForm() {
  document.getElementById("addSupplierForm").style.display = "none";
}

document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const index = document.getElementById("editIndex").value;
  const product = {
    name: document.getElementById("productName").value.trim(),
    brand: document.getElementById("productBrand").value.trim(),
    price: parseFloat(document.getElementById("productPrice").value.trim()),
    stock: parseInt(document.getElementById("productStock").value.trim()),
  };

  const products = JSON.parse(localStorage.getItem("products")) || [];

  if (index) {
    products[index] = product;
  } else {
    products.push(product);
  }

  localStorage.setItem("products", JSON.stringify(products));
  closeProductForm();
  loadProducts();
});

// document
//   .getElementById("supplierForm")
//   .addEventListener("submit", function (e) {
//     e.preventDefault();
//     const supplier = {
//       name: document.getElementById("supplierName").value.trim(),
//       email: document.getElementById("supplierEmail").value.trim(),
//       phone: document.getElementById("supplierPhone").value.trim(),
//     };

//     const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
//     suppliers.push(supplier);
//     localStorage.setItem("suppliers", JSON.stringify(suppliers));
//     closeSupplierForm();
//     loadSuppliers();
//   });

function loadProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const list = document.getElementById("productList");
  list.innerHTML = "<h3>Список товаров</h3>";
  products.forEach((p, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${p.name}</strong><br>
      Бренд: ${p.brand}<br>
      Цена: ${p.price} ₽<br>
      В наличии: ${p.stock}<br>
      <button onclick="openProductForm(${index})">Редактировать</button></p>
    `;
    list.appendChild(div);
  });
}

// --- Поставщики ---
function openSupplierForm(index = null) {
  const form = document.getElementById("supplierForm");
  form.reset();
  document.getElementById("editSupplierIndex").value =
    index !== null ? index : "";

  const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
  if (index !== null && suppliers[index]) {
    document.getElementById("supplierName").value = suppliers[index].name;
    document.getElementById("supplierEmail").value = suppliers[index].email;
    document.getElementById("supplierPhone").value = suppliers[index].phone;
    document.getElementById("supplierFormTitle").textContent =
      "Редактировать поставщика";
    document.getElementById("submitSupplierBtn").textContent = "Сохранить";
    document.getElementById("deleteSupplierBtn").style.display = "inline-block";
  } else {
    document.getElementById("supplierFormTitle").textContent =
      "Добавить поставщика";
    document.getElementById("submitSupplierBtn").textContent = "Добавить";
    document.getElementById("deleteSupplierBtn").style.display = "none";
  }

  document.getElementById("addSupplierForm").style.display = "flex";
}

function closeSupplierForm() {
  const form = document.getElementById("supplierForm");
  form.reset();
  document.getElementById("editSupplierIndex").value = "";
  document.getElementById("addSupplierForm").style.display = "none";
}

document
  .getElementById("supplierForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const idx = document.getElementById("editSupplierIndex").value;
    const supplier = {
      name: document.getElementById("supplierName").value.trim(),
      email: document.getElementById("supplierEmail").value.trim(),
      phone: document.getElementById("supplierPhone").value.trim(),
    };

    const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
    if (idx !== "") suppliers[idx] = supplier;
    else suppliers.push(supplier);

    localStorage.setItem("suppliers", JSON.stringify(suppliers));
    closeSupplierForm();
    loadSuppliers();
  });

function deleteSupplier() {
  const idx = document.getElementById("editSupplierIndex").value;
  if (idx === "") return;
  if (!confirm("Удалить поставщика?")) return;
  const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
  suppliers.splice(idx, 1);
  localStorage.setItem("suppliers", JSON.stringify(suppliers));
  closeSupplierForm();
  loadSuppliers();
}

function loadSuppliers() {
  const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
  const list = document.getElementById("supplierList");
  list.innerHTML = "<h3>Список поставщиков</h3>";
  suppliers.forEach((s, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${s.name}</strong><br>
      Email: ${s.email}<br>Телефон: ${s.phone}<br>
      <button onclick="openSupplierForm(${i})">Редактировать</button></p>`;
    list.appendChild(div);
  });
}

function loadOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const list = document.getElementById("orderList");
  list.innerHTML = "<h3>Список заказов</h3>";
  orders.forEach((o) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>Заказ №${o.id}</strong><br>
      Покупатель: ${o.customerName}<br>
      Адрес: ${o.address}<br>
      <button onclick="confirmOrder(${o.id})">Подтвердить</button>
      <button onclick="rejectOrder(${o.id})">Отклонить</button></p>`;
    list.appendChild(div);
  });
}

function confirmOrder(id) {
  alert(`Заказ №${id} подтвержден.`);
}

function rejectOrder(id) {
  alert(`Заказ №${id} отклонен.`);
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadSuppliers();
  loadOrders();
});
