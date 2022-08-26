/* eslint-disable no-console */
import * as compose from 'docker-compose';
import * as path from 'path';
import { sleep } from './utils/sleep';

const options = {
    cwd: path.join(__dirname, '..'),
    log: true,
};

const appUpTimeout = 5;
enum ServiceNames {
    db = 'db',
    ui = 'judge_ui',
    admin = 'judge_administration',
    redis = 'redis',
}

const createDb = async () => {
    console.log(` --- Executing creation queries in \`${ServiceNames.db}\` ---`);
    await compose.exec(
        ServiceNames.db,
        '/bin/bash /queries/restore/create_db/create.sh',
        options,
    );

    console.log(` --- Creation queries executed in \`${ServiceNames.db}\` ---`);
};

const restoreData = async () => {
    console.log(` --- Executing restoration queries in \`${ServiceNames.db}\` ---`);
    await compose.exec(
        ServiceNames.db,
        '/bin/bash /queries/restore/restore_db/restore.sh',
        options,
    );

    console.log(` --- Restoration queries executed in \`${ServiceNames.db}\` ---`);
};

const runApp = async () => {
    console.log(` --- Uping \`${ServiceNames.ui}\` ---`);
    await compose.upOne(
        ServiceNames.ui,
        options,
    );

    console.log(` --- Waiting ${appUpTimeout} seconds for \`${ServiceNames.ui}\` to initialize ---`);
    await sleep(appUpTimeout, true);
    console.log(` --- \`${ServiceNames.ui}\` is up ---`);
};

const cleanData = async () => {
    console.log(` --- Cleaning data in \`${ServiceNames.db}\` ---`);
    try {
        await compose.exec(ServiceNames.db, '/bin/bash /queries/restore/drop_db/drop.sh', options);
    } catch (err) {
        console.log(err);
    } finally {
        console.log(' --- complete drop ---');
    }
};

const cleanupAppAndDb = async () => {
    console.log(` --- Droping \`${ServiceNames.db}\` ---`);
    await compose.rm(options, ServiceNames.db, ServiceNames.redis, ServiceNames.ui);
};

const prepareAppAndDb = async () => {
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

        console.log(` --- Waiting ${appUpTimeout} seconds for ${ServiceNames.db}\` to initialize ---`);
        await sleep(appUpTimeout, true);

        console.log(` --- \`${ServiceNames.db}\` and \`${ServiceNames.redis}\` are up ---`);

        await createDb();
        await restoreData(); // Needs a restore, so `app` can start
        await runApp();
        await cleanData();
    } catch (err) {
        console.log(err);
    } finally {
        console.log(' --- complete create ---');
    }
};

export {
    restoreData,
    prepareAppAndDb,
    cleanData,
    cleanupAppAndDb,
};
