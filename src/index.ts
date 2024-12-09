import express from 'express';
import https from 'https';
import { Server } from 'ws';
import { initChatServer } from './chat-server';
import { LocalServer } from './local-server';

const app = express();
app.use(express.static('public'));
app.use(express.json());

var requestHandler = new LocalServer();

app.post('/*', (req, res) =>
{
    requestHandler.onConfirm(req, res);
});
app.get('/*', (req, res) =>
{
    requestHandler.onRequest(req, res);
});
app.options('/*', (req, res) =>
{
    requestHandler.onRequest(req, res);
});

const server: any = https.createServer(app);
const wss = new Server(server);
initChatServer(wss);

console.log("Listen http request on port 8181");
server.listen(80);