namespace OJS.Services.Administration.Business.Api.Implementations;

using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models;
using OJS.Services.Common;
using OJS.Services.Infrastructure.Extensions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;

public class ContestsApiService : IContestsApiService
{
    private readonly IContestsDataService contestsData;
    private readonly IUserProviderService userProvider;

    public ContestsApiService(
        IContestsDataService contestsData,
        IUserProviderService userProvider)
    {
        this.contestsData = contestsData;
        this.userProvider = userProvider;
    }

    public Task<IEnumerable<SelectListItemApiServiceModel>> GetSelectListForSubmissionsSimilarity()
    {
        var user = this.userProvider.GetCurrentUser();

        if (user.IsNotAdminButLecturer)
        {
            return this.contestsData.GetAllByLecturer(user.Id)
                .MapCollection<SelectListItemApiServiceModel>()
                .ToEnumerableAsync();
        }

        return this.contestsData.AllTo<SelectListItemApiServiceModel>();
    }
}