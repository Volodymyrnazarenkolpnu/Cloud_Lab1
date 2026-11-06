const { execSync } = require("child_process");
const url = process.env.WURL;
const N = process.env.N;
const CL_APP_ID = process.env.CL_APP_ID;
const TENANTID = process.env.TENANTID;
const CL_SECRET = process.env.CL_SECRET;
const BACKEND_ID = process.env.BACKEND_ID;
async function gettoken() {
    if (CL_SECRET && CL_APP_ID) {
        try {
            turl = `https://login.microsoftonline.com/${TENANTID}/oauth2/v2.0/token`;
            const params = new URLSearchParams({
                grant_type: "client_credentials",
                client_id: CL_APP_ID,
                client_secret: CL_SECRET,
                scope: `api://${BACKEND_ID}/.default`
            });
            const res = await fetch(turl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded"},
                body: params
            });
            const data = await res.json();
            if (data.access_token) {
                console.log(data.access_token)
                return data.access_token;
            }
        } catch (err) {
            console.warn("TOKEN IS MISSING");
        }
    }
}

async function prepare({method, path, getBody, token, df, mf}) {
    const start_time = Date.now();
    const end_time = start_time + 60 * 1000
    async function worker() {
        while (Date.now() < end_time) {
            const reqStart = Date.now();
            try {
                const body = getBody ? JSON.stringify(getBody()) : undefined;
                const res = await fetch(`${url}/${path}`, {
                        method,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer: ${token}`
                        },
                        body
                });
            } catch (err) {
            }
        }
    }

    await Promise.all(Array.from({length: Math.floor(N * mf / df)}, () => worker()));
}

async function main() {
    const token = await gettoken();
    for (let a = 1; a <=5; a++) {
        await prepare({
            method: "GET",
            path: "api/getall?SortType=price&SortDirection=ASC&limit=3",
            token,
            mf: a,
            df: 5,
        });
    }
    await prepare({
            method: "GET",
            path: "api/getall?SortType=price&SortDirection=ASC&limit=3",
            token,
            mf: 5,
            df: 5,
    });
    for (let a = 5; a >=1; a--) {
        await prepare({
            method: "GET",
            path: "api/getall?SortType=price&SortDirection=ASC&limit=3",
            token,
            mf: a,
            df: 5,
        });
    }
}

main().catch(console.error);