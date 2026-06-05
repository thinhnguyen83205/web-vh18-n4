import database from "../database.json";

const ADMIN_ACCOUNT = {
  username: "admin",
  password: "admin123",
  role: "admin",
};

const REGISTERED_USERS_KEY = "registeredUsers";

const DEMO_CUSTOMER = {
  id: "customer_demo",
  username: "customer",
  password: "123456",
  fullName: "Khách hàng demo",
  email: "customer@example.com",
  phone: "0900000000",
  role: "customer",
  createdAt: "2026-01-01T00:00:00Z",
};

function getRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY)) || [];
  } catch {
    return [];
  }
}

export async function login(username, password) {
  const isAdmin =
    username === ADMIN_ACCOUNT.username && password === ADMIN_ACCOUNT.password;

  if (isAdmin) {
    const user = {
      username: ADMIN_ACCOUNT.username,
      role: ADMIN_ACCOUNT.role,
    };

    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  }

  const normalizedUsername = username.trim().toLowerCase();
  const customers = [
    DEMO_CUSTOMER,
    ...database.users.map((user) => ({
      ...user,
      username: user.email,
      password: "123456",
      role: "customer",
    })),
    ...getRegisteredUsers(),
  ];

  const user = customers.find(
    (customer) =>
      [customer.username, customer.email, customer.phone]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase() === normalizedUsername) &&
      customer.password === password,
  );

  if (!user) {
    return null;
  }

  const { password: _password, ...safeUser } = user;
  localStorage.setItem("currentUser", JSON.stringify(safeUser));
  return safeUser;
}

export function registerCustomer(values) {
  const users = getRegisteredUsers();
  const username = values.username.trim();
  const email = values.email.trim();
  const existed = users.some(
    (user) =>
      user.username.toLowerCase() === username.toLowerCase() ||
      user.email.toLowerCase() === email.toLowerCase(),
  );

  if (existed || username === ADMIN_ACCOUNT.username) {
    return { ok: false, message: "Tài khoản hoặc email đã tồn tại." };
  }

  const user = {
    id: `user_${Date.now()}`,
    username,
    password: values.password,
    fullName: values.fullName.trim(),
    email,
    phone: values.phone.trim(),
    avatar: "",
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...users, user]));

  const { password: _password, ...safeUser } = user;
  localStorage.setItem("currentUser", JSON.stringify(safeUser));

  return { ok: true, user: safeUser };
}

export function logout() {
  localStorage.removeItem("currentUser");
}

export function getCurrentUser() {
  const savedUser = localStorage.getItem("currentUser");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    logout();
    return null;
  }
}

export function isAdmin() {
  return getCurrentUser()?.role === "admin";
}

export function isCustomer() {
  return getCurrentUser()?.role === "customer";
}
