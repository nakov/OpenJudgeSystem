namespace OJS.Services.Business.Contests
{
    using OJS.Services.Business.Contests.Models;
    using OJS.Services.Common;

    public interface IContestsImportService : IService
    {
        ContestImportResult ImportContest(int contestIdToImport, int categoryIdToImportTo, string ojsPlatformUrl, bool replace);
    }
}