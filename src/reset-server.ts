import { UserCard } from "./cart";
import { resetChat } from "./chat-server";
import { resetShopDetail } from "./shopee";

export function resetServer(username: string, password: string)
{
    if (!validateRequest(username, password))
    {
        return false;
    }
    resetAllValue();
    return true;
}

function validateRequest(username: string, password: string)
{
    return username == 'secret_group' && password == 'floor_1';
}

function resetAllValue()
{
    UserCard.reset();
    resetShopDetail();
    resetChat();
}