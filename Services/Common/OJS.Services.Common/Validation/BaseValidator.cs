namespace OJS.Services.Common.Validation;
using System.Collections.Generic;
using FluentValidation;
using OJS.Common.Exceptions;
using System.Threading.Tasks;
using System.Linq;

public abstract class BaseValidator<T> : AbstractValidator<T>
{
    public async Task<ExceptionResponse> ExecuteValidation(T model)
    {
        var response = new ExceptionResponse();
        var validationResult = await this.ValidateAsync(model);

        if (validationResult.IsValid)
        {
            return response;
        }

        foreach (var failure in validationResult.Errors)
        {
            response.Errors.Add(new ExceptionResponseModel(failure.PropertyName, failure.ErrorMessage));
        }

        return response;
    }
}

public class ExceptionResponse
{
    public List<ExceptionResponseModel> Errors { get; set; } = new();
    public bool IsValid => !this.Errors.Any();
}