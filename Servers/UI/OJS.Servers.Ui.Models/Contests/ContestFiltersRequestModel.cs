namespace OJS.Servers.Ui.Models.Contests;

using Microsoft.AspNetCore.Mvc;
using OJS.Common.Enumerations;
using OJS.Services.Ui.Models.Contests;
using System.Collections.Generic;

public class ContestFiltersRequestModel
{
    [BindProperty(Name = "status")]
    public IEnumerable<ContestFilter>? Filters { get; set; }

    [BindProperty(Name = "language")]
    public IEnumerable<ContestLanguageType>? LanguageTypes { get; set; }
}