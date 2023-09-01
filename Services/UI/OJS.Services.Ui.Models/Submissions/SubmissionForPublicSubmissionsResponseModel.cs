namespace OJS.Services.Ui.Models.Submissions;

using System;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionForPublicSubmissionsResponseModel : IMapFrom<SubmissionForPublicSubmissionsServiceModel>
{
    public int Id { get; set; }

    public DateTime CreatedOn { get; set; }

    public string StrategyName { get; set; } = null!;

    public bool IsOfficial { get; set; }

    public UserForPublicSubmissionsServiceModel User { get; set; } = null!;

    public ProblemForPublicSubmissionsServiceModel Problem { get; set; } = null!;

    public ResultForPublicSubmissionsServiceModel Result { get; set; } = null!;

    public StateResultForPublicSubmissionsServiceModel State { get; set; }
}