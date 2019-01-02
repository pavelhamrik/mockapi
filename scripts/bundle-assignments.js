import fs from 'fs';
// import stringify from 'json-stringify-pretty-compact';

export default function bundleAssignments(from) {
    const fileNames = fs.readdirSync(from);
    if (fileNames.length !== 0) {
        try {
            const bundle = fileNames.map((fileName, index) => {
                const contents = JSON.parse(fs.readFileSync(`${from}/${fileName}`, {encoding: 'utf-8'}));
                return {
                    id: index,
                    name: contents.name || fileName.replace('.json', ''),
                    item: contents,
                    explanation: '',
                }
            });
            return {items: bundle};
        } catch (err) {
            console.log(err);
            return err;
        }
    }
}