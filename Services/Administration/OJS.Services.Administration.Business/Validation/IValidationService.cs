namespace OJS.Services.Administration.Business.Validation;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using SoftUni.Services.Infrastructure;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IValidationService<in TEntity> : IService
{
    IEnumerable<Func<TEntity, TEntity, AdminActionContext, ValidatorResult>> GetValidators();

    IEnumerable<Func<TEntity, TEntity, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators();
}