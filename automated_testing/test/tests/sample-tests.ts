import { beforeEach } from 'mocha';
import { prepareAppAndDb, cleanData, restoreData, cleanupAppAndDb } from '../app';
import IndexPage from '../pageobjects/index-page';

describe('Testing index', () => {
    before(() => prepareAppAndDb());
    after(() => cleanupAppAndDb());

    beforeEach(() => restoreData());
    afterEach(() => cleanData());

    Array.from({ length: 5 })
        .forEach((_, index) => {
            describe(`Describe ${index + 1}`, () => {
                it(`Open browser ${index + 1}`, async () => {
                    await IndexPage.open();
                });
            });
        });
});
