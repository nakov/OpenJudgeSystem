namespace OJS.Services.Administration.Models.Contests;

using System.Collections.Generic;

public class ContestsGetExistingIdsRequestModel
{
    public IEnumerable<int> Ids { get; set; }
}