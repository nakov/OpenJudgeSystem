const wait = (seconds: number): Promise<void> => new Promise<void>((resolve) => {
    setTimeout(resolve, seconds * 1000);
});

export default wait;
