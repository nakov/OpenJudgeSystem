namespace OJS.Services.Common.Validation;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IFluentValidationService<TModel> : IService
    where TModel : class
{
    ExceptionResponse Validate(BaseValidator<TModel> modelValidator, TModel model);

    Task<ExceptionResponse> ValidateAsync(BaseValidator<TModel> modelValidator, TModel model);
}