namespace OJS.Services.Common.Data.Pagination;

using OJS.Services.Common.Models.Pagination;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using SoftUni.Data.Infrastructure.Models;
using SoftUni.Services.Infrastructure;

public interface IFilteringService<TEntity> : IService
     where TEntity : class, IEntity
{
     PropertyInfo? GetProperty<T>(string key);
     IQueryable<TModel> ApplyFiltering<TModel>(IQueryable<TEntity> query, List<FilteringModel> filters);
}
