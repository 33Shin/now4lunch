import { UserCard } from "./cart";
import { IDENTITY } from "./identity";
import { getPaidData } from "./paid";
import { getShopPrice } from "./shop-price";

export function getPayment(ip: string, date?: string | undefined)
{
    var paidData = getPaidData(date);
    var cart = UserCard.getCart(ip, date);
    var list_seller = getListOfSeller(cart);
    var list_discount = new Map();
    list_seller.forEach(seller =>
    {
        list_discount.set(seller, getTotalShopPrice(cart, seller, date));
    });

    var payment: any[] = [];
    cart.forEach((bill: any) =>
    {
        var totalFoodPrice = 0;
        var isPaid = false;
        bill.cart.forEach((food: any) =>
        {
            var foodPrice = food.price;
            (food.topping || []).forEach((item: any) => foodPrice += item.price);
            var discount = list_discount.get(food.seller) || 0;
            totalFoodPrice += foodPrice * discount;
            isPaid = paidData.includes(food.ip);
        });

        payment.push({
            name: bill.username,
            price: totalFoodPrice,
            owned: IDENTITY.find(i => i.ip == ip)?.name == bill.username,
            paid: isPaid
        });
    });

    return payment;
}

function getListOfSeller(cart: any[])
{
    var list_seller: any[] = [];
    cart.forEach((bill: any) =>
    {
        bill.cart.forEach((food: any) =>
        {
            if (list_seller.indexOf(food.seller) == -1)
            {
                list_seller.push(food.seller);
            }
        });
    });
    return list_seller;
}

function getTotalShopPrice(cart: any[], seller: string, date?: string | undefined)
{
    var totalPrice = getTotalPriceBySeller(cart, seller);
    var shopPrice = getShopPriceBySeller(seller, date);
    return shopPrice / totalPrice;
}

function getTotalPriceBySeller(cart: any[], seller: string)
{
    var total = 0;
    cart.forEach((bill: any) =>
    {
        bill.cart.forEach((food: any) =>
        {
            if (food.seller == seller)
            {
                total += food.price;
                (food.topping || []).forEach((extra: any) => total += extra.price);
            }
        });
    });
    return total;
}

function getShopPriceBySeller(seller: string, date?: string | undefined)
{
    var shopPrice = getShopPrice(date);
    for (let index = 0; index < shopPrice.length; index++)
    {
        const priceData = shopPrice[index];
        if (priceData.seller == seller)
        {
            return priceData.price;
        }
    }
    return 1;
}