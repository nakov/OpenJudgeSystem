namespace OJS.Services.Administration.Business.Validation.Factories;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Services.Infrastructure;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IValidatorsFactory<in TEntity> : IService
{
    IEnumerable<Func<TEntity, TEntity, AdminActionContext, ValidatorResult>> GetValidators();

    IEnumerable<Func<TEntity, TEntity, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators();
}