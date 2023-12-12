namespace OJS.Services.Common.Data.Pagination;

using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;

public interface IGridDataService<TEntity>
{
  Task<PaginatedList<T>> GetAll<T>(PaginationRequestModel paginationRequestModel);
}
