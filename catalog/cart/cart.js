const cartItemsContainer = document.getElementById("cartItems");
const totalPriceElement = document.getElementById("totalPrice");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedIndexes = new Set();

function renderCart() {
  cartItemsContainer.innerHTML = "";
  selectedIndexes.clear();
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Корзина пуста.</p>";
    totalPriceElement.textContent = "0";
    return;
  }

  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div>
        <label>
          <input type="checkbox" onchange="toggleSelection(${index})" />
          <strong>${item.name}</strong>
        </label>
        <p>Бренд: ${item.brand}</p>
        <p>Цена: ${item.price} ₽</p>
      </div>
      <button onclick="removeFromCart(${index})">Удалить</button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  updateTotal();
}

function toggleSelection(index) {
  if (selectedIndexes.has(index)) {
    selectedIndexes.delete(index);
  } else {
    selectedIndexes.add(index);
  }
  updateTotal();
}

function updateTotal() {
  let total = 0;
  selectedIndexes.forEach((index) => {
    total += cart[index].price;
  });
  totalPriceElement.textContent = total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function checkout() {
  if (selectedIndexes.size === 0) {
    alert("Выберите хотя бы один товар для оформления заказа!");
    return;
  }

  const selectedItems = Array.from(selectedIndexes).map((i) => cart[i]);
  localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));

  alert("Переход к оформлению заказа...");
  window.location.href = "../../checkout/checkout.html";
}

renderCart();
