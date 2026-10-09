import {configureStore} from "@reduxjs/toolkit"
import {cart_reducer, command_reducer, item_reduxer} from "./rootReducer"
import authReducer from "./redux/authReducer"
import { combineReducers } from "@reduxjs/toolkit"

const CART_KEY_BASE = "redux_cart";
const USER_KEY = "redux_user";

function getCartKeyForUser(user) {
  if (user && user.id) return `${CART_KEY_BASE}_${user.id}`;
  return `${CART_KEY_BASE}_anon`;
}

function loadState() {
  try {
    const userRaw = localStorage.getItem(USER_KEY);
    const user = userRaw ? JSON.parse(userRaw) : undefined;

    const cartKey = getCartKeyForUser(user);
    const cartRaw = localStorage.getItem(cartKey);
    const cart = cartRaw ? JSON.parse(cartRaw) : undefined;

    if (cart || user) {
      return { 
        auth: { cart: cart || {}, user: user || null },
        items: { items: [] },
        cart: { items: [], loaded: false },
        commands: { commands: [], executed: false }
      };
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
}

const rootReducer = combineReducers({
  items: item_reduxer,
  cart: cart_reducer,
  commands: command_reducer,
  auth: authReducer
});

const preloadedState = typeof window !== "undefined" ? loadState() : undefined;

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

let lastSavedUserKey = null;

store.subscribe(() => {
  try {
    const state = store.getState();
    
    if (state.auth?.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(state.auth.user));
      lastSavedUserKey = state.auth.user.id;
    } else {
      localStorage.removeItem(USER_KEY);
      lastSavedUserKey = null;
    }

    const cartKey = getCartKeyForUser(state.auth?.user);
    localStorage.setItem(cartKey, JSON.stringify(state.auth?.cart || {}));
  } catch (e) {
  }
});

export default store;
