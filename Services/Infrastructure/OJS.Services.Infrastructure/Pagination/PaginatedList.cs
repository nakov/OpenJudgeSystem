namespace OJS.Services.Infrastructure.Pagination;

using System.Collections.Generic;

public class PaginatedList<T>
{
    public PaginatedList()
    {
    }

    public PaginatedList(int page, int itemsPerPage)
    {
        this.Page = page;
        this.ItemsPerPage = itemsPerPage;
    }

    public IEnumerable<T>? Items { get; set; }

    public int Page { get; set; }

    public int ItemsPerPage { get; set; }

    public int TotalCount { get; set; }
}