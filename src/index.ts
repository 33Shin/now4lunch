import express from 'express';
import expressWs from 'express-ws';
import { initChatServer } from './chat-server';
import { LocalServer } from './local-server';

const app: any = express();
expressWs(app);
app.use(express.static('public'));
app.use(express.json());

initChatServer(app);

var requestHandler = new LocalServer();

app.post('/*', (req: any, res: any) =>
{
    requestHandler.onConfirm(req, res);
});
app.get('/*', (req: any, res: any) =>
{
    requestHandler.onRequest(req, res);
});
app.options('/*', (req: any, res: any) =>
{
    requestHandler.onRequest(req, res);
});

app.listen(80, () =>
{
    console.log("Listen http request on port 80");
});