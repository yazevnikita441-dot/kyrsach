export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateProduct(product) {
  const errors = {};

  if (!product.name.trim()) {
    errors.name = 'Введите название товара';
  }

  if (!product.category.trim()) {
    errors.category = 'Введите категорию';
  }

  const price = Number(product.price);
  if (!Number.isFinite(price) || price <= 0) {
    errors.price = 'Цена должна быть числом больше 0';
  }

  return errors;
}

export function validateAuth({ email, password }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = 'Введите e-mail';
  } else if (!isEmail(email)) {
    errors.email = 'Введите корректный e-mail';
  }

  if (!password) {
    errors.password = 'Введите пароль';
  } else if (password.length < 6) {
    errors.password = 'Пароль должен быть не короче 6 символов';
  }

  return errors;
}
