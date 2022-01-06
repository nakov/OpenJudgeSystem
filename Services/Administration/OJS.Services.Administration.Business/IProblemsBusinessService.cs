namespace OJS.Services.Administration.Business
{
    using OJS.Services.Common.Models;
    using SoftUni.Services.Infrastructure;
    using System.Threading.Tasks;

    public interface IProblemsBusinessService : IService
    {
        Task RetestById(int id);

        Task DeleteById(int id);

        Task DeleteByContest(int contestId);

        Task<ServiceResult> CopyToContestByIdByContestAndProblemGroup(int id, int contestId, int? problemGroupId);
    }
}