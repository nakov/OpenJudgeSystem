namespace OJS.Services.Ui.Models.Submissions;

using OJS.Services.Ui.Models.Submissions.PublicSubmissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;

public class PublicSubmissionsResponseModel : IMapFrom<PublicSubmissionsServiceModel>
{
    public int Id { get; set; }

    public DateTime CreatedOn { get; set; }

    public string StrategyName { get; set; } = null!;

    public bool IsOfficial { get; set; }

    public UserForPublicSubmissionsServiceModel User { get; set; } = null!;

    public ProblemForPublicSubmissionsServiceModel Problem { get; set; } = null!;

    public ResultForPublicSubmissionsServiceModel Result { get; set; } = null!;

    public bool IsCompiledSuccessfully { get; set; }

    public bool Processed { get; set; }
}