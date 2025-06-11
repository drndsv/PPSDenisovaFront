document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  loadStaff();

  document
    .getElementById("registerForm")
    .addEventListener("submit", registerUser);
  document
    .getElementById("editForm")
    .addEventListener("submit", saveEditedUser);
});

function showTab(id) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

function loadUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const tbody = document.querySelector("#customersTable tbody");
  tbody.innerHTML = "";

  users
    .filter((u) => u.role === "customer")
    .forEach((user, index) => {
      tbody.innerHTML += createUserRow(user, index, false);
    });
}

function loadStaff() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const tbody = document.querySelector("#staffTable tbody");
  tbody.innerHTML = "";

  users
    .filter((u) => u.role !== "customer")
    .forEach((user, index) => {
      tbody.innerHTML += createUserRow(user, index, true);
    });
}

function createUserRow(user, index, showRole = false) {
  return `
    <tr>
      <td>${user.id ?? index + 1}</td>
      <td>${user.email}</td>
      <td>${user.password}</td>
      <td>${user.fullName}</td>
      <td>${user.phone}</td>
      <td class="${user.active ? "green" : "red"}">
        ${user.active ? "Активен" : "Неактивен"}
      </td>
      ${showRole ? `<td>${user.role}</td>` : ""}
      <td>${user.blocked ? "Заблокирован" : "Не заблокирован"}</td>
      <td>
        <button onclick="toggleBlock('${user.email}')">
          ${user.blocked ? "Разблокировать" : "Заблокировать"}
        </button>
        <button onclick="editUser('${user.email}')">Изменить</button>
        <button onclick="deleteUser('${user.email}')">Удалить</button>
      </td>
    </tr>
  `;
}

function toggleBlock(email) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const index = users.findIndex((u) => u.email === email);
  if (index !== -1) {
    users[index].blocked = !users[index].blocked;
    localStorage.setItem("users", JSON.stringify(users));
    loadUsers();
    loadStaff();
  }
}

function editUser(email) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email);
  if (user) {
    openEditModal(user);
  } else {
    alert("Пользователь не найден.");
  }
}

function openEditModal(user) {
  document.getElementById("editUserId").value = user.id ?? generateUserId(user);
  document.getElementById("editEmail").value = user.email;
  document.getElementById("editPassword").value = user.password;
  document.getElementById("editFullName").value = user.fullName;
  document.getElementById("editPhone").value = user.phone;
  document.getElementById("editRole").value = user.role;

  document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

function saveEditedUser(e) {
  e.preventDefault();

  const id = parseInt(document.getElementById("editUserId").value);
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const index = users.findIndex((u) => (u.id ?? generateUserId(u)) === id);
  if (index !== -1) {
    users[index].email = document.getElementById("editEmail").value.trim();
    users[index].password = document
      .getElementById("editPassword")
      .value.trim();
    users[index].fullName = document
      .getElementById("editFullName")
      .value.trim();
    users[index].phone = document.getElementById("editPhone").value.trim();
    users[index].role = document.getElementById("editRole").value;

    localStorage.setItem("users", JSON.stringify(users));
    loadUsers();
    loadStaff();
    closeEditModal();
  } else {
    alert("Не удалось сохранить изменения: пользователь не найден.");
  }
}

function registerUser(event) {
  event.preventDefault();

  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const fullName = document.getElementById("regFullName").value;
  const phone = document.getElementById("regPhone").value;
  const role = document.getElementById("regRole").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const newUser = {
    id: generateNextId(users),
    email,
    password,
    fullName,
    phone,
    role,
    active: true,
    blocked: false,
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  loadUsers();
  loadStaff();
  document.getElementById("registerForm").reset();
  alert("Пользователь зарегистрирован!");
}

function generateNextId(users) {
  return users.length > 0 ? Math.max(...users.map((u) => u.id ?? 0)) + 1 : 1;
}

function generateUserId(user) {
  return `${user.email}_${user.phone}`;
}

function deleteUser(email) {
  if (!confirm(`Вы уверены, что хотите удалить пользователя ${email}?`)) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.filter((u) => u.email !== email);
  localStorage.setItem("users", JSON.stringify(users));

  loadUsers();
  loadStaff();
}
