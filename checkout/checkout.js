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

form.addEventListener("submit", async function (e) {
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

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);
  const now = new Date();
  const formattedDate = now.toISOString().split(".")[0];

  const newOrder = {
    userId: currentUser.id,
    receiver: recipient,
    address: address,
    totalAmount: totalAmount,
    statusId: 1,
    createdAt: formattedDate,
  };

  try {
    const response = await fetch(
      "http://localhost:8080/application_order/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      }
    );

    if (!response.ok) {
      throw new Error("Ошибка при создании заказа");
    }

    const savedOrder = await response.json();

    for (const item of orderItems) {
      const orderItem = {
        orderId: savedOrder.id,
        partId: item.id,
        quantity: 1,
        price: item.price,
      };

      const itemResponse = await fetch("http://localhost:8080/orderItem/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderItem),
      });

      if (!itemResponse.ok) {
        throw new Error("Ошибка при добавлении товара в заказ");
      }
    }

    localStorage.removeItem("cart");
    localStorage.removeItem("checkoutItems");
    window.location.href = "order-success.html";
  } catch (error) {
    console.error("Ошибка при оформлении заказа:", error);
    alert("Произошла ошибка при оформлении заказа");
  }
});

renderOrderItems();
