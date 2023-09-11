namespace OJS.Services.Ui.Models.Problems;

using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Collections.Generic;

public class ContestDetailsProblemServiceModel : IMapFrom<Problem>
{
    public string Name { get; set; } = string.Empty;

    public ICollection<ProblemResourceServiceModel> Resources { get; set; } = new HashSet<ProblemResourceServiceModel>();
}