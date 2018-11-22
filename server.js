import express from 'express';
import fs from 'fs';
import cors from 'cors';
import http from 'http';
import convertAssignments from './scripts/convert-assignments';
import bundleAssignments from './scripts/bundle-assignments';

const app = express();
const PORT = process.env.PORT || 3443;

function getJSON(path, id) {
    const fileNames = fs.readdirSync(path);
    if (fileNames.length !== 0) {
        const fileName = typeof id !== 'undefined'
            ? `${id}.json`
            : fileNames[Math.round(Math.random() * (fileNames.length - 1))];
        console.log(`serving ${fileName}`);

        try {
            return fs.readFileSync(`${path}/${fileName}`, {encoding: 'utf-8'});
        } catch (err) {
            return err
        }
    }
    return {};
}

app.use(cors());

app.get('/api/v1/assignments/:id?', cors(), (req, res) => {
    res.status(200).send(
        getJSON('./public/assignments/v1', req.params.id)
    )
});

app.get('/api/v2/assignments/:id?', cors(), (req, res) => {
    res.status(200).send(
        getJSON('./public/assignments/v2', req.params.id)
    )
});

app.get('/api/v2/bundle-assignments/', cors(), (req, res) => {
    res.status(200).send(
        bundleAssignments('./public/assignments/v2')
    )
});

app.get('/api/timeout/', cors(), (req, res) => {
    setTimeout(() => {res.status(200).send({})}, 3600000);
});

app.get('/api/v2/convert-assignments/', cors(), (req, res) => {
    const conversion = convertAssignments('./public/assignments/v1', './public/assignments/v2');
    if (conversion.status === 'OK') {
        res.status(200).send({"status": "OK"})
    }
    else {res.status(500).send({"status": JSON.stringify(conversion.error, null, 2)})}
});

const server = http.createServer(app);

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log('Address in use, retrying…');
        setTimeout(() => {
            server.close();
            server.listen(PORT);
        }, 2000);
    }
});

server.on('listening', () => {
    console.log(`REST API listening on: ${PORT}`);
});

server.listen(PORT);

process.on('uncaughtException', function (err) {
    console.log('Closing server upon uncaught exception:\n', err);
    server.close();
});

process.on('SIGTERM', function () {
    console.log('Closing server upon SIGTERM');
    server.close();
});