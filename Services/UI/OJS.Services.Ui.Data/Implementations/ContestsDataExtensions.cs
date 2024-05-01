namespace OJS.Services.Ui.Data.Implementations;

using OJS.Data.Models.Contests;
using OJS.Services.Infrastructure.Extensions;
using OJS.Common.Extensions;
using OJS.Services.Infrastructure.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using static OJS.Services.Common.PaginationConstants.Contests;

public static class ContestsDataExtensions
{
    /// <summary>
    /// Contests that are ongoing or upcoming (priority 1).
    /// Contests with no end time specified (priority 2).
    /// Contests that have ended (priority 3).
    /// </summary>
    /// <param name="contests">Contests query to be sorted.</param>
    /// <returns>Sorted contests.</returns>
    public static IQueryable<Contest> OrderByActivity(this IQueryable<Contest> contests)
        => contests
            .OrderBy(c =>
                c.EndTime.HasValue
                    // Contests that have ended get priority 3, ongoing or upcoming get priority 1
                    ? (c.EndTime.Value < DateTime.UtcNow ? 3 : 1)
                    : 2) // Contests with no end time specified get priority 2
            .ThenBy(c => c.EndTime);

    /// <summary>
    /// Orders contests by their OrderBy property, then by EndTime and PracticeEndTime.
    /// </summary>
    /// <param name="contests">Contests query to be sorted.</param>
    /// <returns>Sorted contests.</returns>
    public static IQueryable<Contest> OrderByOrderBy(this IQueryable<Contest> contests)
        => contests
            .OrderBy(c => c.OrderBy)
            .ThenByDescending(c => c.EndTime)
            .ThenByDescending(c => c.PracticeEndTime);

    /// <summary>
    /// Orders contests by their Category OrderBy then by Contest OrderBy, then by EndTime.
    /// </summary>
    /// <param name="contests">Contests query to be sorted.</param>
    /// <returns>Sorted contests.</returns>
    public static IQueryable<Contest> OrderByCategoryAndContestOrderBy(this IQueryable<Contest> contests)
        => contests
            .OrderBy(c => c.Category == null ? int.MaxValue : c.Category.OrderBy)
            .ThenBy(c => c.OrderBy)
            .ThenByDescending(c => c.EndTime);

    /// <summary>
    /// Orders contests by their Category OrderBy then by Contest OrderBy, then by EndTime.
    /// </summary>
    /// <param name="contests">Contests query to be paginated.</param>
    /// /// <param name="itemsPerPage">Items count per page. </param>
    /// <param name="currentPage">Current page in all pages.</param>
    /// <returns>Paginated contests.</returns>
    public static async Task<PagedResult<TServiceModel>> Paginate<TServiceModel>(
        this IQueryable<Contest> contests,
        int? itemsPerPage = DefaultContestsPerPage,
        int? currentPage = 1)
        => await contests
            .MapCollection<TServiceModel>()
            .ToPagedResultAsync(itemsPerPage, currentPage);
}