namespace OJS.Services.Administration.Business.LecturersInCategories;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models;
using OJS.Services.Administration.Models.LecturerInCategories;
using OJS.Services.Common.Data;
using System.Threading.Tasks;

public class LecturerInCategoriesBusinessService : ILecturersInCategoriesBusinessService
{
    private readonly IDataService<LecturerInContestCategory> lecturerInContestCategoryService;

    public LecturerInCategoriesBusinessService(IDataService<LecturerInContestCategory> lecturerInContestCategoryService)
        => this.lecturerInContestCategoryService = lecturerInContestCategoryService;

    public async Task<LecturerToCategoryModel> AddLecturerToCategory(LecturerToCategoryModel model)
    {
        await this.lecturerInContestCategoryService.Add(new LecturerInContestCategory
        {
            ContestCategoryId = model.CategoryId!, LecturerId = model.LecturerId!,
        });

        await this.lecturerInContestCategoryService.SaveChanges();

        return model;
    }

    public async Task RemoveLecturerFromCategory(LecturerToCategoryModel model)
    {
        var lecturerInContestCategory =
            await this.lecturerInContestCategoryService.GetQuery(x =>
                x.LecturerId == model.LecturerId && x.ContestCategoryId == model.CategoryId)
                .FirstOrDefaultAsync();
        if (lecturerInContestCategory == null)
        {
            return;
        }

        this.lecturerInContestCategoryService.Delete(lecturerInContestCategory);

        await this.lecturerInContestCategoryService.SaveChanges();
    }
}