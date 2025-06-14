document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();

    // Создаём новый объект пользователя
    const newUser = {
      fullName,
      email,
      phone,
      password,
      roleId: 3, // роль покупателя (заменили 'role' на 'roleId' с ID 3)
      isActive: true, // пользователь активен (заменили 'blocked' на 'isActive')
    };

    // Отправляем данные на сервер через POST-запрос
    fetch("http://localhost:8080/application_user/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Регистрация прошла успешно!");
        window.location.href = "../login/login.html";
      })
      .catch((error) => {
        alert("Ошибка при регистрации: " + error);
      });
  });
