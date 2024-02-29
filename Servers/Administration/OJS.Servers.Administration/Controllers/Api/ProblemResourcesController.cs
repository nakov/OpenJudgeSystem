namespace OJS.Servers.Administration.Controllers.Api;

using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business.ProblemResources;
using OJS.Services.Administration.Business.ProblemResources.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ProblemResources;

public class ProblemResourcesController : BaseAdminApiController<ProblemResource, int, ProblemResourceInListModel, ProblemResourceAdministrationModel>
{
    public ProblemResourcesController(
        IGridDataService<ProblemResource> problemResourceGridService,
        IProblemResourcesBusinessService problemResourcesBusinessService,
        ProblemResourceAdministrationModelValidator modelValidator,
        ProblemResourceDeleteValidator deleteValidator)
        : base(problemResourceGridService, problemResourcesBusinessService, modelValidator, deleteValidator)
    {
    }
}