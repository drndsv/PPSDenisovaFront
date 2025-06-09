document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();

    // Заглушка — позже здесь будет отправка данных на бэкенд
    console.log("Регистрация покупателя:", {
      fullName,
      email,
      phone,
      password,
    });
    alert("Регистрация прошла успешно!");

    // Переход на страницу входа
    window.location.href = "../login/login.html";
  });
