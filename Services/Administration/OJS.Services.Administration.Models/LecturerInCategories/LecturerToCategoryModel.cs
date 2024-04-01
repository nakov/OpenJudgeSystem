namespace OJS.Services.Administration.Models.LecturerInCategories;

using OJS.Common.Enumerations;

public class LecturerToCategoryModel
{
    public string? LecturerId { get; set; }

    public int CategoryId { get; set; }

    public CrudOperationType OperationType { get; set; }
}