import axios from "axios";
var server = process.env.REACT_APP_SERVER ? `http://${process.env.REACT_APP_SERVER}:5050` : "";
export let link = server

export async function PullItemsFiltered(MinWeight = null, MaxWeight = null, MinPrice = null, MaxPrice = null, MinRPM = null, MaxRPM = null, SortType = null, SortDirection = null, searchQuery = "", VarOf = null, Limit = 0)  {
        let lst = [MinWeight, MaxWeight, MinPrice, MaxPrice, MinRPM, MaxRPM]
        let lstdict = ["MinWeight","MaxWeight", "MinPrice", "MaxPrice", "MinRPM", "MaxRPM"]
        let linksql = `${link}/getall?`
        let param_num = 0;
        let idx = 0;
        for (let el in lst) {
            if (lst[el] != null) {
                if (param_num > 0) {
                    linksql += "&"
                }
                linksql += `${lstdict[idx]}=${lst[el]}`;
                param_num += 1;
            }
            idx += 1;
        }
        console.log("ASSASASA")
        console.log(VarOf)
        if (VarOf) {
            linksql += `&VarOf=${VarOf}`
        }
        if (SortType === null) {
            linksql += "&SortType=price"
        } else {
            linksql += `&SortType=${SortType}`
        }

        if (SortDirection === null) {
            linksql += "&SortDirection=ASC"
        } else {
            linksql += `&SortDirection=${SortDirection}`
        }
        linksql += `&Limit=${Limit}`

        
        if (searchQuery !== "") {
            linksql += `&Name=${searchQuery.toLowerCase().trim().replace(/\s+/g, "")}`;
        }
        console.log(linksql)
        let res = (await axios.get(linksql))
        return res
    }

export const GetUserCart = async (id) => {
    let sql = ` ${link}/cart?userid=${id}`
    let res = await axios.get(sql)
    return res
}

export const GetOneItem = async (id) => {
    let sql = ` ${link}/get/${id}`
    let res = await axios.get(sql)
    return res
}