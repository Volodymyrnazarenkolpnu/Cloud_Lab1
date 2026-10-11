import axios from "axios";
import { LogLevel, PublicClientApplication } from "@azure/msal-browser";
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
const msalInstance = new PublicClientApplication(msalConfig);

var server = process.env.REACT_APP_SERVER ? `http://${process.env.REACT_APP_SERVER}:5050` : "";
export let link = server + "/api"


export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
    redirectUri: typeof window !== "undefined" ? window.location.origin : "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

export const loginRequest = {
  scopes: [`api://${process.env.REACT_APP_BACKEND_CLIENT_ID}/userAccess`]
};

export async function getToken() {
    const account = msalInstance.getActiveAccount()
    const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: account
      });

    const token = response.accessToken;
    return token
}


export async function PullItemsFiltered(MinWeight = null, MaxWeight = null, MinPrice = null, MaxPrice = null, MinRPM = null, MaxRPM = null, SortType = null, SortDirection = null, searchQuery = "", VarOf = null, Limit = 0)  {
    let token = getToken();
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
    let res = (await axios.get(linksql, {headers: {"Authorization" : `Bearer ${token}`}}))
    return res
}

export const GetUserCart = async (id) => {
    let token = getToken();
    let sql = ` ${link}/cart?userid=${id}`
    let res = await axios.get(sql, {headers: {"Authorization" : `Bearer ${token}`}})
    return res
}

export const GetOneItem = async (id) => {
    let token = getToken();
    let sql = ` ${link}/get/${id}`
    let res = await axios.get(sql, {headers: {"Authorization" : `Bearer ${token}`}})
    return res
}