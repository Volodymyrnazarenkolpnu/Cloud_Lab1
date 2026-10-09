import axios from 'axios'
import { compose, createSlice } from "@reduxjs/toolkit"

function nextID(lst) {
    const nextIDNum = lst.reduce((maxID, item) => Math.max(item.id, maxID), -1)
    return nextIDNum + 1
}

const sqlCommandsSlice = createSlice({
    name: 'cartCommands',
    initialState: {commands: [], executed:false},
    reducers: {
        commands_set: (state, action) => {
            state.commands = action.payload;
        },
        commands_execute: (state, action) => {
            for (let command of state.commands) {
                if (command.type == 0) {
                    axios.post(command.command, command.args ? command.args : null)
                } else if (command.type == 1) {
                    axios.put(command.command)
                    console.log("a")
                } else if (command.type == 2) {
                    axios.delete(command.command)
                }
            }
            state.commands = []
        }
    }
})

const cartItemsSlice = createSlice({
    name: 'cartItems',
    initialState: {items: [], loaded: false},
    reducers: {
        cart_add: (state, action) => {
            state.items = [
                ...state.items,
                {
                    id: nextID(state.items),
                    item: action.payload.item,
                    amount: action.payload.amount,
                    user: JSON.parse(localStorage.getItem("redux_user")).id
                }
            ]
        },
        cart_remove: (state, action) => {
            state.items=state.items.filter(item => action.payload != item.id)
        },
        cart_set: (state, action) => {
            state.items = action.payload;
            state.loaded= true;
        },
        cart_unload: (state, action) => {
            state.loaded = false
        },
        cart_clear: (state, action) => {
            state.items = []
            let id = JSON.parse(localStorage.getItem("redux_user")).id
            axios.delete(`http://localhost:5050/cart/clear/${id}`)
        }
    }
});

const itemSlice = createSlice({
    name: "items",
    initialState: {items: []},
    reducers: {
        items_set: (state,action) => {
            state.items = action.payload
        }
    } 
})

export const {cart_remove, cart_set, cart_add, cart_unload, cart_clear} = cartItemsSlice.actions;
export const {commands_set, commands_execute} = sqlCommandsSlice.actions
export const {items_set} = itemSlice.actions
export const itemsValue = (state) => state.items;
export const cartValue = (state) => state.cart;
export const  commandsValue = (state) => state.commands
export let cart_reducer = cartItemsSlice.reducer
export let command_reducer = sqlCommandsSlice.reducer
export let item_reduxer = itemSlice.reducer