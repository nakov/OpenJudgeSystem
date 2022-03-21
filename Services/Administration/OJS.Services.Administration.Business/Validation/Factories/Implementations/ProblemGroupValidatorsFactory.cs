namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Problems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;
using Resource =  OJS.Common.Resources.ProblemGroupsControllers;

public class ProblemGroupValidatorsFactory : IValidatorsFactory<ProblemGroup>
{
    public IEnumerable<Func<ProblemGroup, ProblemGroup, AdminActionContext, ValidatorResult>> GetValidators()
        => Enumerable.Empty<Func<ProblemGroup, ProblemGroup, AdminActionContext, ValidatorResult>>();

    public IEnumerable<Func<ProblemGroup, ProblemGroup, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => Enumerable.Empty<Func<ProblemGroup, ProblemGroup, AdminActionContext, Task<ValidatorResult>>>();
}