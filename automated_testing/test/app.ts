/* eslint-disable no-console */
import * as compose from 'docker-compose';
import * as path from 'path';

const sleep = (seconds: number) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(null);
    }, seconds * 1000);
});

const setupDb = async () => {
    try {
        await compose.upMany([ 'db', 'ui' ], {
            cwd: path.join(__dirname, '..'),
            log: false,
        });

        console.log(' --- up ---');
        await sleep(10);

        console.log(' --- running restore ---');
        await compose.exec('db', '/bin/bash /queries/restore/restore.sh');
    } catch (err) {
        console.log(' --- complete restore ---');
        console.log(err);
    }
};

const dropDb = async () => {
    console.log(' --- down ---');
    await compose.down();
};

export {
    setupDb,
    dropDb,
};
