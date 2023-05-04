export const registerContest =
    (contestId: number, isOfficial: boolean) => ({
        id: contestId,
        isOfficial,
    });

export default { registerContest };
