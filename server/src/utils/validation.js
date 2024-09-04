const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const validateName = (name) => {
  return name.length >= 2;
};
const validateRequired = (value) => {
  return value.trim() !== "";
};
module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateRequired,
};
