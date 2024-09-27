namespace OJS.Services.Business.Contests
{
    using OJS.Data.Models;
    using OJS.Services.Business.Contests.Models;
    using OJS.Services.Common;

    public interface IContestsImportService : IService
    {
        ContestImportResult ImportContest(Contest contest, int categoryIdToImportTo, bool replace);
    }
}