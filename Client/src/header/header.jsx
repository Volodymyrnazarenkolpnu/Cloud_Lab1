import React, { createContext, useContext, useState } from "react";
import "./header.styles.css"
import { EnvironmentOutlined, SearchOutlined, BarChartOutlined, ShoppingCartOutlined, MailOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons"
import LogoPng from "../images/dzhmihl.png"
import { NavLink, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useSearchContext } from "../App";
import { useSelector, useDispatch } from "react-redux";


const Header = () => {
    return(
            <div className="HeaderDiv">
                <MainNavbarEl/>
                <LowerNavbarEl/>
            </div>
    );
};

const MainNavbarEl = () => {
    let {searchQuery, setSearchQuery, searchOpened, setSearchOpened} = useSearchContext();
    const user = useSelector((state) => state.auth?.user);
    const cart = useSelector((state) => state.auth?.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

    const handleLogout = () => {
        // Зберегти корзину перед виходом
        try {
            if (user && user.id) {
                const cartKey = `redux_cart_${user.id}`;
                localStorage.setItem(cartKey, JSON.stringify(cart || {}));
            }
        } catch (e) {
            // ignore
        }

        // Очистити Redux state
        dispatch({ type: 'LOGOUT_USER' });
        dispatch({ type: 'CLEAR_CART' });

        // Видалити токен користувача
        localStorage.removeItem('redux_user');

        // Перенаправити на сторінку входу
        navigate('/login');
    };

    return(
        <div className="MainNavbarDIv">
                <nav className="MainNavbar">
                    <div>
                    <EnvironmentOutlined />
                    <a>
                        Знайти дилера
                    </a>
                    </div>
                    <nav className="SubNavbar">
                        <Routes>
                            <Route path="/items" element={<div onClick={() => {setSearchOpened(!searchOpened); setSearchQuery("")}}><SearchOutlined/><a>Пошук</a></div>}/>
                        </Routes>
                        {!isAuthPage && (
                            <>
                                <div>
                                    <MailOutlined />
                                    <a>
                                        Контакти
                                    </a>
                                </div>
                                <div>
                                    <BarChartOutlined />
                                    <a>
                                        Порівняти
                                    </a>
                                </div>
                                <div>
                                    <ShoppingCartOutlined />
                                    <NavLink to="/cart">
                                        Кошик
                                    </NavLink>
                                </div>
                                {user && (
                                    <div className="user-info-header">
                                        <UserOutlined />
                                        <span>{user.email}</span>
                                        <button onClick={handleLogout} className="logout-btn-header">
                                            <LogoutOutlined /> Вийти
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </nav>
                </nav>
            </div>
    );
}

const LowerNavbarEl = () => {
    return(
        <div className="SectionsNavbarDiv">
            <nav className="SectionsNavbar">
                <div className="HandDiv">
                    <NavLink to="/items">
                        Техніка та ручний інструмент
                    </NavLink>
                </div>
                <div className="AccessoryDiv">
                    <a>
                        Аксесуари та приладдя
                    </a>
                </div>
                <div className="ClothDiv">
                    <a>
                        Захисний одяг
                    </a>
                </div>
                <div className="NewsDiv">
                    <a>
                        Новини та акції
                    </a>
                </div>
                <div className="HeaderLogoDiv">
                    <NavLink to="/">
                        <img alt="logo" src={LogoPng} width="100%" height="55px"></img>
                    </NavLink>
                </div>
            </nav>
        </div>
    );
}

export default Header;