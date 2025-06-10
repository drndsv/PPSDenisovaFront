document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();

    // Получаем текущий список пользователей или создаём новый
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Проверка на уникальность email
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      alert("Пользователь с таким email уже зарегистрирован");
      return;
    }

    // Создаём нового пользователя
    const newUser = {
      fullName,
      email,
      phone,
      password,
      role: "customer", // обязательно указываем роль
      blocked: false, // покупатель активен
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Регистрация прошла успешно!");
    window.location.href = "../login/login.html";
  });
