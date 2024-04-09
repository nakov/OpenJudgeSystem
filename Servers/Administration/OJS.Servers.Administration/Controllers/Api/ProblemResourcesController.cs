namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Problems;
using OJS.Servers.Administration.Attributes;
using OJS.Services.Administration.Business.ProblemResources;
using OJS.Services.Administration.Business.ProblemResources.Permissions;
using OJS.Services.Administration.Business.ProblemResources.Validators;
using OJS.Services.Administration.Business.ProblemResources.GridData;
using OJS.Services.Administration.Models.ProblemResources;
using System.Threading.Tasks;

public class ProblemResourcesController : BaseAdminApiController<ProblemResource, int, ProblemResourceInListModel, ProblemResourceAdministrationModel>
{
    private readonly IProblemResourcesBusinessService problemResourcesBusinessService;

    public ProblemResourcesController(
        IProblemResourcesGridDataService problemResourceGridService,
        IProblemResourcesBusinessService problemResourcesBusinessService,
        ProblemResourceAdministrationModelValidator modelValidator)
        : base(problemResourceGridService, problemResourcesBusinessService, modelValidator) =>
        this.problemResourcesBusinessService = problemResourcesBusinessService;

    [HttpGet("{id:int}")]
    [ProtectedEntityAction("id", typeof(ProblemResourceIdPermissionService))]
    public async Task<IActionResult> Download(int id)
    {
        var model = await this.problemResourcesBusinessService.GetResourceFile(id);

        return this.File(model.Content!, model.MimeType!, model.FileName);
    }

    public override async Task<IActionResult> Create([FromForm] ProblemResourceAdministrationModel model)
    {
        var response = await base.Create(model);
        return response;
    }

    public override async Task<IActionResult> Edit([FromForm] ProblemResourceAdministrationModel model)
    {
        var response = await base.Edit(model);
        return response;
    }
}