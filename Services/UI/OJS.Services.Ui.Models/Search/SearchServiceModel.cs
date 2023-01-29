﻿namespace OJS.Services.Ui.Models.Search;

using System.Collections.Generic;
using System.Linq;
public class SearchServiceModel
{
    public IEnumerable<ContestSearchServiceModel> Contests { get; set; }
        = Enumerable.Empty<ContestSearchServiceModel>();

    public IEnumerable<ProblemSearchServiceModel> Problems { get; set; }
        = Enumerable.Empty<ProblemSearchServiceModel>();

    public IEnumerable<UserSearchServiceModel> Users { get; set; }
        = Enumerable.Empty<UserSearchServiceModel>();
}