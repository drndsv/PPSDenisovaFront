const orderItemsContainer = document.getElementById("orderItems");
const form = document.getElementById("checkoutForm");

const orderItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

function renderOrderItems() {
  if (orderItems.length === 0 || !currentUser) {
    orderItemsContainer.innerHTML =
      "<p>Нет выбранных товаров для оформления.</p>";
    form.style.display = "none";
    return;
  }

  let total = 0;
  orderItems.forEach((item) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <p>Цена: ${item.price} ₽</p>
      </div>
    `;
    orderItemsContainer.appendChild(div);
  });

  const totalBlock = document.createElement("div");
  totalBlock.className = "cart-summary";
  totalBlock.innerHTML = `<p>Итого к оплате: <strong>${total}</strong> ₽</p>`;
  orderItemsContainer.appendChild(totalBlock);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const recipient = document.getElementById("recipient").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!recipient || !address) {
    alert("Заполните все поля.");
    return;
  }

  if (!currentUser) {
    alert("Вы не авторизованы.");
    return;
  }

  // Формируем объект заказа
  const newOrder = {
    email: currentUser.email,
    receiver: recipient,
    address: address,
    date: new Date().toLocaleDateString("ru-RU"),
    items: orderItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
    })),
  };

  // Сохраняем заказ
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Очистим корзину
  localStorage.removeItem("cart");
  localStorage.removeItem("checkoutItems");

  // Перенаправление на страницу успешного оформления
  window.location.href = "order-success.html";
});

renderOrderItems();
