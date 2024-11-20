namespace OJS.Services.Ui.Business;

using OJS.Services.Common.Models.Cache;
using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Services.Ui.Models.SubmissionTypes;
using OJS.Services.Infrastructure;

public interface ISubmissionTypesBusinessService : IService
{
    Task<IEnumerable<SubmissionTypeFilterServiceModel>> GetAllOrderedByLatestUsage();

    Task<IEnumerable<AllowedContestStrategiesServiceModel>> GetAllForContestCategory(int contestCategoryId);
}