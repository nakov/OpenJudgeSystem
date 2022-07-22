/* eslint-disable no-console */
import * as compose from 'docker-compose';
import * as path from 'path';

const options = {
    cwd: path.join(__dirname, '..'),
    log: true,
};

// const dbAndApp = [ 'db', 'app' ];
const dbAndApp = ['db'];

const sleep = (seconds: number) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(null);
    }, seconds * 1000);
});

const createDb = async () => {
    try {
        console.log(' --- Building `app` and `db` ---');

        await compose.buildMany(
            dbAndApp,
            options,
        );

        console.log(' --- "Up"-ing `app` and `db` ---');

        await compose.upMany(
            dbAndApp,
            options,
        );

        console.log(' --- Waiting 10 seconds for MS SQL to start ---');

        await sleep(10);

        console.log(' --- `db` and `app` are up ---');

        await compose.exec(
            'db',
            '/bin/bash /queries/restore/create_db/create.sh',
            options,
        );

        console.log(' --- queries restored ---');
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
        await compose.exec('db', '/bin/bash /queries/restore/restore.sh');
    } catch (err) {
        console.log(err);
    } finally {
        console.log(' --- complete restore ---');
    }
};

const dropDb = async () => {
    console.log(' --- drop ---');
    try {
        await compose.exec('db', '/bin/bash /queries/restore/drop_db/drop.sh', options);
        await compose.down(options);
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
