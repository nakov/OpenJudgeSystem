namespace OJS.Common.Extensions;

using FluentValidation.Results;
using OJS.Common.Exceptions;
using System.Threading.Tasks;

public static class ValidationResultExtensions
{
    public static async Task<ExceptionResponse> ToExceptionResponseAsync(this Task<ValidationResult> validationResultTask)
    {
        var validationResult = await validationResultTask;
        var response = new ExceptionResponse();

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
