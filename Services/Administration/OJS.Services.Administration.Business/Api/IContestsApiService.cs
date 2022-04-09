namespace OJS.Services.Administration.Business.Api;

using OJS.Services.Administration.Models;
using SoftUni.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IContestsApiService : IService
{
    Task<IEnumerable<SelectListItemApiServiceModel>> GetSelectListForSubmissionsSimilarity();
}