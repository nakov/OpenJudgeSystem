namespace OJS.Services.Ui.Business.Validations.Implementations.Search;

using OJS.Services.Common;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;
using static OJS.Services.Ui.Business.Constants.Search;

public class SearchValidationService : ISearchValidationService
{
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;
    private readonly IUserProviderService userProvider;

    public SearchValidationService(INotDefaultValueValidationHelper notDefaultValueValidationHelper, IUserProviderService userProvider)
    {
        this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;
        this.userProvider = userProvider;
    }

    public ValidationResult GetValidationResult(string? item)
    {
        var contestNullValidationResult = this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(item, nameof(item));

        if (item == null || item?.Length < MinimumSearchTermLength)
        {
            return ValidationResult.Invalid(ValidationMessages.Search.LessThanThreeSymbols);
        }

        return ValidationResult.Valid();
    }
}