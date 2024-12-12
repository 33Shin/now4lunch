import fs from 'fs';

var discountData: any[] = [];
if (fs.existsSync('log/discount.dat'))
{
    discountData = JSON.parse(fs.readFileSync('log/discount.dat', 'utf-8'));
}

export function setDiscount(data: any)
{
    discountData = data;
    fs.mkdirSync('log', { recursive: true });
    fs.writeFileSync('log/discount.dat', JSON.stringify(data));
}

export function getDiscount()
{
    return discountData;
}