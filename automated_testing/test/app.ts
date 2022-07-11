/* eslint-disable no-console */
import * as compose from 'docker-compose';
import * as path from 'path';

const sleep = (seconds: number) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(null);
    }, seconds * 1000);
});

const createDb = async () => {
    console.log(' --- create ---');
    try {
        await compose.exec('db_instance', '/bin/bash /queries/restore/create_db/create.sh');
    } catch (err) {
        console.log(err);
    } finally {
        console.log(' --- complete create ---');
    }
};

const setupDb = async () => {
    try {
        // await compose.upMany([ 'db_instance', 'ui' ], {
        //     cwd: path.join(__dirname, '..'),
        //     log: false,
        // });

        console.log(' --- up ---');
        await sleep(10);

        console.log(' --- running restore ---');
        await compose.exec('db_instance', '/bin/bash /queries/restore/restore.sh');
    } catch (err) {
        console.log(err);
    } finally {
        console.log(' --- complete restore ---');
    }
};

const dropDb = async () => {
    console.log(' --- drop ---');
    try {
        await compose.exec('db_instance', '/bin/bash /queries/restore/drop_db/drop.sh');
        await compose.down();
    } catch (err) {
        console.log(err);
    } finally {
        console.log(' --- complete drop ---');
    }
};

export {
    setupDb,
    createDb,
    dropDb,
};
