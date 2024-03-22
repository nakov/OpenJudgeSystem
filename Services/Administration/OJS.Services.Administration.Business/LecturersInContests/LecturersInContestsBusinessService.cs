namespace OJS.Services.Administration.Business.LecturersInContests;

using Microsoft.EntityFrameworkCore;
using OJS.Data;
using OJS.Data.Models;
using OJS.Services.Administration.Models.LecturerInContests;
using System.Threading.Tasks;

public class LecturersInContestsBusinessService : ILecturersInContestsBusinessService
{
    private readonly OjsDbContext db;

    public LecturersInContestsBusinessService(OjsDbContext db)
        => this.db = db;

    public async Task<LecturerToContestModel> AddLecturerToContest(LecturerToContestModel model)
    {
            await this.db.LecturersInContests.AddAsync(new LecturerInContest()
            {
                ContestId = model.ContestId!, LecturerId = model.LecturerId!,
            });

            await this.db.SaveChangesAsync();

            return model;
    }

    public async Task RemoveLecturerFromContest(LecturerToContestModel model)
    {
        var lecturerInContest =
            await this.db.LecturersInContests.FirstOrDefaultAsync(x =>
                x.LecturerId == model.LecturerId && x.ContestId == model.ContestId);
        if (lecturerInContest == null)
        {
            return;
        }

        this.db.LecturersInContests.Remove(lecturerInContest);

        await this.db.SaveChangesAsync();
    }
}