namespace OJS.Services.Administration.Models.Tests;

using OJS.Data.Models.Problems;

using OJS.Services.Infrastructure.Models.Mapping;

public class ProblemDropdownModel : BaseDropdownModel<int>, IMapFrom<Problem>
{
}