namespace OJS.Services.Common.Data.Pagination;

using System.Collections.Generic;
using System;

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

    public int TotalPages => (int)Math.Ceiling((decimal)this.TotalCount / this.ItemsPerPage);
}