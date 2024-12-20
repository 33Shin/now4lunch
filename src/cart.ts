import CryptoJS from 'crypto-js';
import fs from 'fs';
import { chat, notify } from './chat-server';
import { addIdentity, backupIdentity, IDENTITY } from './identity';

const KEY = "WeAreToys!";

class Cart 
{
    private cart: Map<string, any[]> = new Map();
    private currentTime: string = '';

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
        else if (identity.name == "Mem Lầu G")
        {
            identity.name = name;
            backupIdentity();
        }

        cartData.cart.forEach((cart: any) =>
        {
            cart.auth = encrypt_ip;
        });

        if (this.cart.has(name))
        {
            var currentMenu = this.cart.get(name) || [];
            while (cartData.cart.length > 0)
            {
                currentMenu.push(cartData.cart.shift())
            }
        }
        else
        {
            this.cart.set(name, cartData.cart);
        }

        this.log();
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
        var encrypt_ip = this.encryptIP(ip);
        var list_food = this.cart.get(cartData.username);
        if (list_food == null) return false;
        if (list_food && list_food[cartData.index].auth != encrypt_ip)
        {
            return false;
        }

        list_food.splice(cartData.index, 1);
        if (list_food.length == 0)
        {
            this.cart.delete(cartData.username);
        }
        return true;
    }

    reset()
    {
        this.cart.clear();
    }

    private log()
    {
        fs.mkdirSync('log', { recursive: true });
        fs.writeFileSync('log/cart.dat', JSON.stringify(Array.from(this.cart)));

        var date = new Date();
        this.currentTime = date.toISOString().split('T')[0] + '_' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
        fs.writeFileSync('log/cart_backup.' + this.currentTime, JSON.stringify(Array.from(this.cart)));
    }

    private loadLog()
    {
        if (fs.existsSync('log/cart.dat'))
        {
            var logContent = fs.readFileSync('log/cart.dat', 'utf-8');
            var log = JSON.parse(logContent);
            this.cart.clear();
            for (let index = 0; index < log.length; index++)
            {
                const cartData = log[index];
                this.cart.set(cartData[0], cartData[1]);
            }
        }
    }

    getCart(ip: string)
    {
        var encrypt_ip = this.encryptIP(ip);
        var list_cart: any[] = [];

        if (this.cart.size == 0)
        {
            this.loadLog();
        }

        this.cart.forEach((value: any[], key: String) =>
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

        var encrypt_ip = CryptoJS.AES.encrypt(ip, CryptoJS.enc.Utf8.parse(KEY), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
        return encrypt_ip;
    }
}

var UserCard = new Cart();
export { UserCard };

