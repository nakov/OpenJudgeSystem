function convertToContestUrlName(contestName) {
    return contestName
        .replace('C#', 'CSharp')
        .replace('C++', 'CPlusPlus')
        .replace(/\s+/g, '-')
        .replace(/-{2,}/g, '-');
}