namespace OJS.Services.Administration.Business.LecturersInContests;

using OJS.Services.Administration.Models.LecturerInContests;
using OJS.Services.Infrastructure;
using System.Threading.Tasks;

public interface ILecturersInContestsBusinessService : IService
{
    Task<LecturerToContestModel> AddLecturerToContest(LecturerToContestModel model);

    Task RemoveLecturerFromContest(LecturerToContestModel model);
}