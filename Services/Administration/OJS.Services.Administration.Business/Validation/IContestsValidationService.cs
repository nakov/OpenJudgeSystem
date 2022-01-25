namespace OJS.Services.Administration.Business.Validation;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Contests;
using SoftUni.Services.Infrastructure;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IContestsValidationService : IService
{
    IEnumerable<Func<Contest, Contest, AdminActionContext, ValidatorResult>> GetValidators();

    IEnumerable<Func<Contest, Contest, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators();
}