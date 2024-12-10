import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { getMenu } from "./api";
import { UserCard } from "./cart";
import { createMenu } from "./create-menu";
import { resetServer } from "./reset-server";
import { getAllShopDetail } from "./shopee";

export class LocalServer
{
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
            var cart = UserCard.getCart(req.ip || '');

            var resData = JSON.stringify(cart);
            res.send(resData);
        }
        if (req.url.includes('reset'))
        {
            if (req.url.includes('username=') && req.url.includes('password='))
            {
                var username = req.url.split('username=')[1].split('&')[0];
                var password = req.url.split('password=')[1].split('&')[0];
                var result = resetServer(username, password);
                if (result)
                {
                    res.send("Successfully Reset All Server Data");
                }
                else
                {
                    res.send("Failed to reset");
                }
            }
            else
            {
                res.send("Failed to reset. Check username and password.");
            }
        }
    }

    onConfirm(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>)
    {
        if (req.url.includes('confirm'))
        {
            UserCard.add(req.body, req.ip || '');
            res.send(JSON.stringify({ result: 'success' }));
        }
        if (req.url.includes('remove'))
        {
            var canDelete = UserCard.remove(req.body, req.ip || '');
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