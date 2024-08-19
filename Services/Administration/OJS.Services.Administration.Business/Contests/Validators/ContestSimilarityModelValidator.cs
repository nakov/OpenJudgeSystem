namespace OJS.Services.Administration.Business.Contests.Validators;

using FluentValidation;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Common.Validation;
using System.Collections.Generic;
using System.Linq;

public class ContestSimilarityModelValidator : BaseValidator<SimillarityCheckModel>
{
    public ContestSimilarityModelValidator() =>
        this.RuleFor(x => x.ContestIds)
            .Must(MustHaveIdsAndMustBeValidIds)
            .WithMessage("Must specify at least one valid contest id");

    private static bool MustHaveIdsAndMustBeValidIds(List<int>? contestIds)
    {
        if (contestIds == null || !contestIds.Any())
        {
            return false;
        }

        foreach (var id in contestIds)
        {
            if (id <= 0)
            {
                return false;
            }
        }

        return true;
    }
}