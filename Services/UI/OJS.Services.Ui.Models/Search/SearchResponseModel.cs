﻿namespace OJS.Services.Ui.Models.Search;

using System.Collections.Generic;
using System.Linq;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SearchResponseModel : IMapFrom<SearchServiceModel>
{
    public IEnumerable<ContestSearchServiceModel> Contests { get; set; }
        = Enumerable.Empty<ContestSearchServiceModel>();

    public IEnumerable<ProblemSearchServiceModel> Problems { get; set; }
        = Enumerable.Empty<ProblemSearchServiceModel>();

    public IEnumerable<UserSearchServiceModel> Users { get; set; }
        = Enumerable.Empty<UserSearchServiceModel>();
}