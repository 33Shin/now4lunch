import { UserCard } from "./cart";
import { getDiscount } from "./discount";

export function getPayment(ip: string)
{
    var cart = UserCard.getCart(ip);
    var payment: any[] = [];
    cart.forEach(bill =>
    {
        var name = bill.username;
        var list_food = bill.cart;
        var totalPrice = 0;
        list_food.forEach((food: any) =>
        {
            totalPrice += food.price;
            (food.topping || []).forEach((extra: any) => totalPrice += extra.price);

            var discount = getDiscountValue(food.seller);
            totalPrice *= (1 - discount);
        });
        var owned = list_food[0].owned;

        payment.push({
            name: name,
            price: totalPrice,
            owned: owned
        });
    });
    return payment;
}

function getDiscountValue(seller: string)
{
    var discount = getDiscount();
    for (let index = 0; index < discount.length; index++)
    {
        const discountData = discount[index];
        if (discountData.seller == seller)
        {
            return discountData.discount;
        }
    }
    return 1;
}