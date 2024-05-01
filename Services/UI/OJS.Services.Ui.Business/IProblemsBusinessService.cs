namespace OJS.Services.Ui.Business
{
    using System.Threading.Tasks;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Participants;
    using OJS.Services.Common.Models;
    using OJS.Services.Ui.Models.Search;
    using OJS.Services.Infrastructure;

    public interface IProblemsBusinessService : IService
    {
        Task DeleteById(int id);

        Task DeleteByContest(int contestId);

        Task<ProblemSearchServiceResultModel> GetSearchProblemsByName(SearchServiceModel model);
    }
}