import fs from "fs";

export async function getLocalMenu(id: string | number)
{
    var menuData = fs.readFileSync('database/shopee-food/menu/' + id + '.dat', 'utf-8');
    return JSON.parse(menuData);
}

export async function getShopDetail()
{
    var shopDataContent: any = fs.readFileSync('database/shopee-food/shop.dat', 'utf-8');
    var shopData = JSON.parse(shopDataContent);
    var activeShop = shopData.filter((i: any) => i.disabled != true);
    return activeShop;
}

export async function setActiveShop(data: any)
{

}