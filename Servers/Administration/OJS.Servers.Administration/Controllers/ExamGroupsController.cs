namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Resource = OJS.Common.Resources.ExamGroupsController;

public class ExamGroupsController : BaseAutoCrudAdminController<ExamGroup>
{
    private readonly IExamGroupsValidationService examGroupsValidation;

    public ExamGroupsController(
        IExamGroupsValidationService examGroupsValidation)
        => this.examGroupsValidation = examGroupsValidation;

    public IActionResult Users([FromQuery] IDictionary<string, string> complexId)
    {
        var examGroupId = int.Parse(complexId.Values.First());
        return this.RedirectToAction("ByExamGroup", "Users", new { examGroupId });
    }

    protected override IEnumerable<Func<ExamGroup, ExamGroup, AdminActionContext, ValidatorResult>> EntityValidators
        => this.examGroupsValidation.GetValidators();

    protected override IEnumerable<Func<ExamGroup, ExamGroup, AdminActionContext, Task<ValidatorResult>>>
        AsyncEntityValidators
        => this.examGroupsValidation.GetAsyncValidators();

    protected override IEnumerable<GridAction> CustomActions
        => new GridAction[]
        {
            new() { Action = nameof(this.Users) },
        };
}