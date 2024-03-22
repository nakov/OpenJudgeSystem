namespace OJS.Services.Administration.Business.LecturersInCategories;

using Microsoft.EntityFrameworkCore;
using OJS.Data;
using OJS.Data.Models;
using OJS.Services.Administration.Models.LecturerInCategories;
using System.Threading.Tasks;

public class LecturerInCategoriesBusinessService : ILecturersInCategoriesBusinessService
{
    private readonly OjsDbContext db;

    public LecturerInCategoriesBusinessService(OjsDbContext db)
        => this.db = db;

    public async Task<LecturerToCategoryModel> AddLecturerToCategory(LecturerToCategoryModel model)
    {
        await this.db.LecturersInContestCategories.AddAsync(new LecturerInContestCategory()
        {
            ContestCategoryId = model.CategoryId!, LecturerId = model.LecturerId!,
        });

        await this.db.SaveChangesAsync();

        return model;
    }

    public async Task RemoveLecturerFromCategory(LecturerToCategoryModel model)
    {
        var lecturerInContestCategory =
            await this.db.LecturersInContestCategories.FirstOrDefaultAsync(x =>
                x.LecturerId == model.LecturerId && x.ContestCategoryId == model.CategoryId);
        if (lecturerInContestCategory == null)
        {
            return;
        }

        this.db.LecturersInContestCategories.Remove(lecturerInContestCategory);

        await this.db.SaveChangesAsync();
    }
}