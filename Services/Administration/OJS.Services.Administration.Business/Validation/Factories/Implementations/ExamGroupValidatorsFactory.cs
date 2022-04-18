namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Contests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Resource = OJS.Common.Resources.ExamGroupsController;

public class ExamGroupValidatorsFactory : IValidatorsFactory<ExamGroup>
{
    public IEnumerable<Func<ExamGroup, ExamGroup, AdminActionContext, ValidatorResult>> GetValidators()
        => Enumerable.Empty<Func<ExamGroup, ExamGroup, AdminActionContext, ValidatorResult>>();

    public IEnumerable<Func<ExamGroup, ExamGroup, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => Enumerable.Empty<Func<ExamGroup, ExamGroup, AdminActionContext, Task<ValidatorResult>>>();
}