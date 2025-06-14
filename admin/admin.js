document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user || user.roleId !== 1) {
    window.location.href = "../../login/login.html";
    return;
  }

  document.getElementById(
    "adminGreeting"
  ).textContent = `Здравствуйте, ${user.fullName}!`;

  loadUsers();

  document
    .getElementById("registerForm")
    .addEventListener("submit", registerUser);
  document
    .getElementById("editForm")
    .addEventListener("submit", saveEditedUser);
  document.getElementById("logoutBtn").addEventListener("click", logout);

  showTab("customers");
});

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "../../login/login.html";
}

let allUsers = [];

function loadUsers() {
  fetch("http://localhost:8080/application_user/getAll")
    .then((response) => response.json())
    .then((data) => {
      allUsers = data;
      renderUsers();
      renderStaff();
    })
    .catch((error) => {
      console.error("Ошибка при загрузке пользователей:", error);
      alert("Не удалось загрузить пользователей");
    });
}

function renderUsers() {
  const table = document.querySelector("#customersTable tbody");
  table.innerHTML = "";

  allUsers
    .filter((u) => u.roleId === 3)
    .forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.email}</td>
        <td>${user.password}</td>
        <td>${user.fullName}</td>
        <td>${user.phone}</td>
        <td>${user.isActive ? "Активен" : "Заблокирован"}</td>
        <td>
          <button onclick="toggleUserStatus(${user.id})">${
        user.isActive ? "Заблокировать" : "Разблокировать"
      }</button>
          <button onclick="openEditModal(${user.id})">Редактировать</button>
          <button onclick="deleteUser(${user.id})">Удалить</button>
        </td>
      `;
      table.appendChild(row);
    });
}

function renderStaff() {
  const table = document.querySelector("#staffTable tbody");
  table.innerHTML = "";

  allUsers
    .filter((u) => u.roleId === 1 || u.roleId === 2)
    .forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.email}</td>
        <td>${user.password}</td>
        <td>${user.fullName}</td>
        <td>${user.phone}</td>
        <td>${user.isActive ? "Активен" : "Заблокирован"}</td>
        <td>${user.roleId === 1 ? "Админ" : "Модератор"}</td>
        <td>
          <button onclick="toggleUserStatus(${user.id})">${
        user.isActive ? "Заблокировать" : "Разблокировать"
      }</button>
          <button onclick="openEditModal(${user.id})">Редактировать</button>
          <button onclick="deleteUser(${user.id})">Удалить</button>
        </td>
      `;
      table.appendChild(row);
    });
}

function toggleUserStatus(userId) {
  const user = allUsers.find((u) => u.id === userId);
  if (!user) return;

  const updatedUser = { ...user, isActive: !user.isActive };

  fetch("http://localhost:8080/application_user/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedUser),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Ошибка обновления пользователя");
      return res.text();
    })
    .then(() => loadUsers());
}

function openEditModal(userId) {
  const user = allUsers.find((u) => u.id === userId);
  if (!user) return;

  document.getElementById("editUserId").value = user.id;
  document.getElementById("editEmail").value = user.email;
  document.getElementById("editPassword").value = user.password;
  document.getElementById("editFullName").value = user.fullName;
  document.getElementById("editPhone").value = user.phone;
  document.getElementById("editRole").value =
    user.roleId === 1 ? "admin" : user.roleId === 2 ? "moderator" : "customer";

  document.getElementById("editModal").style.display = "block";
}

function saveEditedUser(event) {
  event.preventDefault();

  const updatedUser = {
    id: Number(document.getElementById("editUserId").value),
    email: document.getElementById("editEmail").value,
    password: document.getElementById("editPassword").value,
    fullName: document.getElementById("editFullName").value,
    phone: document.getElementById("editPhone").value,
    roleId:
      document.getElementById("editRole").value === "admin"
        ? 1
        : document.getElementById("editRole").value === "moderator"
        ? 2
        : 3,
    isActive: true,
  };

  fetch("http://localhost:8080/application_user/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedUser),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Ошибка при сохранении");
      return res.text();
    })
    .then(() => {
      document.getElementById("editModal").style.display = "none";
      loadUsers();
    });
}

function registerUser(event) {
  event.preventDefault();

  const newUser = {
    email: document.getElementById("regEmail").value,
    password: document.getElementById("regPassword").value,
    fullName: document.getElementById("regFullName").value,
    phone: document.getElementById("regPhone").value,
    roleId:
      document.getElementById("regRole").value === "admin"
        ? 1
        : document.getElementById("regRole").value === "moderator"
        ? 2
        : 3,
    isActive: true,
  };

  fetch("http://localhost:8080/application_user/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Ошибка при регистрации");
      return res.json();
    })
    .then(() => {
      alert("Пользователь успешно зарегистрирован");
      document.getElementById("registerForm").reset();
      loadUsers();
    });
}

function deleteUser(userId) {
  if (!confirm("Вы уверены, что хотите удалить пользователя?")) return;

  fetch(`http://localhost:8080/application_user/delete/${userId}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Ошибка при удалении пользователя");
      return res.text();
    })
    .then(() => {
      alert("Пользователь удалён");
      loadUsers();
    })
    .catch((error) => {
      console.error("Ошибка при удалении:", error);
      alert("Не удалось удалить пользователя");
    });
}

function showTab(tabName) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.style.display = "none";
  });

  const activeTab = document.getElementById(tabName);
  if (activeTab) {
    activeTab.style.display = "block";
  }
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}
