namespace OJS.Services.Common.Models.Pagination;
using System.ComponentModel.DataAnnotations;

public class PaginationRequestModel
{
    [Range(1, 100)]
    public int ItemsPerPage { get; set; } = 50;

    [Range(1, int.MaxValue)]
    public int Page { get; set; } = 1;

    public string? Sorting { get; set; }

    public string? Filter { get; set; }
}