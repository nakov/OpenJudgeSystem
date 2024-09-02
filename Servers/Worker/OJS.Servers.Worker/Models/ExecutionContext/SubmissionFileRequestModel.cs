namespace OJS.Servers.Worker.Models.ExecutionContext;

using System.ComponentModel.DataAnnotations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using OJS.Common.Extensions;
using OJS.Services.Common.Models.Submissions.ExecutionContext;

public class SubmissionFileRequestModel : SubmissionBaseRequestModel<SubmissionFileRequestModel, string>
{
    [Required]
    public IFormFile? File { get; set; }

    protected override void MapAdditionalMembers(
        IMappingExpression<SubmissionFileRequestModel, SubmissionServiceModel> mapping)
        => mapping
            .ForMember(
                m => m.FileContent,
                opt => opt.MapFrom(src => src.File!.GetBytes()))
            .ForMember(s => s.Code, opt => opt.Ignore())
            .ForMember(s => s.StartedExecutionOn, opt => opt.Ignore());
}
