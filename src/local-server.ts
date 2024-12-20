import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { UserCard } from "./cart";
import { createMenu } from "./create-menu";
import { setDiscount } from "./discount";
import { getBackupLog, getBackupLogData, getBackupShop, getBackupShopData } from "./get-backup-file";
import { IDENTITY, setIdentity } from "./identity";
import { getPayment } from "./payment";
import { resetServer } from "./reset-server";
import { getAllShopDetail, getShopeeMenu, getShopURL, setActiveShop } from "./shopee";

export class LocalServer
{
    onRequest(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>)
    {
        if (req.url.includes('get_name'))
        {
            var identity = IDENTITY.find(i => i.ip == req.ip);
            if (identity == null || identity.name == 'Mem Lầu G')
            {
                res.send('');
            }
            else
            {
                res.send(identity.name);
            }
        }
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
            getShopeeMenu(seller_id).then((food_data) =>
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
        if (req.url.includes('get_shop'))
        {
            var list_shop = getShopURL();
            res.send(JSON.stringify(list_shop));
        }
        if (req.url.includes('database'))
        {
            var file = req.url.split('/').slice(-1)[0];
            if (file != 'database' && file != '')
            {
                res.send(JSON.stringify(getBackupShopData(file)));
            }
            else
            {
                res.send(JSON.stringify(getBackupShop()));
            }
        }
        if (req.url.includes('log'))
        {
            var file = req.url.split('/').slice(-1)[0];
            if (file != 'log' && file != '')
            {
                res.send(JSON.stringify(getBackupLogData(file)));
            }
            else
            {
                res.send(JSON.stringify(getBackupLog()));
            }
        }
        if (req.url.includes('get_payment'))
        {
            var payment = getPayment(req.ip || '');
            res.send(JSON.stringify(payment));
        }
        if (req.url.includes('get_identity'))
        {
            res.send(JSON.stringify(IDENTITY));
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
        if (req.url.includes('set_shop'))
        {
            setActiveShop(req.body).then(() =>
            {
                res.send(JSON.stringify({ result: 'success' }));
            });
        }
        if (req.url.includes('set_discount'))
        {
            setDiscount(req.body);
            res.send(JSON.stringify({ result: 'success' }));
        }
        if (req.url.includes('set_identity'))
        {
            setIdentity(req.body);
            res.send(JSON.stringify({ result: 'success' }));
        }
    }

    private getQueryString(url: string, name: string)
    {
        return url.split(name + '=')[1].split('&')[0];
    }
}