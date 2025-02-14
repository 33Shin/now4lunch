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
    "Accept": "application/json; charset=utf-8",
    "x-foody-client-id": "",
    "x-foody-client-type": 1,
    "x-foody-app-type": 1004,
    "x-foody-client-version": "3.0.0",
    "x-foody-api-version": 1,
    "x-foody-client-language": "vi",
    "x-foody-access-token": "",
    "7db3f5c4": "G:6]!>-R`<DT.Mr(=uaI=]0?'",
    "b095d65c": "Q()!'X.pomG'aEXR8>WknsTek",
    "x-sap-ri": "c9e868672fa33062c491b8350e84fb3ac7d55e5743fd7f4a",
    "48245c16": "h;qTGbh8Fm;V@LHBT,6UB?G6-'/WL4EM&X@Z].Nqqo?>O4m!KI\"g3nP%SK,)YgcKq2$?l!`e&*e6^E+#n5sWWilAC=L=+\\4)<7?HPL9n1cDe*3i?\"]2\\&ks1[7(Pcg.GktI_HiQMD_Q)a*dU]r=HeZXmO_\"A:VPJeHL_7.R!d(/j!5NkmG9A%Q7pU<q49+NVju(kmG9A%Q7pU<q49+NVju("
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
    var url = 'https://gappapi.deliverynow.vn/api/dish/get_delivery_dishes?id_type=2&request_id=' + id;
    var res = await fetch(url, {
        method: 'GET',
        headers: HEADER
    });
    var response = await res.json();
    return response;
}

export async function getFromUrl(shopeeUrl: string)
{
    var url = 'https://gappapi.deliverynow.vn/api/delivery/get_from_url?url=' + shopeeUrl.split('shopeefood.vn/').slice(-1)[0];
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

getMenu(312556).then(res => console.log(res));