export interface Photo 
{
    width: number;
    value: string;
    height: number;
}

export interface Dish
{
    name: string;
    price: number;
    list_photo: Photo[];
}

export interface Menu 
{
    name: string;
    dish: Dish[];
}