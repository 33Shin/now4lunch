import fs from 'fs';
import { getDetail, getFromUrl, getMenu } from "./api";

var shop_json = fs.readFileSync(process.cwd() + '/database/shop.dat', 'utf-8');
var LIST_SHOP_URL: string[] = JSON.parse(shop_json);

var SHOP_DATA: any[] = [];

export function getShopURL()
{
    return LIST_SHOP_URL;
}

export async function getAllShopDetail()
{
    if (SHOP_DATA.length > 0)
    {
        return SHOP_DATA;
    }
    for (let index = 0; index < LIST_SHOP_URL.length; index++)
    {
        const shopUrl = LIST_SHOP_URL[index];
        var id = '';
        var has_id_in_url = shopUrl.includes('now-food/shop/');
        if (has_id_in_url)
        {
            id = shopUrl.split('now-food/shop/')[1].split('?')[0];
        }
        else
        {
            var shop_id_response: any = {};
            while (!shop_id_response.reply)
            {
                shop_id_response = await getFromUrl(shopUrl);
            }
            id = shop_id_response.reply.delivery_id;
        }
        var detail_response: any = {};
        while (detail_response.reply == null)
        {
            detail_response = await getDetail(id)
        }
        var detail_data = detail_response.reply.delivery_detail
        if (detail_data.asap_is_available)
        {
            SHOP_DATA.push({
                id: detail_data.delivery_id,
                name: detail_data.name,
                url: detail_data.url,
                address: detail_data.address
            });
        }
    }
    return SHOP_DATA;
}

export function resetShopDetail()
{
    SHOP_DATA = [];
}

export async function setActiveShop(list_shop_data: any)
{
    resetShopDetail();
    LIST_SHOP_URL.length = 0;
    for (let index = 0; index < list_shop_data.length; index++)
    {
        const shopData = list_shop_data[index];
        if (shopData.isChecked)
        {
            LIST_SHOP_URL.push(shopData.url);
        }
    }
    var new_shop_json = list_shop_data.map((shop: any) => shop.url);

    var date = new Date();
    var currentTime = date.toISOString().split('T')[0] + '_' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
    fs.renameSync('database/shop.dat', 'database/shop.dat_' + currentTime);
    fs.writeFileSync('database/shop.dat', JSON.stringify(new_shop_json));
    await getAllShopDetail();
}

export async function getShopeeMenu(id: string | number)
{
    var menu: any = {};
    while (menu.reply == null)
    {
        menu = await getMenu(id);
    }
    return menu;
}

getAllShopDetail();