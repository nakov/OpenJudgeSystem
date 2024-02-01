namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Common;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Services.Common.Data.Pagination;
using OJS.Services.Common.Models.Pagination;
using SoftUni.Data.Infrastructure.Models;
using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using SoftUni.Common.Models;

[Authorize(Roles = GlobalConstants.Roles.AdministratorOrLecturer)]
public abstract class BaseAdminApiController<TEntity, TGridModel> : BaseApiController
    where TEntity : class, IEntity
{
    private readonly IGridDataService<TEntity> gridDataService;

    public BaseAdminApiController(IGridDataService<TEntity> gridDataService)
        => this.gridDataService = gridDataService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        var contest = await this.gridDataService.GetAll<TGridModel>(model);
        return this.Ok(contest);
    }

    protected async Task<PagedResult<T>> GetWithFilter<T>(PaginationRequestModel model,  Expression<Func<TEntity, bool>> filter)
        => await this.gridDataService.GetAll<T>(model, filter);
}