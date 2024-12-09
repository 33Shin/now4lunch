import fs from 'fs';
import { getDetail, getFromUrl } from "./api";

var shop_json = fs.readFileSync('database/shop.json', 'utf-8');
var LIST_SHOP_URL = JSON.parse(shop_json);

var SHOP_DATA: any[] = [];

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
            var shop_id_response = await getFromUrl(shopUrl);
            id = shop_id_response.reply.delivery_id;
        }
        var detail_response = await getDetail(id);
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

getAllShopDetail();