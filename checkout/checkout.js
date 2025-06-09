const orderItemsContainer = document.getElementById("orderItems");
const form = document.getElementById("checkoutForm");

const orderItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];

function renderOrderItems() {
  if (orderItems.length === 0) {
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
        <p>Бренд: ${item.brand}</p>
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

  // Здесь может быть отправка на сервер. Пока просто имитируем оформление:
  alert(`Заказ оформлен на имя ${recipient}. Доставка по адресу: ${address}.`);

  // Очистим данные
  localStorage.removeItem("cart");
  localStorage.removeItem("checkoutItems");

  // Перенаправим (можно сделать заказ.html с подтверждением)
  window.location.href = "order-success.html";
});

renderOrderItems();
