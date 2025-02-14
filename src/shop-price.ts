import fs from 'fs';

export function setShopPrice(data: any)
{
    var date = new Date();
    var currentDate = date.toISOString().split('T')[0];
    fs.mkdirSync(`log/${currentDate}/shop-price/`, { recursive: true });
    fs.writeFileSync(`log/${currentDate}/shop-price/shop-price.dat`, JSON.stringify(data));
}

export function getShopPrice(date?: string | undefined)
{
    if (date == null)
    {
        date = new Date().toISOString().split('T')[0];
    }
    if (fs.existsSync(`log/${date}/shop-price/shop-price.dat`))
    {
        return JSON.parse(fs.readFileSync(`log/${date}/shop-price/shop-price.dat`, 'utf-8'));;
    }
    return [];
}