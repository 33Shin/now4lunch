import { Menu } from "./menu.i";

export function createMenu(data: any)
{
    var list_menu: Menu[] = [];
    for (let index = 0; index < data.reply.menu_infos.length; index++)
    {
        const menu = data.reply.menu_infos[index];
        var list_dish = menu.dishes.map((i: any) =>
        {
            return {
                name: i.name,
                price: i.price.value,
                list_photo: i.photos,
                available: i.is_available,
                list_option: i.options.map((o: any) =>
                {
                    return {
                        name: o.name,
                        mandatory: o.mandatory,
                        max_select: o.option_items.max_select,
                        list_item: o.option_items.items.map((item: any) => {
                            return {
                                name: item.name,
                                price: item.price.value,
                                is_default: item.is_default,
                            };
                        }),
                    };
                }),
            };
        });

        list_menu.push({
            name: menu.dish_type_name,
            dish: list_dish
        });
    }
    return list_menu;
}