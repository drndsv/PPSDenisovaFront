document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Получаем список пользователей (записан в localStorage при регистрации)
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Ищем пользователя с введёнными email и паролем
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    alert("Неверные учетные данные");
    return;
  }

  if (user.blocked) {
    alert("Ваш аккаунт заблокирован");
    return;
  }

  // Сохраняем авторизованного пользователя
  localStorage.setItem("currentUser", JSON.stringify(user));

  // Перенаправляем по роли
  if (user.role === "admin") {
    window.location.href = "../../admin/admin.html";
  } else if (user.role === "moderator") {
    window.location.href = "../../moderator/moderator.html";
  } else if (user.role === "customer") {
    window.location.href = "../../catalog/catalog.html";
  } else {
    alert("Неизвестная роль пользователя");
  }
});
