import express from 'express';
import { initChatServer } from './chat-server';
import { Server } from './server';

const app = express();
app.use(express.static('public'));
app.use(express.json());

initChatServer();
var server = new Server();

app.post('/*', (req, res) =>
{
    server.onConfirm(req, res);
});
app.get('/*', (req, res) =>
{
    server.onRequest(req, res);
});
app.options('/*', (req, res) =>
{
    server.onRequest(req, res);
});

console.log("Listen http request on port 8181");
app.listen(8181);