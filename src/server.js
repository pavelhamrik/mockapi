import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

function getJSON(path) {
    const files = fs.readdirSync(path);
    return files.length !== 0
        ? fs.readFileSync(`${path}/${files[Math.round(Math.random() * files.length)]}`, {encoding: 'utf-8'})
        : {}
}

app.use(cors());

app.get('/api/v1/assignments', cors(), (req, res) => {
    res.status(200).send(
        getJSON('./src/assignments')
    )
});

app.listen(PORT, () => console.log(`REST API listening on: ${PORT}`));
