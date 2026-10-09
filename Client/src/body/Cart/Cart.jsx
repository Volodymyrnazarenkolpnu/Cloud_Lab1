import { useContext, useEffect, useState } from "react"
import axios from "axios"
import "./Cart.styles.css"
import {cart_remove, cart_set, cartValue, commands_execute, commands_set, commandsValue, itemsValue, cart_unload} from "../../rootReducer";
import { useSelector, useDispatch } from "react-redux"
import { NavLink } from "react-router-dom";
import ItemImage from "../../images/MA032000005-2-ratio-width-500-jpg.webp"
import { PullItemsFiltered, GetUserCart, GetOneItem, link } from "../../api/backendapi";
export const Cart= () => {
    const cartItemsStorage = useSelector(cartValue);
    const commandsStorage = useSelector(commandsValue); 
    const itemsStorage = useSelector(itemsValue);
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);


    // useEffect(() => {
    //     const load = async () => {
    //         const cartRes = (await axios.get(`http://localhost:5050/cart?userid=0`)).data.data;
    //         setCart1(cartRes)
    //         let arr = [] 
    //         for (let el of cartRes) {
    //             const a = (await (axios.get(`http://localhost:5050/get/${el.item}`))).data.data[0];
    //             a.amount = el.amount;
    //             arr.push(a)
    //         }
    //         setItems(arr);
    //     };
    //     load();
    // }, []);

    useEffect(() => {
        dispatch(cart_unload())
    }, [])
    

    async function loadCart() {
        if (!cartItemsStorage.loaded) {
            const loadedItems = await GetUserCart(JSON.parse(localStorage.getItem("redux_user")).id)
            console.log(loadedItems.data.data)
            dispatch(cart_set(loadedItems.data.data))
        }
    }

    function SyncCart() {
        console.log(commandsStorage.commands)
        PullItemsFiltered().then(() => {
            if (commandsStorage.commands.length != 0) {
                dispatch(commands_execute())
            }
            loadCart();
        }, () => {alert("Working offline. Click Sync before purchasing.")})
    }

    useEffect(() => {
        SyncCart();
        const tmpf = async () => {
            if (cartItemsStorage.items != []) {
                let arr = []
                for (let el of cartItemsStorage.items) {
                        const a = (await GetOneItem(el.item)).data.data[0];
                        a.amount = el.amount;
                        a.cart_id = el.id
                        arr.push(a)
                    }
                setItems(arr);

                console.log(items)
            }
        }
        PullItemsFiltered().then(() => {
            tmpf()
        }, () => {
            alert("Offline");
            let arr = []
            console.log(itemsStorage.items)
            console.log(cartItemsStorage.items)
            for (let el of cartItemsStorage.items) {
                const a = JSON.parse(JSON.stringify(itemsStorage.items.filter(item => item.id == el.item)))[0]
                console.log(a)
                a.amount = el.amount;
                a.cart_id = el.id
                arr.push(a)
            }
            if (items != arr) {
                setItems(arr)
            }
            console.log(arr)
        })
    }, [cartItemsStorage.items, cartItemsStorage.loaded])
    
    return(
        <>
            <div className="cartMainDiv">
                <h className="titleText">Корзина</h>
                <hr/>
                <div className="cartItemsAndDesc">
                    <div className="cartItemsDiv">
                        {items.map((item, i) => (
                            <CartItemCard 
                            key={i}
                            Name={item.name}
                            weight={item.weight}
                            price={item.price} 
                            rpm={item.rpm}
                            amount={item.amount}
                            id={item.id}
                            cart_id={item.cart_id}
                            />
                        ))}
                    </div>
                    <div className="cartDescDiv">
                        <h>
                            {`Загальна ціна: ${items.reduce((acc, val)=>acc + ( val.price * val.amount), 0)}`}
                        </h>
                        <h>
                            {`Загальна вага: ${items.reduce((acc, val)=>acc + ( val.weight * val.amount), 0)}`}
                        </h>
                        <NavLink to="/checkout">
                            <button className="checkoutButton">Замовити</button>
                        </NavLink>
                    </div>
                </div>
                <button onClick={() =>{SyncCart()}}>Sync</button>
            </div>
        </>
    )
}

const CartItemCard = ({Name, price, rpm, weight, amount, id, cart_id}) => {
    let [comstate, setComstate] = useState(true)
    const dispatch = useDispatch();
    const commandsStorage = useSelector(commandsValue)
    const cartItemsStorage = useSelector(cartValue);
    function removeItem(id) {
        dispatch(cart_remove(id));
        console.log(cartItemsStorage)
        dispatch(commands_set(commandsStorage.commands.concat({id: cartItemsStorage.items[cartItemsStorage.items.length - 1].id, type:2, command:`${link}/cart/${id}`})))
        setComstate(!comstate)
    }

    useEffect(() => {
        PullItemsFiltered().then(() => {
            if (commandsStorage.commands.length != 0) {
                dispatch(commands_execute())
            }
        }, () => {alert("Working offline. Click Sync before purchasing.")})
    }, [comstate])
    return (
        <>
            <div className="cartItemCardDiv">
                <div className="cartItemCardInfo">
                    <div className="cartItemCardPicture">
                        <img scr={ItemImage}></img>
                    </div>
                    <NavLink to={`/items/${id}`}>
                        <h>
                            {`${Name} Weight: ${weight}, Price: ${price}, RPM: ${rpm}`}
                        </h>
                    </NavLink>
                </div>
                <div className="cartItemCardAmount">
                    <h>
                        {`Amount: ${amount}`}
                    </h>
                    <button className="removeButton" onClick={() => {removeItem(cart_id)}}>x</button>
                </div>
            </div>
        </>
    )
}