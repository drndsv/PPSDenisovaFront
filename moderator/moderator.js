// Открытие формы для добавления товара
function openProductForm() {
  document.getElementById("addProductForm").style.display = "block";
}

// Закрытие формы для добавления товара
function closeProductForm() {
  document.getElementById("addProductForm").style.display = "none";
}

// Открытие формы для добавления поставщика
function openSupplierForm() {
  document.getElementById("addSupplierForm").style.display = "block";
}

// Закрытие формы для добавления поставщика
function closeSupplierForm() {
  document.getElementById("addSupplierForm").style.display = "none";
}

// Обработчик отправки формы товара
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const productName = document.getElementById("productName").value.trim();
  const productBrand = document.getElementById("productBrand").value.trim();
  const productPrice = parseFloat(
    document.getElementById("productPrice").value.trim()
  );
  const productStock = parseInt(
    document.getElementById("productStock").value.trim()
  );

  const product = {
    name: productName,
    brand: productBrand,
    price: productPrice,
    stock: productStock,
  };

  // Добавление товара в список (пока только в localStorage)
  const products = JSON.parse(localStorage.getItem("products")) || [];
  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));

  alert("Товар добавлен!");
  closeProductForm();
  loadProducts();
});

// Обработчик отправки формы поставщика
document
  .getElementById("supplierForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const supplierName = document.getElementById("supplierName").value.trim();
    const supplierEmail = document.getElementById("supplierEmail").value.trim();
    const supplierPhone = document.getElementById("supplierPhone").value.trim();

    const supplier = {
      name: supplierName,
      email: supplierEmail,
      phone: supplierPhone,
    };

    // Добавление поставщика в список (пока только в localStorage)
    const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
    suppliers.push(supplier);
    localStorage.setItem("suppliers", JSON.stringify(suppliers));

    alert("Поставщик добавлен!");
    closeSupplierForm();
    loadSuppliers();
  });

// Загрузка товаров из localStorage
function loadProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const productList = document.getElementById("productList");

  productList.innerHTML = "<h3>Список товаров</h3>";
  products.forEach((product) => {
    const div = document.createElement("div");
    div.innerHTML = `<p><strong>${product.name}</strong><br>Бренд: ${product.brand}<br>Цена: ${product.price} ₽<br>В наличии: ${product.stock}</p>`;
    productList.appendChild(div);
  });
}

// Загрузка поставщиков из localStorage
function loadSuppliers() {
  const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
  const supplierList = document.getElementById("supplierList");

  supplierList.innerHTML = "<h3>Список поставщиков</h3>";
  suppliers.forEach((supplier) => {
    const div = document.createElement("div");
    div.innerHTML = `<p><strong>${supplier.name}</strong><br>Email: ${supplier.email}<br>Телефон: ${supplier.phone}</p>`;
    supplierList.appendChild(div);
  });
}

// Загрузка заказов (для примера, можно добавить дополнительную логику для подтверждения/отклонения)
function loadOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const orderList = document.getElementById("orderList");

  orderList.innerHTML = "<h3>Список заказов</h3>";
  orders.forEach((order) => {
    const div = document.createElement("div");
    div.innerHTML = `
            <p><strong>Заказ №${order.id}</strong><br>Покупатель: ${order.customerName}<br>Адрес: ${order.address}<br><br>
            <button class="confirmOrderBtn" onclick="confirmOrder(${order.id})">Подтвердить</button>
            <button class="rejectOrderBtn" onclick="rejectOrder(${order.id})">Отклонить</button></p>
        `;
    orderList.appendChild(div);
  });
}

// Подтверждение заказа
function confirmOrder(orderId) {
  alert(`Заказ №${orderId} подтвержден.`);
}

// Отклонение заказа
function rejectOrder(orderId) {
  alert(`Заказ №${orderId} отклонен.`);
}

// Загрузка данных при инициализации
document.addEventListener("DOMContentLoaded", function () {
  loadProducts();
  loadSuppliers();
  loadOrders();
});
