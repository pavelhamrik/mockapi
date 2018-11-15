import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

function getJSON(path) {
    const files = fs.readdirSync(path);
    if (files.length !== 0) {
        const file = files[Math.round(Math.random() * (files.length - 1))];
        console.log(`serving ${file}`);
        return fs.readFileSync(`${path}/${file}`, {encoding: 'utf-8'});
    }
    return {};
}

app.use(cors());

app.get('/api/v1/assignments', cors(), (req, res) => {
    res.status(200).send(
        getJSON('./public/assignments')
    )
});

app.listen(PORT, () => console.log(`REST API listening on: ${PORT}`));
