namespace OJS.Services.Common.Models;

using OJS.Common.Enumerations;

public abstract class BaseAdministrationModel<TId>
{
    public TId? Id { get; set; }

    public CrudOperationType OperationType { get; set; }
}