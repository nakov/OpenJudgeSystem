namespace OJS.Services.Administration.Models.Validation;

public class BaseDeleteValidationModel<TId>
{
    public TId Id { get; set; } = default!;
}