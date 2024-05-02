namespace OJS.Services.Infrastructure.Extensions;

using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Models;
using System.Threading.Tasks;

public static class ValidationResultExtensions
{
    public static async Task VerifyResult(this Task<ValidationResult> task)
        => (await task)
            .VerifyResult();

    public static void VerifyResult(this ValidationResult validationResult, string? explicitPropertyName = null)
    {
        if (!validationResult.IsValid)
        {
            var exception = validationResult.PropertyName == null && explicitPropertyName == null
                ? new BusinessServiceException(validationResult.Message)
                : new BusinessServiceException(
                    validationResult.Message,
                    explicitPropertyName ?? validationResult.PropertyName);

            throw exception;
        }
    }
}