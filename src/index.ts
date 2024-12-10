import express from 'express';
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

app.listen(80, ()=> {
    console.log("Listen http request on port 80");
});