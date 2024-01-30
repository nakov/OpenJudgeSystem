namespace OJS.Services.Administration.Business.Implementations;

using System.Linq;
using OJS.Services.Administration.Data;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Data.Pagination;

public class ContestCategoriesBusinessService : GridDataService<ContestCategory>, IContestCategoriesBusinessService
{
    private readonly IContestCategoriesDataService categoriesDataService;

    public ContestCategoriesBusinessService(IContestCategoriesDataService categoriesDataService)
        : base(categoriesDataService) =>
        this.categoriesDataService = categoriesDataService;

    public IQueryable<ContestCategory> GetAllVisible() => this.categoriesDataService.GetAllVisible();
}