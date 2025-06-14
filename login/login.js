document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  fetch(
    `http://localhost:8080/application_user/isUserExist/${email}/${password}`,
    {
      method: "GET",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка при попытке входа");
      }
      return response.json();
    })
    .then((user) => {
      if (!user || !user.id) {
        alert("Неверные учетные данные");
        return;
      }

      if (!user.isActive) {
        alert("Ваш аккаунт заблокирован");
        return;
      }

      // Определяем роль и сохраняем пользователя с ролью в localStorage
      switch (user.roleId) {
        case 1:
          user.role = "admin";
          break;
        case 2:
          user.role = "moderator";
          break;
        case 3:
          user.role = "customer";
          break;
        default:
          user.role = "unknown";
      }

      localStorage.setItem("currentUser", JSON.stringify(user));

      // Перенаправление в зависимости от роли
      switch (user.role) {
        case "admin":
          window.location.href = "/admin/admin.html";
          break;
        case "moderator":
          window.location.href = "/moderator/moderator.html";
          break;
        case "customer":
          window.location.href = "/catalog/catalog.html";
          break;
        default:
          alert("Неизвестная роль пользователя");
      }
    })
    .catch((err) => {
      alert(err.message || "Ошибка входа в систему");
      console.error("Ошибка входа:", err);
    });
});
