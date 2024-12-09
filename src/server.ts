import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { getMenu } from "./api";
import { Cart } from "./cart";
import { createMenu } from "./create-menu";
import { getAllShopDetail } from "./shopee";

export class Server
{
    private cart: Cart = new Cart();

    onRequest(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>)
    {
        if (req.url.includes('get_seller'))
        {
            getAllShopDetail().then(shopData =>
            {
                res.send(JSON.stringify(shopData));
            });
        }
        if (req.url.includes('get_menu'))
        {
            var seller_id = Number.parseInt(this.getQueryString(req.url, 'seller_id'));
            getMenu(seller_id).then((food_data) =>
            {
                var food = createMenu(food_data);
                res.send(JSON.stringify(food));
            });
        }
        if (req.url.includes('get_cart'))
        {
            var cart = this.cart.getCart(req.ip || '');

            var resData = JSON.stringify(cart);
            res.send(resData);
        }
    }

    onConfirm(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>)
    {
        if (req.url.includes('confirm'))
        {
            this.cart.add(req.body, req.ip || '');
            res.send(JSON.stringify({ result: 'success' }));
        }
        if (req.url.includes('remove'))
        {
            var canDelete = this.cart.remove(req.body, req.ip || '');
            if (canDelete)
            {
                res.send(JSON.stringify({ result: 'success' }));
            }
            else
            {
                res.send(JSON.stringify({ result: 'failed' }));
            }
        }
    }

    private getQueryString(url: string, name: string)
    {
        return url.split(name + '=')[1].split('&')[0];
    }
}