const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PASSWORD_LENGTH = 128;

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const validateSignup = ({ name, email, password }) => {
  const trimmedName = String(name || "").trim();

  if (!trimmedName || !email || !password) {
    return "Name, email, and password are required";
  }

  if (trimmedName.length < 2) {
    return "Name must be at least 2 characters";
  }

  const normalizedEmail = normalizeEmail(email);

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return "Please enter a valid email address";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return "Password is too long";
  }

  return null;
};

const validateLogin = ({ email, password }) => {
  if (!email || !password) {
    return "Email and password are required";
  }

  if (!EMAIL_REGEX.test(normalizeEmail(email))) {
    return "Please enter a valid email address";
  }

  return null;
};

const isPdfBuffer = (buffer) =>
  Buffer.isBuffer(buffer) && buffer.length >= 4 && buffer.subarray(0, 4).toString() === "%PDF";

module.exports = {
  normalizeEmail,
  validateSignup,
  validateLogin,
  isPdfBuffer,
  MAX_PASSWORD_LENGTH,
};
