namespace OJS.Services.Common.Models.Pagination;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class PaginationRequestModel
{
    [Range(1, 100)]
    public int ItemsPerPage { get; set; }

    [Range(1, int.MaxValue)]
    public int Page { get; set; }

    public string? Sorting { get; set; }

    public string? Direction { get; set; }

    public string? Filter { get; set; }
}