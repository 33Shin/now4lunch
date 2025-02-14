import fs from 'fs';
import { chat, notify } from './chat-server';
import { addIdentity, backupIdentity, IDENTITY } from './identity';

class Cart 
{
    private currentTime: string = '';
    private currentDate: string = '';

    add(cartData: any, ip: string)
    {
        notify(cartData, ip);
        this.sendToChat(cartData);

        var encrypt_ip = this.encryptIP(ip);
        var name = cartData.username;

        var identity = IDENTITY.find(i => i.ip == encrypt_ip);
        if (identity == null)
        {
            addIdentity(encrypt_ip, name);
            backupIdentity();
        }

        cartData.cart.forEach((cart: any) =>
        {
            cart.auth = encrypt_ip;
        });

        var cart = this.loadLog();
        if (cart.has(name))
        {
            var currentMenu = cart.get(name) || [];
            while (cartData.cart.length > 0)
            {
                currentMenu.push(cartData.cart.shift())
            }
        }
        else
        {
            cart.set(name, cartData.cart);
        }

        this.log(cart);
    }

    private sendToChat(cartData: any)
    {
        var list_seller: string[] = [];
        for (let index = 0; index < cartData.cart.length; index++)
        {
            const cart = cartData.cart[index];
            if (list_seller.includes(cart.seller) == false)
            {
                list_seller.push(cart.seller);
            }

        }
        chat(`<i>${cartData.username}</i> đã đặt món tại <b>${list_seller.join(', ')}</b>`);
    }

    remove(cartData: any, ip: string)
    {
        var cart = this.loadLog();
        var encrypt_ip = this.encryptIP(ip);
        var identity = IDENTITY.find(i => i.ip == encrypt_ip);
        var list_food = cart.get(cartData.username);
        if (list_food == null || identity == null)
        {
            return false
        }
        if (list_food && list_food[cartData.index].auth != encrypt_ip && identity.name != 'Admin')
        {
            return false;
        }

        list_food.splice(cartData.index, 1);
        if (list_food.length == 0)
        {
            cart.delete(cartData.username);
        }
        this.log(cart);
        return true;
    }

    reset()
    {
    }

    private log(cart: any)
    {
        var date = new Date();
        this.currentDate = date.toISOString().split('T')[0];

        fs.mkdirSync(`log/${this.currentDate}/cart/`, { recursive: true });
        fs.writeFileSync(`log/${this.currentDate}/cart/cart.dat`, JSON.stringify(Array.from(cart)));

        this.currentTime = date.toISOString().split('T')[0] + '_' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
        fs.writeFileSync(`log/${this.currentDate}/cart/cart.` + this.currentTime, JSON.stringify(Array.from(cart)));
    }

    private loadLog(date?: string | undefined)
    {
        if (date == null)
        {
            date = new Date().toISOString().split('T')[0]
        }
        var cart = new Map();
        if (fs.existsSync(`log/${date}/cart/cart.dat`))
        {
            var logContent = fs.readFileSync(`log/${date}/cart/cart.dat`, 'utf-8');
            var log = JSON.parse(logContent);
            for (let index = 0; index < log.length; index++)
            {
                const cartData = log[index];
                cart.set(cartData[0], cartData[1]);
            }
        }
        return cart;
    }

    getCart(ip: string, date?: string | undefined)
    {
        var encrypt_ip = this.encryptIP(ip);
        var list_cart: any[] = [];

        var cart = this.loadLog(date);

        cart.forEach((value: any[], key: String) =>
        {
            var cart_data = value.map(i =>
            {
                return {
                    name: i.name,
                    price: i.price,
                    seller: i.seller,
                    image: i.image,
                    topping: i.list_topping,
                    owned: i.auth == encrypt_ip || encrypt_ip == '::1',
                    note: i.note
                }
            });
            list_cart.push({
                username: key,
                cart: cart_data
            });
        });
        list_cart.sort((a: any, b: any) => { return a.cart[0].seller.localeCompare(b.cart[0].seller) })
        return list_cart;
    }

    private encryptIP(ip: string)
    {
        return ip;
    }
}

var UserCard = new Cart();
export { UserCard };

