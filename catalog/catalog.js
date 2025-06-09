const products = [
  { id: 1, name: "Тормозные колодки", brand: "Brembo", price: 4500 },
  { id: 2, name: "Масляный фильтр", brand: "Bosch", price: 900 },
  { id: 3, name: "Аккумулятор", brand: "Varta", price: 7200 },
  { id: 4, name: "Фара передняя", brand: "Philips", price: 3100 },
];

const productList = document.getElementById("productList");

products.forEach((product) => {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
      <h3>${product.name}</h3>
      <p>Производитель: ${product.brand}</p>
      <p>Цена: ${product.price} ₽</p>
      <button onclick="addToCart(${product.id})">В корзину</button>
    `;
  productList.appendChild(card);
});

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} добавлен в корзину`);
}

function goToCart() {
  window.location.href = "../catalog/cart/cart.html";
}
