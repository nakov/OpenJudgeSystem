namespace OJS.Services.Common.Data.Pagination;

using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;
using System;
using System.Linq.Expressions;
using SoftUni.Services.Infrastructure;
using SoftUni.Data.Infrastructure.Models;
using SoftUni.Common.Models;

public interface IGridDataService<TEntity> : IService
  where TEntity : class, IEntity
{
  Task<PagedResult<T>> GetAll<T>(PaginationRequestModel paginationRequestModel, Expression<Func<TEntity, bool>>? filter = null);
}
