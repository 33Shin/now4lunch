import { IDENTITY } from './identity';

var list_connection: any[] = [];
var list_message: any[] = [
    {
        type: 1,
        sender: 'Bot',
        message: 'Rủ bạn bè đặt chung để được giảm ship nha'
    }
];

export function initChatServer(app: any)
{
    app.ws('/ws', (socket: any, req: any) =>
    {
        var ip = req.socket.remoteAddress;
        var identity = IDENTITY.find(i => i.ip == ip);
        if (identity == null)
        {
            console.log("New connection from: " + ip);
        }
        else
        {
            console.log(identity.name + " is connected");
        }
        list_connection.push({
            socket: socket,
            ip: ip
        });
        socket.send(JSON.stringify({
            type: 0,
            list_message: getListMessage(list_message, ip)
        }));
        socket.on('message', (message: any) =>
        {
            var msg: any = {
                type: 1,
                sender: getSender(ip),
                message: message
            }
            postMessage(msg, socket);
            msg.ip = ip;
            list_message.push(msg);
        });
        socket.on('close', () =>
        {
            var socketIndex = list_connection.indexOf(socket);
            list_connection.splice(socketIndex, 1);
            if (identity == null)
            {
                console.log("New connection is lost: " + ip);
            }
            else
            {
                console.log(identity.name + " closed the connection");
            }
        })
    });
}

export function chat(msg: string)
{
    var msgData =
    {
        type: 1,
        sender: 'Bot',
        message: msg
    }
    list_message.push(msgData);
    postMessage(msgData);
}

export function notify(message: any, ip: string)
{
    list_connection.forEach(connection =>
    {
        if (connection.ip != ip)
        {
            connection.socket.send(JSON.stringify({
                type: 2,
                message: message
            }));
        }
    });
}

export function resetChat()
{
    list_message = [
        {
            type: 1,
            sender: 'Bot',
            message: 'Rủ bạn bè đặt chung để được giảm ship nha'
        }
    ];
}

function getSender(ip: string)
{
    var identity = IDENTITY.find(i => i.ip == ip);
    if (identity == null)
    {
        return "Ẩn danh";
    }
    return identity.name;
}

function getListMessage(list_message: any[], ip: any)
{
    var listMessage: any[] = [];
    list_message.forEach(msg =>
    {
        listMessage.push({
            type: msg.type,
            sender: msg.sender,
            message: msg.message,
            owned: msg.ip == ip
        });
    });
    return listMessage;
}

function postMessage(message: any, socket?: any)
{
    list_connection.forEach(connection =>
    {
        if (socket != connection.socket)
        {
            connection.socket.send(JSON.stringify(message));
        }
    });
}