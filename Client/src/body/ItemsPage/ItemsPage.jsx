import "./ItemsPage.styles.css";
import CardItem from "../../images/MA032000005-2-ratio-width-500-jpg.webp"
import { ShoppingCartOutlined } from "@ant-design/icons"
import { useState, useEffect } from "react";
import axios, * as otherAxios from "axios";
import { useSearchContext } from "../../App";
import { data, NavLink } from "react-router-dom";
import { cart_set, items_set, itemsValue } from "../../rootReducer";
import { useDispatch, useSelector } from "react-redux";
import {PullItemsFiltered} from "../../api/backendapi"



function ItemPage() {
    let {searchQuery, setSearchQuery, searchOpened, setSearchOpened} = useSearchContext();
    let VarOF = null

    const itemStorage = useSelector(itemsValue);
    const dispatch = useDispatch()

    const [items, setItems] = useState([]);
    const [filterMinWeight, setFilterMinWeight] = useState(null);
    const [filterMaxWeight, setFilterMaxWeight] = useState(null);
    const [filterMinPrice, setFilterMinPrice] = useState(null);
    const [filterMaxPrice, setFilterMaxPrice] = useState(null);
    const [filterMinRPM, setFilterMinRPM] = useState(null);
    const [filterMaxRPM, setFilterMaxRPM] = useState(null);
    const [Limit, setLimit] = useState(0);

    const [filterWeightState, setFilterWeightState] = useState(false);
    const [filterPriceState, setFilterPriceState] = useState(false);
    const [filterRPMState, setFilterRPMState] = useState(false);

    const [sortType, setSortType] = useState("price");
    const [sortDirection, setSortDirection] = useState("ASC");


    // const PullItemsFiltered = (MinWeight = null, MaxWeight = null, MinPrice = null, MaxPrice = null, MinRPM = null, MaxRPM = null, SortType = null, SortDirection = null, searchQuery = "", VarOf = null, Limit = 0) => {
    //     let lst = [MinWeight, MaxWeight, MinPrice, MaxPrice, MinRPM, MaxRPM]
    //     let lstdict = ["MinWeight","MaxWeight", "MinPrice", "MaxPrice", "MinRPM", "MaxRPM"]
    //     let linksql = 'http://localhost:5050/getall?'
    //     let param_num = 0;
    //     let idx = 0;
    //     for (let el in lst) {
    //         if (lst[el] != null) {
    //             if (param_num > 0) {
    //                 linksql += "&"
    //             }
    //             linksql += `${lstdict[idx]}=${lst[el]}`;
    //             param_num += 1;
    //         }
    //         idx += 1;
    //     }

    //     if (SortType === null) {
    //         linksql += "&SortType=price"
    //     } else {
    //         linksql += `&SortType=${SortType}`
    //     }

    //     if (SortDirection === null) {
    //         linksql += "&SortDirection=ASC"
    //     } else {
    //         linksql += `&SortDirection=${SortDirection}`
    //     }

    //     linksql += `&Limit=${Limit}`

    //     if (searchQuery !== "") {
    //         linksql += `&Name=${searchQuery.toLowerCase().trim().replace(/\s+/g, "")}`;
    //     }
    //     axios.get(linksql).then((data) => {
    //             setItems(data);
    //             dispatch(items_set(data.data.data))
    //     }).catch((err)=>{console.log(err)})
    // }

    useEffect(() => {
        const load = async () => {
            let res = (await PullItemsFiltered(filterMinWeight, filterMaxWeight, filterMinPrice, filterMaxPrice, filterMinRPM, filterMaxRPM, sortType, sortDirection, searchQuery, VarOF, Limit)).data.data;
            setItems(res)
            dispatch(items_set(res))
            console.log(res)
        }
        load()
    }, [filterMinWeight, filterMaxWeight, filterMinPrice, filterMaxPrice, filterMinRPM, filterMaxRPM, sortType, sortDirection, searchQuery, Limit])

    return(
        <div className="ItemPageMainDiv">
            {searchOpened && 
            <div className="SearchDiv">
                <form onSubmit={(e) => {e.preventDefault(); let tmp = (Object.fromEntries((new FormData(e.target)).entries())).searchinput; setSearchQuery(tmp);}}>
                    <input type="text" name="searchinput"/>
                    <button onClick={(e) => {e.target.form.reset()}}>x</button>
                    <button type="submit">{">"}</button>
                </form>
            </div>}
            <div className="TextAndSortDiv">
                <p>
                    Техніка та ручний інструмент
                </p>
                <div className="SortDiv">
                    <p>
                        Сортування
                    </p>
                    <select defaultValue="price">
                        <option onClick={() => {setSortType("price")}}>price</option>
                        <option onClick={() => {setSortType("weight")}}>weight</option>
                        <option onClick={() => {setSortType("RPM")}}>RPM</option>
                    </select>
                    <button onClick={()  => {setSortDirection(sortDirection == "ASC" ? "DESC" : "ASC")}}>
                        |
                    </button>
                </div>
            </div>
            <div className="ItemsAndFilterDiv">
                <div className="FilterDiv">
                    <div className="FilterTextDiv">
                        <p>
                            Фільтри
                        </p>
                    </div>
                     <hr></hr>
                    <div className="FilterTextDiv" onClick={() => {setFilterPriceState(!filterPriceState)}}>
                        <p>
                            Ціна
                        </p>
                    </div>
                    {filterPriceState && <Filters callback={(data) => {setFilterMinPrice(data.Min); setFilterMaxPrice(data.Max);}} callback2={() => {return {Min:filterMinPrice, Max:filterMaxPrice}}}/>}
                        <hr></hr>
                    <div className="FilterTextDiv" onClick={() => {setFilterWeightState(!filterWeightState)}}>
                        <p>
                            Вага
                        </p>
                    </div>
                        {filterWeightState && <Filters callback={(data) => {setFilterMinWeight(data.Min); setFilterMaxWeight(data.Max);}} callback2={() => {return {Min:filterMinWeight, Max:filterMaxWeight}}}/>}
                            <hr></hr>
                    <div className="FilterTextDiv" onClick={() => {setFilterRPMState(!filterRPMState)}}>
                        <p>
                            Обороти
                        </p>
                    </div>
                    {filterRPMState && <Filters callback={(data) => {setFilterMinRPM(data.Min); setFilterMaxRPM(data.Max);}} callback2={() => {return {Min:filterMinRPM, Max:filterMaxRPM}}}/>}
                        <hr></hr>
                </div>
                <div className="ItemStorageDiv">
                   {items.length != 0 && items.map((item)=>
                    (
                        <ItemCard text={item.name} price={item.price} id={item.id}/>
                    )
                    )
                    }
                </div>
            </div>
                <button onClick={() => {setLimit(Limit + 3)}}>Показати більше</button>
        </div>
    );
}

const ItemCard = ({text, price, id}) => {
    return(
         <NavLink to={`/items/${id}`}>
            <div className="ItemCardDiv">
                <img src={CardItem}>
                </img>
                <p className="namePriceText">
                    {text}
                </p>
                <div className="ItemCardPriceDiv">
                    <p className="namePriceText">
                        {price}$
                    </p>
                    <button className="BuyButton">
                        <ShoppingCartOutlined/>
                    </button>
                </div>
            </div>
        </NavLink>
    ); 
};

const Filters = ({callback, callback2}) => {

    function handleSubmit(e, callback) {
        e.preventDefault();
        const inputsdata = new FormData(e.target);
        const data = Object.fromEntries(inputsdata.entries());
        callback(data);
    }

    function formReset(e, callback) {
        e.target.form.reset();
        callback({Min:null, Max:null})
    }

    return(
        <form className="FilterMenuForm" onSubmit= {(e) => {handleSubmit(e, callback)}}>
            <div>
            <p>Від</p>
                <input name="Min" defaultValue={callback2().Min}></input>
                <p>До</p>
                <input name="Max" defaultValue={callback2().Max}></input>
            </div>
            <div>
                <button type="submit">Submit</button>
                <button onClick={(e) => {formReset(e, callback)}}>Reset</button>
            </div>
        </form>
    );
}

export default ItemPage;