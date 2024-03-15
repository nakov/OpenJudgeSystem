namespace OJS.Services.Administration.Models;

public class BaseDropdownModel<TId>
{
    public TId? Id { get; set; }

    public string? Name { get; set; }
}