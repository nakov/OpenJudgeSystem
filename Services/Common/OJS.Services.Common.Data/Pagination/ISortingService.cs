﻿namespace OJS.Services.Common.Data.Pagination;

using SoftUni.Data.Infrastructure.Models;
using SoftUni.Services.Infrastructure;
using System.Linq;

public interface ISortingService : IService
{
    IQueryable<TModel> ApplySorting<TModel>(IQueryable<TModel> query, string? sorting);
}