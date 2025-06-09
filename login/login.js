document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Заглушка — позже подключим бэкенд
  if (email === "admin@example.com" && password === "admin") {
    alert("Вход выполнен как администратор");
    // window.location.href = "admin.html"; // пример перехода
  } else {
    alert("Неверные учетные данные");
  }
});
