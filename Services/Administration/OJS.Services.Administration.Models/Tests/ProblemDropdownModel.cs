namespace OJS.Services.Administration.Models.Tests;

using OJS.Data.Models.Problems;

using SoftUni.AutoMapper.Infrastructure.Models;

public class ProblemDropdownModel : BaseDropdownModel<int>, IMapFrom<Problem>
{
}