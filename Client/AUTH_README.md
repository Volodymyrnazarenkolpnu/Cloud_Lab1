# Авторизація, Реєстрація та Чекаут

## Огляд

Цей модуль додає функціонал авторизації, реєстрації користувачів та чекауту замовлень до вашого React додатку. Включає:

- ✅ Сторінка реєстрації (RegisterPage)
- ✅ Сторінка входу (LoginPage)
- ✅ Сторінка оформлення замовлення (CheckoutPage)
- ✅ Сторінка успішного замовлення (SuccessPage)
- ✅ Захищені маршрути (ProtectedRoute)
- ✅ Персоналізована корзина для кожного користувача
- ✅ Збереження даних у localStorage

## Структура файлів

```
назаренко/src/
├── pages/
│   ├── LoginPage.jsx           # Сторінка входу
│   ├── RegisterPage.jsx        # Сторінка реєстрації
│   ├── CheckoutPage.jsx        # Сторінка оформлення замовлення
│   ├── SuccessPage.jsx         # Сторінка успішного замовлення
│   ├── AuthPages.css           # Стилі для авторизації
│   ├── CheckoutPage.css        # Стилі для чекауту
│   └── SuccessPage.css         # Стилі для успішного замовлення
├── api/
│   └── authApi.js              # API для авторизації (мок)
├── redux/
│   ├── actions.js              # Redux actions для auth
│   └── authReducer.js          # Redux reducer для auth
├── components/
│   └── ProtectedRoute/
│       └── ProtectedRoute.jsx  # Компонент захисту маршрутів
└── store.js                    # Оновлений Redux store
```

## Встановлення залежностей

Якщо ще не встановлені:

```bash
npm install formik yup
```

## Інтеграція в App.js

Додайте маршрути до вашого `App.js`:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          {/* Публічні маршрути */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Захищені маршрути */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          } />
          
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          
          <Route path="/success" element={
            <ProtectedRoute>
              <SuccessPage />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
}
```

## Використання Redux селекторів

### Отримання користувача
```jsx
import { useSelector } from 'react-redux';

function MyComponent() {
  const user = useSelector((state) => state.auth?.user);
  
  return (
    <div>
      {user ? `Привіт, ${user.firstName}!` : 'Не авторизовано'}
    </div>
  );
}
```

### Отримання корзини
```jsx
const cart = useSelector((state) => state.auth?.cart || {});
const items = Object.values(cart);
```

### Додавання товару в корзину
```jsx
import { useDispatch } from 'react-redux';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  
  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        item: product,
        variant: 'default'
      }
    });
  };
  
  return <button onClick={handleAddToCart}>Додати в корзину</button>;
}
```

### Вихід з акаунту
```jsx
function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);
  const cart = useSelector((state) => state.auth?.cart);
  
  const handleLogout = () => {
    // Зберегти корзину перед виходом
    if (user && user.id) {
      const cartKey = `redux_cart_${user.id}`;
      localStorage.setItem(cartKey, JSON.stringify(cart || {}));
    }
    
    // Очистити Redux state
    dispatch({ type: 'LOGOUT_USER' });
    dispatch({ type: 'CLEAR_CART' });
    
    // Видалити токен користувача
    localStorage.removeItem('redux_user');
    
    // Перенаправити на сторінку входу
    navigate('/login');
  };
  
  return <button onClick={handleLogout}>Вийти</button>;
}
```

## Особливості

### Персоналізована корзина
- Кожен користувач має свою корзину, яка зберігається під ключем `redux_cart_{userId}`
- Анонімна корзина зберігається під ключем `redux_cart_anon`
- При вході користувача, його корзина автоматично завантажується
- При виході, корзина зберігається і відновлюється при наступному вході

### Валідація форм
- **Email**: перевіряється формат (мінімум 2 символи після останньої крапки)
- **Пароль**: мінімум 6 символів
- **Ім'я/Прізвище**: 2-50 символів, тільки букви
- **Телефон**: рівно 10 цифр
- **Адреса**: 5-100 символів

### Захист маршрутів
`ProtectedRoute` автоматично перенаправляє неавторизованих користувачів на `/login`

### localStorage структура
```
localStorage:
├── mock_users            # Об'єкт всіх зареєстрованих користувачів
├── redux_user           # Поточний авторизований користувач
├── redux_cart_anon      # Корзина анонімного користувача
├── redux_cart_{userId}  # Корзина конкретного користувача
└── order                # Останнє замовлення
```

## Тестування

### Реєстрація нового користувача
1. Перейдіть на `/register`
2. Заповніть форму (всі поля обов'язкові)
3. Натисніть "Зареєструватися"
4. Ви будете перенаправлені на головну сторінку

### Вхід існуючого користувача
1. Перейдіть на `/login`
2. Введіть email та пароль
3. Натисніть "Увійти"
4. Ваша корзина відновиться автоматично

### Оформлення замовлення
1. Додайте товари в корзину
2. Перейдіть на `/checkout`
3. Заповніть форму або натисніть "Мої дані" для автозаповнення
4. Натисніть "Перейти до оплати"
5. Ви будете перенаправлені на `/success`

## API Endpoints (мок)

```javascript
// Вхід
loginUser(email, password)
  .then(response => {
    // response.success === true
    // response.user === { id, firstName, lastName, email }
  })
  .catch(error => {
    // error.message === "Invalid password" або інше
  });

// Реєстрація
registerUser(firstName, lastName, email, password, confirmPassword)
  .then(response => {
    // response.success === true
    // response.user === { id, firstName, lastName, email }
  })
  .catch(error => {
    // error.message === "Account with this email already exists" або інше
  });
```

## Можливі помилки та вирішення

### "Account with this email does not exist"
- Користувач не зареєстрований
- Рішення: спочатку зареєструйтеся

### "Invalid password"
- Введено неправильний пароль
- Рішення: введіть правильний пароль або скиньте localStorage

### "Passwords do not match"
- Паролі не співпадають при реєстрації
- Рішення: введіть однакові паролі в обидва поля

### "Invalid email format"
- Email має неправильний формат (наприклад, `a@b.c`)
- Рішення: використовуйте правильний формат (наприклад, `user@example.com`)

## Додаткова інформація

Для детальніших питань звертайтеся до документації або коду компонентів.
