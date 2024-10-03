namespace OJS.Services.Administration.Business.LecturersInContests;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models;
using OJS.Services.Administration.Models.LecturerInContests;
using OJS.Services.Common.Data;
using System.Threading.Tasks;

public class LecturersInContestsBusinessService : ILecturersInContestsBusinessService
{
    private readonly IDataService<LecturerInContest> lecturerInContestsDataService;

    public LecturersInContestsBusinessService(IDataService<LecturerInContest> lecturerInContestsDataService)
        => this.lecturerInContestsDataService = lecturerInContestsDataService;

    public async Task<LecturerToContestModel> AddLecturerToContest(LecturerToContestModel model)
    {
        await this.lecturerInContestsDataService.Add(new LecturerInContest
        {
            ContestId = model.ContestId!,
            LecturerId = model.LecturerId!,
        });

        await this.lecturerInContestsDataService.SaveChanges();

        return model;
    }

    public async Task RemoveLecturerFromContest(LecturerToContestModel model)
    {
        var lecturerInContest =
             await this.lecturerInContestsDataService.GetQuery(x =>
                x.LecturerId == model.LecturerId && x.ContestId == model.ContestId)
                 .FirstOrDefaultAsync();

        if (lecturerInContest == null)
        {
            return;
        }

        this.lecturerInContestsDataService.Delete(lecturerInContest);

        await this.lecturerInContestsDataService.SaveChanges();
    }
}