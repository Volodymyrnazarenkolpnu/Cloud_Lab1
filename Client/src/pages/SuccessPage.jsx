import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SuccessPage.css";

export default function SuccessPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("order");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  if (!order) {
    return (
      <div className="container success-page">
        <h1>Помилка</h1>
        <p>Замовлення не знайдено. <a href="/cart">Повернутися в кошик</a></p>
      </div>
    );
  }

  return (
    <div className="container success-page">
      <div className="success-content">
        <div className="success-icon">✓</div>
        <h1>Замовлення успішно оформлене!</h1>
        <p className="success-msg">Дякуємо за покупку!</p>

        <div className="order-details">
          <h3>Деталі замовлення</h3>
          
          <div className="detail-section">
            <h4>Контактні дані</h4>
            <p><strong>Ім'я:</strong> {order.firstName} {order.lastName}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Телефон:</strong> {order.phone}</p>
            <p><strong>Адреса:</strong> {order.address}</p>
          </div>

          <div className="detail-section">
            <h4>Товари</h4>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={`${item.id}`} className="order-item">
                  <span>{item.item}×{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="summary-total">
            <p><strong>Всього позицій: {order.total}</strong></p>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate("/")} className="btn-primary">
            На головну
          </button>
        </div>
      </div>
    </div>
  );
}
