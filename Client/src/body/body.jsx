import MainPage from "./MainPage/MainPage"
import ItemPage from "./ItemsPage/ItemsPage";
import {Route, Routes} from "react-router-dom"
import { createContext, useContext, useState } from "react";
import { ItemItself } from "./ItemItselfPage/ItemItselfPage";
import { Cart } from "./Cart/Cart";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CheckoutPage from "../pages/CheckoutPage";
import SuccessPage from "../pages/SuccessPage";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";


export const Body = () => {
    return(
            <Routes>
                {/* Публічні маршрути */}
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage/>} />
                
                {/* Захищені маршрути */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <MainPage/>
                    </ProtectedRoute>
                } />
                <Route path="/items" element={
                    <ProtectedRoute>
                        <ItemPage/>
                    </ProtectedRoute>
                } />
                <Route path="/items/:id" element={
                    <ProtectedRoute>
                        <ItemItself/>
                    </ProtectedRoute>
                } />
                <Route path="/cart" element={
                    <ProtectedRoute>
                        <Cart/>
                    </ProtectedRoute>
                }/>
                <Route path="/checkout" element={
                    <ProtectedRoute>
                        <CheckoutPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/success" element={
                    <ProtectedRoute>
                        <SuccessPage/>
                    </ProtectedRoute>
                }/>
            </Routes>
    );
};

