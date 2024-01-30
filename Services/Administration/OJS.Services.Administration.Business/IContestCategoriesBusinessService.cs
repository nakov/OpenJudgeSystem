namespace OJS.Services.Administration.Business;

using System.Linq;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Data.Pagination;
using SoftUni.Services.Infrastructure;

public interface IContestCategoriesBusinessService : IGridDataService<ContestCategory>, IService
{
    IQueryable<ContestCategory> GetAllVisible();
}