namespace OJS.Services.Common.Data.Pagination;

using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;
using System.Linq;

public interface IGridDataService<TEntity>
{
  Task<PaginatedList<T>> GetAll<T>(PaginationRequestModel paginationRequestModel);

  Task<PaginatedList<T>> GetAll<T>(PaginationRequestModel paginationRequestModel, IQueryable<TEntity> query);
}
