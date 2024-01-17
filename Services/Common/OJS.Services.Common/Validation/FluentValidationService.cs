namespace OJS.Services.Common.Validation;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public class FluentValidationService<TModel> : IFluentValidationService<TModel>, IService
    where TModel : class
{
    public ExceptionResponse Validate(BaseValidator<TModel> modelValidator, TModel model)
        => modelValidator.ProcessValidationResult(modelValidator.Validate(model));

    public async Task<ExceptionResponse> ValidateAsync(BaseValidator<TModel> modelValidator, TModel model)
        => modelValidator.ProcessValidationResult(await modelValidator.ValidateAsync(model));
}