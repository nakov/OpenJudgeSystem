namespace OJS.Services.Administration.Models;

public abstract class BaseAdministrationModel<TId>
{
    public TId? Id { get; set; }
}