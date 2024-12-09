import jssha from 'jssha';

const CONFIG = {
    app_name: "buyer-web",
    secret_key: "6b144e72ab9ee13de9cfbf78c1bd7ea6efdfd928af2c6f23838f4e66cea04b0a",
    environment: "live",
    region: "sg",
    logger: !1,
    app_version: "v1.0.0",
    sample: 1
};

const HEADER: any = {
    "Accept": "application/json, text/plain, */*",
    "x-foody-client-id": "",
    "x-foody-client-type": 1,
    "x-foody-app-type": 1004,
    "x-foody-client-version": "3.0.0",
    "x-foody-api-version": 1,
    "x-foody-client-language": "vi",
    "x-foody-access-token": "",
    "x-sap-ri": "ead84e678ee4c001e02ba733f19bee8bc830752fb4223537"
}

export async function login()
{
    var timestamp: any = new Date();
    timestamp = 1733215170500;
    var t = new jssha("SHA-256", "TEXT").update("" + CONFIG.app_name + CONFIG.secret_key + timestamp);
    var hex_key = t.getHash("HEX");

    var res = await fetch('https://dem.shopee.com/dem/janus/v1/app-auth/login', {
        method: 'POST',
        body: JSON.stringify({
            app_name: CONFIG.app_name,
            sign: hex_key,
            timestamp: timestamp
        })
    });
    var response = await res.json();
    return response;
}

export async function getMenu(id: number | string)
{
    var res = await fetch('https://gappapi.deliverynow.vn/api/dish/get_delivery_dishes?id_type=2&request_id=' + id, {
        method: 'GET',
        headers: HEADER
    });
    var response = await res.json();
    return response;
}

export async function getFromUrl(url: string)
{
    var url = 'https://gappapi.deliverynow.vn/api/delivery/get_from_url?url=' + url.split('shopeefood.vn/').slice(-1);
    var res = await fetch(url, {
        method: 'GET',
        headers: HEADER
    });
    var response = await res.json();
    return response;
}

export async function getDetail(id: number | string)
{
    var res = await fetch('https://gappapi.deliverynow.vn/api/delivery/get_detail?id_type=2&request_id=' + id, {
        method: 'GET',
        headers: HEADER
    });
    var response = await res.json();
    return response;
}