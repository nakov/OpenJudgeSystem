const sleep = (seconds) => new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
});

describe('Testing index', () => {
    Array.from({ length: 15 })
        .forEach((_, index) => {
            describe(`Describe ${index + 1}`, () => {
                it(`Test of "Describe ${index + 1}"`, async () => {
                    await sleep(5000);
                    expect(5).toBe(5);
                });
            });
        });
});
