namespace OJS.Services.Administration.Models.Contests;

using OJS.Common.Enumerations;
using System.Collections.Generic;

public class SimillarityCheckModel
{
    public List<int>? ContestIds { get; set; }

    public SimilarityCheckType SimilarityCheckType { get; set; }
}