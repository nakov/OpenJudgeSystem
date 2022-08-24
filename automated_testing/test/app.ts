/* eslint-disable no-console */
import * as compose from 'docker-compose';
import * as path from 'path';

const options = {
    cwd: path.join(__dirname, '..'),
    log: true,
};

const sleep = (seconds: number, withTimer = false) => new Promise((resolve) => {
    const sleepInternal = (currentLoop: number, loopSize: number, timeout: number) => {
        console.log(` --- Sleeping ${currentLoop + 1}`);

        if (currentLoop >= loopSize) {
            return resolve(null);
        }

        return setTimeout(() => sleepInternal(currentLoop + 1, loopSize, timeout), timeout);
    };

    return sleepInternal(
        0,
        withTimer
            ? seconds
            : 1,
        withTimer
            ? 1000
            : seconds * 1000,
    );
});

const appUpTimeout = 5;
enum ServiceNames {
    db= 'db',
    ui= 'judge_ui',
    admin= 'judge_administration',
    redis= 'redis',
}

const createDb = async () => {
    try {
        console.log(` --- Building \`${ServiceNames.db}\` ---`);
        await compose.buildOne(
            ServiceNames.db,
            options,
        );

        console.log(` --- Uping \`${ServiceNames.db}\` and \`${ServiceNames.redis}\` ---`);
        await compose.upMany(
            [ ServiceNames.db, ServiceNames.redis ],
            options,
        );

        // console.log(` --- Waiting ${appUpTimeout} seconds for
        // \`${ServiceNames.db}\` to initialize ---`);
        // await sleep(appUpTimeout, true);

        console.log(` --- \`${ServiceNames.db}\` and \`${ServiceNames.redis}\` are up ---`);

        console.log(` --- Restoring queries in \`${ServiceNames.db}\` ---`);
        await compose.exec(
            ServiceNames.db,
            '/bin/bash /queries/restore/create_db/create.sh',
            options,
        );

        console.log(` --- Queries restored in \`${ServiceNames.db}\` ---`);

        console.log(` --- Uping \`${ServiceNames.ui}\` ---`);
        await compose.upOne(
            ServiceNames.ui,
            options,
        );

        console.log(` --- Waiting ${appUpTimeout} seconds for \`${ServiceNames.ui}\` to initialize ---`);
        await sleep(appUpTimeout, true);
        console.log(` --- \`${ServiceNames.ui}\` is up ---`);
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
        await compose.exec(ServiceNames.db, '/bin/bash /queries/restore/restore.sh');
    } catch (err) {
        console.log(err);
    } finally {
        console.log(' --- complete restore ---');
    }
};

const dropDb = async () => {
    console.log(' --- drop ---');
    try {
        await compose.exec(ServiceNames.db, '/bin/bash /queries/restore/drop_db/drop.sh', options);
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
