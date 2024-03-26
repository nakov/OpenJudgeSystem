namespace OJS.Servers.Administration.Controllers.Api;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.ExamGroups;
using OJS.Services.Administration.Business.ExamGroups.GridData;
using OJS.Services.Administration.Business.ExamGroups.Validators;
using OJS.Services.Administration.Models.ExamGroups;

public class ExamGroupsController : BaseAdminApiController<ExamGroup, int, ExamGroupInListModel, ExamGroupAdministrationModel>
{
    public ExamGroupsController(
       IExamGroupsGridDataService gridDataService,
       IExamGroupsBusinessService operationService,
       ExamGroupAdministrationModelValidator validator,
       ExamGroupDeleteValidator deleteValidator)
        : base(gridDataService, operationService, validator, deleteValidator)
    {
    }
}