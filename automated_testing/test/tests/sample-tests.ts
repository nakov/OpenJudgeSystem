import { beforeEach } from 'mocha';
import { createDb, dropDb } from '../app';

const sleep = (seconds: number) => new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
});

describe('Testing index', () => {
    beforeEach(() => createDb());
    afterEach(() => dropDb());

    Array.from({ length: 15 })
        .forEach((_, index) => {
            describe(`Describe ${index + 1}`, () => {
                it(`Test of "Describe ${index + 1}"`, async () => {
                    await sleep(1);
                    expect(5).toBe(5);
                });
            });
        });
});
