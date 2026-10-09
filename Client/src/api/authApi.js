 
const USERS_KEY = "mock_users";

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
  }
}

function isValidEmailFormat(email) {
  if (!email || typeof email !== 'string') return false;
  const atIndex = email.indexOf('@');
  if (atIndex <= 0) return false;
  const domain = email.slice(atIndex + 1);
  if (!domain || domain.indexOf('.') === -1) return false;
  const parts = domain.split('.');
  const last = parts[parts.length - 1];
  if (!last || last.length < 2) return false;  
  return true;
}

export const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password) {
        reject({ success: false, message: "Email and password are required" });
        return;
      }

      if (!isValidEmailFormat(email)) {
        reject({ success: false, message: "Invalid email format" });
        return;
      }

      const users = loadUsers();
      const user = Object.values(users).find((u) => u.email === email);

      if (!user) {
        reject({ success: false, message: "Account with this email does not exist" });
        return;
      }

      if (user.password !== password) {
        reject({ success: false, message: "Invalid password" });
        return;
      }

      const { password: _pw, ...publicUser } = user;
      resolve({ success: true, user: publicUser, message: "Login successful" });
    }, 400);
  });
};

export const registerUser = async (firstName, lastName, email, password, confirmPassword) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        reject({ success: false, message: "All fields are required" });
        return;
      }

      if (firstName.length < 2 || firstName.length > 50) {
        reject({ success: false, message: "First name must be 2-50 characters" });
        return;
      }

      if (lastName.length < 2 || lastName.length > 50) {
        reject({ success: false, message: "Last name must be 2-50 characters" });
        return;
      }

      if (password.length < 6) {
        reject({ success: false, message: "Password must be at least 6 characters" });
        return;
      }

      if (password !== confirmPassword) {
        reject({ success: false, message: "Passwords do not match" });
        return;
      }

      if (!isValidEmailFormat(email)) {
        reject({ success: false, message: "Invalid email format" });
        return;
      }

      const users = loadUsers();
      const exists = Object.values(users).some((u) => u.email === email);
      if (exists) {
        reject({ success: false, message: "Account with this email already exists" });
        return;
      }

      const id = (Math.random() * 1000000000).toString().slice(0,8);
      const newUser = { id, firstName, lastName, email, password };
      users[id] = newUser;
      saveUsers(users);

      try {
        const cartKey = `redux_cart_${id}`;
        if (!localStorage.getItem(cartKey)) localStorage.setItem(cartKey, JSON.stringify({}));
      } catch (e) {
      }

      const { password: _pw, ...publicUser } = newUser;
      resolve({ success: true, user: publicUser, message: "Registration successful" });
    }, 400);
  });
};
