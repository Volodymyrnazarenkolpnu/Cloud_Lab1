import axios from "axios";
import "./ItemItselfPage.styles.css"
import { useEffect, useState } from "react";
import ItemImage from "../../images/MA032000005-2-ratio-width-500-jpg.webp"
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import {cart_set, cart_add, cartValue, commands_execute, commands_set, commandsValue, itemsValue} from "../../rootReducer";
import { GetOneItem, PullItemsFiltered, link} from "../../api/backendapi";



export const ItemItself = () => {
    const commandsStorage = useSelector(commandsValue)
    const cartItemsStorage = useSelector(cartValue);
    const itemsStorage = useSelector(itemsValue)
    const dispatch = useDispatch();
    const {id} = useParams();
    let [item, setItem] = useState({});
    let [comstate, setComstate] = useState(true);
    let [variants, setVariants] = useState([]) ;
    let [currentId, setCurrentId] = useState(id);


    useEffect(() => {
        const f = async () => {
            let res1 = await PullItemsFiltered(null, null,  null, null,  null,  null,  null, null, "", id, 100)
            setVariants(res1.data.data)
            let res2 = await GetOneItem(id);
            console.log(res2)
            setItem(res2.data.data[0])
            // axios.get(`http://localhost:5050/getall?SortType=price&SortDirection=ASC&VarOf=${id}&Limit=100`).then((data) => {setVariants(data.data.data);})
            // axios.get(`http://localhost:5050/get/${id}`).then((data) => {setItem(data.data.data[0])})
        }
        f()
    }, [])
    useEffect(() => {

    }, [variants])

    useEffect(() => {
        if (!cartItemsStorage.loaded) {
            const load = async () => {
                const loadedItems = await axios.get(`${link}/cart?userid=0`)
                return loadedItems.data.data;
            }
            load().then((data) => {dispatch(cart_set(data))})
        }
    }, [])
    useEffect(()=> {console.log(commandsStorage)}, [])

    async function CheckCart(amount) {
        console.log(amount)
        let unfilteredCart = JSON.parse(JSON.stringify(cartItemsStorage.items));
        console.log(unfilteredCart)
        let filteredCart = unfilteredCart.filter(item => {return item.item == currentId})
        if (filteredCart.length != 0) {
            var loadedItems = await axios.get(`${link}/cart?userid=${JSON.parse(localStorage.getItem("redux_user")).id}`)
            loadedItems.data.data.filter(item => {return item.item == currentId})
            unfilteredCart = JSON.parse(JSON.stringify(cartItemsStorage.items.filter(item => {return item.item != currentId})))
            filteredCart[0].amount += amount.amountInput == "" ? 1 : JSON.parse(amount.amountInput);
            dispatch(cart_set(unfilteredCart.concat(filteredCart)))
            dispatch(commands_set(commandsStorage.commands.concat({id: cartItemsStorage.items.length == 0 ? 0 : cartItemsStorage.items[cartItemsStorage.items.length - 1].id, type:1, command: `${link}/cart/${loadedItems.data.data[0].id}?user=${JSON.parse(localStorage.getItem("redux_user")).id}&item=${filteredCart[0].item}&amount=${filteredCart[0].amount}`})))
        } else {
            console.log("a")
            dispatch(cart_add({item: currentId, amount:1}))
            dispatch(commands_set(commandsStorage.commands.concat({id: cartItemsStorage.items.length == 0 ? 0 : cartItemsStorage.items[cartItemsStorage.items.length - 1].id, type:0, command:`${link}/cart`, args: {itemid: currentId, amount: JSON.parse(amount.amountInput), user: JSON.parse(localStorage.getItem("redux_user")).id}})))
        }
        setComstate(!comstate)
    }

    useEffect(() => {if (variants.length != 0 && !(item in variants)) {setVariants(variants.concat(item))}}, [item])
    useEffect(() => {
        if (commandsStorage.commands.length != 0) {
            console.log(commandsStorage.commands)
            axios.get(`${link}/getall?Limit=3&SortType=price&SortDirection=ASC`).then(() => {dispatch(commands_execute())}, () => {alert("Working offline")})
        }
    }, [comstate])

    // async function CheckCart() {
    //     const cart = await (axios.get(`http://localhost:5050/cart?userid=${0}`))
    //     let cartItems = cart.data.data
    //     console.log(cartItems);
    //     let cartItemsFiltered = cartItems.filter(item => {return (item.item == id)})
    //     console.log(id);
    //     console.log(cartItemsFiltered);
    //     if (cartItemsFiltered.length == 0){
    //         axios.post(`http://localhost:5050/cart`, {itemid: id})
    //         alert("Item added to cart!")
    //     } else {
    //         axios.put(`http://localhost:5050/cart/${cartItemsFiltered[0].id}?user=0&item=${cartItemsFiltered[0].item}&amount=${cartItemsFiltered[0].amount + 1}`);
    //         alert("Cart updated!")
    //     }
    // } cartValue, c

    return (
        <div className="ItemPageContainer">
            <div className="pictureDiv">
                <img src={ItemImage} className="itemPicture">

                </img>
            </div>
            <div className="rightInfoPanel">
                <div className="infoDiv">
                    <a className="titleText">
                        {item.name}
                    </a>
                    <hr></hr>
                    <h className="titleText">
                        {`${item.price}$`}
                    </h>
                </div>
                <form onSubmit={(e) => {e.preventDefault(); let tmp = (Object.fromEntries((new FormData(e.target)).entries())); CheckCart(tmp)}}>
                    {variants.length >= 2 && <select>
                            {variants.map(item => (
                                <option id={item.id} onClick={() => {setCurrentId(item.id)}}>{item.name}</option>
                            ))}
                        </select>}
                    <input name="amountInput" defaultValue={1} onKeyDown={(e) => {if(Event.Keycode === 13) {e.preventDefault()}}}></input>
                    <button className="buyButton">Замовити</button>
                </form>
                <h>{` Weight: ${item.weight}`}</h>
                <h>{` Rpm: ${item.rpm}`}</h>
                <hr></hr>
                <div className="greyTextArea">
                    <a>Доступний до замовлення</a>
                    <div className="greyTextRow">
                        <div className="greyTextColumn">
                            <h className="titleText">Способи оплати</h>
                            <h>При отриманні</h>
                            <h>- готівкою або банківкоською картою при самовивезенні</h>
                            <h>Безготівковий розрахунок</h>
                            <h>- після виставлення рахунку</h>
                        </div>
                        <div className="greyTextColumn">
                            <h className="titleText">Способи доставки</h>
                            <h>Самовивіз із магазину</h>
                            <h>Фахова доставка дилером</h>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}