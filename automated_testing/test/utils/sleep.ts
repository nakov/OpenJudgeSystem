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

export { sleep };