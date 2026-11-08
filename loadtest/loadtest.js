const { execSync } = require("child_process");
const url = process.env.WURL;
const N = process.env.N;
const CL_APP_ID = process.env.CL_APP_ID;
const TENANTID = process.env.TENANTID;
const CL_SECRET = process.env.CL_SECRET;
const BACKEND_ID = process.env.BACKEND_ID;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
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
            } else {
                console.log(data);
            }
        } catch (err) {
            console.warn("TOKEN IS MISSING");
        }
    }
}

async function prepare({wpath, rpath, token, df, mf}) {
    let nrequests = 0;
    let srequests = 0;
    let frequests = 0;
    const latencies = [];
    const start_time = Date.now();
    const end_time = start_time + 60 * 1000
    async function worker() {
        while (Date.now() < end_time) {
            for (let a = 0; a <=9; a++){
                try {
                    const reqStart = Date.now();
                    const body = undefined;
                    const res = await fetch(`${url}/${rpath}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer: ${token}`
                        },
                        body
                    });
                    const reqduration = Date.now() - reqStart;
                    latencies.push(reqduration)
                    nrequests++;
                    if (res.status >= 200 && res.status < 400) {
                        srequests++;
                    } else {
                        frequests++;
                    }
                } catch (err) {
                    nrequests++;
                    frequests++;
                }
                await delay(500 + Math.floor(Math.random() * 700));
            }
            try {
                const reqStart = Date.now();
                const body = JSON.stringify({amount: 1, itemid: "1", user: `${Math.floor(Date.now() / 1000)}`});
                const res = await fetch(`${url}/${wpath}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer: ${token}`
                    },
                    body
                });
                const reqduration = Date.now() - reqStart;
                latencies.push(reqduration)
                nrequests++;
                if (res.status >= 200 && res.status < 400) {
                    srequests++;
                } else {
                    frequests++;
                }
            } catch (err) {
                nrequests++;
                frequests++;
            }
            await delay(1000 + Math.floor(Math.random() * 1400));
        }
    }
    await Promise.all(Array.from({length: Math.floor(N * mf / df)}, () => worker()));
    const acduration = (Date.now() - start_time) / 1000;
    latencies.sort((a, b) => a - b);

    const avglatency = latencies.reduce((a, b) => a+b, 0) / (latencies.length || 1);
    const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
    const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;
    console.log(`total: ${nrequests}`);
    console.log(`good: ${srequests}`);
    console.log(`bad: ${frequests}`);
    console.log(`latencyAvg: ${avglatency}`);
    console.log(`p95 ${p95}`);
    console.log(`P99 ${p99}`);
}

async function main() {
    const token = await gettoken();
    for (let a = 1; a <=5; a++) {
        await prepare({
            wpath: "api/cart",
            rpath: "api/getall?=&SortType=price&SortDirection=ASC&Limit=0",
            token,
            mf: a,
            df: 5,
        });
    }
    for (let a = 1; a <=5; a++) {
        await prepare({
            wpath: "api/cart",
            rpath: "api/getall?=&SortType=price&SortDirection=ASC&Limit=0",
            token,
            mf: 5,
            df: 5,
        });
    }
    for (let a = 5; a >=1; a--) {
        await prepare({
            wpath: "api/cart",
            rpath: "api/getall?=&SortType=price&SortDirection=ASC&Limit=0",
            token,
            mf: a,
            df: 5,
        });
    }
}

main().catch(console.error);