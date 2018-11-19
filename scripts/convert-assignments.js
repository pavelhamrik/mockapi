import fs from 'fs';
import stringify from 'json-stringify-pretty-compact';

export default function convertAssignments(from, to) {
    const fileNames = fs.readdirSync(from);
    if (fileNames.length !== 0) {
        fileNames.forEach(fileName => {
            try {
                const contents = JSON.parse(fs.readFileSync(`${from}/${fileName}`, {encoding: 'utf-8'}));
                const problem = {};

                for (let collection of ['points', 'segments', 'lines']) {
                    if (typeof contents.problem[collection] !== 'undefined') {
                        problem[collection] = contents.problem[collection].map(elem => ({geometry: elem}))
                    }
                }

                const output = stringify(
                    Object.assign({}, contents, {problem: problem}),
                    {indent: 4, maxLength: 44, margins: false}
                );
                fs.writeFileSync(`${to}/${fileName}`, output, {encoding: 'utf-8'})
            } catch (err) {
                console.log(err);
                return {status: 'ERROR', error: err};
            }
        });
    }
    return {status: 'OK'};
}