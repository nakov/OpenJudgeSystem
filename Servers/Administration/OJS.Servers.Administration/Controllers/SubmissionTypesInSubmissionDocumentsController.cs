namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Common;
using OJS.Data.Models;
using OJS.Servers.Administration.Attributes;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Services.Administration.Business.SubmissionTypes;
using OJS.Services.Administration.Business.SubmissionTypesInSubmissionDocuments;
using OJS.Services.Administration.Business.SubmissionTypesInSubmissionDocuments.GridData;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.SubmissionTypesInSubmissionDocuments;
using OJS.Services.Common.Data;
using OJS.Services.Common.Models.Pagination;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Authorize(Roles = GlobalConstants.Roles.AdministratorOrLecturer)]
public class SubmissionTypesInSubmissionDocumentsController : BaseApiController
{
    private readonly IDataService<SubmissionTypeInSubmissionDocument> submissionTypesInSubmissionDocumentsDataService;
    private readonly ISubmissionTypesInSubmissionDocumentsGridDataService submissionTypesInSubmissionDocumentsGridDataService;
    private readonly ISubmissionTypesInSubmissionDocumentsBusinessService submissionTypesInSubmissionDocumentsBusinessService;
    private readonly ISubmissionTypesBusinessService submissionTypesBusinessService;

    public SubmissionTypesInSubmissionDocumentsController(
        IDataService<SubmissionTypeInSubmissionDocument> submissionTypesInSubmissionDocumentsDataService,
        ISubmissionTypesInSubmissionDocumentsGridDataService submissionTypesInSubmissionDocumentsGridDataService,
        ISubmissionTypesInSubmissionDocumentsBusinessService submissionTypesInSubmissionDocumentsBusinessService,
        ISubmissionTypesBusinessService submissionTypesBusinessService)
    {
        this.submissionTypesInSubmissionDocumentsDataService = submissionTypesInSubmissionDocumentsDataService;
        this.submissionTypesInSubmissionDocumentsGridDataService = submissionTypesInSubmissionDocumentsGridDataService;
        this.submissionTypesInSubmissionDocumentsBusinessService = submissionTypesInSubmissionDocumentsBusinessService;
        this.submissionTypesBusinessService = submissionTypesBusinessService;
    }

    [HttpGet]
    [ProtectedEntityAction(false)]
    public async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        var user = this.User.Map<UserInfoModel>();

        if (!await this.submissionTypesInSubmissionDocumentsGridDataService.UserHasAccessToGrid(user))
        {
            return this.Unauthorized();
        }

        return this.Ok(await this.submissionTypesInSubmissionDocumentsGridDataService.GetAllForUser<SubmissionTypeInSubmissionDocumentInListModel>(model, user));
    }

    [HttpGet]
    [ProtectedEntityAction(false)]
    public async Task<IActionResult> GetAllBySubmissionTypeIds([FromQuery] List<int> submissionTypeIds)
    {
        foreach (var submissionTypeId in submissionTypeIds)
        {
            if (!await this.submissionTypesBusinessService.ExistsById(submissionTypeId))
            {
                return this.UnprocessableEntity("The submission type does not exist.");
            }
        }

        return this.Ok(await this.submissionTypesInSubmissionDocumentsBusinessService.GetAllBySubmissionTypeIds(submissionTypeIds.ToHashSet()));
    }
}