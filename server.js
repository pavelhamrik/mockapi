import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

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
        getJSON('./public/assignments', req.params.id)
    )
});

app.listen(PORT, () => console.log(`REST API listening on: ${PORT}`));
