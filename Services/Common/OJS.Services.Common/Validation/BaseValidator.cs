namespace OJS.Services.Common.Validation;
using System.Collections.Generic;
using FluentValidation;
using FluentValidation.Results;
using OJS.Common.Exceptions;

public abstract class BaseValidator<T> : AbstractValidator<T>
{
    public ExceptionResponse ProcessValidationResult(ValidationResult validationResult)
    {
        var response = new ExceptionResponse();

        if (validationResult.IsValid)
        {
            return response;
        }

        foreach (var failure in validationResult.Errors)
        {
            response.Errors.Add(new ExceptionResponseModel
            {
                Name = failure.PropertyName,
                Message = failure.ErrorMessage,
            });
        }

        return response;
    }
}

public class ExceptionResponse
{
    public List<ExceptionResponseModel> Errors { get; set; } = new ();
}