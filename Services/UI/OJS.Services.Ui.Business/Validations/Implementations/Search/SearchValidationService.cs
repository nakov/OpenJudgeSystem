﻿namespace OJS.Services.Ui.Business.Validations.Implementations.Search;

using OJS.Services.Common;
using OJS.Services.Common.Models;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Ui.Business.Validation;

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
            .ValidateValueIsNotDefault(item, nameof(item), ValidationMessages.Search.IsNull);

        if (!contestNullValidationResult.IsValid)
        {
            return ValidationResult.Invalid(ValidationMessages.Search.IsNull);
        }

        if (item?.Length < MinimumSearchTermLength)
        {
            return ValidationResult.Invalid(ValidationMessages.Search.LessThanThreeSymbols);
        }

        return ValidationResult.Valid();
    }
}