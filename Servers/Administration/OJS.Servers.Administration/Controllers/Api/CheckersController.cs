namespace OJS.Servers.Administration.Controllers.Api;

using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Checkers;
using OJS.Servers.Administration.Attributes;
using OJS.Services.Administration.Business.Checkers;
using OJS.Services.Administration.Business.Checkers.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Checkers;
using OJS.Services.Administration.Models.Validation;

public class CheckersController : BaseAdminApiController<Checker, int, Checker, CheckerAdministrationModel>
{
    private readonly ICheckersDataService checkersDataService;

    public CheckersController(
        ICheckersDataService checkersDataService,
        IGridDataService<Checker> checkerGridDataService,
        ICheckersBusinessService checkersBusinessService,
        CheckerAdministrationModelValidator validator,
        IValidator<BaseDeleteValidationModel<int>> deleteValidator)
    : base(
        checkerGridDataService,
        checkersBusinessService,
        validator,
        deleteValidator)
        => this.checkersDataService = checkersDataService;

    [HttpGet]
    [ProtectedEntityAction(false)]
    public IActionResult GetForProblems()
        => this.Ok(this.checkersDataService.GetAll());
}